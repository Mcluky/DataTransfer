<script>
    //todo fix eslint
    import Form from "./components/Form.svelte";
    import FileWindow from "./components/FileWindow.svelte";
    import {Toast} from 'svelma'
    import {toastStore} from "./stores/toast_store";

    export let name;

    //todo fix where it is displayed
    const unsubscribeToastStore = toastStore.subscribe(value => {
        if (value != null)
            Toast.create({
                message: value.message,
                type: value.type,
                position: value.position
            });
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

<div id="parentContainer">
    <div class="flexBox">
        <FileWindow/>
        <Form/>
    </div>
</div>
