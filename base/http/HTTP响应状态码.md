响应状态码有以下五种：

|     |               类别               |          原因短语          |
|:---:|:--------------------------------:|:--------------------------:|
| 1XX |    Informational(信息性状态码)   |     接收的请求正在处理     |
| 2XX |       Success（成功状态码）      |      请求正常处理完毕      |
| 3XX |    Redirection（重定向状态码）   | 需要进行附加操作以完成请求 |
| 4XX | Client Error（客户端错误状态码） |     服务器无法处理请求     |
| 5XX | Server Error（服务器错误状态码） |     服务器处理请求出错     |


<br>

# 一、1xx消息

这一类型的状态码，代表请求已被接受，需要继续处理。这类响应是临时响应，只包含状态行和某些可选的响应头信息，并以空行结束。由于HTTP/1.0协议中没有定义任何1xx状态码，所以除非在某些试验条件下，服务器禁止向此类客户端发送1xx响应。 这些状态码代表的响应都是信息性的，标示客户应该采取的其他行动。

## 100 Continue（继续）

客户端应当继续发送请求。这个临时响应是用来通知客户端它的`部分请求已经被服务器接收，且仍未被拒绝。客户端应当继续发送请求的剩余部分`，或者如果请求已经完成，忽略这个响应。服务器必须在请求完成后向客户端发送一个最终响应。

应用场景：常用于POST大数据传输。例如 客户端在发送POST数据给服务器前，征询服务器情况，看服务器是否处理POST的数据，如果不处理，客户端则不上传POST数据；如果处理，则服务器返回状态码`100` 给客户端，客户端继续POST上传数据。

##  101 Switching Protocols（切换协议）

服务器根据客户端的请求切换协议，主要用于websocket或http2升级。

<br>

# 二、2xx成功

这一类型的状态码，代表请求已成功被服务器接收、理解、并接受。

## 200 OK（成功）

请求已成功，请求所希望的响应头或数据体将随此响应返回。

## 201 Created（已创建）

请求成功，创建了一个新的资源，且`新资源的URI已经随Location头信息返回`。假如需要的资源无法及时创建的话，应当返回`202 Accepted`。

使用场景：https://segmentfault.com/q/1010000038339677

## 202 Accepted（已接受）

服务器已接受请求，但尚未处理。正如它可能被拒绝一样，最终`该请求可能会也可能不会被执行`。在`异步操作的场合`下，没有比发送这个状态码更方便的做法了。

比如：页面上提交一个表单的操作。点击提交，客户端向服务器发送请求：
- 若服务器仅仅收到了请求，但还没开始进行处理，则先返回状态码`202`给客户端(表示已接受，但还没开始操作)，让客户端继续等待
- 若服务器收到了请求，且将表单创建操作完毕，则返回状态码`201`给客户端(表示已创建，操作成功)

## 203 Non-Authoritative Information（非授权信息）

`203` 非权威内容，简单的说，就是通过代理访问原始服务器的时候，成功获取了原始服务器（状态200）的返回内容，但是代理对内容做出了一些改动，例如修改了文档编码等等，代理通过这个状态码告知用户，成功获取内容，但是这部分内容和原始服务器的返回内容可能不完全一致。

HTTP请求Proxy再到Origin Server过程：

① 请求： `Client` ---> `Proxy` ---> `Origin Server`<br>
② 源服务器返回内容给代理： `Proxy` <--- `Origin Server`, 得到内容 例如：`index.html` <br>
③ `Proxy` 有自定义设置，比如：过滤掉一些广告内容，或者移除一些敏感信息。那么`index.html`变为了修改后的 `index.html`<br>
④ 代理返回修改后的内容给客户端： `Client` <--- `Proxy` 使用 状态码`203`表示内容和源站的原始内容不一样。

使用 状态码203 表示`虽然返回成功，但返回的内容和源站的原始内容不一样`。

## 204 No Content（无内容）

`服务器成功处理了请求，但没返回任何内容，浏览器不用刷新页面.也不用导向新的页面。`

如何理解这段话呢。还是通过例子来说明吧，假设页面上有个form，提交的url为http-204.htm，提交form，正常情况下，页面会跳转到http-204.htm，但是如果http-204.htm的相应的状态码是204，此时页面就不会发生转跳，还是停留在当前页面。另外对于a标签，如果链接的页面响应码为204，页面也不会发生跳转。

所以对于一些提交到服务器处理的数据，只需要返回是否成功的情况下，可以考虑使用状态码204来作为返回信息，从而省掉多余的数据传输。

## 205 Reset Content（重置内容）

服务器成功处理了请求，且没有返回任何内容。但是与204响应不同，返回此状态码的响应要求请求者重置文档视图。该响应主要是被用于接受用户输入后，立即重置表单，以便用户能够轻松地开始另一次输入。

## 206 Partial Content（部分内容）

服务器已经成功处理了部分GET请求。类似于FlashGet或者迅雷这类的HTTP 下载工具都是使用此类响应实现断点续传或者将一个大文档分解为多个下载段同时下载。

使用场景：https://blog.csdn.net/dong123dddd/article/details/52038729

看视频的时候一般就会返回状态码206
<img width="973" alt="image" src="https://user-images.githubusercontent.com/74364990/174134596-164a5d23-d507-4dce-9bda-cd7ef348c9df.png">

