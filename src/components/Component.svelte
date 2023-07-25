
<script lang="ts">
    import Form from "./Form.svelte";
    import back from '../../public/Back.svg'
    export let root: HTMLElement;
    let loading = true;
    let fields = [{key: "", value: ""}]
    let forms: string[] = [];
    let allData = {}
    let isEditing = false
    let currentForm = {name: "", fields: fields}

    let openForm = false;

    const closePopup = () => {
      chrome.runtime.sendMessage({action: "closePopup"})
    };

    const getChromeStorage = async () => {
      await chrome.storage.local.get(null, async (result) => {
        console.log("forms: ", result)
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

<div id="ActualRoot" class="ext flex flex-col rounded-xl h-full w-full bg-[#242424] overflow-hidden font-sans" >
  <div id="Header" class="ext flex justify-between bg-[#363636]">
    {#if !openForm}
    <div id="ExtensionTitle" class="ext text-2xl text-white font-bold my-3 pl-3 font-sans">Markdown Clipper</div>
    {:else}
    <div class="flex pl-2">
      <div class="ext flex p-2 pb-1 rounded-md bg-transparent hover:bg-[#363636] align-middle cursor-pointer"
      on:click={() => {openForm = false}}>
        {#if import.meta.env.DEV}
          <img src={back} alt="back" width="20px">
          {:else}
          <img src={chrome.runtime.getURL(back)} alt="back" width="20px">
        {/if}
    </div>
      <h2 id="ExtensionTitle">{currentForm.name}</h2>
    </div>
    {/if}
    <div id="CloseButton" class="ext flex bg-transparent text-2xl text-white py-3 px-5 hover:bg-red-500" on:click={closePopup}>
      x
    </div>
  </div>
  <div id="MainContent" class="ext flex flex-col flex-grow-[10] max-h-[92%]">
    {#if import.meta.env.DEV}
      {#if openForm}
        <Form root={root} bind:currentForm={currentForm} isEditing={isEditing} bind:forms={forms} refresh={getChromeStorage}/>
      {:else}
      <div class="ext p-3">
        <button class="btn-primary"
          on:click={() => {fields = [{key: "file title", value: ""}]; currentForm = {name: "New Form", fields: fields}; isEditing=true; openForm = true}}>
          <div class="text-white font-normal font-sans">Add Form</div>
        </button>
      </div>
      {/if}
    {/if}
    {#await promise}
      <div class="text-white font-normal font-sans">loading...</div>
    {:then}
      {#if openForm}
        <Form root={root} bind:currentForm={currentForm} isEditing={isEditing} bind:forms={forms} refresh={getChromeStorage}/>
      {:else}
        <div class="p-3">
          <button class="btn-primary" on:click={() => {currentForm = {name: "New Form", fields: [{key: "", value: ""}]}; isEditing=true; openForm = true}}>Add Form</button>
          {#each forms as form, i}
            <div id="Form">
              <div class="text-2xl text-white font-bold my-3 pl-3 font-sans">{form}</div>
              <button class="btn-primary" on:click={() => {currentForm = allData[`form_${form}`]; isEditing=false; openForm = true;}}>Open Form</button>
              <button class="btn-primary" on:click={() => deleteForm(form)}>Delete</button>
            </div>
          {/each}
        </div>
      {/if}
    {/await}
  </div>
</div>

<style>
h2{
  @apply text-2xl text-white font-bold my-3 pl-3 font-sans;
}
p{
  @apply text-white font-normal font-sans;
}
button{
  @apply font-sans bg-[#363636] align-middle text-white text-base px-5 rounded-md h-9 transition-all duration-100 border-l border-r border-t-[#242424] border-[#3f3f3f] shadow-[0_2px_5px_-2px_rgba(0,0,0,0.67)]; 
}
button:hover{
  @apply bg-[#3f3f3f] border-[#4e4e4e] shadow-[0_2px_5px_-2px_rgba(0,0,0,1)]; 
}
</style>
