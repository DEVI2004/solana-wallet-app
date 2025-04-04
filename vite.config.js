import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inject from '@rollup/plugin-inject';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  define: {
    global: 'window', // Make global available for browser
  },
  // resolve: {
  //   alias: {
  //     buffer: 'buffer',  // Ensure Vite recognizes buffer properly
  //   },
  // },
  // optimizeDeps: {
  //   include: ['buffer'],
  // },
  // build: {
  //   rollupOptions: {
  //     plugins: [
  //       inject({
  //         Buffer: ['buffer', 'Buffer'],
  //         process: 'process/browser',
  //       }),
  //     ],
  //   },
  // },
});
