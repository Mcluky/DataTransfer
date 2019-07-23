<script>
    import {slide, fade, fly} from 'svelte/transition'
    import {originUrl} from "../config";
    import {getClassNameForFilename} from "../utils/font_awsome_filetyp_mapper/mapper";
    import {deleteFile} from "../http/communicator";
    import {Dialog} from 'svelma'
    import {copyStringToClipboard} from "../utils/clipboard";
    import ToolTip from "./ToolTip.svelte";

    export let file;
    export let fromThisId;

    $: fileUrl = originUrl + "/api/data/download/" + file.id;
    $: fileIcon = "fa " + getClassNameForFilename(file.name) + " file-icon";

    function removeFile() {
        deleteFile(file.id);
    }

    function showInfo() {
        Dialog.alert("<pre>" + JSON.stringify(file, undefined, 2) + "</pre>");
    }
</script>

<style>
    .no-link-dec {
        text-decoration: none;
    }

    .file-icon {
        margin: 10px;
        font-size: 40px;
    }

    @media (max-width: 600px) {
        .file-icon {
            font-size: 40px;
            margin: 10px 0px 10px 0px;
        }
    }

</style>

<!-- todo out transition (doesnt work like intended)
out:fly="{{ x: 100, duration: 5000 }}"
-->
<div class="box" in:slide="{{duration: 250 }}" style="background-color: { fromThisId ? '#23d160' : 'white'}">
    <article class="media">
        <div class="media-left">
            <i class={fileIcon}></i>
        </div>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong><a href={fileUrl}>{file.name}</a></strong>
                    <br/>
                    <strong>Uploaded on</strong> {new Date(file.uploadDate).toLocaleString()} -
                    {#if file.availableUntil}
                        <strong>Available
                            until</strong> {new Date(file.availableUntil).toLocaleString()}
                    {:else}
                        <strong>Available
                            forever</strong>
                    {/if}
                </p>
            </div>
            <nav class="level is-mobile" in:fade>
                <div class="level-left">
                    <ToolTip toolTipText="Deletes the file">
                        <a class="level-item no-link-dec" aria-label="trash" on:click={removeFile}>
                        <span class="icon is-small">
                            <i class="fas fa-trash"></i>
                        </span>
                        </a>
                    </ToolTip>
                    <ToolTip toolTipText="Shows more information about the file">
                        <a class="level-item no-link-dec" aria-label="info" on:click={showInfo}>
                        <span class="icon is-small">
                            <i class="fas fa-info-circle"></i>
                        </span>
                        </a>
                    </ToolTip>
                    <ToolTip toolTipText="Copies the link to your clipboard">
                        <a class="level-item no-link-dec " aria-label="share" on:click={() =>
                        copyStringToClipboard(fileUrl)}>
                        <span class="icon is-small">
                                <i class="fas fa-share-alt"></i>
                            </span>
                        </a>
                    </ToolTip>
                </div>
            </nav>
        </div>
    </article>
</div>


