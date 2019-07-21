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
</style>

<h1>Hello {name}!</h1>
<FileWindow/>
<Form/>

