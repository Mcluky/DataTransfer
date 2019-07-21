<script>
    import {slide} from 'svelte/transition'
    import {originUrl} from "../config";
    import {getClassNameForFilename} from "../utils/font_awsome_filetyp_mapper/mapper";

    export let file;
    export let fromThisIp;

    $: fileUrl = originUrl + "/api/data/download/" + file.id;
    $: fileIcon = "fa " + getClassNameForFilename(file.name) + " fa-3x";
</script>

<style>
</style>

<div class="box" transition:slide="{{duration: 500 }}"  style="background-color: { fromThisIp ? '#23d160' : 'white'}">
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
        </div>
    </article>
</div>


