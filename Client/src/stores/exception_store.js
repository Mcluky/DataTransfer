import { writable} from 'svelte/store';

export class ExceptionStoreData {
    //todo implement
    constructor(name, msg) {
        this.name = name;
        this.msg = msg;
    }
}

export const exceptionStore = writable (null);
