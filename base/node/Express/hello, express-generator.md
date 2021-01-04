express-generator即express的脚手架，用来快速生成express项目。

# 1、安装express、express-generator

- express 是基于 node 的开发框架。
- express-generator: Express 应用程序生成器

```js
npm install express -g            // 全局安装express
npm install express-generator -g  // 全局安装express脚手架,安装之后可以使用express命令
express --version                 // 检查express版本
```

<br>

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

- bin: 用来`存放各种启动脚本`
- public：存放静态文件(css,js,img等)
- routes：存放路由文件 
- views：视图目录
- app.js：项目入口文件
- package.json：存储项目的信息

<br>

# 3、安装Supervisor

node告诉我们，服务端的js代码只有在node第一次引用，才会重新加载；如果node已经加载了某个文件，即使我们对它进行了修改， node也不会重新加载这个文件。

那么，在开发过程中，要如何才能像PHP一样，修改某个文件后，直接刷新网页就能看到效果呢？

方法有很多，比如使用 `pm2`、`forever` 等来管理，比如使用今天要介绍的 `supervisor`。

#### （1）安装
```
npm install -g supervisor
```

#### （2）使用
Express4.0中，启动文件位于 `./bin/www` 中，则我们启动时，必须在 `./` 中执行：

```
supervisor bin/www
```

而不能进入 bin 目录执行： `supervisor www`。这样虽然有可能也能启动，但这么做相当于把 `bin` 目录当作了服务的根目录了，一旦有涉及到文件目录的操作，一定会出错的。

执行完这个命令后，我们的网站服务就已经启动了。

注意：

- 这种方式启动的服务，是`默认监控所有文件、文件夹的变化的`；
- 一旦有变化，服务就会重启

所以说，supervisor的这种工作方式，仅仅适用于调试阶段；甚至于有一些调试环境都不适合。

#### （3）不监控某些文件夹

如果想不监控某一些文件夹，可以使用 -i 参数。

如：我们要忽略根目录下的 views 文件夹，可以这样启动：

```
supervisor -i ./views bin/www
```
如果要忽略多个文件夹，则用英文的逗号,分隔：
```
supervisor -i ./views,./otherdir bin/www
```

<br>

# 4、项目分析

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

**./bin/www**

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
