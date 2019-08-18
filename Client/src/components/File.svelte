<script>
    import { fade, slide} from 'svelte/transition'
    import {originUrl} from "../config";
    import {getClassNameForFilename} from "../utils/font_awsome_filetyp_mapper/mapper";
    import {deleteFile, getTextFromUrl} from "../http/communicator";
    import {Dialog} from 'svelma'
    import {copyStringToClipboard} from "../utils/clipboard";
    import ToolTip from "./ToolTip.svelte";
    import {scrollFileWindowStore, scrollFileWindowStoreData} from "../stores/scroll_file_window_store";

    export let file;
    export let fromThisId;
    export let lastOne;

    $: fileUrl = originUrl + "/api/data/download/" + file.id;
    $: fileSeeUrl = originUrl + "/api/data/see/" + file.id;
    $: fileIcon = "fa " + getClassNameForFilename(file.name) + " file-icon";

    let readable = file.name.endsWith(".md") || file.name.endsWith(".txt");
    $: readableCollapseOpen = false;
    $: readableText =  null;

    function removeFile() {
        deleteFile(file.id);
    }

    function showInfo() {
        file.readable = readable;
        file.readableText = readableText;
        Dialog.alert("<pre>" + JSON.stringify(file, undefined, 2) + "</pre>");
    }

    async function showReadable() {
        readableCollapseOpen = !readableCollapseOpen;
        if(!readableText) {
            if (file.name.endsWith(".md")) {
                let converter = new showdown.Converter();
                let mdText = await getTextFromUrl(fileSeeUrl);
                readableText = DOMPurify.sanitize(converter.makeHtml(mdText)) + " ";
            } else {
                readableText = DOMPurify.sanitize(await getTextFromUrl(fileSeeUrl));
            }
        }
    }

    //open the text if one of the last ones
    $: if(lastOne && readable){
        showReadable();
    }

    let iframeStyles = '<style> html, body { position: relative; width: 100%; } body { color: #333; margin: 0; padding: 1px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; } a { color: rgb(0,100,200); text-decoration: none; } a:hover { text-decoration: underline; } a:visited { color: rgb(0,80,160); } </style>'
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
<div class="box" style="background-color: { fromThisId ? '#23d160' : 'white'}" >
    <article class="media" >
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
                    <ToolTip toolTipText="See file in browser">
                        <a class="level-item no-link-dec" aria-label="trash" href={fileSeeUrl}>
                        <span class="icon is-small">
                            <i class="far fa-eye"></i>
                        </span>
                        </a>
                    </ToolTip>
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
                    {#if readable }
                        <ToolTip toolTipText="Show text">
                            <a class="level-item no-link-dec " aria-label="share" on:click={() =>
                            showReadable()} >
                                <span class="icon is-small">
                                     <!-- todo make them turn -->
                                    {#if !readableCollapseOpen}
                                        <i class="fas fa-chevron-circle-down"></i>
                                    {:else}
                                        <i class="fas fa-chevron-circle-up"></i>
                                    {/if}
                                </span>
                            </a>
                        </ToolTip>
                    {/if}
                </div>
            </nav>
            {#if readableCollapseOpen }
                <div transition:slide on:introend="{ () => {if(lastOne) scrollFileWindowStore.update(value => new scrollFileWindowStoreData('bottom')) }}">
                    {#if readableText }
                        <iframe style="margin-top: -18px; margin-bottom: -18px; height: fit-content" srcdoc='<head>
                        {iframeStyles}
                        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
                        </head><html><body>{readableText}</body></html>'></iframe>
                    {:else}
                        <div style="display: flex; align-items: baseline">
                            <a class="button is-loading" style="border: none; background-color:rgba(0, 0, 0, 0.0)">-</a>
                            <p>Loading...</p>
                        </div>
                    {/if}
                </div>
            {/if}
    </div>
    </article>
</div>


