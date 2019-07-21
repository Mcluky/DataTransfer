import {replaceAll} from "../util/replace_all";

export default class DbFile {
    public id: string;
    public fileName: string;
    public name: string;
    public uploadDate: Date;
    public availableUntil?: Date;
    public hash: string;
    public uploadedBy: string;


    constructor(name: string, uploadDate: Date, hash: string, uploadedBy: string, availableUntil?: Date, id?: string, fileName?: string) {
        this.name = name.trim();
        //check if name is not empty
        if(!name){
            let error = new Error("The given id could not be parsed.");
            error.name = "id_could_not_be_parsed";
            throw error;
        }
        this.uploadDate = uploadDate;
        this.availableUntil = availableUntil;
        this.hash = hash;
        this.uploadedBy = uploadedBy;

        if (id) {
            this.id = id;
        } else {
            this.id = "";
            this.id += uploadDate.valueOf() + ";";
            this.id += (availableUntil ? availableUntil.valueOf() : "-") + ";";
            this.id += uploadedBy + ";";
            this.id += hash + ";";
            this.id += name;
        }

        if (fileName) {
            this.fileName = fileName;
        } else {
            // The filename is not allowed to contain colons from the ip address so we must replace it with something that look similar
            this.fileName = replaceAll(this.id, ":", "꞉");
        }
    }

    public static fromId(id: string, fileName?: string): DbFile {
        let parts = id.split(";");
        if(parts.length != 5)
            return null;
        let uploadDate = new Date(parseInt(parts[0]));
        let availableUntil = parts[1] != "-" ? new Date(parseInt(parts[1])) : null;
        let uploadedBy = parts[2];
        let hash = parts[3];
        let name = parts[4];

        return new DbFile(name, uploadDate, hash, uploadedBy, availableUntil, id, fileName);
    }

    public static fromFileName(fileName: string): DbFile {
        let id = replaceAll(fileName, "꞉", ":");
        return DbFile.fromId(id, fileName);
    }
}
