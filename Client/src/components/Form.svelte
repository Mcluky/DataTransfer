<script>
    import {Field, Input, Icon, Switch, Button} from 'svelma'
    import {ajaxFileUpload} from "../http/communicator"
    import {toastStore, ToastStoreData} from "../stores/toast_store";
    import MdEditor from "./MdEditor.svelte"
    import {dndStore} from "../stores/dnd_store";
    import ToolTip from "./ToolTip.svelte"

    let metaFile = {
        availableForever: false,
        availableForHours: 1.0
    };

    //$: metaFile.availableUntil = new Date(Date.now() + metaFile.availableForHours * 60 * 60 * 1000);

    let inputFiles = [];
    $: filesString = function () {
        let string = "";
        for (let ipF of inputFiles) {
            string += ipF.name;
            string += ", ";
        }
        return string;
    };


    $: disabledTimeOfAvailability = metaFile.availableForever;

    let loading = false;

    function uploadFiles(files) {
        if (!loading) {
            loading = true;
            //use current time
            let availableUntil = new Date(Date.now() + (metaFile.availableForHours * 60 * 60 * 1000)).valueOf();
            console.debug("starting upload...");
            ajaxFileUpload(files, metaFile.availableForever, availableUntil)
                    .then(value => {
                        loading = false;
                        inputFiles = [];
                    }).catch(reason => {
                        loading = false;
                        console.error(reason);
                        //todo do something meaningful
                    }
            );
        } else {
            toastStore.update(tsd => new ToastStoreData('Upload is already in progress, please wait until its finished.', 'is-danger', 'is-top'))
        }
    }

    function onClickSave() {
        // todo change this if text is added
        if (inputFiles.length === 0) {
            toastStore.update(tsd => new ToastStoreData('You must at least select one file.', 'is-danger', 'is-top'))
            return
        }
        uploadFiles(inputFiles);
    }

    dndStore.subscribe(value => {
        if (value) uploadFiles(value);
    });


</script>

<style>
    #save-button-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
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

    .flexContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap-reverse;
        align-items: start;
    }

    .form {
        width: 30%;
        margin-right: 5%;
        height: fit-content;
    }

    .editor {
        width: 65%;
    }

    @media (max-width: 730px) {
        .editor {
            width: 100%;
            margin-bottom: 30px;
        }

        .form {
            width: 70%;
            height: fit-content;
        }
    }

    @media (max-width: 410px) {
        .form {
            width: 100%;
            height: fit-content;
        }
    }


</style>

<div class="section" style="margin-top: -60px; margin-bottom: 0px">
    <div class="flexContainer">
        <div class="box form">
            <div class="container">
                <Field>
                    <Switch size="is-small"
                            bind:checked={metaFile.availableForever}>Available forever
                    </Switch>
                </Field>
                <Field label="Time of availability (hours)">
                    <Input disabled={disabledTimeOfAvailability} type="number"
                           bind:value={metaFile.availableForHours}
                           placeholder="Hours">_</Input>
                </Field>

                <Field>
                        <div class="file has-name">
                            <label class="file-label">
                                <input class="file-input" type="file" multiple bind:files={inputFiles}>
                                <span class="file-cta">
                                    <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span class="file-label">
                                        Choose files...
                                    </span>
                                </span>
                                <!-- set this to high on purpose so it looks better-->
                                <span class="file-name" style="width: 30vw">
                                    {filesString()}
                                </span>
                            </label>
                        </div>
                </Field>
                <small style="font-size: smaller">(You can also just drop your files anywhere on the page.)</small>
                <Field>
                    <div id="save-button-container">
                        {#if loading}
                            <a class="button is-success ripple is-loading" on:click={onClickSave}><i
                                    class="fas fa-check"></i>&nbsp Save</a>
                        {:else}
                            <a class="button is-success ripple" on:click={onClickSave}><i
                                    class="fas fa-check"></i>&nbsp
                                Save</a>
                        {/if}
                    </div>
                </Field>
            </div>
        </div>
        <div class="box editor">
            <div class="container">
                <MdEditor loading={loading} availableForever={metaFile.availableForever} availableForHours={metaFile.availableForHours} />
            </div>
        </div>
    </div>
</div>
