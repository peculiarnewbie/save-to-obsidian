<script lang="ts">
    import Component from "./Main Iframe/Component.svelte";
    import Inspector from "./Content Script/Inspector.svelte";
	import { onDestroy, onMount } from "svelte";
	import { formScroll, storeMessaging, Actions, initAllStores } from "../utils/stores";

    export let root: HTMLElement;

    let extensionId = chrome.runtime.id;
    let mainIframe:HTMLIFrameElement;
    let canvas:HTMLCanvasElement;

    onMount(() =>{

        initAllStores();

        mainIframe.onload = (ev) => {
            mainIframe.style.all = "initial";
			mainIframe.style.position = "fixed";
			mainIframe.style.top = "10px";
			mainIframe.style.right = "10px";
			mainIframe.style.width = "450px";
			mainIframe.style.height = "700px";
			mainIframe.style.backgroundColor = "transparent";
			mainIframe.style.zIndex = "9998";
            mainIframe.style.display = "block";
            mainIframe.style.pointerEvents = "all";

            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('assets/svelteContent.css');

            mainIframe.contentDocument.querySelector('head').appendChild(link)

            new Component({
                target: mainIframe.contentWindow.document.body
            });
        }

    })

    const unsubscribe = storeMessaging.subscribe((message) => {
        console.log(message);
        const action = message.action;
        switch(action){
            case Actions.ClosePopup:
                mainIframe.style.display = "none";
                mainIframe.style.pointerEvents = "none";
                break;
            case Actions.OpenPopup:
                mainIframe.style.display = "block";
                mainIframe.style.pointerEvents = "all";
                break;
            default:
                break;
        }
    })

    onDestroy(unsubscribe);

</script>

<!-- <div id={`${extensionId}-SvelteParent`}> -->
<iframe id={`${extensionId}-iframe`} bind:this={mainIframe} title={`${extensionId}-iframe`}/>
<canvas id={`${extensionId}-canvas`} bind:this={canvas} style="position: fixed; pointer-events: none; z-index: 9999; top: 0px; left: 0px; width: 100vw; height: 100vh;"/>
<Inspector canvas={canvas} extensionId={extensionId} />
<!-- </div> -->