import { readable } from 'svelte/store';
import {originUrl} from "../config";

let files = [];

export const filesStore = readable([], set => {
    const fileEvtSource = new EventSource(originUrl + '/api/data/sse-updates');

    fileEvtSource.onmessage = eventMessage => {
        console.debug("received event message");
        console.debug(eventMessage);

    }
});


