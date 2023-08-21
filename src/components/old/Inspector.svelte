<script lang="ts">
  import { onMount } from "svelte";

  let markdownText = "# Hello World";
  let selectedText = "Selected";

  const selectElement = () => {
    window.close();

    chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.ts"]
    });
    });
  };
  
  const download = () => {
    const blob = new Blob([markdownText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const downloadOptions = {
      url,
      filename: "generated.md",
      saveAs: true
    }

    chrome.downloads.download(downloadOptions)
  };
</script>

<div class="fixed bg-blue-50 min-w-[20rem] p-4 flex flex-col gap-4">
  <div class="flex gap-2">
    <button on:click={selectElement}>Select</button>
  </div>
  <p id="valueContainer" class="text-blue-800 text-xl">value: {selectedText}</p>
  <textarea rows="10" bind:value={markdownText}></textarea>
  <p class="text-blue-800 text-xl">
    Download:
  </p>
  <div class="flex gap-2">
    <button on:click={download}>Save</button>
  </div>
</div>

<style>
  textarea {
    width: 300px;
    height: 200px;
  }
</style>
