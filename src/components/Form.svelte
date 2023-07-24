<script lang="ts">
    import Field from "./Field.svelte";
    export let root: HTMLElement;
    export let currentForm;
    export let isEditing;
    $: fields = currentForm.fields;
    let prevName;
    let hoveredElement;
    $: data = `---<br>${
        currentForm.fields.map(field => {
            return `${field.key}: ${field.value}`
        }).join('<br>')
    }<br>---<br>`
    export let forms;
    export let refresh;

    const download = () => {
        data = `---\n` 
        fields.forEach((field) => {
        data += `${field.key}: ${field.value}\n`
        })
        data += `---\n`
        chrome.runtime.sendMessage({ action: "download", data: data}, (response) => {
            if (response.success) {
                document.getElementById("floatingPage").style.display = "none";
            }
        })
    }

    const addField = () => {
        currentForm.fields = [...fields, {key: "", value: ""}]
    }

    function deleteField(event){
        const temp = [...fields]
        temp.splice(event.detail, 1)
        currentForm.fields = temp;
    }

    const inspect = async () => {

        let selectedElement;

        root.style.opacity = "0";
        root.style.pointerEvents = "none";

        let click_count = 0;

        const canvas = document.getElementById("hoverCanvas") as HTMLCanvasElement;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";

        const ctx = canvas.getContext('2d');

        document.addEventListener('click', InspectElement, true);
        document.addEventListener('mouseover', HoverElement, true);
        window.addEventListener('mouseout', ClearCanvas, true);

        const WaitForSelection = () => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                if (selectedElement) {
                    clearInterval(interval);
                    resolve(selectedElement);
                }
                }, 100);
            });
        };

        const chosen = await WaitForSelection() as HTMLElement;
        return chosen

        function InspectElement (event) {
        click_count++;
        event.preventDefault();
        event.stopPropagation();
        const element = event.target;
        selectedElement = element;

        if(click_count == 1){
            root.style.opacity = "1";
            root.style.pointerEvents = "all";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.removeEventListener('click', InspectElement, true);
            document.removeEventListener('mouseover', HoverElement, true);
            window.removeEventListener('mouseout', ClearCanvas, true);
            return selectedElement
        }
        }

        function HoverElement (event){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hoveredElement = event.target;
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        const hoveredDom = hoveredElement.getBoundingClientRect();
        // ctx.fillRect(100, 100, 200, 200);
        ctx.fillRect(hoveredDom.left, hoveredDom.top, hoveredDom.width, hoveredDom.height);
        }

        function ClearCanvas (){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const saveForm = async () => {
        if(!forms.includes(currentForm.name)){
            await chrome.storage.local.remove([`form_${prevName}`])
            let temp = forms
            temp[temp.indexOf(prevName)] = currentForm.name
            forms = temp
            await chrome.storage.local.set({forms: forms})
        }
        await chrome.storage.local.set({[`form_${currentForm.name}`]: currentForm, forms: forms})
        await refresh()
        isEditing = false;
    }

    prevName = currentForm.name;
</script>


<div id="Form" class="min-h-28 p-4 pt-1 overflow-y-auto flex-grow-[10]">

    {#if isEditing}
        <div style="display: flex; justify-content:space-between; align-items:end">
            <div>
                <p class="ext-h4">Form Title:</p>
                <input type="text" placeholder="enter form name" bind:value={currentForm.name}>
            </div>
            <button class="btn-primary" on:click={addField}>Add Field</button>
        </div>
    {:else}
        <button class="btn-primary" on:click={() => {isEditing = true}}>Edit</button>
    {/if}
        
    {#each currentForm.fields as field, i}
        <Field index={i} bind:field={field} parentInspect={inspect} on:deleteField={deleteField} isEditing={isEditing} />
    {/each}

</div>
  
<div id="result" class="flex flex-col text-white h-44 bg-[#1e1e1e] p-3 pb-5 border-t border-[#363636] bottom-0">
    <div class="flex justify-between mb-4 items-center">
    <p style="margin: 0;">result:</p>
    {#if isEditing}
        <button class="btn-primary" on:click={saveForm}>Save</button>
    {:else}
        <button class="btn-primary" on:click={download}>Download</button>
    {/if}
    </div>
    <div id="rawData" class="h-full grow-10 overflow-y-auto bg-[#242424] p-2 text-xs">
    <p style="margin: 0;">{@html data}</p>
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
  @apply bg-[#363636] align-middle text-white px-5 rounded-md h-9 transition-all duration-100 border-l border-r border-t border-[#3f3f3f] shadow-[0_2px_5px_-2px_rgba(0,0,0,0.67)]; 
}
button.hover{
 @apply bg-[#3f3f3f]border-[#4e4e4e] shadow-[0_2px_5px_-2px_rgba(0,0,0,1)]; 
}
</style>