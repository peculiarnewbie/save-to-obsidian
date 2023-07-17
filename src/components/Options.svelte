<script lang="ts">
    import { onMount } from "svelte";
  
    let count = 0;
    let message: string = null;
  </script>
  
  
  <div class="flex flex-col py-[3%] px-[2%] bg-blue-50 h-screen">
    <h2 class="mb-5">Options Page</h2>
    {#if message}
      <span class="font-bold text-blue-800">{message}</span>
    {/if}
  </div>