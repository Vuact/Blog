# 一、初始化node项目

### 1、创建项目目录

找个喜欢的地方，新建并初始化项目，执行以下命令：

```sh
mkdir node-server
cd node-server
npm init -y
```

### 2、编写服务脚本

在项目根目录下创建bin/www.js。

```
+  |- /bin
+     |- www.js
   |- package.json
```
启动web服务需要使用nodejs的http模块，打开 bin/www.js 编写代码：

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

<br>

# 二 服务热启动

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
