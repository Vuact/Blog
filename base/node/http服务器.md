```javascript
const http = require('http');

const post = 3000;
const server = http.createServer((req, res) => {
	res.end('22');//必须有，否则不响应
});

server.listen(post, () => {
	console.log(111);
});
```

https://juejin.im/post/6844903912596586509