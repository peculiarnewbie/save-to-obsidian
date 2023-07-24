import Inspector from "../components/Inspector.svelte";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "popup"){
        let firstTime = true;
        let root;
        
        if(!document.getElementById("extension-root")){
            
            if(firstTime){
                
                root = document.createElement("iframe");
                root.id = "extension-root";
                root.style.position = "fixed";
                root.style.top = "10px";
                root.style.right = "10px";
                root.style.width = "450px";
                root.style.height = "700px";
                root.style.zIndex = "9998";
                root.src = chrome.runtime.getURL('assets/index.html');
    
                // const canvas = document.createElement('canvas');
                // canvas.id = "hoverCanvas";
                // canvas.style.position = "fixed";
                // canvas.style.pointerEvents = "none";
                // canvas.style.zIndex = "9999";
                // canvas.style.top = "0";
                // canvas.style.left = "0";
            
                // document.body.appendChild(canvas);
            }
            
            firstTime = false;
        }
    
        document.body.appendChild(root);
    
        sendResponse({success: true});
    }
    
    else if(message.action === "inspect" ){

        if( !document.getElementById("inspect-root")){
            const inspectRoot = document.createElement("div");
            inspectRoot.id = "inspect-root";
            inspectRoot.style.position = "fixed";
            inspectRoot.style.top = "10px";
            inspectRoot.style.right = "10px";
            inspectRoot.style.zIndex = "9999";
            
            const canvas = document.createElement('canvas');
            canvas.id = "hoverCanvas";
            canvas.style.position = "fixed";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "9999";
            canvas.style.top = "0";
            canvas.style.left = "0";
            
            new Inspector({target: inspectRoot, props: {root: inspectRoot, canvas: canvas}});
            document.body.appendChild(inspectRoot);
            document.body.appendChild(canvas);
    
            sendResponse({success: true});
        }
        else{
            console.log("inspector already exists");
            sendResponse({success: true});
        }
    }
});