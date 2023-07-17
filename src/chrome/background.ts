

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
    let markdownText = "# Hello World";
    const blob = new Blob([markdownText], { type: "text/markdown" });

    // use BlobReader object to read Blob data
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      const blobUrl = `data:${blob.type};base64,${btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
      chrome.downloads.download({
        url: blobUrl,
        filename: "generated.md",
        saveAs: true,
        conflictAction: "uniquify"
      }, () => {
        console.log("downloaded")});
    };
    sendResponse({ success: true });
    reader.readAsArrayBuffer(blob);
})