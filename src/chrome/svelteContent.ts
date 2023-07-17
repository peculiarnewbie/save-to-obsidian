import Component from "../components/Component.svelte";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let firstTime = true;
    let root;
    
    if(!document.getElementById("extension-root")){
        
        if(firstTime){
            
            root = document.createElement("div");
            root.id = "extension-root";
            root.style.position = "fixed";
            root.style.top = "0";
            root.style.right = "0";
            root.style.zIndex = "9999";
            new Component({target: root, props: {root: root}});
        }
        
        firstTime = false;
        
        
    }
    
    document.body.appendChild(root);

    sendResponse({success: true});
});