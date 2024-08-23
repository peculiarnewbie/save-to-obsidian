<script lang="ts">
  export let count = 0
  let action: string = null
  function increment() {
    count += 1
    action = "increment"
  }
  function decrement() {
    count -= 1
    action = "decrement"
  }
</script>

<div>
  <h2 class="text-center">
    thossgg
  </h2>
  <div class="container">
    <button on:click={decrement}>-</button>
    <p>count: <b>{count}</b></p>
    <button on:click={increment}>+</button>
  </div>
  {#if action}<p class="action text-center">{action}</p>{/if}
  <a href="https://docs.plasmo.com" target="_blank"> Docsss </a>
</div>

<style>
  .container {
    min-width: 470px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 47px;
  }
  .action {
    color: #470;
    font-weight: bold;
  }
  .text-center {
    text-align: center;
  }
</style>
