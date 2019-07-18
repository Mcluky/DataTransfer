export default class SSEMessage {
    public event: SSEEvent;
    public data: any[];


    constructor(event: SSEEvent, data: any[]) {
        this.event = event;
        this.data = data;
    }
}

export enum SSEEvent {
    handshake = "HANDSHAKE",
    NewFiles = "NEW_FILES",
    FilesDeleted = "FILES_DELETED"
}
