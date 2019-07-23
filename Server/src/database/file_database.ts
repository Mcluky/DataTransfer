import IDatabase from "./i_database";
import DbFile from "./db_file";
import path from "path";
import DbResponse, {
    couldNotBeParsedResponse,
    fileNotFoundResponse,
    fileToBigResponse,
    storageFullResponse
} from "./db_response";
import fs from "fs";
import getFolderSize from "get-folder-size";
import SSEMessage, {SSEEvent} from "../response/sse_message";

export default class FileDatabase implements IDatabase {
    sse?: any;
    filesDir = path.join(__dirname, '..', '..', 'files');


    constructor(sse?: any) {
        this.sse = sse;
    }

    async addFile(dbFile: DbFile, currentFileName: string, notDeleteAllRunOut?: boolean): Promise<DbResponse<DbFile | any>> {
        try {
            if (!notDeleteAllRunOut) {
                //remove all files that are not supposed to be available at the time
                let deleteAllDbResponse = await this.deleteAllRunOut();
                if (!deleteAllDbResponse.success)
                    return deleteAllDbResponse;
            }

            //check if file even exists
            let dbResponse = await this.fileExists(currentFileName, true);
            if (!dbResponse.success)
                return dbResponse;
            if (dbResponse.data === false)
                return fileNotFoundResponse;

            //check if file is not to big
            let stats = fs.statSync(path.join(this.filesDir, currentFileName));
            let fileSizeInMegabytes = stats.size / 1000000.0;
            if ( fileSizeInMegabytes > parseInt(process.env.MAX_FILE_SIZE_MB)) {
                //delete file if so
                fs.unlinkSync(path.join(this.filesDir, currentFileName));
                return fileToBigResponse;
            }

            //check if file limit is reached
            dbResponse = await this.fileLimitReached(true);
            if (!dbResponse.success)
                return dbResponse;
            if (dbResponse.data) {
                //delete file if so
                fs.unlinkSync(path.join(this.filesDir, currentFileName));
                return storageFullResponse;
            }


            fs.renameSync(path.join(this.filesDir, currentFileName), path.join(this.filesDir, dbFile.fileName))
            return new DbResponse(true, dbFile);
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async deleteAllRunOut(): Promise<DbResponse<DbFile[] | any>> {
        console.log("Delete all run out");
        try {
            let dbResponse = await new FileDatabase().getAllFiles(true);
            if (!dbResponse.success)
                return dbResponse;
            let dbFiles: DbFile[] = dbResponse.data;
            let deletedFiles: DbFile[] = [];
            for (let dbFile of dbFiles) {
                if (dbFile.availableUntil != null) {
                    if (dbFile.availableUntil.valueOf() - new Date().valueOf() < 0) {
                        let tmpDbResponse = await this.deleteFileByFileName(dbFile.fileName);
                        if (tmpDbResponse.success) {
                            deletedFiles.push(dbFile);
                        } else {
                            return dbResponse;
                        }
                    }
                }
            }
            if (deletedFiles.length > 0) {
                //todo this is not a nice and clean solution to send updates to the client but it works
                let sseMessage = new SSEMessage(SSEEvent.FilesDeleted, deletedFiles);
                this.sse.send(sseMessage);
            }
            return new DbResponse<DbFile[]>(true, deletedFiles);
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async deleteFileById(id: string): Promise<DbResponse<DbFile | any>> {
        let dbFile = DbFile.fromId(id);
        if (!dbFile) {
            //file could most likely not be parsed
            console.error("File could most likely not be parsed");
            return couldNotBeParsedResponse;
        }
        return await this.deleteFileByFileName(dbFile.fileName);
    }

    async deleteFileByFileName(fileName: string): Promise<DbResponse<DbFile | any>> {
        try {
            //check if file even exists
            let dbResponse = await this.fileExists(fileName, true);
            if (!dbResponse.success)
                return dbResponse;
            if (dbResponse.data === false)
                return fileNotFoundResponse;

            fs.unlinkSync(path.join(this.filesDir, fileName));
            //todo not optimal
            return new DbResponse(true, DbFile.fromFileName(fileName))
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async fileExistsById(id: string, notDeleteAllRunOut?: boolean): Promise<DbResponse<boolean | any>> {
        let dbFile = DbFile.fromId(id);
        if (!dbFile) {
            //file could most likely not be parsed
            console.error("File could most likely not be parsed");
            return couldNotBeParsedResponse;
        }
        return await this.fileExists(dbFile.fileName, notDeleteAllRunOut);
    }

    async fileExists(fileName: string, notDeleteAllRunOut?: boolean): Promise<DbResponse<boolean | any>> {
        try {
            if (!notDeleteAllRunOut) {
                //remove all files that are not supposed to be available at the time
                let deleteAllDbResponse = await this.deleteAllRunOut();
                if (!deleteAllDbResponse.success)
                    return deleteAllDbResponse;
            }

            let exists = fs.existsSync(path.join(this.filesDir, fileName))
            return new DbResponse<boolean>(true, exists);
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async fileLimitReached(notDeleteAllRunOut?: boolean): Promise<DbResponse<boolean | any>> {
        try {
            if (!notDeleteAllRunOut) {
                //remove all files that are not supposed to be available at the time
                let deleteAllDbResponse = await this.deleteAllRunOut();
                if (!deleteAllDbResponse.success)
                    return deleteAllDbResponse;
            }

            return new Promise<DbResponse<boolean | any>>((resolve, reject) => {
                getFolderSize(this.filesDir, (err, size) => {
                    if (err) {
                        console.error(err);
                        resolve(new DbResponse(false, null, err.name, err.message));
                    }

                    let fileDirectorySizeInMb = size / 1024 / 1024;
                    console.log("Current storage size:", fileDirectorySizeInMb.toFixed(2) + ' MB');

                    if (fileDirectorySizeInMb > parseInt(process.env.MAX_SPACE_MB)) {
                        console.error("Storage full...");
                        resolve(new DbResponse<boolean>(true, true));
                    } else {
                        resolve(new DbResponse<boolean>(true, false));
                    }
                });
            });
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async getAllFiles(notDeleteAllRunOut?: boolean): Promise<DbResponse<DbFile[] | any>> {
        try {
            if (!notDeleteAllRunOut) {
                //remove all files that are not supposed to be available at the time
                let deleteAllDbResponse = await this.deleteAllRunOut();
                if (!deleteAllDbResponse.success)
                    return deleteAllDbResponse;
            }

            let dbFiles: DbFile[] = [];
            for (let fileName of fs.readdirSync(this.filesDir)) {
                let dbTmpFile = DbFile.fromFileName(fileName);
                //can return null if parsing wasn't possible
                if (dbTmpFile)
                    dbFiles.push(dbTmpFile);
            }
            return new DbResponse(true, dbFiles);
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }

    async getFileById(id: string, notDeleteAllRunOut?: boolean): Promise<DbResponse<DbFile | any>> {
        try {
            if (!notDeleteAllRunOut) {
                //remove all files that are not supposed to be available at the time
                let deleteAllDbResponse = await this.deleteAllRunOut();
                if (!deleteAllDbResponse.success)
                    return deleteAllDbResponse;
            }

            let dbFile = DbFile.fromId(id);
            if (!dbFile) {
                //file could most likely not be parsed
                console.error("File could most likely not be parsed");
                return couldNotBeParsedResponse;
            }

            let dbResponse = await this.fileExists(dbFile.fileName, true);
            if (!dbResponse.success)
                return dbResponse;
            if (dbResponse.data === false)
                return fileNotFoundResponse;

            return new DbResponse<DbFile>(true, dbFile);
        } catch (e) {
            console.error(e);
            return new DbResponse(false, null, e.name, e.message);
        }
    }
}
