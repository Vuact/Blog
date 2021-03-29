做过web性能优化的同学，对性能优化大杀器**gzip**应该不陌生。浏览器向服务器发起资源请求，比如下载一个js文件，`服务器先对资源进行压缩，再返回给客户端，客户端再解压使用`，以此节省流量，加快访问速度。

- 客户端通过HTTP请求头里的 **Accept-Encoding** 告诉服务器：“你可以用gzip、br、或者defalte算法压缩资源”；
- 服务器通过HTTP响应头里的 **Content-Encoding** 告诉客户端：使用的哪种压缩方式。

![image](https://user-images.githubusercontent.com/74364990/112879387-a5560080-90fb-11eb-9cd1-2baa78d77642.png)

那么，在nodejs里，是如何对资源进行压缩的呢？答案就是**Zlib**模块。

<br>

# 一、入门实例：简单的压缩/解压缩

压缩/解压 有gzip、defalte、br等方式，API：

- defalte：zlib.createDeflate() 和 zlib.createInflate()
- gzip：zlib.createGzip() 和 zlib.createGunzip()
- br：zlib.createBrotliCompress() 和 zlib.createBrotliDecompress()

这里只介绍 `gzip`。

## 压缩

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

## 解压

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

```javascript
const http = require("http");
const zlib = require("zlib");
const fs = require("fs");
const { pipeline } = require("stream");

const PORT = 8000;

// 创建服务器
const server = http.createServer((req, res) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  const sourceFile = fs.createReadStream("./index.html");

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

- `res.setHeader("Vary", "Accept-Encoding")`的含义：“告诉代理服务器缓存两种版本的资源：压缩和非压缩，这有助于避免一些公共代理不能正确地检测Content-Encoding标头的问题”。[具体请狠狠戳我](http://www.webkaka.com/blog/archives/how-to-set-Vary-Accept-Encoding-header.html)
- 客户端解压代码请参见：[压缩 HTTP 的请求和响应](http://nodejs.cn/api/zlib/compressing_http_requests_and_responses.html)
- 压缩完再发送请求，发现文件会变小（注：若文件本来就很小，压缩后会反而变大）

![image](https://user-images.githubusercontent.com/74364990/112877776-bef64880-90f9-11eb-82d0-70e314da2110.png)


<br>

>zlib.gzipSync(str)可对字符串进行gzip压缩

<br>

# 三、压缩算法

## 1、压缩算法：RLE

RLE 全称是 Run Length Encoding, 行程长度编码，也称为游程编码。

它的原理是：记录连续重复数据的出现次数。它的公式是：`字符 * 出现次数`。

例如原数据是 `AAAAACCPPPPPPPPERRPPP`，一共 18 个字节。按照 RLE 的规则,<br>
压缩后的结果是：`A5C2P8E1R2P3`，一共 12 个字节。压缩比例是：12 / 17 = 70.6%

RLE 的优点是压缩和解压非常快，针对连续出现的多个字符的数据压缩率更高。但对于ABCDE类似的数据，压缩后数据会更大。

<br>

## 2、压缩算法：哈夫曼树

哈夫曼树的原理是：出现频率越高的字符，用尽量更少的编码来表示。按照这个原理，以数据ABBCCCDDDD为例：

![image](https://user-images.githubusercontent.com/74364990/112882603-be60b080-90ff-11eb-8173-badf8286c945.png)

原来的数据是 10 个字节。那么编码后的数据是：`1110101110000`，一共 13bit，在计算机中需要 2 个字节来存储。这样的压缩率是：2 / 10 = 20%。

但是仅仅按照这个原理编码后的数据，无法正确还原。以前 4bit 为例，`1110`可以理解成:

- 11 + 10
- 1 + 1 + 1 + 0
- 1 + 1 + 10
- ...

而哈夫曼树的设计就很巧妙，能正确还原。哈夫曼树的构造过程如下：
