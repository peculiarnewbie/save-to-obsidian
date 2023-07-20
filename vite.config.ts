import { crx } from "@crxjs/vite-plugin";
import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import manifest from "./manifest.json";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [svelte(), crx({ manifest })],
    define: {
      'import.meta.env': JSON.stringify(env),
    },
  };
});
