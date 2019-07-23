<script>
    import { Input} from 'svelma'

    import {  afterUpdate } from 'svelte';

    let loading;
    let fileName;
    let mdEditor;

    let simplemde;
    afterUpdate(() => {
        simplemde = new SimpleMDE({ element: mdEditor});
    });


    function onClickSend() {
        let text = simplemde.value();
        if(text.trim()){
            console.log(simplemde.value());
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
        <Input type="number"
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
