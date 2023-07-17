
<script lang="ts">
  export let root: HTMLElement;

  let clicked = "not clicked"

  const closePopup = () => {
    root.remove();
  };

  const download = () => {
    console.log("clicked download")
        chrome.runtime.sendMessage({ action: "download" }, (response) => {
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

    document.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const element = event.target;
      console.log("clicked")
      console.log("element: ", element)
      if(element.nodeName == "IMG"){
        console.log("src: ", element.src)
      }
      console.log("innerText: ", element.innerText)
      // console.log("nodeType: ", element.nodeType)
      // console.log("nodeValue: ", element.nodeValue)
      // console.log("nodeName: ", element.nodeName)
      // console.log("innerHTML: ", element.innerHTML)
      console.log("outerHTML: ", element.outerHTML)
      clicked = element.innerText;
    }, true);

  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "clicked"){
      clicked = request.element;
    }
  })
</script>

<div class="ActualRoot">
  <p>We here</p>
  <div>
    <button on:click={closePopup}>Close</button>
    <button on:click={download}>Download</button>
  </div>
  <div>
    <p>{clicked}</p>
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
