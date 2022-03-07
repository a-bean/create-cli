# 说明

## 目录结构

```
 ├─ .husky                     // husky 钩子目录
 | ├─ _
 | | ├─  husky.sh
 | | └─  .gitignore
 | ├─  prepare.js
 | └─  pre-commit
 ├─ .vscode
 | └─  extensions.json
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

```
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
  稳定分支: `master` `main` `dev` `test` `prod`   
  不稳定分支: `feat-*`功能分支, `bugfix-*`bug 修复分支 `test-*`测试分支

## 写 tsx

将 `script`的`lang`属性设置为`tsx`, 可与模板结合使用;

```tsx
<script lang='tsx'>
  const div = () => <div></div>
</script>

```

## ci

目前仅配置`dev`环境的 ci.  
修改`gitlab-ci` 中的`line:16 template-vite` 为实际目录名

## 建议

项目中如非必要请勿使用`any` (请用`unknown`替代), 实际体验中, 类型预先定义花费的时间并不会比先设置`any`一路莽来的多. 并且, 良好的`ide`提示, 会在开发阶段揪出潜在的问题;

## 使用

1. `git clone` 该模板
2. 删除`.git` 目录
3. 重新执行 `git init`
4. 设置`git remote` 为实际项目目录
5. 正常开发

## TODO

### 打包 docker 镜像

此项交付项目使用较多, 根据项目不通, 配置变化较大, 暂未通用化.

### cli

通过命令行生成项目
