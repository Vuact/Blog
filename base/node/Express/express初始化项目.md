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
   res.send('hello, express');
});

app.listen(3000);
```

以上代码的意思是：生成一个 express 实例 app，挂载了一个根路由控制器，然后监听 `3000` 端口并启动程序。运行 `node index`，打开浏览器访问 `http://localhost:3000/` 时，页面应显示 `hello, express`。

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

以上代码的意思是：
- 当访问根路径时`http://localhost:3000`，依然返回 `hello, express`
- 当访问如 `http://localhost:3000/users/bty` 路径时，返回 `hello, bty`。路径中 `:name` 起了占位符的作用，这个占位符的名字是 name，可以通过 `req.params.name` 取到实际的值。

> 小提示：express 使用了 [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) 模块实现的路由匹配。

不难看出：req 包含了请求来的相关信息，res 则用来返回该请求的响应，更多请查阅 [express 官方文档](http://expressjs.com/en/4x/api.html)。下面介绍几个常用的 req 的属性：

- `req.query`: 解析后的 url 中的 querystring，如 `?name=haha`，req.query 的值为 `{name: 'haha'}`
- `req.params`: 解析 url 中的占位符，如 `/:name`，访问 /haha，req.params 的值为 `{name: 'haha'}`
- `req.body`: 解析后请求体，需使用相关的模块，如 [body-parser](https://www.npmjs.com/package/body-parser)，请求体为 `{"name": "haha"}`，则 req.body 为 `{name: 'haha'}`

<br>

## 2、升级：使用express.Router

上面只是很简单的路由使用的例子（将所有路由控制函数都放到了 index.js），但在实际开发中通常有几十甚至上百的路由，都写在 index.js 既臃肿又不好维护，这时可以使用 express.Router 实现更优雅的路由解决方案。

在根目录下创建空文件夹 routes，在 routes 目录下创建 index.js 和 users.js。最后代码如下：

**index.js**

```js
const express = require('express');
const app = express();
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

app.use('/', indexRouter);
app.use('/', userRouter);

app.listen(3000);
```

**routes/index.js**

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
   res.send('hello, express');
});

module.exports = router;
```

**routes/users.js**

```js
const express = require('express');
const router = express.Router();

router.get('/users/:name', (req, res) => {
   res.send(`hello, ${req.params.name}`);
});

module.exports = router;
```

以上代码的意思是：我们将 `/` 和 `/users/:name` 的路由分别放到了 routes/index.js 和 routes/users.js 中，每个路由文件通过生成一个 express.Router 实例 router 并导出，通过 `app.use` 挂载到不同的路径。这两种代码实现了相同的功能，但在实际开发中推荐使用 express.Router 将不同的路由分离到不同的路由文件中。

更多 express.Router 的用法见 [express 官方文档](http://expressjs.com/en/4x/api.html#router)。

<br>

## 3、再升级：更优雅的写法

修改`index.js`文件，新增`routes/main.js`文件，其余文件不变。

**index.js**

```js
const express = require('express');
const routes = require('./routes/main');

const app = express();

routes.register(app);

app.listen(3000);
```

**routes/main.js**

```js
const express = require('express');
const router = express.Router();

const LIST = [
	require('./index'),
	require('./users')
];

const register = (app) => {
	for (let router of LIST) {
		app.use(router);
	}
};

module.exports = {
	register
};
```

<br>

# 三、模板引擎

模板引擎（Template Engine）是一个将页面模板和数据结合起来生成 html 的工具。上例中，我们只是返回纯文本给浏览器，现在我们修改代码返回一个 html 页面给浏览器。

## 1、使用ejs

模板引擎有很多，[ejs](https://www.npmjs.com/package/ejs) 是其中一种，因为它使用起来十分简单，而且与 express 集成良好，所以我们使用 ejs。安装 ejs：

```sh
npm i ejs --save
```

修改 index.js 如下：

**index.js**

```js
const path = require('path')
const express = require('express')
const app = express()
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')

