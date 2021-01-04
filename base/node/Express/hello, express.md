- Hello, express
- 路由routes
- 创建controllers：路由处理器回调函数
- 模板引擎
- 中间件与next
- 错误处理
- 提供静态文件

项目源码链接：[狠狠戳我](https://github.com/Vuact/dome/tree/master/express/helloExpress)

<br>

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

# 二、路由routes

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

module.exports.register = (app) => {
   for (let router of LIST) {
      app.use(router);
   }
};
```

这样我们再新增路由，只需在routes文件夹下新增js文件，并在`routes/main.js`里的 `LIST` 数组中新增元素即可。

<br>

# 三、创建controllers：路由处理器回调函数

我们再将 路由的分发逻辑 和 路由的回调函数逻辑(即控制器) 进行分离。

即将`routes/index.js`和`routes/users.js`中的回调逻辑拆分出去，放到新创建的controllers文件夹下。

在根目录下创建空文件夹 controllers，在 controllers 目录下创建 index.js 和 users.js。并修改`routes/index.js`、`routes/users.js`，最后代码如下：

**routes/index.js**

```js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');

router.get('/', controller.hello);

module.exports = router;
```

**controllers/index.js**

```js
module.exports.hello = (req, res) => {
   res.send('hello, express');
};
```

**routes/users.js**

```js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

router.get('/users/:name', controller.sayName);

module.exports = router;
```

**controllers/users.js**

```js
module.exports.sayName = (req, res) => {
   res.send(`hello, ${req.params.name}`);
};
```

<br>


# 四、模板引擎

模板引擎（Template Engine）是一个将页面模板和数据结合起来生成 html 的工具。上例中，我们只是返回纯文本给浏览器，现在我们修改代码返回一个 html 页面给浏览器。

## 1、使用ejs

模板引擎有很多，[ejs](https://www.npmjs.com/package/ejs) 是其中一种，因为它使用起来十分简单，而且与 express 集成良好，所以我们使用 ejs。安装 ejs：

```sh
npm i ejs --save
```

修改 index.js 如下：

**index.js**

```js
const path = require('path');
const express = require('express');
const routes = require('./routes/main');

const app = express();

app.set('views', path.join(__dirname, 'views')); // 设置存放模板文件的目录
app.set('view engine', 'ejs'); // 设置模板引擎为 ejs

routes.register(app);

app.listen(3000);
```

通过 `app.set` 设置模板引擎为 ejs 和存放模板的目录。

在 根目录 下新建 views 文件夹，在 views 下新建 `index.ejs`和`users.ejs`，添加如下代码：

**views/users.ejs**

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
   <h1>
      <%= name.toUpperCase() %>
   </h1>
   <p>hello, <%= name %></p>
</body>
</html>
```

**views/index.ejs**

```html
<!DOCTYPE html>
<html>
<head></head>
<body>
   <h1>
      hello, express
   </h1>
</body>
</html>
```

修改 controllers/index.js 和 controllers/users.js 如下：

**controllers/index.js**

```js
module.exports.sayName = (req, res) => {
   res.render('index', {});
};
```

**controllers/users.js**

```js
module.exports.sayName = (req, res) => {
   res.render('users', {
      name: req.params.name
   });
};
```

以users为例：

通过调用 `res.render` 函数渲染 ejs 模板，res.render：
- 第一个参数：是模板的名字，这里是 users 则会匹配 views/users.ejs
- 第二个参数：是传给模板的数据，这里传入 name，则在 ejs 模板中可使用 name。

`res.render` 的作用就是将模板和数据结合生成 html，同时设置响应头中的 `Content-Type: text/html`，告诉浏览器我返回的是 html，不是纯文本，要按 html 展示。现在我们访问 `http://localhost:3000/users/bty`，如下图所示：

![](https://github.com/Vuact/Blog/blob/main/base/node/images/4E7E6FA50374C291C4466779DCDB4B33.jpg?raw=true)

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

```nunjucks
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
**views/index.ejs**

```ejs
<%- include('header') %>
   <h1>hello, express</h1>
<%- include('footer') %>
```

我们将原来的 users.ejs 拆成出了 header.ejs 和 footer.ejs，并在 users.ejs 通过 ejs 内置的 include 方法引入，从而实现了跟以前一个模板文件相同的功能。

> 小提示：拆分模板组件通常有两个好处：
>
> 1. 模板可复用，减少重复代码
> 2. 主模板结构清晰

> 注意：要用 `<%- include('header') %>` 而不是 `<%= include('header') %>`



<br>

-----



此时我们的项目目录结构：
![](https://github.com/Vuact/Blog/blob/main/base/node/images/55BB6ED600A20526106AC2A25D3D8F37.jpg?raw=true)

然后我们再看以上目录之间的关系:

<br>

![](https://mdn.mozillademos.org/files/16453/Express_MVC.png)

- 路由routes：把需要支持的请求（以及请求 URL 中包含的任何信息）转发到适当的控制器函数。
- 控制器controllers：从模型中获取请求的数据，创建一个 HTML 页面显示出数据，并将页面返回给用户，以便在浏览器中查看。
- 视图（模板）views：供控制器用来渲染数据。

-----

<br>

# 五、中间件与next

前面我们讲解了 express 中路由和模板引擎 ejs 的用法，但 express 的精髓并不在此，在于中间件的设计理念。

## 1、概念讲解

express 中的中间件（middleware）就是用来处理请求的，当一个中间件处理完，可以通过调用 `next()` 传递给下一个中间件，如果没有调用 `next()`，则请求不会往下传递，如内置的 `res.render` 其实就是渲染完 html 直接返回给客户端，没有调用 `next()`，从而没有传递给下一个中间件。看个小例子，修改 index.js 如下：

**index.js**

```js
const express = require('express')
const app = express()

app.use(function (req, res, next) {
  console.log('1')
  next()
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

app.listen(3000)
```

此时访问 `localhost:3000`，终端会输出：`1 2`


通过 `app.use` 加载中间件，在中间件中通过 next 将请求传递到下一个中间件，next 可接受一个参数接收错误信息，如果使用了 `next(error)`，则会返回错误而不会传递到下一个中间件，修改 index.js 如下：

**index.js**

```js
const express = require('express')
const app = express()

app.use(function (req, res, next) {
  console.log('1')
  next(new Error('haha'))
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

app.listen(3000)
```

此时访问 `http://localhost:3000/`，终端会输出错误信息：

![](https://github.com/Vuact/Blog/blob/main/base/node/images/FA32578D0D381B72E47F254461EA9B0C.jpg?raw=true)

浏览器会显示：

![](https://github.com/Vuact/Blog/blob/main/base/node/images/03176056D4BEA7EFA0BE94EE0D6C267D.jpg?raw=true)

> 小提示：`app.use` 有非常灵活的使用方式，详情见 [官方文档](http://expressjs.com/en/4x/api.html#app.use)。

express 有成百上千的第三方中间件，在开发过程中我们首先应该去 npm 上寻找是否有类似实现的中间件，尽量避免造轮子，节省开发时间。下面给出几个常用的搜索 npm 模块的网站：

1. [http://npmjs.com](http://npmjs.com)(npm 官网)
2. [http://node-modules.com](http://node-modules.com)
3. [https://npms.io](https://npms.io)
4. [https://nodejsmodules.org](https://nodejsmodules.org)

> 小提示：express@4 之前的版本基于 connect 这个模块实现的中间件的架构，express@4 及以上的版本则移除了对 connect 的依赖自己实现了，理论上基于 connect 的中间件（通常以 `connect-` 开头，如 `connect-mongo`）仍可结合 express 使用。

> 注意：中间件的加载顺序很重要！比如：通常把日志中间件放到比较靠前的位置，后面将会介绍的 `connect-flash` 中间件是基于 session 的，所以需要在 `express-session` 后加载。

<br>

## 2、接着上面的项目

我们接着上面的项目来添加中间件，需求：

- （1）将上面的ejs模板渲染抽象为 `渲染中间件`render.js
- （2）在每次启动程序时添加 `日记上报中间件`log.js

首先我们在根目录创建 `middleware` 文件，并在其中新建 render.js 和 log.js 文件，如下：

**middleware/render.js**

```js
//渲染中间件

const path = require('path');

module.exports = (app) => {
   return (req, res, next) => {
      app.set('views', path.join(process.cwd(), '/views')); // 设置存放模板文件的目录 (process.cwd()获得当前执行node命令时候的文件夹目录名)
      app.set('view engine', 'ejs'); // 设置模板引擎为 ejs
      next();
   };
};
```

**middleware/log.js**

```js
//日记上报中间件
module.exports = () => {
   return (req, res, next) => {
      console.log('send log');
      next();
   };
};
```

然后再修改index.js文件：

**index.js**
```js
const express = require('express');
const routes = require('./routes/main');
const log = require('./middleware/log');
const render = require('./middleware/render');

const app = express();

app.use(log());  //发日记
app.use(render(app)); //渲染 

routes.register(app);

app.listen(3000);
```
从上面代码即：每次启动程序时，先日记上报，再配置模板引擎，最后注册路由。

<br>

# 六、错误处理

## 1、简述

上面 第五部分概念的第二个例子中，应用程序为我们自动返回了错误栈信息（express 内置了一个默认的错误处理器），假如我们想手动控制返回的错误内容，则需要加载一个自定义错误处理的中间件，修改 index.js 如下：

**index.js**

```js
const express = require('express')
const app = express()

app.use(function (req, res, next) {
  console.log('1')
  next(new Error('haha'))
})

app.use(function (req, res, next) {
  console.log('2')
  res.status(200).end()
})

//错误处理
//错误处理中间件函数的定义方式与其他中间件函数基本相同，差别在于错误处理函数有四个自变量而不是三个：(err, req, res, next)
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000)
```

此时访问 `localhost:3000`，浏览器会显示 `Something broke!`。

注意：`请在其他 app.use() 和路由调用之后，最后定义错误处理中间件`

> 小提示：关于 express 的错误处理，详情见 [官方文档](https://expressjs.com/zh-cn/guide/error-handling.html)。

<br>

## 2、接着上面的项目

新建 `middleware/error.js`文件，改写index.js，如下：

**middleware/error.js**

```js
module.exports = {
  //将请求和错误信息写入 stderr
  logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  },

  //错误会显式传递到下一项
  clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: "Something failed!" });
    } else {
      next(err);
    }
  },

  errorHandler(err, req, res, next) {
    if (res.headersSent) {
      //委托给 Express 中的缺省错误处理机制处理
      return next(err);
    }

    //自定义处理
    res.status(500);
    res.render("error", { error: err });
  }
};
```

**index.js**

```js
const express = require('express');
const routes = require('./routes/main');
const log = require('./middleware/log');
const render = require('./middleware/render');
const error = require('./middleware/error');

const app = express();

app.use(log());  //发日记
app.use(render(app)); //渲染 

routes.register(app);

app.use(error.logErrors);//将请求和错误信息写入 stderr
app.use(error.clientErrorHandler);//错误会显式传递到下一项
app.use(error.errorHandler);

app.listen(3000);
```

<br>

# 七、提供静态文件

再添加个功能：提供静态文件。

首先我们在根目录下新建 public 文件夹，然后在里面新建 images 文件夹，在其中添加一个叫 1.jpg 的图片。(/public/images/1.jpg)

然后我们通过 `http://localhost:3000/static/images/1.jpg`，来访问这个图片。

仅修改index.js文件即可：

**index.js**
```js
const express = require('express');
······

const app = express();

app.use('/static', express.static('public'));

·····
```


