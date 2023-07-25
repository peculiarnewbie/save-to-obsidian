
import DetailedSelector from "./components/DetailedSelector.svelte"

console.log("am here")

const target = document.getElementById('app');
const root = document.createElement("div");
new DetailedSelector({target: root, props: {extensionId: 1, selectedElement: target}});
target.appendChild(root);