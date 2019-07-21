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
            if($fileStore.event.toUpperCase() === "FILES_DELETED"){
                removeArrayItems($fileStore.data);
            }
        }
        return files;
    }
);

function removeArrayItems(filesToDelete) {
    for(let i = files.length - 1; i >= 0 ; i--){
        let file = files[i];
        for(let fileToDelete of filesToDelete){
            if(file.id === fileToDelete.id){;
                files.splice(i, 1);
            }
        }
    }
}
