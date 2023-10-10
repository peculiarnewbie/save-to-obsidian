import Inspector from "../components/Content Script/Inspector.svelte";
import Component from "../components/Main Iframe/Component.svelte";
import SvelteParent from "../components/SvelteParent.svelte";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	let extensionId = chrome.runtime.id;
	if (message.action === "popup") {
		const svelteParent = document.getElementById(`${extensionId}-SvelteParent`);
		if (!svelteParent) {
			const svelteParent = document.createElement("div");

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

			document.body.appendChild(svelteParent);
		} else {
			console.log("popup already exists");

			svelteParent.style.display = "block";
			svelteParent.style.pointerEvents = "all";
		}
		sendResponse({ success: true });
	} else if (message.action === "closeExtension") {
		const parent = document.getElementById(`${extensionId}-SvelteParent`);
		if (parent) parent.remove();
	}
});
