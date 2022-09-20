# 说明

## 目录结构

```text
 ├─ .husky                     // husky 钩子目录
 | ├─ _
 | | ├─  husky.sh
 | | └─  .gitignore
 | ├─  prepare.js
 | └─  pre-commit
 ├─ .vscode
 | └─  extensions.json
 ├─ deploy                     // 部署相关, 打包docker时候使用的ng配置;
 | └─  nginx/nginx.conf        // 最外层的ng配置 (一般情况不需要修改)
 | ├─ dev.conf                 // 开发环境 ng配置  (其他可参考dev.conf修改, 添加代理)
 | ├─ prod.conf                // 生产环境 ng配置
 | ├─ test.conf                // 测试环境 ng配置
 ├─ env                        // 环境变量目录
 | └─  .env
 ├─ src
 | ├─ api                      // 接口提取
 | ├─ assets                   // 静态资源
 | ├─ components               // 通用组件
 | | ├─  Logo.vue
 | | └─  Icon.vue
 | ├─ constants                // 常量设置
 | | ├─  pages.ts              // 枚举存放所有页面
 | | └─  common.ts
 | ├─ hooks                    // 通用的hooks函数
 | ├─ router                   // 路由相关
 | | └─  index.ts
 | ├─ styles                   // 公用的css提取放置目录
 | | ├─  resetArco.scss
 | | └─  global.scss
 | ├─ types                    // 项目中的通用类型定义
 | | └─  common.ts
 | ├─ utils                    // 工具目录, 如request
 | | └─  request.ts
 | ├─ views                    // 存放每个view 对应的组件 例:目录demo
 | ├─  main.ts                 // 入口文件
 | ├─  env.d.ts
 | └─  App.vue
 ├─  vite.config.ts
 ├─  tsconfig.json
 ├─  package.json
 ├─  index.html
 ├─  README.md
 ├─  Dockerfile
 ├─  .prettierrc.js
 ├─  .npmrc
 ├─  .gitlab-ci.yml
 ├─  .gitignore
 └─  .eslintrc.js
```

view 目录 demo

```text
  ├─ views
    └─  login
      ├─  pages                // 子页面
      ├─  components           // 页面组件
      ├─  composables          // 逻辑抽取, 参考vue官方文档示例;
      └─  index.vue            // login页文件
```

## 代码提交校验

设置的`pre-commit`钩子 在提交过程中, 会经过以下过程 **请勿跳过**

1. `typescript` 类型校验. (不放在`lint-stage`中的原因: 只校验占存区的目录会导致校验不完全.)
2. `lint-stage` 对暂存区文件校验
   1. `prettier` 文件格式化. (1. 统一风格; 2.避免如空格类修改引起的文件变化,方便 CR.)
   2. `eslint` 校验风格. (1. 统一风格; 2. 避免由于写法问题导致的部分坑.)

设置的`commit-msg`钩子 在提交过程中会校验提交信息

1. [提交规范](https://www.npmjs.com/package/@commitlint/config-conventional)
2. 可使用`npm run commit` 使用`commitizen`自动生成`commitmsg`

设置的`pre-push`钩子 在提交过程中会校验分支名  
 目前仅支持以下分支提交  
 稳定分支: `master` `main` `dev` `test`  
 不稳定分支: `feat-*`功能分支, `bugfix-*` `hotfix-*`bug 修复分支 `test-*`测试分支 `dev-*` 开发环境部署分支

## 写 tsx

将 `script`的`lang`属性设置为`tsx`, 可与模板结合使用;

> 如果使用 import router from '@/router 的方式引入 router, 会导致 hmr 出问题

```tsx
<script lang='tsx'>
  const div = () => <div></div>
</script>

```

## 自动引入组件和函数

目前配置组件库的组件以及 src/components 目录下的组件可以自动引入。

```html
<template>
  <div>
    <!-- test -->
    <div style="width: 100px">
    <!-- 使用 src/components 下的组件 -->
      <logo />
    </div>
    <hello></hello>
    <!-- 使用组件库组件 -->
    <AButton type="primary">
      <template #icon>
        <!-- 使用组件库图标 -->
        <IconLoading />
      </template>
      加载中
    </AButton>
  </div>
</template>
```

配置 src/composables 和 src/utils 函数可以自动引入

```ts
// 直接使用函数名称即可提示
// eg：utils/tool.ts -> seedRandom
const num = seedRandom(1000, 900, 9)
```

## 全局的 scss 变量

文件地址: `styles/variables.scss`;  
自动插入到所有的 scss 文件前;

## ci

目前仅配置 `dev` 环境的 `build` stage.  
修改 `gitlab-ci` 中的 `line:18 projectName` 为实际目录名

## 阿里云 OSS 静态文件自动上传

- 阿里云 OSS 主要依赖于 [vite-plugin-ali-oss](https://www.npmjs.com/package/vite-plugin-ali-oss) 这个插件实现自动化上传
- 腾讯 OSS 则是 [vite-plugin-tencent-oss](https://github.com/taosiqi/vite-plugin-tencent-oss)

以 TENCENT OSS 配置为例，对应的 OSS 配置信息放在对应的部署服务器的环境变量中：

- OSS_region：对应的 OSS 地域
- OSS_secretId：密钥对 ID
- OSS_secretKey：密钥对密钥
- OSS_bucket：存储桶名

```ts
import { name } from './package.json';

const enableCDN = !!process.env.OSS_secretId;
const cdnPath = `https://${process.env.OSS_bucket}.cos-website.${process.env.OSS_region}.myqcloud.com`;

export default defineConfig(() => {
  // 省略无关配置

  // 服务器有密钥 ID 表明需要弃用 cdn 加速，则配置对应的 cdn 路径
  base: enableCDN ? cdnPath : '/',
  plugins: [
    TencentOss({
      region: process.env.OSS_region,
      secretId: process.env.OSS_secretId,
      secretKey: process.env.OSS_secretKey,
      bucket: process.env.OSS_bucket,
      enabled: enableCDN,
    }),
  ],
  build: {
    assetsDir: enableCDN ? `${name}/assets` : 'assets',
  }
})
```

对应字段释义文档：[飞书文档](https://deepwisdom.feishu.cn/wiki/wikcnNMmYcTfBu176UYWeDbpetc)

## 打包 docker 镜像

参考 ci 中的 docker-deploy 任务;

## 建议

1. 项目中如非必要请勿使用`any` (请用`unknown`替代), 实际体验中, 类型预先定义花费的时间并不会比先设置`any`一路莽来的多. 并且, 良好的`ide`提示, 会在开发阶段揪出潜在的问题;

2. Api 的使用
   在 `api` 目录底下创建 `index.ts`
   如下: 命名大驼峰;

```typescript
export * as XxxApi from './other';
```

使用的地方

```typescript
import { XxxApi } from '@/api';
XxxApi.xxx;
```

## 使用

1. `git clone` 该模板
2. 删除`.git` 目录
3. 重新执行 `git init`
4. 设置`git remote` 为实际项目目录
5. 正常开发

## TODO

### cli

通过命令行生成项目
