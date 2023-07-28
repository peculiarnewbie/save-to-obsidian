import Inspector from "../components/Content Script/Inspector.svelte";

let firstTime = true;

let extensionId = chrome.runtime.id;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "popup") {
		if (!document.getElementById(`${extensionId}-iframe`)) {
			const iframe = document.createElement("iframe");
			iframe.id = `${extensionId}-iframe`;
			iframe.style.all = "initial";
			iframe.style.position = "fixed";
			iframe.style.top = "10px";
			iframe.style.right = "10px";
			iframe.style.width = "450px";
			iframe.style.height = "700px";
			iframe.style.backgroundColor = "transparent";
			iframe.style.zIndex = "9998";
			iframe.src = chrome.runtime.getURL("assets/index.html");

			document.body.appendChild(iframe);
		} else {
			console.log("popup already exists");
		}

		if (!document.getElementById(`${extensionId}-inspect-root`)) {
			const inspectRoot = document.createElement("div");
			inspectRoot.id = `${extensionId}-inspect-root`;
			inspectRoot.style.position = "fixed";
			inspectRoot.style.top = "10px";
			inspectRoot.style.right = "10px";
			inspectRoot.style.zIndex = "9999";

			const canvas = document.createElement("canvas");
			canvas.id = `${extensionId}-hoverCanvas`;
			canvas.style.position = "fixed";
			canvas.style.pointerEvents = "none";
			canvas.style.zIndex = "9999";
			canvas.style.top = "0";
			canvas.style.left = "0";

			new Inspector({
				target: inspectRoot,
				props: { canvas: canvas, extensionId: extensionId },
			});
			document.body.appendChild(inspectRoot);
			document.body.appendChild(canvas);
		} else {
			console.log("inspector already exists");
		}

		sendResponse({ success: true });
	}
});
