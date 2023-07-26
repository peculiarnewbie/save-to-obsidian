import DetailedSelector from "./components/DetailedSelector.svelte";

import Component from "./components/Component.svelte";
import "./app.css";

const target = document.getElementById("app");
const root = document.createElement("div");
// root.style.position = "fixed";
// root.style.top = "10px";
// root.style.right = "10px";
// root.style.width = "450px";
// root.style.height = "700px";
// root.style.backgroundColor = "transparent";
// root.style.zIndex = "9998";
new DetailedSelector({
    target: root,
    props: { extensionId: 1, selectedElement: target },
});
// new Component({target: root, props: { root: target}});
target.appendChild(root);