app.set('views', path.join(__dirname, 'views'))// 设置存放模板文件的目录
app.set('view engine', 'ejs')// 设置模板引擎为 ejs

app.use('/', indexRouter)
app.use('/users', userRouter)

app.listen(3000)
```

通过 `app.set` 设置模板引擎为 ejs 和存放模板的目录。

在 根目录 下新建 views 文件夹，在 views 下新建 users.ejs，添加如下代码：

**views/users.ejs**

```html
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {padding: 50px;font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;}
    </style>
  </head>
  <body>
    <h1><%= name.toUpperCase() %></h1>
    <p>hello, <%= name %></p>
  </body>
</html>
```

修改 routes/users.js 如下：

**routes/users.js**

```js
const express = require('express')
const router = express.Router()

router.get('/:name', function (req, res) {
  res.render('users', {
    name: req.params.name
  })
})

module.exports = router
```

通过调用 `res.render` 函数渲染 ejs 模板，res.render 第一个参数是模板的名字，这里是 users 则会匹配 views/users.ejs，第二个参数是传给模板的数据，这里传入 name，则在 ejs 模板中可使用 name。`res.render` 的作用就是将模板和数据结合生成 html，同时设置响应头中的 `Content-Type: text/html`，告诉浏览器我返回的是 html，不是纯文本，要按 html 展示。现在我们访问 `localhost:3000/users/haha`，如下图所示：

![](./img/3.3.1.png)

上面代码可以看到，我们在模板 `<%= name.toUpperCase() %>` 中使用了 JavaScript 的语法 `.toUpperCase()` 将名字转化为大写，那这个 `<%= xxx %>` 是什么东西呢？ejs 有 3 种常用标签：

1. `<% code %>`：运行 JavaScript 代码，不输出
2. `<%= code %>`：显示转义后的 HTML内容
3. `<%- code %>`：显示原始 HTML 内容

> 注意：`<%= code %>` 和 `<%- code %>` 都可以是 JavaScript 表达式生成的字符串，当变量 code 为普通字符串时，两者没有区别。当 code 比如为 `<h1>hello</h1>` 这种字符串时，`<%= code %>` 会原样输出 `<h1>hello</h1>`，而 `<%- code %>` 则会显示 H1 大的 hello 字符串。

下面的例子解释了 `<% code %>` 的用法：

**Data**

```
supplies: ['mop', 'broom', 'duster']
```

**Template**

```ejs
<ul>
<% for(var i=0; i<supplies.length; i++) {%>
   <li><%= supplies[i] %></li>
<% } %>
</ul>
```

**Result**

```html
<ul>
  <li>mop</li>
  <li>broom</li>
  <li>duster</li>
</ul>
```

更多 ejs 的标签请看 [官方文档](https://www.npmjs.com/package/ejs#tags)。

<br>

## 2、加上includes

我们使用模板引擎通常不是一个页面对应一个模板，这样就失去了模板的优势，而是把模板拆成可复用的模板片段组合使用，如在 views 下新建 header.ejs 和 footer.ejs，并修改 users.ejs：

**views/header.ejs**

```ejs
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {padding: 50px;font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;}
    </style>
  </head>
  <body>
```

**views/footer.ejs**

```ejs
  </body>
</html>
```

**views/users.ejs**

```ejs
<%- include('header') %>
  <h1><%= name.toUpperCase() %></h1>
  <p>hello, <%= name %></p>
<%- include('footer') %>
```

我们将原来的 users.ejs 拆成出了 header.ejs 和 footer.ejs，并在 users.ejs 通过 ejs 内置的 include 方法引入，从而实现了跟以前一个模板文件相同的功能。

> 小提示：拆分模板组件通常有两个好处：
>
> 1. 模板可复用，减少重复代码
> 2. 主模板结构清晰

> 注意：要用 `<%- include('header') %>` 而不是 `<%= include('header') %>`
