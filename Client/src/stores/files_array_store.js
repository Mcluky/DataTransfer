import {derived} from 'svelte/store';
import {fileStore} from "./file_store";

let files = [];

export const filesArrayStore = derived(
    fileStore,
    $fileStore => {
        if ($fileStore.data) {
            if($fileStore.event.toUpperCase() === "NEW_FILES" || $fileStore.event.toUpperCase() === "INITIAL_FILES"){
                files = files.concat($fileStore.data);
            }
        }
        return files;
    }
);
