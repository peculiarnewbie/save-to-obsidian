
<script lang="ts">
  export let root: HTMLElement;

  const closePopup = () => {
    root.remove();
  };

  const download = () => {
    console.log("clicked download")
        chrome.runtime.sendMessage({ action: "download" }, (response) => {
            console.log("sent message")
            if (response.success) {
                console.log("success")
                document.getElementById("floatingPage").style.display = "none";
            }
            console.log("done")
        })
  }
</script>

<div class="ActualRoot">
  <p>We here</p>
  <button on:click={closePopup}>Close</button>
  <button on:click={download}>Download</button>
</div>

<style>
.ActualRoot{
  background-color: white;
  padding: 15px;
}
</style>
