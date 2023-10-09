<script lang="ts">
    export let src: string;
    export let alt: string;
    export let width: string;
</script>

{#if import.meta.env.DEV}
    <img src={src} alt={alt} width={width} class="pointer-events-none" />
{:else}
    <img src={chrome.runtime.getURL(src)} alt={alt} width={width} class="pointer-events-none" />
{/if}
