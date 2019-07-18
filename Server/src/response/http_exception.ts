import DbResponse, {couldNotBeParsedResponse, fileNotFoundResponse, storageFullResponse} from "../database/db_response";

export default class HttpException {
    public statusCode: number;
    public error: string;
    public msg: string;


    constructor(statusCode: number, error: string, msg: string) {
        this.statusCode = statusCode;
        this.error = error;
        this.msg = msg;
    }

    /**
     * Tries to parse a db error response to http response
     * @param dbResponse
     */
    public static fromDbResponse(dbResponse: DbResponse<any>): HttpException {
        switch (dbResponse.error) {
            case storageFullResponse.error:
                return storageFullException;

            case  fileNotFoundResponse.error:
                return fileNotFoundException;

            case couldNotBeParsedResponse.error:
                return couldNotBeParsedException;

            default:
                //todo might be a security issue
                return new HttpException(500, dbResponse.error, dbResponse.msg);
        }
    }
}

export const couldNotBeParsedException = new HttpException(406, "id_could_not_be_parsed", "The given id could not be parsed.");
export const fileNotFoundException = new HttpException(404, "file_not_found", "The requested file either does not exist or is not available anymore.")
export const pageNotFoundException = new HttpException(404, "page_not_found", "The requested page was not found.");
export const storageFullException = new HttpException(507, "storage_full", "The allocated storage is full and not able to store more files.");
