
import Counter from '../src/components/old/Counter.svelte';
import Component from "../src/components/Component.svelte";
import "../src/app.css"

// const target = document.getElementById('app');

// async function render() {

//   new Inspector({target, props: {}})
// }

// document.addEventListener('DOMContentLoaded', render);

const root = document.createElement("div");
root.id = "extension-root";
new Component({target: root, props: {root: root}});
const html = document.getElementById("extension-html")
//@ts-ignore
html.appendChild(root);