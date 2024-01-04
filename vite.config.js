import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';

export default defineConfig({
  build: {
    outDir: 'dist/Liegt-PC',
  },
  server: {
    port: 5174,
    proxy: {
      '/procoin-market': {
        target: 'http://market.yulexing.cn',
        changeOrigin: true,
      },
      '/procoin-file': {
        target: 'http://upload.yulexing.cn',
        changeOrigin: true,
      },
      '/procoin': {
        target: 'http://api.yulexing.cn',
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
