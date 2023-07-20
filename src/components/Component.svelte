
<script lang="ts">
    import Form from "./Form.svelte";

    export let root: HTMLElement;
    let fields = [{key: "", data: ""}]

    let openForm = false;

    const closePopup = () => {
      root.remove();
    };

  // const getParent = () => {
  //   console.log("element: ", selectedElement)
  //   console.log("parent: ", selectedElement.parentElement)
  //   if(selectedElement.parentElement == null){
  //     console.log("no parent")
  //     return;
  //   }
  //   else{
  //     selectedElement = selectedElement.parentElement
  //     return selectedElement
  //   }
  // }

  // const determineNodeType = () => {
  //   if(selectedElement.nodeName == "IMG"){
  //     console.log("src: ", selectedElement.src)
  //     data = selectedElement.src
  //     return data
  //   }
  //   else{
  //     console.log("innerText: ", selectedElement.innerText)
  //     data = selectedElement.innerText;
  //     return data
  //     console.log(JSON.stringify(fields))
  //   }
  // }

</script>

<div class="ActualRoot">
  <div class="Header">
    <h2 class="ExtensionTitle">Markdown Clipper</h2>
    <div class="CloseButton" on:click={closePopup}>x</div>
  </div>
  <div class="MainContent">
    {#if openForm}
      <Form root={root} fields={fields} bind:openForm={openForm}/>
    {:else}
      <button on:click={() => {openForm = !openForm}}>Open Form</button>
    {/if}
  </div>
</div>

<style>
.ActualRoot{
  display: flex;
  flex-direction: column;
  background-color: #242424;
  border-radius: 10px;
  width: fit-content;
  width: 50vw;
  height: 70vh;
  min-width: 350px;
  max-width: 450px;
  min-height: 500px;
  max-height: 1200px;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  overflow: hidden;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #1e1e1e;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  
}
.Header{
  display: flex;
  justify-content: space-between;
  background-color: #363636;
  padding: 0 0 0 15px;
}
.ExtensionTitle{
  margin: 10px 0;
}
h2{
  font-size: 1.5em;
  font-weight: 700;
  margin: 0;
  padding: 0;
}
.CloseButton{
  display: flex;
  background-color: transparent;
  border: none;
  border-radius: 0;
  color: white;
  font-size: 1.5em;
  font-weight: 300;
  cursor: pointer;
  padding: 5px 20px;
}
.CloseButton:hover{
  background-color: #fb464c;
}
.MainContent{
  display: flex;
  flex-direction: column;
  height:200px; 
  flex-grow:10; 
  padding:10px
}
button {
  align-items: center;
  border-radius: 6px;
  border: 1px solid transparent;
  padding: 0.4em 1.5em;
  height: 36px;
  font-size: 1em;
  font-weight: 300;
  font-family: inherit;
  background-color: #363636;
  cursor: pointer;
  transition: border-color 0.1s;
  border-left: solid 1px #3f3f3f;
  border-right: solid 1px #3f3f3f;
  border-top: solid 1px #484848;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 0.67);
}
button:hover {
  background-color: #3f3f3f;
  border-left: solid 1px #4e4e4e;
  border-right: solid 1px #4e4e4e;
  border-top: solid 1px #5b5b5b;
  box-shadow: 0px 2px 5px -2px rgba(0, 0, 0, 1);
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}


</style>