所以状态206可以用作多线程下载的状态码

<br>


# 三、3xx重定向

这类状态码代表需要客户端采取进一步的操作才能完成请求。通常，这些状态码用来重定向，后续的请求地址（重定向目标）在本次响应的Location域中指明。

## 301 Moved Permanently（永久移动）

301代表 请求的资源被永久性的移到了新的位置；客户端使用Location首部给出的URL来重定向资源。

应用场景：新域名替换旧域名，旧的域名不再使用时，用户访问旧域名时用301就重定向到新的域名

必读：[http状态码301和302详解及区别——辛酸的探索之路
](https://blog.csdn.net/grandPang/article/details/47448395)

## 302 Moved Temporarily（临时移动）

302代表 请求的资源被临时移到新的位置；客户端使用Location首部给出的URL来重定向资源。

应用场景：常用 于未登陆的用户访问用户中心重定向到登录页面

> 302的body你拿不到

### 302与响应头的Location

`Location` 响应头表示URL的页面重定向到。它仅在提供 `3xx` （重定向）或 `201` （已创建）状态响应时提供含义。

#### 实例
访问这个地址会发生什么：https://segmentfault.com/img/remote/1460000038996968

过程：先请求资源`1460000038996968`，状态码为`302`；然后url再`重定向`到 `响应头location的值`，此时的url即为 `https://image-static.segmentfault.com/382/288/3822888048-5f12eba48f86ab03_fix732`

<img width="2463" alt="image" src="https://user-images.githubusercontent.com/74364990/173828718-df1d9afc-ffdd-477d-b3c8-1f2237b881f1.png">

#### 必读
- [当302遇到跨域请求](https://zhuanlan.zhihu.com/p/383548535)
- [有关重定向的一些细节](https://blog.lishunyang.com/2020/06/redirect.html)
- [http状态码301和302详解及区别——辛酸的探索之路](https://blog.csdn.net/grandPang/article/details/47448395)


<br>

## 303 See Other（查看其他位置）

303 与 302 一样，唯一的区别就是：303 会将客户端发来的原请求(POST、DELETE等)重定向为GET请求。

303 常用于将 POST 请求重定向到 GET 请求，比如你上传了一份个人信息，服务器发回一个 303 响应，将你导向一个“上传成功”页面。

不管原请求是什么方法，重定向请求的方法都是 GET（或 HEAD，不常用）

## 304 Not Modified（未修改）

自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。

应用场景：协商缓存，告诉客户端有缓存，直接使用缓存中的数据，返回页面的只有头部信息，是没有内容部分

涉及请求头：If-Match,If-Modified-Since，If-None-March，If-Range，If-Unmodified-Since等

简介：https://juejin.cn/post/6844903512946507790

与 协商缓存 相关，具体请参见：https://github.com/Vuact/Blog/blob/main/base/http/HTTP%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6%E5%8F%8A%E5%8E%9F%E7%90%86.md


## 305 Use Proxy（使用代理）

被请求的资源必须通过指定的代理才能被访问。响应头的`Location`中将给出指定的代理所在的URI信息，接收者需要重复发送一个单独的请求，通过这个代理才能访问相应资源。

换句话：请求者只能使用代理访问请求的网页，而代理的地址在响应头的`Location`中。


<br>

# 四、4xx客户端错误

这类的状态码代表了客户端看起来可能发生了错误，妨碍了服务器的处理。

## 400 Bad Request（错误请求）

由于包含语法错误，当前请求无法被服务器理解。

应用场景：请求参数有误，导致请求无法被服务器识别

## 401 Unauthorized（未授权）

请求要求身份验证。对于需要登录的网页，服务器可能返回此响应。

当前请求需要用户验证。该响应必须包含一个适用于被请求资源的WWW-Authenticate信息头用以询问用户信息。客户端可以重复提交一个包含恰当的Authorization头信息的请求。如果当前请求已经包含了Authorization证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息

## 403 Forbidden（已禁止）

服务器拒绝请求。

应用场景：告诉客户端禁止访问该站点或者资源，如在外网环境下，然后访问只有内网IP才能访问的时候则返回

## 404 Not Found（未找到）

请求失败，请求所希望得到的资源未被在服务器上发现。

应用场景：服务器找不到资源时，或者服务器拒绝请求又不想说明理由时

## 405 Method Not Allowed（方法禁用）

请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow头信息用以表示出当前资源能够接受的请求方法的列表。

鉴于PUT，DELETE方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误。

<br>

# 五、5xx服务器错误

这类状态码代表了服务器在处理请求的过程中有错误或者异常状态发生。

## 500 Internal Server Error（服务器内部错误）

服务器遇到错误，无法完成请求

## 501 Not Implemented（尚未实施）

服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。

## 502 Bad Gateway（错误网关）

服务器作为网关或者代理执行请求时，从上游服务器接收到无效的响应。

## 503 Service Unavailable（服务不可用）

服务器目前无法使用（由于超载或停机维护）

如果事先得知服务器恢复正常的时间，最好写入Retry-After首部字段再返回给客户端。

应用场景：服务器停机维护时，主动用503响应请求或 nginx 设置限速，超过限速，会返回503


## 504 Gateway Timeout（网关超时）

服务器作为网关或者代理执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。







