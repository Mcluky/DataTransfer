import { writable} from 'svelte/store';

export class scrollFileWindowStoreData {
    //scroll to position (currently only top or bottom)
    constructor(position) {
        this.position = position;
    }
}

export const scrollFileWindowStore = writable (new scrollFileWindowStoreData("bottom"));