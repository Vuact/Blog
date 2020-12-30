# 一、环境配置

1、安装express

express 是基于 node 的开发框架

```js
npm install express -g            // 全局安装express
npm install express-generator -g  // 全局安装express脚手架,安装之后可以使用express命令
express --version                 // 检查express版本
```
>express-generator: Express 应用程序生成器

2、生成项目文件

```js
mkdir app
cd app

express -e    // 生成项目文件，express 默认使用ajs模板，加上 -e 指定更友好的ejs模板
npm install   // 安装依赖
npm start     // 启动项目
```
然后浏览器访问`http://localhost:3000/`，最简单的服务器就ok了。


https://segmentfault.com/a/1190000015170332

https://www.jianshu.com/p/5357934b1dbf
