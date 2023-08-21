import Component from "../components/Main Iframe/Component.svelte";
let fromManifest = true;
let firstTime = true;
let root;
if (fromManifest) {
	fromManifest = false;
} else if (!document.getElementById("extension-root")) {
	if (firstTime) {
		root = document.createElement("div");
		root.id = "extension-root";
		root.style.position = "fixed";
		root.style.top = "0";
		root.style.right = "0";
		root.style.zIndex = "9999";
		new Component({ target: root, props: { root: root } });
	}

	firstTime = false;

	document.body.appendChild(root);
}
