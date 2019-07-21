<script>
    import {fileStore} from "../stores/file_store";
    import {filesArrayStore} from "../stores/files_array_store";
    import File from "./File.svelte"
    import {getPublicIp} from "../http/public_ip";

    let publicIp = 0;
    $: fromThisIp = (ip) => ip === publicIp;

    getPublicIp().then(ip => {
       publicIp = ip
    });

    let files = [];

    const unsubscribeFilesArrayStore = filesArrayStore.subscribe(value => {
        console.debug("files", files);
        files = value;
    });

</script>

<style>
</style>

<div class="section">
    <div class="box" >
        <div class="container">
            {#each files as file, i}
                <File file={file} fromThisIp={fromThisIp(file.uploadedBy)}/>
            {:else}
                <p>No Files</p>
            {/each}
        </div>
    </div>
</div>


