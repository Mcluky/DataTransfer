<script>
    import {slide, fade, fly} from 'svelte/transition'
    import {originUrl} from "../config";
    import {getClassNameForFilename} from "../utils/font_awsome_filetyp_mapper/mapper";
    import {deleteFile} from "../http/communicator";

    export let file;
    export let fromThisId;

    $: fileUrl = originUrl + "/api/data/download/" + file.id;
    $: fileIcon = "fa " + getClassNameForFilename(file.name) + " file-icon";

    function removeFile() {
        deleteFile(file.id);
    }
</script>

<style>
    .file-icon {
        margin: 10px;
        font-size: 40px;
    }

    @media (max-width: 960px) {
        .file-icon {
            margin-top: 10px;
            margin-right: 0px;
            font-size: 10vw;
        }
    }
</style>

<!-- todo out transition (doesnt work like intended)
out:fly="{{ x: 100, duration: 5000 }}"
-->
<div class="box" in:slide="{{duration: 500 }}"  style="background-color: { fromThisId ? '#23d160' : 'white'}">
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
                            until</strong> {new Date(file.uploadDate).toLocaleString()}
                    {:else}
                        <strong>Available
                            forever</strong>
                    {/if}
                </p>
            </div>
            <nav class="level is-mobile" transition:fade>
                <div class="level-left">
                    <a class="level-item" aria-label="trash" on:click={removeFile}>
                        <span class="icon is-small">
                            <i class="fas fa-trash"></i>
                        </span>
                    </a>
                    <a class="level-item" aria-label="info">
                        <span class="icon is-small">
                            <i class="fas fa-info-circle"></i>
                        </span>
                    </a>
                    <a class="level-item" aria-label="share">
                        <span class="icon is-small">
                            <i class="fas fa-share-alt"></i>
                        </span>
                    </a>
                </div>
            </nav>
        </div>
    </article>
</div>


