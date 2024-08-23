<script lang="ts">
    import type { PlasmoCSConfig } from "plasmo"
    import { onMount } from 'svelte';

    export const config: PlasmoCSConfig = {
      matches: ["https://*/*"],
    }

    onMount(() => {
        console.log("can we have")
    })

</script>

<div>
    can we a heyy
</div>
