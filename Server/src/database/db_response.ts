export default class DbResponse <T>{
    public success: boolean;
    public error?: string;
    public msg?: string;
    public data?: T;

    constructor(success: boolean, data?:T, error?: string, msg?: string) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.msg = msg;
    }
}

export const storageFullResponse = new DbResponse(false, null, "storage_full", "The allocated storage is full and not able to store more files.");
export const fileToBigResponse = new DbResponse(false, null, "file_to_large", "The file is larger than in the options allowed.");
export const couldNotBeParsedResponse = new DbResponse(false, null, "id_could_not_be_parsed",  "The given id could not be parsed.");
export const fileNotFoundResponse = new DbResponse(false, null, "file_not_found", "The requested file either does not exist or is not available anymore.");
