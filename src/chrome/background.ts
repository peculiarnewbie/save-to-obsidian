import { fetchDocument } from "../utils/ElementFetcher";

chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(
			tabs[0].id ?? 0,
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
			const buffer = reader.result as ArrayBufferLike;
			const blobUrl = `data:${blob.type};base64,${btoa(
				new Uint8Array(buffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					"",
				),
			)}`;
			chrome.downloads.download(
				{
					url: blobUrl,
					filename: `${request.title}`,
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
	} else if (request.action === "closeExtension") {
		console.log("background x");
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id ?? 0,
				{ action: "closeExtension" },
				(response) => {
					sendResponse(response);
				},
			);
		});
		return;
	} else if (request.action === "fetchDocument") {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			if (tabs[0].url) {
				FetchDocument(tabs[0].url);
				sendResponse("collecting");
			} else {
				sendResponse("no url");
			}
		});
	} else if (request.action === "exportForms") {
		console.log("exporting", request.data);
		let data = request.data;
		const blob = new Blob([data], { type: "text/json" });
		const reader = new FileReader();
		reader.onload = () => {
			const buffer = reader.result as ArrayBufferLike;
			const blobUrl = `data:${blob.type};base64,${btoa(
				new Uint8Array(buffer).reduce(
					(data, byte) => data + String.fromCharCode(byte),
					"",
				),
			)}`;
			chrome.downloads.download(
				{
					url: blobUrl,
					filename: `Save-to-Obsidian forms.json`,
					saveAs: true,
					conflictAction: "uniquify",
				},
				() => {
					console.log("exported");
				},
			);
		};
		sendResponse({ success: true });
		reader.readAsArrayBuffer(blob);
		return;
	}
});

const FetchDocument = async (url: string) => {
	console.log("calling fetcher from bg: ", url);
	const docText = await fetchDocument(url);

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(
			tabs[0].id ?? 0,
			{
				action: "documentFetched",
				data: docText,
			},
			(response) => {
				console.log(response);
			},
		);
	});
};
