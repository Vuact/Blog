
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

这是最简单的一个使用 express 的例子，后面会介绍路由及模板的使用。
