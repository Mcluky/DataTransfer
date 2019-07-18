import {Response} from "express";
import HttpException from "./http_exception";

export function returnSuccess(res: Response, data: any) {
    res.status(200);
    res.send({"success": true, "data": data})
}

export function returnException(res: Response, exception: HttpException) {
    res.status(exception.statusCode);
    res.send({"success": false, "exception": exception})
}
