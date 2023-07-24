
import Counter from '../components/Counter.svelte';
import Component from "../components/Component.svelte";
import "../app.css"

// const target = document.getElementById('app');

// async function render() {

//   new Inspector({target, props: {}})
// }

// document.addEventListener('DOMContentLoaded', render);

const root = document.createElement("div");
root.id = "extension-root";
new Component({target: root, props: {root: root}});
const html = document.getElementById("extension-html")
html.appendChild(root);