import Inspector from "../components/Content Script/Inspector.svelte";
import Component from "../components/Main Iframe/Component.svelte";
import SvelteParent from "../components/SvelteParent.svelte";

let firstTime = true;

let extensionId = chrome.runtime.id;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "popup") {
		// if (!document.getElementById(`${extensionId}-iframe`)) {
		if (!document.getElementById(`${extensionId}-SvelteParent`)) {
			// const iframe = document.createElement("iframe");
			// iframe.id = `${extensionId}-iframe`;
			// iframe.style.all = "initial";
			// iframe.style.position = "fixed";
			// iframe.style.top = "10px";
			// iframe.style.right = "10px";
			// iframe.style.width = "450px";
			// iframe.style.height = "700px";
			// iframe.style.backgroundColor = "transparent";
			// iframe.style.zIndex = "9998";
			
			// // new Component({
            // //     target: iframe.contentDocument.body
            // // });
			// iframe.src = chrome.runtime.getURL("assets/index.html");

			// document.body.appendChild(iframe);

			const svelteParent = document.createElement('div')
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
				props: {root: svelteParent}
			})

			document.body.appendChild(svelteParent);
		} else {
			console.log("popup already exists");
			const svelteParent = document.getElementById(`${extensionId}-SvelteParent`);
			svelteParent.style.display = "block";
			svelteParent.style.pointerEvents = "all";
		}
		sendResponse({ success: true });
	}
	else if (message.action === "closeExtension") {
		console.log("byee")
		const parent = document.getElementById(`${extensionId}-SvelteParent`);
		parent.remove();
	}
});
