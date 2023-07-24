import Component from "../components/Component.svelte";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let firstTime = true;
    let root;
    let iframe;
    
    if(!document.getElementById("extension-root")){
        
        if(firstTime){
            
            root = document.createElement("iframe");
            root.id = "extension-root";
            root.style.position = "fixed";
            root.style.top = "10px";
            root.style.right = "10px";
            root.style.width = "450px";
            root.style.height = "700px";
            root.style.zIndex = "9999";
            root.src = chrome.runtime.getURL('assets/index.html');
            iframe = document.createElement("div");
            new Component({target: iframe, props: {root: iframe}});

            const canvas = document.createElement('canvas');
            canvas.id = "hoverCanvas";
            canvas.style.position = "fixed";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "9999";
            canvas.style.top = "0";
            canvas.style.left = "0";
        
            document.body.appendChild(canvas);
        }
        
        firstTime = false;
    }

    document.body.appendChild(root);
    console.log("appending into iframe")
    const iframeDiv = document.getElementById("extension-root")
    console.log("or are we")
    iframeDiv.appendChild(iframe);
    console.log(iframeDiv, iframe)

    sendResponse({success: true});
});