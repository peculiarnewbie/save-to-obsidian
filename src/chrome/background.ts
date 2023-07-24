

chrome.action.onClicked.addListener((tab) => {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "popup" }, (response) => {
          
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
      return;
    }
  else if(request.action === "inspect"){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "inspect" }, (response) => {
        // Handle the response from the content script
        sendResponse(response);
      });
    });
    return;
  }
  else if(request.action === "elementSelected"){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "bgElementSelected", path: request.path }, (response) => {
        sendResponse(response);
      });
    });
    return;
  }
  else if(request.action === "getElement"){
    (async () => {
      let actualResponse; 
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "bgGetElement", path: request.path }, (response) => {
          // Handle the response from the content script
          actualResponse = response;
        });
      });

      const result = await new Promise((resolve, reject) => {
        setInterval(() => {
          if(actualResponse){
            resolve(actualResponse);
          }
          }, 10);
      })
      
      sendResponse(result);
    })();
    return true;
  }
})