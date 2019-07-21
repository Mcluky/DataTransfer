<script>
    import {fileStore} from "../stores/file_store";
    import {filesArrayStore} from "../stores/files_array_store";
    import File from "./File.svelte"
    import {getLocalId} from "../http/local_id";

    let localId = getLocalId();
    $: fromThisId = (id) => id === localId;

    let files = [];

    const unsubscribeFilesArrayStore = filesArrayStore.subscribe(value => {
        setTimeout(scrollToBottom, 500);
        //innerWindow.scrollTop = innerWindow.scrollHeight;
        files = value;
    });

    function scrollToBottom(){
        let innerWindow = document.getElementById("innerWindow");
        innerWindow.scrollTop = innerWindow.scrollHeight ;
    }
</script>

<style>
    #innerWindow {
        height: 55vh;
        overflow-y: scroll;
        padding: 10px;
        scroll-behavior: smooth;
    }
</style>

<div class="section" style="margin-top: -25px">
    <div class="box">
        <div class="container" id="innerWindow"  >
            {#each files as file, i}
                <File file={file} fromThisId={fromThisId(file.uploadedBy)}/>
            {:else}
                <div style="text-align: center">
                    <p>No Files yet</p>
                    <a class="button is-loading" style="border: none">-</a>
                </div>
            {/each}
        </div>
    </div>
</div>


