做过web性能优化的同学，对性能优化大杀器**gzip**应该不陌生。浏览器向服务器发起资源请求，比如下载一个js文件，服务器先对资源进行压缩，再返回给浏览器，以此节省流量，加快访问速度。

浏览器通过HTTP请求头部里加上**Accept-Encoding**，告诉服务器，“你可以用gzip，或者defalte算法等压缩资源”

![image](https://user-images.githubusercontent.com/74364990/112713599-fb1a8500-8f10-11eb-9f86-338dc3891843.png)


那么，在nodejs里，是如何对资源进行压缩的呢？答案就是**Zlib**模块。

<br>

# 一、入门实例：简单的压缩/解压缩

压缩有gzip、defalte、br等，这里只介绍 `gzip`。


### 压缩的例子

非常简单的几行代码，就完成了本地文件的gzip压缩。

```javascript
const { pipeline } = require("stream");
const { createGzip } = require("zlib");
const { createReadStream, createWriteStream } = require("fs");

const filePath = "./static/test.txt";
const gzip = createGzip(),
  source = createReadStream(filePath),
  destination = createWriteStream(`${filePath}.gz`);

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error("发生错误", err);
    process.exitCode = 1;
  }
});
//或 source.pipe(gzip).pipe(destination);
```
也可以 Promise 化，与上面代码作用一样；
```js
const { createGzip } = require("zlib");
const { createReadStream, createWriteStream } = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const pipe = promisify(pipeline);

async function doGzip(input, output) {
  output = output || `${input}.gz`; 
  const gzip = createGzip(),
    source = createReadStream(input),
    destination = createWriteStream(output);

  await pipe(source, gzip, destination);
}

doGzip("./static/test.txt", "./static/test.txt.gz")
  .then(() => {
    //do some thing
  })
  .catch((err) => {
    console.error("发生错误", err);
    process.exitCode = 1;
  });
```
- [stream.pipeline(source[, ...transforms], destination, callback)](http://nodejs.cn/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback)

<br>

### 解压的例子

同样非常简单，就是个反向操作。

```javascript
const { pipeline } = require("stream");
const { createGunzip } = require("zlib");
const { createReadStream, createWriteStream } = require("fs");

const filePath = "./static/test.txt";
const gunzip = createGunzip(),
  source = createReadStream(`${filePath}.gz`),
  destination = createWriteStream(filePath);

pipeline(source, gunzip, destination, (err) => {
  if (err) {
    console.error("发生错误", err);
    process.exitCode = 1;
  }
});
//或 source.pipe(gunzip).pipe(destination);
```
解压也同样可以 Promise 化，这里就不写了。

<br>

# 二、压缩 HTTP 的请求和响应

### 服务端压缩

代码超级简单。首先判断 是否包含 **accept-encoding** 首部，正则匹配看是否为采用哪种压缩（**deflate** 或 **gzip** 或 **br**）<br>
若匹配不到，则不压缩。

**服务端代码**
```javascript
const http = require("http");
const zlib = require("zlib");
const fs = require("fs");
const { pipeline } = require("stream");

const PORT = 8000;

// 创建服务器
const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  const sourceFile = fs.createReadStream("./static/test.html");

  // 存储资源的压缩版本和未压缩版本。
  res.setHeader("Vary", "Accept-Encoding");

  const onError = (err) => {
    if (err) {
      // 如果发生错误，则我们将会无能为力；因为服务器已经发送了 200 响应码，并且已经向客户端发送了一些数据。
      // 我们能做的最好就是立即终止响应并记录错误。
      response.end();
      console.error("发生错误:", err);
    }
  };

  if (/\bdeflate\b/.test(acceptEncoding)) {
    res.writeHead(200, { "Content-Encoding": "deflate" });
    pipeline(sourceFile, zlib.createDeflate(), res, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    res.writeHead(200, { "Content-Encoding": "gzip" });
    pipeline(sourceFile, zlib.createGzip(), res, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    res.writeHead(200, { "Content-Encoding": "br" });
    pipeline(sourceFile, zlib.createBrotliCompress(), res, onError);
  } else {
    res.writeHead(200, {});
    pipeline(sourceFile, res, onError);
  }
});

// 设置服务器端口
server.listen(PORT);

console.log("node-server started at port http://localhost:" + PORT);
```

<br>

### 服务端字符串gzip压缩

代码跟前面例子大同小异。这里采用了 **zlib.gzipSync(str)** 对字符串进行gzip压缩。

```javascript
var http = require('http');
var zlib = require('zlib');

var responseText = 'hello world';

var server = http.createServer(function(req, res){
    var acceptEncoding = req.headers['accept-encoding'];
    if(acceptEncoding.indexOf('gzip')!=-1){
        res.writeHead(200, {
            'content-encoding': 'gzip'
        });
        res.end( zlib.gzipSync(responseText) );
    }else{
        res.end(responseText);
    }

});

server.listen('3000');
```

<br>

deflate压缩的使用也差不多，这里就不赘述。更多详细用法可参考[官方文档](https://nodejs.org/api/zlib.html#zlib_class_options)。
