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

    sendResponse({success: true});
});