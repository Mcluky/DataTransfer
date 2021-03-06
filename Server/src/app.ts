import dotenv from "dotenv";
//load dotenv file
dotenv.config();
import express from "express";
import path from "path";
import logger from "morgan";
import fs from "fs";
import formidableMiddleware from "express-formidable";
import cookieParser from "cookie-parser";
import HttpException, {pageNotFoundException} from "./response/http_exception";
import http from "http";
import generalRouter from "./router/general_router";
import IDatabase from "./database/i_database";
import FileDatabase from "./database/file_database";
import {returnException} from "./response/response";

const server = express();
server.use(express.static(path.join(__dirname, '..', 'static')));

//todo dockerize
let db: IDatabase = new FileDatabase();

//Default place for saving uploaded files
//create files directory if not exist
let dir = db.filesDir;
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

server.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: db.filesDir,
    multiples: true, // req.files to be arrays of files
    hash: "md5"
}));

server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(logger('dev'));


//This is required to work with local instance of client js
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});


server.use("/", generalRouter);

// catch 404 and forward to error handler
server.use(function (req, res, next) {
    returnException(res, pageNotFoundException);
});


const httpServer = http.createServer(server);
const port = process.env.PORT || 5555;
httpServer.listen(port);
httpServer.addListener('error', onError);
httpServer.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = httpServer.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

