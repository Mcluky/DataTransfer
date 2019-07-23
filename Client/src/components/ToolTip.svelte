<script>
    import {copyStringToClipboard} from "../utils/clipboard";

    //todo can be made better
    export let toolTipText;
</script>
<style>

    a.tooltip {
        margin-right: 12px;
        position: relative;
        text-decoration: none;
    }

    a.tooltip:after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 130%;
        left: 20%;
        background: #4a4a4a;
        padding: 5px 15px;
        color: #ffffff;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        white-space: nowrap;
        opacity: 0;
        /* At time of this creation, only Fx4 doing pseduo transitions */
        -webkit-transition: all 0.4s ease;
        -moz-transition: all 0.4s ease;
    }

    a.tooltip:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-top: 20px solid #4a4a4a;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        /* At time of this creation, only Fx4 doing pseduo transitions */
        -webkit-transition: all 0.4s ease;
        -moz-transition: all 0.4s ease;
        opacity: 0;
        left: 30%;
        bottom: 90%;
    }

    a.tooltip:hover:after {
        bottom: 100%;
    }

    a.tooltip:hover:before {
        bottom: 70%;
    }

    a.tooltip:hover:after, a:hover:before {
        opacity: 1;
    }
</style>

<a class="tooltip" data-tooltip={toolTipText} style="text-decoration: none">
   <slot></slot>
</a>
