<script lang="ts">
	import Component from "./Main Iframe/Component.svelte";
	import Inspector from "./Content Script/Inspector.svelte";
	import { onDestroy, onMount } from "svelte";
	import {
		formScroll,
		storeMessaging,
		Actions,
		initAllStores,
		docHeaders,
		mainIframeDoc,
	} from "../utils/stores";

	export let root: HTMLElement;

	let extensionId: string;
	if (!import.meta.env.DEV) extensionId = chrome.runtime.id;
	else extensionId = "id";

	let mainIframe: HTMLIFrameElement;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		initStores();

		mainIframe.onload = (ev) => {
			// mainIframe.style.all = "initial";
			mainIframe.style.position = "fixed";
			mainIframe.style.top = "10px";
			mainIframe.style.right = "10px";
			mainIframe.style.width = "450px";
			mainIframe.style.height = "700px";
			mainIframe.style.backgroundColor = "transparent";
			mainIframe.style.border = "none";
			mainIframe.style.zIndex = "9998";
			mainIframe.style.display = "block";
			mainIframe.style.pointerEvents = "all";

			let link = document.createElement("link");
			link.rel = "stylesheet";

			if (!import.meta.env.DEV)
				link.href = chrome.runtime.getURL("assets/svelteContent.css");
			else link.href = "src/app.css";

			mainIframe.contentDocument?.querySelector("head")?.appendChild(link);

			if (mainIframe.contentWindow) {
				new Component({
					target: mainIframe.contentWindow.document.body,
				});
			}

			mainIframe.contentDocument ??
				mainIframeDoc.set(mainIframe.contentDocument);
		};
	});

	const unsubscribe = storeMessaging.subscribe((message) => {
		// console.log(message);
		const action = message.action;
		switch (action) {
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
	});

	const initStores = () => {
		// let title = document.title;
		// let url = document.URL;
		let title = document.querySelector(
			'meta[property="og:title"]',
		) as HTMLMetaElement;
		let url = document.querySelector(
			'meta[property="og:url"]',
		) as HTMLMetaElement;
		let image = document.querySelector(
			'meta[property="og:image"]',
		) as HTMLMetaElement;

		docHeaders.set({ title: title, url: url, image: image });
		initAllStores();
	};

	onDestroy(unsubscribe);
</script>

<!-- <div id={`${extensionId}-SvelteParent`}> -->
<iframe
	id={`${extensionId}-iframe`}
	bind:this={mainIframe}
	title={`${extensionId}-iframe`}
/>
<canvas
	id={`${extensionId}-canvas`}
	bind:this={canvas}
	style="position: fixed; pointer-events: none; z-index: 9999; top: 0px; left: 0px; width: 100vw; height: 100vh;"
/>
<Inspector {canvas} {extensionId} />
<!-- </div> -->
