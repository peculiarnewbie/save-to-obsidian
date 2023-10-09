import Inspector from "../components/Content Script/Inspector.svelte";
import Component from "../components/Main Iframe/Component.svelte";
import SvelteParent from "../components/SvelteParent.svelte";

let firstTime = true;

let extensionId = chrome.runtime.id;
const svelteParent = document.createElement("div");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "popup") {
		if (firstTime) {
			firstTime = false;

			svelteParent.id = `${extensionId}-SvelteParent`;
			svelteParent.style.position = "fixed";
			svelteParent.style.top = "10px";
			svelteParent.style.right = "10px";
			svelteParent.style.backgroundColor = "transparent";
			svelteParent.style.zIndex = "9997";
			svelteParent.style.display = "block";
			svelteParent.style.pointerEvents = "all";

			new SvelteParent({
				target: svelteParent,
				props: { root: svelteParent },
			});
		}
		if (!document.getElementById(`${extensionId}-SvelteParent`)) {
			document.body.appendChild(svelteParent);
		} else {
			console.log("popup already exists");
			const svelteParent = document.getElementById(
				`${extensionId}-SvelteParent`,
			);
			svelteParent.style.display = "block";
			svelteParent.style.pointerEvents = "all";
		}
		sendResponse({ success: true });
	} else if (message.action === "closeExtension") {
		const parent = document.getElementById(`${extensionId}-SvelteParent`);
		parent.remove();
	}
});
