import DbFile from "./db_file";
import DbResponse from "./db_response";

//todo define specifications
export default interface IDatabase {
    filesDir: string;

    getAllFiles(notDeleteAllRunOut?:boolean): Promise<DbResponse<DbFile[] | any>>;

    getFileById(id: string, notDeleteAllRunOut?:boolean): Promise<DbResponse<DbFile | any>>;

    deleteFileByFileName(fileName: string): Promise<DbResponse<DbFile | any>>;

    deleteFileById(id: string): Promise<DbResponse<DbFile | any>>;

    addFile(dbFile: DbFile, currentFileName: string, notDeleteAllRunOut?:boolean): Promise<DbResponse<DbFile | any>>;

    deleteAllRunOut(): Promise<DbResponse<DbFile[] | any>>;

    fileExistsById(id: string, notDeleteAllRunOut?:boolean): Promise<DbResponse<boolean | any>>;

    fileExists(fileName: string, notDeleteAllRunOut?:boolean): Promise<DbResponse<boolean | any>>;

    fileLimitReached(notDeleteAllRunOut?:boolean): Promise<DbResponse<boolean | any>>;
}
