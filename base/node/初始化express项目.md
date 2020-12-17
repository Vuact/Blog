# 一、搭建服务器

1、安装express

```js
npm install express -g            // 全局安装express
npm install express-generator -g  // 全局安装express脚手架,安装之后可以使用express命令
express --version                 // 检查express版本
```

2、生成项目文件

```js
mkdir app
cd app

express -e    // 生成项目文件，express 默认使用ajs模板，加上 -e 指定更友好的ejs模板
npm intall    // 安装依赖
npm start     // 启动项目
```
然后浏览器访问localhost:3000，最简单的服务器就ok了。
