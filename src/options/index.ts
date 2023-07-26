import Options from "../components/Options.svelte";

chrome.action.onClicked.addListener((tab) => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content.ts"],
	});
});
