<script>
    import {fileStore} from "../stores/file_store";
    import {filesArrayStore} from "../stores/files_array_store";
    import File from "./File.svelte"
    import {getLocalId} from "../http/local_id";
    import {scrollFileWindowStore} from "../stores/scroll_file_window_store";

    let localId = getLocalId();
    $: fromThisId = (id) => id === localId;

    let files = [];
    let scrollDiv;

    const unsubscribeFilesArrayStore = filesArrayStore.subscribe(value => {
        setTimeout(scrollToBottom, 250);
        files = value;
    });

    const unsubscribeScrollFileWindowStore= scrollFileWindowStore.subscribe(value => {
        switch (value.position) {
            case 'bottom':
                setTimeout(scrollToBottom, 250);
                break;
            case 'top':
                setTimeout(scrollToTop, 250);
                break;
        }
    });

    function scrollToBottom(){
        scrollDiv.scrollTo(0, scrollDiv.scrollHeight);
    }

    function scrollToTop(){
        scrollDiv.scrollTo(0, 0);
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

<div class="section" style="margin-top: -15px">
    <div class="box">
        <div class="container" id="innerWindow" bind:this={scrollDiv} >
            {#each files as file, i}
                <File file={file} fromThisId={fromThisId(file.uploadedBy)} lastOne={files.length - i <= 1} />
            {:else}
                <div style="text-align: center">
                    <p>No Files yet</p>
                    <a class="button is-loading" style="border: none">-</a>
                </div>
            {/each}
        </div>
    </div>
</div>


