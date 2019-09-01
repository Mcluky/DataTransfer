<script>
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    $: notifications = [];
    let notificationCounter = 0;

    export function showToast(msg, timeInMs = 3000, color = 'rgba(41,42,56,0.9)', textColor = 'rgba(255,255,255,0.9)') {
        if (msg) {
            notificationCounter++;
            let id = notificationCounter;
            let notificationMetadata = {id, msg, timeInMs, color, textColor};
            notifications = [...notifications, notificationMetadata];
            setTimeout(() => removeNotification(id), timeInMs);
        }
    }

    function removeNotification(id){
        notifications = notifications.filter(notification => notification.id !== id);
    }
</script>

<style>
    #notificationBox {
        pointer-events: none;
        padding-top: 20px;
        position: absolute;
        z-index: 9;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .notification {
        padding: 20px;
        border-radius: 70px 70px 70px 70px;
        -moz-border-radius: 70px 70px 70px 70px;
        -webkit-border-radius: 70px 70px 70px 70px;
    }

    .notification-text {
        width: available;
        text-align: center;
    }
</style>


<div id="notificationBox">
    {#each notifications as notification (notification) }
        <div class="notification"
             animate:flip="{{duration: 300}}"
             in:fly="{{ y: -100, duration: 400 }}"
             out:fade
             style="background-color: {notification.color}; color: {notification.textColor}" >
            <p class="notification-text">{notification.msg}</p>
        </div>
    {/each}
</div>
