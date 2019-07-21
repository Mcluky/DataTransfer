import {writable, readable} from 'svelte/store';
import {originUrl} from "../config";
import {getAllFiles} from "../http/communicator";

export const fileStore = readable([], set => {
    //Initial files
    let getAllFilesPromise = getAllFiles();
    getAllFilesPromise.then(value => {
        if (value.data){
            let initialDataEvent = {data: value.data};
            initialDataEvent.event = "INITIAL_FILES";
            set(initialDataEvent);
        }
    }).catch(reason => {
        //todo error
        console.error("initial files", reason);
    });


    const fileEvtSource = new EventSource(originUrl + '/api/data/sse-updates');

    fileEvtSource.onmessage = (eventMessage) => {
        console.debug("received event message", eventMessage);
        set(JSON.parse(eventMessage.data));
    };

    return function stop() {
        getAllFilesPromise.abort();
        fileEvtSource.close()
    }
});


