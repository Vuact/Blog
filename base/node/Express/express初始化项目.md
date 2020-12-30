# 一、hello, express

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

以上代码的意思是：生成一个 express 实例 app，挂载了一个根路由控制器，然后监听 `3000` 端口并启动程序。运行 `node index`，打开浏览器访问 `http://localhost:3000/` 时，页面应显示 hello, express。

<br>

# 二、安装Supervisor

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

# 三、
