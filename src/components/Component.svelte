
<script lang="ts">
  export let root: HTMLElement;

  let clicked = "not clicked"
  let selectedElement;
  let hoveredElement;
  let data = ""

  const closePopup = () => {
    root.remove();
  };

  const download = () => {
    console.log("clicked download")
        chrome.runtime.sendMessage({ action: "download", data: data}, (response) => {
            console.log("sent message")
            if (response.success) {
                console.log("success")
                document.getElementById("floatingPage").style.display = "none";
            }
            console.log("done")
        })
  }

  const inspect = () => {
    // chrome.runtime.sendMessage({ action: "inspect" }, (response) => {
    //   console.log("sent message")
    //   if (response.success) {
    //     console.log("success")
    //     document.getElementById("floatingPage").style.display = "none";
    //   }
    //   console.log("done")
    // })

    root.style.opacity = "0";
    root.style.pointerEvents = "none";
    
    let click_count = 0;

    function InspectElement (event) {
      console.log(click_count)
      click_count++;
      event.preventDefault();
      event.stopPropagation();
      const element = event.target;
      console.log("clicked")
      console.log("element: ", element)
      selectedElement = element;
      determineNodeType()
      console.log("outerHTML: ", element.outerHTML)

      if(click_count == 1){
        root.style.opacity = "1";
        root.style.pointerEvents = "all";
        document.removeEventListener('click', InspectElement, true);
        document.removeEventListener('mouseover', HoverElement, true);
      }
    }

    function HoverElement (event){
      if(hoveredElement) hoveredElement.style.boxShadow = "none";
      event.preventDefault();
      event.stopPropagation();
      const element = event.target as HTMLElement;
      hoveredElement = element;
      hoveredElement.style.boxShadow = "inset 0 0 100px 100px rgba(255, 255, 255, 0.1)";
      console.log(hoveredElement)
    }

    document.addEventListener('click', InspectElement, true);
    document.addEventListener('mouseover', HoverElement, true);

  }

  const getParent = () => {
    console.log("element: ", selectedElement)
    console.log("parent: ", selectedElement.parentElement)
    if(selectedElement.parentElement == null){
      console.log("no parent")
      return;
    }
    else{
      selectedElement = selectedElement.parentElement
      determineNodeType()
    }
  }

  const determineNodeType = () => {
    if(selectedElement.nodeName == "IMG"){
      console.log("src: ", selectedElement.src)
      data = selectedElement.src
      clicked = data;
    }
    else{
      console.log("innerText: ", selectedElement.innerText)
      data = selectedElement.innerText;
      clicked = data;
    }
  }

</script>

<div class="ActualRoot">
  <p>We here</p>
  <div>
    <button on:click={closePopup}>Close</button>
    <button on:click={download}>Download</button>
  </div>
  <div>
    <p>{clicked}</p>
    <button on:click={getParent}>Prev</button>
    <button on:click={inspect}>Inspect</button>
  </div>
</div>

<style>
.ActualRoot{
  background-color: white;
  padding: 15px;
  margin: 10px;
}
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
