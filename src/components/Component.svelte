
<script lang="ts">
    import Form from "./Form.svelte";

    export let root: HTMLElement;
    let loading = true;
    let fields = [{key: "", value: ""}]
    let forms: string[] = [];
    let allData = {}
    let isEditing = false
    $: currentForm = {name: "", fields: fields}

    let openForm = false;

    const closePopup = () => {
      root.remove();
    };

    const getChromeStorage = async () => {
      await chrome.storage.local.get(null, async (result) => {
        console.log(result)
        allData = result;
        forms = Object.keys(allData).filter((item) => item.includes("form_")).map((item) => item.replace("form_", ""))
        if(forms.length == 0){
          forms = ["example"]
          let form_example = {name: "example", fields: [{key: "title", value: "Example Title"}, {key: "tags", value: "example, tags"}, {key: "description", value: "Example Description"}]}
          await chrome.storage.local.set({forms: forms, form_example: form_example})
          allData["form_example"] = form_example
        }
        loading = false;
      })
    }

    const deleteForm = async(form) => {
      await chrome.storage.local.remove([`form_${form}`])
      let newForms = forms.filter((item) => item != form)
      await chrome.storage.local.set({forms: newForms})
      forms = newForms;
    }

    const promise = getChromeStorage();

</script>

<div class="ActualRoot">
  <div class="Header">
    {#if !openForm}
    <h2 class="ExtensionTitle">Markdown Clipper</h2>
    {:else}
    <div style="display: flex;">
      <button on:click={() => {openForm = false}}>Back</button>
      <h2 class="ExtensionTitle">{currentForm.name}</h2>
    </div>
    {/if}
    <div class="CloseButton" on:click={closePopup}>x</div>
  </div>
  <div class="MainContent">
    {#if import.meta.env.DEV}
      {#if openForm}
        <Form root={root} bind:currentForm={currentForm} isEditing={isEditing} bind:forms={forms} refresh={getChromeStorage}/>
      {:else}
        <button on:click={() => {currentForm = {name: "New Form", fields: [{key: "", value: ""}]}; isEditing=true; openForm = true}}>Add Form</button>
      {/if}
    {/if}
    {#await promise}
      <p>loading...</p>
    {:then}
      {#if openForm}
        <Form root={root} bind:currentForm={currentForm} isEditing={isEditing} bind:forms={forms} refresh={getChromeStorage}/>
      {:else}
        <button on:click={() => {currentForm = {name: "New Form", fields: [{key: "", value: ""}]}; isEditing=true; openForm = true}}>Add Form</button>
        {#each forms as form, i}
          <div class="Form">
            <h2>{form}</h2>
            <button on:click={() => {currentForm = allData[`form_${form}`]; isEditing=false; openForm = true;}}>Open Form</button>
            <button on:click={() => deleteForm(form)}>Delete</button>
          </div>
        {/each}
      {/if}
    {/await}
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

  color: white;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  
}
.Header{
  color: white;
  display: flex;
  justify-content: space-between;
  background-color: #363636;
  padding: 0 0 0 15px;
}
.ExtensionTitle{
  margin: 10px 0;
}
h2{
  color: white;
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
  color: white;
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
