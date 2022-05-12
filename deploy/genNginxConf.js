/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

// dev test demo prd
const filePath = `./${process.env.ENV_NAME || 'dev'}.conf`;

// const conf = fs.readFileSync(path.resolve(__dirname, "./"));
const targetFilePath = path.resolve(__dirname, './nginx/conf.d/default.conf');
const sourceFilePath = path.resolve(__dirname, filePath);

const defaultSourceFilePath = path.resolve(__dirname, './dev.conf');

if (fs.existsSync(sourceFilePath)) {
  console.log(`使用配置文件 ${sourceFilePath}`);
  fs.copyFileSync(sourceFilePath, targetFilePath);
} else if (fs.existsSync(defaultSourceFilePath)) {
  console.log(`使用默认配置文件 ${defaultSourceFilePath}`);
  fs.copyFileSync(sourceFilePath, defaultSourceFilePath);
} else {
  console.log('未找到nginx配置文件 跳过');
}
