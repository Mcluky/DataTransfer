import express from "express";
import FileDatabase from "../../../database/file_database";
import IDatabase from "../../../database/i_database";
import {returnException, returnSuccess} from "../../../response/response";
import DbFile from "../../../database/db_file";
import HttpException, {
    couldNotBeParsedException,
    fileNotFoundException,
    storageFullException
} from "../../../response/http_exception";
import * as path from "path";

const dataRouter = express.Router();

const db: IDatabase = new FileDatabase();

dataRouter.get("/", async (req, res, next) => {
    let dbResponse = await db.getAllFiles();
    if (dbResponse.success) {
        //maybe sort
        returnSuccess(res, dbResponse.data);
    } else {
        returnException(res, HttpException.fromDbResponse(dbResponse));
    }
});

dataRouter.get("/:id", async (req, res, next) => {
    let fileId = req.params.id;

    let dbResponse = await db.getFileById(fileId);

    if (dbResponse.success) {
        returnSuccess(res, dbResponse.data);
    } else {
        returnException(res, HttpException.fromDbResponse(dbResponse));
    }
});

dataRouter.post("/", async (req, res, next) => {
    let clientIp = (req.headers['x-forwarded-for'][0] || req.connection.remoteAddress || '').split(',')[0].trim();

    for (let fileKey in req.files) {
        let name = req.files[fileKey].name;
        let currentFileName = req.files[fileKey].path.replace(/^.*[\\\/]/, '');
        let hash = req.files[fileKey].path.split("_")[1].replace(/^.*[\\\/]/, '');
        let uploadDate = new Date();
        let availableUntil: Date;
        if (req.fields.availableForever) {
            availableUntil = null;
        } else {
            // @ts-ignore
            availableUntil = req.fields.availableUntil ? new Date(req.fields.availableUntil) : new Date().setHours(new Date().getHours() + process.env.DEFAULT_AVAILABLE_TIME_MIN);
        }

        let dbFile = new DbFile(name, uploadDate, hash, clientIp, availableUntil);

        let dbResponse = await db.addFile(dbFile, currentFileName)
        if (dbResponse.success) {
            returnSuccess(res, dbResponse.data);
        } else {
            returnException(res, HttpException.fromDbResponse(dbResponse))
        }
    }
});

dataRouter.delete("/:id", async (req, res, next) => {
    let fileId = req.params.id;

    let dbResponse = await db.deleteFileById(fileId);

    if (dbResponse.success) {
        returnSuccess(res, dbResponse.data);
    } else {
        returnException(res, HttpException.fromDbResponse(dbResponse));
    }
});

dataRouter.get("/download/:id", async (req, res, next) => {
    let fileId = req.params.id;
    let dbFile = DbFile.fromId(fileId);
    if (!dbFile) {
        //file could most likely not be parsed
        console.error("File could most likely not be parsed");
        returnException(res, couldNotBeParsedException)
    }
    if ((await db.fileExists(dbFile.fileName)).data) {
        console.log("starting download...");
        res.download(path.join(db.filesDir, dbFile.fileName), dbFile.name, err => console.error(err));
    } else {
        returnException(res, fileNotFoundException)
    }
});


export default dataRouter;
