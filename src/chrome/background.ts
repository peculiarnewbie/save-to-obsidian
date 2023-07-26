chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "popup" },
            (response) => {},
        );
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "download") {
        console.log("download: ", request.data, request.title);
        let markdownText = request.data;
        const blob = new Blob([markdownText], { type: "text/markdown" });

        // use BlobReader object to read Blob data
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result;
            const blobUrl = `data:${blob.type};base64,${btoa(
                new Uint8Array(buffer).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    "",
                ),
            )}`;
            chrome.downloads.download(
                {
                    url: blobUrl,
                    filename: `${request.title}.md`,
                    saveAs: true,
                    conflictAction: "uniquify",
                },
                () => {
                    console.log("downloaded");
                },
            );
        };
        sendResponse({ success: true });
        reader.readAsArrayBuffer(blob);
        return;
    } else if (request.action === "inspect") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "inspect" },
                (response) => {
                    sendResponse(response);
                },
            );
        });
        return;
    } else if (request.action === "elementSelected") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    action: "bgElementSelected",
                    path: request.path,
                    value: request.value,
                },
                (response) => {
                    sendResponse(response);
                },
            );
        });
        return;
    } else if (request.action === "getElement") {
        (async () => {
            let actualResponse;

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "bgGetElement", path: request.path },
                    (response) => {
                        // Handle the response from the content script
                        actualResponse = response;
                        sendResponse(actualResponse);
                    },
                );
            });

            const result = await new Promise((resolve, reject) => {
                setInterval(() => {
                    if (actualResponse) {
                        resolve(actualResponse);
                    }
                }, 10);
            });
        })();
        return true;
    } else if (request.action === "getElements") {
        (async () => {
            let actualResponse;

            console.log("bg: received getElements request", request.paths);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "bgValuesUpdate", paths: request.paths },
                    (response) => {
                        // Handle the response from the content script
                        actualResponse = response;
                        sendResponse(actualResponse);
                    },
                );
            });

            const result = await new Promise((resolve, reject) => {
                setInterval(() => {
                    if (actualResponse) {
                        resolve(actualResponse);
                    }
                }, 10);
            });
        })();
        return true;
    } else if (request.action === "closePopup") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "closePopup" },
                (response) => {
                    sendResponse(response);
                },
            );
        });
        return;
    }
});
