import "../app.css";
import Counter from '../components/Counter.svelte';
import Inspector from "../components/Inspector.svelte";

// const target = document.getElementById('app');

// async function render() {

//   new Inspector({target, props: {}})
// }

// document.addEventListener('DOMContentLoaded', render);

const root = document.createElement("div");
root.id = "extension-root";
document.body.appendChild(root);

async function render(){
  new Inspector({target: root, props: {}})
}

document.addEventListener('DOMContentLoaded', render);