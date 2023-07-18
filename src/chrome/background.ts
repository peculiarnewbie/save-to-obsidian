

chrome.action.onClicked.addListener((tab) => {
    console.log("alooo")

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, (response) => {
          // Handle the response from the content script
          console.log(response);
        });
      });

    
    // chrome.scripting.executeScript({
    //   target: { tabId: tab.id },
    //   files: ["src/chrome/content.ts"]
    // });
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === "download"){  
    let markdownText = request.data;
      const blob = new Blob([markdownText], { type: "text/markdown" });

      // use BlobReader object to read Blob data
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const blobUrl = `data:${blob.type};base64,${btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
        chrome.downloads.download({
          url: blobUrl,
          filename: "Obsidian/generated.md",
          saveAs: true,
          conflictAction: "uniquify"
        }, () => {
          console.log("downloaded")});
      };
      sendResponse({ success: true });
      reader.readAsArrayBuffer(blob);
    }
})

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
//   if(message.action === "inspect"){
//     console.log("waiting for click");
//     chrome.scripting.executeScript({
//       target: { tabId: sender.tab.id },

//     });
//   }
// });

function displayClickedElement() {
  console.log("in listening function")
  document.addEventListener('click', (event) => {
    const clickedElement = event.target as HTMLElement;
    // Do something with the clicked element, such as displaying it in the popup
    chrome.runtime.sendMessage({ action: "clicked", element: clickedElement.innerText });
  });
}