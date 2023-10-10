import SvelteParent from "./components/SvelteParent.svelte";
import TestComponent from "./components/Test/TestComponent.svelte";
import TestButtons from "./components/Test/TestButtons.svelte";

import "./app.css";

const target = document.getElementById("app");
const root = document.createElement("div");

new SvelteParent({
	target: root,
	props: { root: root },
});

new TestButtons({
	target: root,
});

new TestComponent({
	target: root,
});

// root.style.position = "fixed";
// root.style.top = "10px";
// root.style.right = "10px";
// root.style.width = "450px";
// root.style.height = "700px";
// root.style.backgroundColor = "transparent";
// root.style.zIndex = "9998";
// new Component({target: root, props: { root: target}});

target?.appendChild(root);
