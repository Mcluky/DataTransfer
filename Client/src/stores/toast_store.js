import { writable} from 'svelte/store';

export class ToastStoreData {
    constructor(message, type, position) {
        this.message = message;
        this.type = type;
        this.position = position;
    }
}

export const toastStore = writable (null);
