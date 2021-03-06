# 总结

如果不了解`强缓存`与`对比缓存`，可阅读[HTTP缓存机制及原理](https://github.com/Vuact/Blog/blob/main/base/http/HTTP%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6%E5%8F%8A%E5%8E%9F%E7%90%86.md)

1、浏览器第一次发起一个http/https请求，读取服务器的资源

2、服务端设置响应头（cache-control、Expires、last-modified、Etag）给浏览器

- cache-control、Expires 属于强缓存<br>
- last-modified、Etag属于对比缓存

3、浏览器不关闭tab、f5刷新页面（再次发起一个请求给服务器）

- 如果cache-control的max-age 和 Expires 未超过缓存时间，所有资源除了index.html 都来自于内存缓存（from memory cache）加载。且状态码为200<br>
- 如果cache-control的max-age缓存时间为5s， Expires的过期时间是超过5s，则cache-control会覆盖Expires
- 如果强缓存失效，则下一步会走对比缓存。浏览器会从第二步的拿到的响应头，在刷新发起请求会设置
	- if-modified-since值为响应的last-modified的值；
	- if-none-match 值为响应的Etag的值;
- 如果if-modified-since 和if-none-match都存在，则if-none-match的优先比if-modified-since高。直接对比第二步给浏览器的Etag的值，如果相等就直接返回一个状态为304不返回内容，如果不相等就返回一个状态码为200，并且会返回内容和cache-control 、Expires、last-modified、Etag等响应头；
- 如果if-modified-since 存在， if-none-match不存在，步骤跟上述的3.4类似，只不过服务端对比的是if-modified-since 和第一次返回给浏览器last-modified的值

4、如果浏览器关闭tab。重新打开新tab，发起请求资源。步骤跟上述3类似，只不过在上述3.1中，左右资源除了index.html缓存（from disk cache）都从磁盘加载。

<br>

http缓存分为 强缓存 和 对比缓存

<br>

# 一、强缓存

当客户端请求后，会先访问缓存数据库看缓存是否存在。如果存在则直接返回，不存在则请求真的服务器。

强制缓存直接减少请求数，是提升最大的缓存策略。 它的优化覆盖了文章开头提到过的请求数据的全部三个步骤。如果考虑使用缓存来优化网页性能的话，强制缓存应该是首先被考虑的。

可以造成强制缓存的字段是 `Cache-control` 和 `Expires`


## 1、Expires(已废弃)

这是 HTTP 1.0 的字段，表示缓存到期时间，是一个绝对的时间 (当前时间+缓存时间)。在响应消息头中，设置这个字段之后，就可以告诉浏览器，在未过期之前不需要再次请求。

>Expires: Thu, 22 Mar 2029 16:06:42 GMT

```js
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

http.createServer((req, res) => {
    let { pathname } = url.parse(req.url, true);
    console.log(pathname)
    let abs = path.join(__dirname, pathname);
    res.setHeader('Expires', new Date(Date.now() + 20000).toGMTString());
    fs.stat(path.join(__dirname, pathname), (err, stat) => {
        if(err) {
            res.statusCode = 404;
            res.end('not found')
            return
        }
        if(stat.isFile()) {
            fs.createReadStream(abs).pipe(res)
        }
    })
}).listen(3000)
```

以上代码给Expires设置过期时间为20s。

![image](https://user-images.githubusercontent.com/74364990/109678431-92601700-7bb5-11eb-8cbe-2061255b3159.png)

（1）首次请求 首次请求 全部走网络请求

![image](https://user-images.githubusercontent.com/74364990/109678457-9855f800-7bb5-11eb-82c9-a5868bdf9f91.png)


（2）20s内F5刷新当前，从内存里面加载。因为我们没有关闭TAB，所以浏览器把缓存的应用加到了内存缓存。（耗时0ms，也就是1ms以内）

![image](https://user-images.githubusercontent.com/74364990/109678471-9d1aac00-7bb5-11eb-82e9-ad89df56f44a.png)


（3）20s内关闭tab，打开请求的url，从磁盘加载

![image](https://user-images.githubusercontent.com/74364990/109678491-a4da5080-7bb5-11eb-87e2-ff76882b2081.png)

关闭了TAB，内存缓存也随之清空。但是磁盘缓存是持久的，于是所有资源来自磁盘缓存。（大约耗时3ms，因为文件有点小）而且对比2和3，很明显看到内存缓存还是比disk cache快得多的。


（4）20s以后请求，缓存已经失效，重复第1步


过期的缺点：

在这里，其他电脑访问服务器，若修改电脑的本地时间，会导致浏览器判断缓存失效 这里修重新修改缓存时间： 

```js
res.setHeader（'Expires', new Date(Date.now() + 2000000).toGMTString())
```

![image](https://user-images.githubusercontent.com/74364990/109678543-b15ea900-7bb5-11eb-9559-1b41a48ddac1.png)


<br>

## 2、Cache-control

已知Expires的缺点之后，在HTTP/1.1中，增加了一个字段Cache-control，该字段表示资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发送请求

Expires 和 Cache-control 区别：
- Expires设置的是 绝对时间
- Cache-control设置的是 相对时间

`Cache-control：max-age=20`, max-age为最大有效时间

```js
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

http.createServer((req, res) => {
    let { pathname } = url.parse(req.url, true);
    console.log(pathname)
    let abs = path.join(__dirname, pathname);
    res.setHeader('Cache-Control', 'max-age=20')
    fs.stat(path.join(__dirname, pathname), (err, stat) => {
        if(err) {
            res.statusCode = 404;
            res.end('not found')
            return
        }
        if(stat.isFile()) {
            fs.createReadStream(abs).pipe(res)
        }
    })
}).listen(3000)
```

以上代码给cache-control设置max-age为20s

解析：首次请求->关闭tab再次请求参考Expires的图

- no-cache 不使用强制缓存，使用对比缓存来验证缓存数据<br>
- no-store 所有内容都不会缓存，强制缓存，对比缓存都不会触发
- public 任何路径的缓存者（本地缓存、代理服务器），可以无条件的缓存改资源
- private 只针对单个用户或者实体（不同用户、窗口）缓存资源


#### no-store 和 no-cache的区别

- no-store: 如果服务器再响应中设置了no-store。那么浏览器不会存储这次相应的数据，当下次请求时，浏览器会在请求一次，就是说不会对比Etag<br>
`res.setHeader('Cache-control', 'no-store')`

- no-cache: 如果服务器在响应中设置了no-cache，那么说明浏览器在使用缓存前会对比Etag，返回304就会避免修改


#### public 和 private

设置了public,表示该响应可以在用户的浏览器或者任何中继web代理对其进行缓存,不写默认为public,表示只有用户的浏览器可以缓存private响应不允许任何web代理进行缓存，
只有用户的浏览器可以进行缓存。

<br><br>

# 二、对比缓存

当强制缓存失效(超过规定时间)时，就需要使用对比缓存，由服务器决定缓存内容是否失效。对比缓存是可以和强制缓存一起使用。

## last-modified / if-modified-since

（1）服务器在响应头中设置last-modified字段返回给客户端，告诉客户端资源最后一次修改的时间。
```
Last-Modified: Sat, 30 Mar 2019 05:46:11 GMT
```

（2）浏览器在这个值和内容记录在浏览器的缓存数据库中。<br>
（3）下次请求相同资源，浏览器将在请求头中设置if-modified-since的值（这个值就是第一步响应头中的Last-Modified的值）传给服务器<br>
（4）服务器收到请求头的if-modified-since的值与last-modified的值比较，如果相等，表示未进行修改，则返回状态码为304；如果不相等，则修改了，返回状态码为200，并返回数据<br>


```js
http.createServer((req, res) => {
    let { pathname } = url.parse(req.url, true);
    console.log(pathname);
    let abs = path.join(__dirname, pathname);
    fs.stat(path.join(__dirname, pathname), (err, stat) => {
        if(err) {
            res.statusCode = 404;
            res.end('Not Fount');
            return
        }
        if(stat.isFile()) {
            res.setHeader('Last-Modified', stat.ctime.toGMTString())
            console.log(stat.ctime.toGMTString())
            if(req.headers['if-modified-since'] === stat.ctime.toGMTString()) {
                console.log('if-modifined-since', req.headers['if-modified-since'])
                res.statusCode = 304;
                res.end()
                return
            }
            fs.createReadStream(abs).pipe(res)
        }
    })
}).listen(3000)
```

缺点：

- last-modified是以秒为单位的，假如资料在1s内可能修改几次，那么该缓存就不能被使用的。<br>
- 如果文件是通过服务器动态生成，那么更新的时间永远就是生成的时间，尽管文件可能没有变化，所以起不到缓存的作用。

<br>

## Etag / If-None-Match

为了解决上述问题，出现了一组新的字段 Etag 和 If-None-Match。<br>
Etag是根绝文件内容，算出一个唯一的值。服务器存储着文件的 Etag 字段。之后的流程和 Last-Modified 一致，只是 Last-Modified 字段和它所表示的更新时间改变成了 Etag 字段和它所表示的文件 hash，把 If-Modified-Since 变成了 If-None-Match。服务器同样进行比较，命中返回 304, 不命中返回新资源和 200。<br>

>Etag 的优先级高于 Last-Modified

```js
http.createServer(function(req, res) {
    let { pathname } = url.parse(req.url, true);
    console.log(pathname)
    let abs = path.join(__dirname, pathname);
    fs.stat(path.join(__dirname, pathname), (err, stat) => {
      if(err) {
        res.statusCode = 404;
        res.end('Not Found')
        return
      }
      if(stat.isFile()) {
        //Etag 实体内容，他是根绝文件内容，算出一个唯一的值。
        let md5 = crypto.createHash('md5')
        let rs = fs.createReadStream(abs)
        let arr = []; // 你要先写入响应头再写入响应体
        rs.on('data', function(chunk) {
          md5.update(chunk);
          arr.push(chunk)
        })

        rs.on('end', function() {
          let etag = md5.digest('base64');
          if(req.headers['if-none-match'] === etag) {
            console.log(req.headers['if-none-match'])
            res.statusCode = 304;
            res.end()
            return
          }
          res.setHeader('Etag', etag)
          // If-None-Match 和 Etag 是一对， If-None-Match是浏览器的， Etag是服务端的
          res.end(Buffer.concat(arr))
        })
      }
    })
  }).listen(3000)
```

缺点：

- 每次请求的时候，服务器都会把index.html 读取一次，以确认文件有没有修改<br>
- 对大文件进行etag 一般用文件的大小 + 文件的最后修改时间 来组合生成这个etag

