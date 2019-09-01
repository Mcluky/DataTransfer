<script>
    //todo fix eslint
    import 'bulma/css/bulma.css'
    import Form from "./components/Form.svelte";
    import FileWindow from "./components/FileWindow.svelte";
    import {afterUpdate} from 'svelte';
    import {dndStore} from "./stores/dnd_store";
    import {toastStore} from "./stores/toast_store"
    import Toast from "./components/Toast.svelte";

    let toaster;

    const unsubscribeToastStore = toastStore.subscribe(value => {
        if (value != null)
            toaster.showToast(value.message, value.timeInMs, value.color, value.textColor);
    });

    //dropdown enabling
    let dropZone;

    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleDrop(event) {
        if (event.dataTransfer.items) {
            let files = [];
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    let file = event.dataTransfer.items[i].getAsFile();
                    files.push(file);
                }
            }
            if (files.length > 0) {
                event.preventDefault();
                event.stopPropagation();
                dndStore.update(value => files);
            }
        }
    }

    afterUpdate(() => {
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleDrop, false);
    });
</script>

<style>
    .flexBox {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 960px) {
        .flexBox {
            display: flex;
            flex-direction: column;
            width: 960px;
        }
    }

    @media (min-width: 960px) {
        #parentContainer {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }

    @media (max-width: 960px) {
        #parentContainer {
            width: 100%;
        }
    }
</style>

<Toast bind:this={toaster} ></Toast>
<div bind:this={dropZone}>
    <div id="parentContainer">
        <div class="flexBox">
            <FileWindow/>
            <Form/>
        </div>
    </div>
</div>
