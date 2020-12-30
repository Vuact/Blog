# 1、安装express、express-generator

- express 是基于 node 的开发框架。
- express-generator: Express 应用程序生成器

```js
npm install express -g            // 全局安装express
npm install express-generator -g  // 全局安装express脚手架,安装之后可以使用express命令
express --version                 // 检查express版本
```

# 2、生成项目文件

```js
mkdir app
cd app

express -e    // 生成项目文件，express 默认使用ajs模板，加上 -e 指定更友好的ejs模板
npm install   // 安装依赖
npm start     // 启动项目
```
然后浏览器访问`http://localhost:3000/`，最简单的服务器就ok了。

生成目录结构：

![](https://github.com/Vuact/document/blob/main/base/node/images/75F3EF67680BB83257A9BCD014ECD035.jpg?raw=true)

<br>

# 3、项目分析：

通过`package.json`可以看出, 我们通过`npm start`指令来执行  `启动脚本 ./bin/www`。
```json
{
  "name": "app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1"
  }
}
```

bin文件夹用来`存放各种启动脚本`(eg: test，stop或restart等)，

`./bin/www`文件就是个启动Web服务器的示例脚本。

参考链接：[Express4.X中的bin/www是作什么用的？为什么没有后缀？](https://www.cnblogs.com/fhen/p/6378855.html)

<br>

./bin/www

```js
var app = require('../app');
var debug = require('debug')('test:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  //····
}

function onError(error) {
  //····
}

function onListening() {
  //····
}
```

`./bin/www`里面又引用了`app.js`文件，app.js里用来填写各种业务逻辑、路由、中间件等。


https://segmentfault.com/a/1190000015170332

https://www.jianshu.com/p/5357934b1dbf
