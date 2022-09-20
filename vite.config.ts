import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import TencentOss from 'vite-plugin-tencent-oss';
import { name } from './package.json';

const srcPath = path.resolve(__dirname, 'src');
const envDir = path.resolve(__dirname, 'env');

const enableCDN = !!process.env.OSS_secretId;
const cdnPath = `https://${process.env.OSS_bucket}.cos-website.${process.env.OSS_region}.myqcloud.com`;

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    // 修改 env 文件的路径  还是 import.meta.env.xxx 的方式存取
    envDir,
    base: enableCDN ? cdnPath : '/',
    plugins: [
      vue(),
      vueJSX(),
      Components({
        dts: path.resolve(srcPath, 'types/components.d.ts'),
        dirs: [path.resolve(srcPath, 'components/')],
        resolvers: [ArcoResolver({ resolveIcons: true })],
      }),
      AutoImport({
        dts: path.resolve(srcPath, 'types/auto-import.d.ts'),
        dirs: [path.resolve(srcPath, 'composables/'), path.resolve(srcPath, 'utils/')],
        imports: ['vue', 'vue-router', '@vueuse/core'], // 自动引入这三个库的函数 api
      }),
      TencentOss({
        region: process.env.OSS_region,
        secretId: process.env.OSS_secretId,
        secretKey: process.env.OSS_secretKey,
        bucket: process.env.OSS_bucket,
        enabled: enableCDN,
      }),
      // 分包
      chunkSplitPlugin({
        strategy: 'default',
        customSplitting: {
          vue: ['vue', 'vue-router'],
          lib: ['@arco-design/web-vue'],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': srcPath,
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
    build: {
      // css 不拆分（默认是每个加了 scoped 组件的 css 是单独的文件
      cssCodeSplit: false,
      assetsDir: enableCDN ? `${name}/assets` : 'assets',
    },
  };
});
