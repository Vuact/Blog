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

在项目根目录下创建`bin/www.js`

```
+  |- /bin
+     |- www.js
   |- node_modules
   |- package-lock.json
   |- package.json
```
启动web服务需要使用nodejs的http模块，打开 `bin/www.js` 编写代码：

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
M     "main": "./bin/www.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
+       "dev": "node ./bin/www.js"
      },
```

回到我们的项目来，项目的主入口文件是`./bin/www.js`。

现在，在项目根目录下执行npm run dev，就等同于执行node `./bin/www.js` 。 执行后，在控制台可以看到输出，说明服务已经正常启动：

```
node-server started at port http://localhost:8000
```

浏览器打开 `http://localhost:8000`，出现 "hello nodejs"


### 3、目录结构建设
这个比较灵活，这里说个通常的例子，

创建models、public、routes 和 views等文件夹，以及app.js、README.md文件

```
   |- /bin
      |- www.js
+  |- config
+  |- controllers
+  |- models
   |- node_modules
+  |- public
+  |- routes
+  |- test
+  |- tools
+  |- views
+  |- app.js
   |- package-lock.json
   |- package.json
+  |- README.md
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


https://blog.csdn.net/liudongdong19/article/details/79795369

https://juejin.cn/post/6844904133464424456
<br>

# 二、服务热启动

每次修改代码都要重启服务器才能生效很麻烦，使用nodemon来实现自动监测代码变化并重启。

另外，安装cross-env可以方便的跨平台设置环境变量（例如，windows用%ENV_VAR%，其他系统可能使用$ENV_VAR，不统一）

```
npm install nodemon cross-env --save-dev
```

修改package.json：
```
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
M       "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js"
    },
```

再次执行npm run dev的时候，如果代码有改动，web服务会自动重启，这样就方便多啦。
