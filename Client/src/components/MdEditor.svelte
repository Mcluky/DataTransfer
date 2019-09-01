<script>
    import { Input} from 'svelma'
    import {  afterUpdate } from 'svelte';
    import {makeId} from "../http/local_id";
    import {ajaxFileUpload} from "../http/communicator";
    import {MdEditor} from "../utils/md_editor";
    import {ToastStoreData, ToastStoreDataType, toastStore} from "../stores/toast_store";

    export let availableForever;
    export let availableForHours;
    export let loading;

    let fileName;
    let mdEditor;

    let simplemde = MdEditor.simplemde;
    afterUpdate(() => {
        if(!MdEditor.simplemde) {
            simplemde = new SimpleMDE({element: mdEditor});
            MdEditor.simplemde = simplemde;
        }
    });


    async function onClickSend() {
        let text = simplemde.value().trim();
        if (text) {
            try {
                console.log(simplemde.value());
                let blob = new Blob([text], {type: "text/markdown;charset=utf-8"});
                fileName = fileName.trim();
                if (!fileName)
                    fileName = makeId(16);
                //todo throw exception on certain explorers
                //https://caniuse.com/#search=file
                let mdFile = new File([blob], fileName + ".md");
                await ajaxFileUpload([mdFile], availableForever, new Date(Date.now() + (availableForHours * 60 * 60 * 1000)).valueOf());
                toastStore.update(tsd => new ToastStoreData("Successfully uploaded text!", ToastStoreDataType.INFO));
                simplemde.value("");
            } catch (e) {
                toastStore.update(tsd => new ToastStoreData("An error occurred while uploading.", ToastStoreDataType.DANGER));
            } finally {
                fileName = "";
            }
        }
    }

</script>

<style>
    #button-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    .button {
        text-decoration: none;
    }

    .ripple {
        background-position: center;
        transition: background 0.8s;
    }

    .ripple:hover {
        background: #23d160 radial-gradient(circle, transparent 1%, #23D160 1%) center/15000%;
    }

    .ripple:active {
        background-color: #23D160;
        background-size: 100%;
        transition: background 0s;
    }

    @media (max-width: 400px) {
        .fileNameInputBottomSmall{
            margin-bottom: 15px;
        }
    }


</style>


<textarea bind:this={mdEditor}></textarea>
<div id="button-container">
    <div class="fileNameInputBottomSmall" style="display: flex; flex-direction: row; align-items: center; flex-wrap: nowrap;}">
        <Input type="text"
               bind:value={fileName}
               placeholder="Filename">_</Input>
        <p>.md</p>
    </div>
    {#if loading}
        <a class="button is-success ripple is-loading" on:click={onClickSend}><i
                class="fas fa-check"></i>&nbsp Send</a>
    {:else}
        <a class="button is-success ripple" on:click={onClickSend}><i
                class="far fa-paper-plane"></i>&nbsp
            Send</a>
    {/if}
</div>
