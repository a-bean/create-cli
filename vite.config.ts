import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // 修改env文件的路径  还是 import.meta.env.xxx 的方式存取
  envDir: './env',
  plugins: [vue(), vueJSX()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx'],
  },
  // jsx支持
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: "import { h } from 'vue';",
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },
});
