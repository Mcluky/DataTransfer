<script>
    import { quintOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';
    import {filesArrayStore} from "../stores/files_array_store";
    import File from "./File.svelte"
    import {getLocalId} from "../http/local_id";
    import {scrollFileWindowStore} from "../stores/scroll_file_window_store";

    let localId = getLocalId();
    $: fromThisId = (id) => id === localId;

    let files = [];
    let scrollDiv;

    const unsubscribeFilesArrayStore = filesArrayStore.subscribe(value => {
        files = [...value];
    });

    const unsubscribeScrollFileWindowStore= scrollFileWindowStore.subscribe(value => {
        switch (value.position) {
            case 'bottom':
                scrollToBottom();
                break;
            case 'top':
                scrollToTop();
                break;
        }
    });

    function scrollToBottom(){
        if(scrollDiv)
            scrollDiv.scrollTo(0, scrollDiv.scrollHeight);
    }

    function scrollToTop(){
        if(scrollDiv)
            scrollDiv.scrollTo(0, 0);
    }

    function fileTransition(node, params) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;

        return {
            duration: 600,
            easing: quintOut,
            css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
        };
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
        <div class="container" id="innerWindow" bind:this={scrollDiv}>
            {#each files as file, i (file.id)}
                <div transition:fileTransition on:introend="{ () => scrollToBottom()}" animate:flip="{{duration: 300}}"
                    style="margin-bottom: 15px">
                    <File file={file} fromThisId={fromThisId(file.uploadedBy)} lastOne={files.length - i <= 1} />
                </div>
            {:else}
                <div style="text-align: center">
                    <p>No Files yet</p>
                    <a class="button is-loading" style="border: none">-</a>
                </div>
            {/each}
        </div>
    </div>
</div>


