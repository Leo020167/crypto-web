import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist/Cryptographe-PC',
  },
  server: {
    port: 5174,
    proxy: {
      // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
      // http://api.worldcoinservice.com/procoin/swagger/index.html#/
      '/procoin-market': {
        target: 'http://market.cryptographeex.com',
        changeOrigin: true,
      },
      '/procoin-file': {
        target: 'http://upload.cryptographeex.com',
        changeOrigin: true,
      },
      //  http://api.cryptographexx.com/procoin/meiqia
      '/procoin': {
        target: 'http://api.cryptographeex.com',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";`,
      },
    },
  },
});
