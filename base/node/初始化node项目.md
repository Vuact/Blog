- 初始化node项目
- 服务热启动
- Dome

<br>

# 一、初始化node项目

### 1、创建项目目录

找个喜欢的地方，新建并初始化项目，执行以下命令：

```js
mkdir node-server
cd node-server
npm init -y  //生成package.json

npm install  //生成 package-lock.json 和 node_modules
```
此时目录结构
```
+  |- node_modules
+  |- package-lock.json
+  |- package.json
```


### 2、编写服务脚本

在项目根目录下创建入口文件app.js

```
   |- node_modules
+  |- app.js
   |- package-lock.json
   |- package.json
```
app.js内容

```js
const http = require('http')

// 设置服务器端口
const PORT = 8000

// 创建服务器
const server = http.createServer((req, res) => {
   // 返回的内容
   res.end('hello nodejs')
});

// 设置服务器端口
server.listen(PORT)

console.log('node-server started at port http://localhost:' + PORT)
```
配置入口文件，修改package.json

```js
      "name": "node-server",
      "version": "1.0.0",
      "description": "",
M     "main": "app.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
+       "dev": "node app.js"
      },
```

回到我们的项目来，项目的主入口文件是`app.js`。

现在，在项目根目录下执行npm run dev，就等同于执行`node app.js` 。 执行后，在控制台可以看到输出，说明服务已经正常启动：

```
node-server started at port http://localhost:8000
```

浏览器打开 `http://localhost:8000`，出现 "hello nodejs"


### 3、目录结构建设
这个比较灵活，这里就是举个例子，

```
   |- bin
   |- config
   |- controllers
   |- models
   |- node_modules
   |- public
   |- routes
   |- test
   |- tools
   |- views
   |- app.js
   |- package-lock.json
   |- package.json
   |- README.md
```
- bin：项目的启动文件，也可以放其他脚本。
- node_modules：用来存放项目的依赖库。
- public：存放静态文件(css,js,img等)
- routes：存放路由文件
- models：存放操作数据库的文件(相当于MVC中的M)
- views：视图目录(相当于MVC中的V)
- controllers：控制器,对请求的操作(相当于MVC中的C)
- tools：工具库
- config：配置目录
- test：测试目录
- README.md：项目说明文件
- app.js：项目入口及程序启动文件
- package.json：存储项目的信息，比如项目名、描述、作者、依赖等


[1](https://blog.csdn.net/liudongdong19/article/details/79795369)
[2](https://juejin.cn/post/6844904133464424456)


<br>

# 二、nodemon(服务热启动) + cross-env

- 安装nodemon：每次修改代码都要重启服务器才能生效很麻烦，使用nodemon来实现自动监测代码变化并重启。

- 安装cross-env：cross-env可以方便的跨平台设置环境变量（例:windows用%ENV_VAR%，其他系统可能使用$ENV_VAR，不统一）


```
npm install nodemon cross-env --save-dev
```
>[使用cross-env解决跨平台设置NODE_ENV的问题](https://segmentfault.com/a/1190000005811347)

<br>

修改package.json：
```
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
M       "dev": "cross-env NODE_ENV=dev nodemon app.js"
    },
```

再次执行npm run dev的时候，如果代码有改动，web服务会自动重启，这样就方便多啦。

<br>

# 三、Dome

### 例1

现在我们有三个页面：
- 主页面：`http://localhost:8000?id=1&name=demo`，发送了一个GET请求，并且传递了两个变量和值。
         功能：服务接收GET请求，并把GET请求传递的数据再返回给浏览器
- about：`http://localhost:8000/about`
- error：404页面，访问不存在页面兜底用

代码：
```js
const http = require("http");
const querystring = require("querystring");

const PORT = 8000;

const server = http.createServer((request, response) => {
  const { url, method } = { ...request };

  //防止因为favicon多走一遍下面逻辑
  if (url.includes("/favicon.ico")) {
    return;
  }

  const params = querystring.parse(url.split("?")[1]); // 解析URL，把url中?后面的参数转换为对象

  const optionMap = {
    // 主页
    "/"() {
      response.setHeader("Content-Type", "application/json"); // 设置返回数据的Content-Type为JSON
      if (method === "GET") {
        const resData = {
          error: 0,
          message: "GET返回成功",
          data: {
            query: params
          }
        };

        response.end(JSON.stringify(resData)); // 返回的数据
      }
    },

    // About页面
    "/about"() {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end("Welcome to the about page!");
    },

    // 404错误
    "/error"() {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 error! File not found.");
    }
  };

  optionMap[url] ? optionMap[url]() : optionMap["/error"]();
});

server.listen(PORT);

console.log("node-server started at port http://localhost:" + PORT);
```
浏览器访问效果：
[](https://github.com/Vuact/document/blob/main/base/node/images/7F25C7673AE2E8C8F1B1E9D419421B96.jpg?raw=true)
[](https://github.com/Vuact/document/blob/main/base/node/images/A8C7BD8936CE34A1D86D0250D099CC29.jpg?raw=true)
[](https://github.com/Vuact/document/blob/main/base/node/images/BCF88599B9781D8327B86FB1413600AC.jpg?raw=true)
[](https://github.com/Vuact/document/blob/main/base/node/images/CEF2AD7874ECE06D6CF90F1B0FF15E43.jpg?raw=true)
[](https://github.com/Vuact/document/blob/main/base/node/images/E990373EBDD8D7ACA84BD87EE8FD01C7.jpg?raw=true)

<br>

### 例2

https://juejin.im/post/6844903912596586509
