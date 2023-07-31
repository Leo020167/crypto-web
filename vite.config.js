import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist/AIDTC-PC',
  },
  server: {
    port: 5174,
    proxy: {
      // http://api.piglobalexchanges.com/procoin/swagger/index.html#/
      // http://api.worldcoinservice.com/procoin/swagger/index.html#/

      '/procoin-market': {
        target: 'http://market.tyresd.com',
        changeOrigin: true,
      },
      '/procoin-file': {

        target: 'http://upload.tyresd.com',
        changeOrigin: true,
      },
      //  http://api.cryptographexx.com/procoin/meiqia
      '/api': {
        target: 'http://web.tyresd.com',

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
