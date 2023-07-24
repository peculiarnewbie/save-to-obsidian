<script lang="ts">
  export let count: number;
  let message: string = null;

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);
</script>

<div class=" bg-blue-50 min-w-[20rem] p-4 flex flex-col gap-4">
  <p class="text-blue-800 text-xl">
    Current count: <span class="font-extrabold">{count}</span>
  </p>
  <div class="flex gap-2">
    <button on:click={decrement}>-</button>
    <button on:click={increment}>+</button>
    {#if message}<span class="font-bold text-blue-800">{message}</span>{/if}
  </div>
</div>

<style scoped>
  button {
    color: theme('colors.blue.700');
    padding: theme('spacing.2') theme('spacing.4');
    font-size: theme('fontSize.base');
    border: 1px solid theme('borderColor.blue.400');
    box-shadow: theme('boxShadow.lg');
    background-color: theme('backgroundColor.blue.50');
  }

  button:hover,
  button:focus {
    background-color: theme('colors.blue.800');
    color: theme('colors.blue.50');
  }
</style>