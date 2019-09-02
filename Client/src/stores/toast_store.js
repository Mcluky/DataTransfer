import { writable} from 'svelte/store';

export const ToastStoreDataType = {
    DANGER: 'DANGER',
    INFO: 'INFO',
    WARNING: 'WARNING',
    SUCCESS: 'SUCCESS',
    DEFAULT: 'SHOW'
};

export class ToastStoreData {
    constructor(message, type, duration ) {
        this.message = message;
        this.duration = duration;
        switch (type) {
            case ToastStoreDataType.DANGER:
                this.color = 'rgba(255,56,96,1)';
                this.textColor = 'rgba(255,255,255,1)';
                break;
            case ToastStoreDataType.SUCCESS:
                this.color = 'rgba(35,209,96,1)';
                this.textColor = 'rgba(255,255,255,1)';
                break;
            case ToastStoreDataType.INFO:
                this.color = 'rgba(35,131,241,1)';
                this.textColor = 'rgba(255,255,255,1)';
                break;
                //todo add all types
        }
    }
}

export const toastStore = writable (null);
