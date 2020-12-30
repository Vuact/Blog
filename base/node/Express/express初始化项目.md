# 一、Hello, express

## 1、最简单的Dome

```
mkdir test
cd test

npm init 

npm install express
```
`package.json`中默认入口文件为`index.js`,

新建 `index.js`，添加如下代码：

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
   res.send('Hello, express');
});

app.listen(3000);
```

以上代码的意思是：生成一个 express 实例 app，挂载了一个根路由控制器，然后监听 `3000` 端口并启动程序。运行 `node index`，打开浏览器访问 `http://localhost:3000/` 时，页面应显示 `Hello, express`。

<br>

## 2、安装Supervisor

具体请参考《express-generator初始化项目》。

```
npm install -g supervisor
```

使用：
```
supervisor index.js
```
执行完这个命令后，我们的网站服务就已经启动了。

- 这种方式启动的服务，是默认监控所有文件、文件夹的变化的；
- 一旦有变化，服务就会重启，因而仅仅适用于调试阶段

<br>

# 二、路由

## 1、最简单的使用
前面我们只是挂载了根路径的路由控制器，现在修改 index.js 如下：

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
   res.send('hello, express');
});

app.get('/user/:name', (req, res) => {
   res.send(`hello, ${req.params.name}`);
});

app.listen(3000);
```

以上代码的意思是：当访问根路径时，依然返回 hello, express，当访问如 `localhost:3000/users/nswbmw` 路径时，返回 hello, nswbmw。路径中 `:name` 起了占位符的作用，这个占位符的名字是 name，可以通过 `req.params.name` 取到实际的值。

> 小提示：express 使用了 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 模块实现的路由匹配。

不难看出：req 包含了请求来的相关信息，res 则用来返回该请求的响应，更多请查阅 [express 官方文档](http://expressjs.com/en/4x/api.html)。下面介绍几个常用的 req 的属性：

- `req.query`: 解析后的 url 中的 querystring，如 `?name=haha`，req.query 的值为 `{name: 'haha'}`
- `req.params`: 解析 url 中的占位符，如 `/:name`，访问 /haha，req.params 的值为 `{name: 'haha'}`
- `req.body`: 解析后请求体，需使用相关的模块，如 [body-parser](https://www.npmjs.com/package/body-parser)，请求体为 `{"name": "haha"}`，则 req.body 为 `{name: 'haha'}`

<br>

## 2、升级：使用express.Router

上面只是很简单的路由使用的例子（将所有路由控制函数都放到了 index.js），但在实际开发中通常有几十甚至上百的路由，都写在 index.js 既臃肿又不好维护，这时可以使用 express.Router 实现更优雅的路由解决方案。在 myblog 目录下创建空文件夹 routes，在 routes 目录下创建 index.js 和 users.js。最后代码如下：

**index.js**

```js
const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

app.use('/', indexRouter)
app.use('/users', userRouter)

app.listen(3000)
```

**routes/index.js**

```js
const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.send('hello, express')
})

module.exports = router
```

**routes/users.js**

```js
const express = require('express')
const router = express.Router()

router.get('/:name', function (req, res) {
  res.send('hello, ' + req.params.name)
})

module.exports = router
```

以上代码的意思是：我们将 `/` 和 `/users/:name` 的路由分别放到了 routes/index.js 和 routes/users.js 中，每个路由文件通过生成一个 express.Router 实例 router 并导出，通过 `app.use` 挂载到不同的路径。这两种代码实现了相同的功能，但在实际开发中推荐使用 express.Router 将不同的路由分离到不同的路由文件中。

更多 express.Router 的用法见 [express 官方文档](http://expressjs.com/en/4x/api.html#router)。


