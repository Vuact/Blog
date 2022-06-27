在介绍HTTP缓存之前，作为知识铺垫，先简单介绍一下HTTP报文

- HTTP报文就是浏览器和服务器间通信时发送及响应的数据块。
- 浏览器向服务器请求数据，发送请求(`request`)报文；服务器向浏览器返回数据，返回响应(`response`)报文。
- 报文信息主要分为两部分
    - 包含属性的首部(`header`)---------------附加信息（cookie，缓存信息等）与缓存相关的规则信息，均包含在header中
    - 包含数据的主体部分(`body`)--------------HTTP请求真正想要传输的部分


<br>

# 一、缓存规则解析

为方便大家理解，我们认为浏览器存在一个缓存数据库,用于存储缓存信息。<br>
在客户端第一次请求数据时，此时缓存数据库中没有对应的缓存数据，需要请求服务器，服务器返回后，将数据存储至缓存数据库中。

![image](https://user-images.githubusercontent.com/74364990/109672112-a9036f80-7baf-11eb-8760-ebf796dcd536.png)

HTTP缓存有多种规则，根据是否需要重新向服务器发起请求来分类，我将其分为两大类(`强制缓存`，`对比缓存`)<br>
在详细介绍这两种规则之前，先通过时序图的方式，让大家对这两种规则有个简单了解。

<br>

**已存在缓存数据时，仅基于`强制缓存`，请求数据的流程如下:**

![image](https://user-images.githubusercontent.com/74364990/109672155-b4ef3180-7baf-11eb-82eb-e2ff796885c1.png)

**已存在缓存数据时，仅基于`对比缓存`，请求数据的流程如下:**

![image](https://user-images.githubusercontent.com/74364990/109672181-bc163f80-7baf-11eb-960b-48e7b6a3f6e1.png)


对缓存机制不太了解的同学可能会问，基于`对比缓存`的流程下，不管是否使用缓存，都需要向服务器发送请求，那么还用缓存干什么？<br>
这个问题，我们暂且放下，后文在详细介绍每种缓存规则的时候，会带给大家答案。


我们可以看到两类缓存规则的不同：
- `强制缓存`如果生效，不需要再和服务器发生交互
- 而`对比缓存`不管是否生效，都需要与服务端发生交互。

<br>

两类缓存规则可以同时存在，`强制缓存`优先级高于`对比缓存`，也就是说，当执行`强制缓存`的规则时，如果缓存生效，直接使用缓存，不再执行`对比缓存`规则。

<br>

# 二、强制缓存

从上文我们得知，强制缓存，在缓存数据未失效的情况下，可以直接使用缓存数据，那么浏览器是`如何判断缓存数据是否失效`呢？<br>
我们知道，在没有缓存数据的时候，浏览器向服务器请求数据时，服务器会将数据和缓存规则一并返回，`缓存规则信息包含在响应header`中。

对于强制缓存来说，响应header中会有两个字段来标明失效规则（`Expires/Cache-Control`）<br>
使用chrome的开发者工具，可以很明显的看到对于强制缓存生效时，网络请求的情况

![image](https://user-images.githubusercontent.com/74364990/109672213-c46e7a80-7baf-11eb-93b6-d17c05978920.png)

## 1、Expires与Cache-Control

### Expires（作用基本忽略）

Expires的值为服务端返回的到期时间，即下一次请求时，请求时间小于服务端返回的到期时间，直接使用缓存数据。<br>
不过Expires 是HTTP 1.0的东西，现在默认浏览器均默认使用HTTP 1.1，所以它的作用基本忽略。<br>
另一个问题是，到期时间是由服务端生成的，但是客户端时间可能跟服务端时间有误差，这就会导致缓存命中的误差。<br>
所以HTTP 1.1 的版本，使用`Cache-Control`替代。

### Cache-Control

Cache-Control 是最重要的规则。常见的取值有private、public、no-cache、max-age，no-store，默认为private。

- `private`: 客户端可以缓存

- `public`: 客户端和代理服务器都可缓存（前端的同学，可以认为public和private是一样的）

- `max-age=xxx`: 缓存的内容将在 xxx 秒后失效

- `no-cache`: 需要使用`对比缓存`来验证缓存数据（后面介绍）

- `no-store`: 所有内容都不会缓存，`强制缓存`，`对比缓存`都不会触发（对于前端开发来说，缓存越多越好，so...基本上和它说886）


举个板栗：

![image](https://user-images.githubusercontent.com/74364990/109672235-cc2e1f00-7baf-11eb-927a-203915c9747e.png)


图中Cache-Control仅指定了max-age，所以默认为private，缓存时间为31536000秒（365天）<br>
也就是说，在365天内再次请求这条数据，都会直接获取缓存数据库中的数据，直接使用。

若Cache-Control指定了 `max-age=0`,则强缓存失效，走对比缓存。

## 2、一些细节

### 请求头 与 响应头 的 Cache-Control 区别

`Response Header`与 `Request Header`里都有 `Cache-Control`，但实质是有区别的。

- `Response Header`的 Cache-Control: 它是告诉浏览器当前这次是这样存储的。影响的是当前这一次请求。
- `Request Header`的 Cache-Control: 它是告诉浏览器每次都是这样存储的。影响的是每一次请求。 

具体请务必详细阅读：
[https://juejin.cn/post/7062150108590112804](https://juejin.cn/post/6960988505816186894)

<br>

### max-age和Expires的区别

在用fiddler抓包的时候，发现不少网站同时设置了max-age和Expires，为毛要设置两个，功能不都差不多吗，两者区别是啥？

- max-age是http1.1的属性，Expires是http1.0的属性，为了做到向下兼容，一般写两个。但如在1.1环境下，max-age优先级比Expires高。
- max-age是相对过期时间，Expires是绝对过期时间。max-age在浏览器成功缓存文件后，只需相对请求成功之后的多长时间不再发起请求就好了，而Expires总是需要服务器返回一个精准的GMT格式的日期，并以这个日期为标准来判断缓存是否过期，相对就比较麻烦，所以才有了max-age这样的存在来代替它。

同理，no-cache和 Pargma也是这样的存在，一个是1.1的属性，一个是1.0，向下兼容，同时写了两个。


<br>

# 三、对比缓存

`对比缓存`，顾名思义，需要进行比较判断是否可以使用缓存。<br>
浏览器第一次请求数据时，服务器会将缓存标识与数据一起返回给客户端，客户端将二者备份至缓存数据库中。<br>
再次请求数据时，客户端将备份的缓存标识发送给服务器，服务器根据缓存标识进行判断，判断成功后，返回304状态码，通知客户端比较成功，可以使用缓存数据。

**第一次访问：**

![image](https://user-images.githubusercontent.com/74364990/109673154-b3723900-7bb0-11eb-9d0c-1b8174465e75.png)

**再次访问：**

![image](https://user-images.githubusercontent.com/74364990/109673167-b79e5680-7bb0-11eb-9f57-df000f7957be.png)


通过两图的对比，我们可以很清楚的发现，在`对比缓存`生效时，状态码为304，并且报文大小和请求时间大大减少。<br>
原因是，服务端在进行标识比较后，只返回header部分，通过状态码通知客户端使用缓存，不再需要将报文主体部分返回给客户端。

对于`对比缓存`来说，缓存标识的传递是我们着重需要理解的，它在请求header和响应header间进行传递，<br>
一共分为两种标识传递，接下来，我们分开介绍。

<br>

## 1、Last-Modified / If-Modified-Since

### Last-Modified：

服务器在响应请求时，告诉浏览器资源的最后修改时间。

![image](https://user-images.githubusercontent.com/74364990/109673291-d8ff4280-7bb0-11eb-8a92-e4c803cb590c.png)

### If-Modified-Since：
再次请求服务器时，通过此字段通知服务器上次请求时，服务器返回的资源最后修改时间。<br>
服务器收到请求后发现有头If-Modified-Since 则与被请求资源的最后修改时间进行比对。<br>
若资源的最后修改时间大于If-Modified-Since，说明资源又被改动过，则响应整片资源内容，返回状态码200；<br>
若资源的最后修改时间小于或等于If-Modified-Since，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache。

![image](https://user-images.githubusercontent.com/74364990/109673734-47440500-7bb1-11eb-890b-274494f40423.png)

#### 缺点：

如果客户端在一秒内向服务端发送大量请求，且1秒内服务端上内容变化多次，此时用`Last-Modified / If-Modified-Since`就无法读取到最新数据；
所以`Etag / If-None-Match`优先级高于`Last-Modified / If-Modified-Since`。

## 2、Etag / If-None-Match（优先级高于Last-Modified / If-Modified-Since）


### Etag：
服务器响应请求时，告诉浏览器当前资源在服务器的唯一标识（生成规则由服务器决定）。

![image](https://user-images.githubusercontent.com/74364990/109674460-e49f3900-7bb1-11eb-979a-b1746de70fbd.png)


### If-None-Match：
再次请求服务器时，通过此字段通知服务器客户段缓存数据的唯一标识。<br>
服务器收到请求后发现有头If-None-Match 则与被请求资源的唯一标识进行比对，<br>
不同，说明资源又被改动过，则响应整片资源内容，返回状态码200；<br>
相同，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache。

![image](https://user-images.githubusercontent.com/74364990/109674478-e9fc8380-7bb1-11eb-9552-f2cd58a24e0e.png)


<br>

# 四、总结 和 缺陷

## 1、总结

对于强制缓存，服务器通知浏览器一个缓存时间，在缓存时间内，下次请求，直接用缓存，不在时间内，执行对比缓存策略。<br>
对于对比缓存，将缓存信息中的Etag和Last-Modified通过请求发送给服务器，由服务器校验，返回304状态码时，浏览器直接使用缓存。

浏览器第一次请求：

![image](https://user-images.githubusercontent.com/74364990/109674638-0b5d6f80-7bb2-11eb-9de2-4e8f51f95fef.png)


浏览器再次请求时：

![image](https://user-images.githubusercontent.com/74364990/109674663-10222380-7bb2-11eb-96b5-2ee041a9c658.png)


（1）浏览器第一次发起一个http/https请求，读取服务器的资源

（2）服务端设置响应头cache-control、Expires、last-modified、Etag 通常一起给浏览器

- cache-control、Expires 属于强缓存<br>
- last-modified、Etag属于对比缓存

（3）浏览器不关闭tab、f5刷新页面（再次发起一个请求给服务器）

- 如果cache-control的max-age 和 Expires 未超过缓存时间，所有资源除了XXX.html 都来自于内存缓存（from memory cache）加载。且状态码为200<br>
- 如果cache-control的max-age缓存时间为5s， Expires的过期时间是超过5s，则cache-control会覆盖Expires
- 如果强缓存失效，则下一步会走对比缓存。浏览器会从第二步的拿到的响应头，在刷新发起请求会设置
	- if-modified-since值为响应的last-modified的值；
	- if-none-match 值为响应的Etag的值;
- 如果if-modified-since 和if-none-match都存在，则if-none-match的优先比if-modified-since高。直接对比第二步给浏览器的Etag的值，如果相等就直接返回一个状态为304不返回内容，如果不相等就返回一个状态码为200，并且会返回内容和cache-control 、Expires、last-modified、Etag等响应头；
- 如果if-modified-since 存在， if-none-match不存在，步骤跟上述的3.4类似，只不过服务端对比的是if-modified-since 和第一次返回给浏览器last-modified的值

（4）如果浏览器关闭tab。重新打开新tab，发起请求资源。步骤跟上述（3）类似，只不过在上述3.1中，左右资源除了XXX.html缓存（from disk cache）都从磁盘加载。

<br>

### 这里再将上面过程简单概括下：
1、先判断资源是否命中强缓存，命中则直接从disk里拿到资源；

2、如果没有命中强缓存，判断是否命中协商缓存，命中则走协商缓存；

3、如果命中了协商缓存，会发起请求，服务端根据Request Header里的If-None-Match（对应Etag）和If-Modified-Since（对应Last-Modified）判断资源是否过期，没过期则返回304状态码，浏览器依旧用disk里的资源。如果资源过期，则服务端会返回新的资源；

4、如果也没有命中协商缓存，则这个请求不走缓存策略，发起真实的请求，从服务端拿资源；

<br>

如果还不是很懂，请阅读这篇文章：[http缓存详解，http缓存推荐方案](https://www.cnblogs.com/echolun/p/9419517.html)


### 涉及的请求头和响应头

![image](https://user-images.githubusercontent.com/74364990/173895220-1d50d3d2-a1b1-477e-aa57-5f0dc359b6ba.png)


<br>

## 2、缺陷

我们已经可以精确的对比服务器文件与本地缓存文件差异，但其实上面方案的演变都存在一个较大缺陷： `max-age或Expires不过期，浏览器无法主动感知服务器文件变化。`

#### 解决缺陷：md5/hash缓存

通过不缓存html，为静态文件添加MD5或者hash标识，解决浏览器无法跳过缓存过期时间主动感知文件变化的问题。

为什么这么做？实现原理是什么？

我们前面说的http缓存方案，服务器与浏览器的文件修改时间对比，文件内容标识对比，前提基础都是建立在两者文件路径完全相同的情况下。

`module/js/a-hash1.js`与`module/js/a-hash2.js`是两个完全不同的文件，假想浏览器第一次加载页面，请求并缓存了`module/js/a-hash1.js`，第二次加载，文件指向变成了`module/js/a-hash2.js`，浏览器会直接重新请求`a-hash2.js`，因为这就是两个完全不同的文件，哪里还有什么http缓存文件对比，通过这种做法，我们就可以从根本上解决过期时间没到浏览器无法主动请求服务器的问题。因此我们只需要在项目每次发布迭代将修改过的静态文件添加不同的MD5或hash标识就好啦。

>注意，这里我们不缓存html文件，缓存的都是css、js文件（因为改变频率高）

## 3、应用

（1）单页面应用中：

- 入口文件index.html设置为协商缓存，每次都向服务器发起请求，确定资源是否过期。
- 其他的资源，css，js这些都会设置成强缓存。因为这些文件名在打包之后会带上hash值，如果修改了内容，那么打包之后因为hash值变化，所以文件名也是会变化的。这些文件在index.html里引入

（2）不走两个缓存的操作：

- 硬性重新加载、控制台 `勾选Disable cache后点刷新`<br>
以上操作会跳过缓存判断，发起真实的请求，从服务端拿资源。但本地的缓存资源(如disk里的缓存)并没有删除。
这种方式会在Request Header里添加Cache-Control:no-cache和Pragma: no-cache

- 清空缓存并硬性重新加载<br>
这种方式，相当于先删除缓存（如disk里的缓存），再执行硬性重新加载

<br>

# 五、实战

[https://github.com/Vuact/Blog/blob/main/base/node/Node.js/Node%E5%AE%9E%E6%88%98:%20HTTP%E7%BC%93%E5%AD%98.md](https://github.com/Vuact/Blog/blob/main/base/node/Node.js/Node%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/%E8%BF%9B%E9%98%B6/Node%E5%AE%9E%E6%88%98:%20HTTP%E7%BC%93%E5%AD%98.md)
