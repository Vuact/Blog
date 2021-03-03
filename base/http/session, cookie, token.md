
http是一个无状态协议。

什么是无状态呢？就是说这一次请求和上一次请求是没有任何关系的，互不认识的，没有关联的。这种无状态的的好处是快速。坏处是假如我们想要把 `www.zhihu.com/login.html` 和`www.zhihu.com/index.html` 关联起来，必须使用某些手段和工具。

<br>

# 一、cookie和session

由于http的无状态性，为了使某个域名下的所有网页能够共享某些数据，session和cookie出现了。客户端访问服务器的流程如下

- 首先，客户端会发送一个http请求到服务器端。<br>
- 服务器端接受客户端请求后，建立一个session，并发送一个http响应到客户端，这个响应头，其中就包含Set-Cookie头部。该头部包含了sessionId。Set-Cookie格式如下：<br>
`Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]` 具体请看[cookie属性详解](https://github.com/Vuact/Blog/blob/main/base/http/cookie%E5%B1%9E%E6%80%A7%E8%AF%A6%E8%A7%A3.md)<br>
- 在客户端发起的第二次请求，假如服务器给了set-Cookie，浏览器会自动在请求头中添加cookie<br>
- 服务器接收请求，分解cookie，验证信息，核对成功后返回response给客户端

![image](https://user-images.githubusercontent.com/74364990/109837335-07981e80-7c80-11eb-9be3-be5add3882b2.png)

>**注意**
>cookie只是实现session的其中一种方案。虽然是最常用的，但并不是唯一的方法。禁用cookie后还有其他方法存储，比如放在url中
>现在大多都是Session + Cookie，但是只用session不用cookie，或是只用cookie，不用session在理论上都可以保持会话状态。可是实际中因为多种原因，一般不会单独使用

<br>

**Cookie和Session的区别：**

- cookie数据存放在客户的浏览器上，session数据放在服务器上。
- session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能,考虑到减轻服务器性能方面，应当使用cookie。
- 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。<br>
  所以个人建议：<br>
  将登陆信息等重要信息存放为session；<br>
  其他信息如果需要保留，可以放在cookie中


<br>

# 二、token

token 也称作令牌，由uid+time+sign[+固定参数]<br>
token 的认证方式类似于临时的证书签名, 并且是一种服务端无状态的认证方式, 非常适合于 REST API 的场景. 所谓无状态就是服务端并不会保存身份认证相关的数据。

**组成:**

- uid: 用户唯一身份标识
- time: 当前时间的时间戳
- sign: 签名, 使用 hash/encrypt 压缩成定长的十六进制字符串，以防止第三方恶意拼接
- 固定参数(可选): 将一些常用的固定参数加入到 token 中是为了避免重复查库

<br>

**token认证流程：** 

token 的认证流程与cookie很相似，拿个应用场景说明：

- 当用户首次登录成功（或注册成功）之后, 服务器端就会生成一个token值，这个值会保存在服务端的数据库中；然后再将这个token值返回给客户端.
- 客户端拿到 token 值之后,进行本地保存。
- 当客户端再次发送网络请求(一般不是登录请求)的时候,就会将这个 token 值附带到headers中发送给服务器
- 服务器接收到客户端的请求之后,会取出token值与保存在本地(数据库)中的token值做对比
  - 如果 token 值相同，说明用户登录成功过!当前用户处于登录状态!
  - 如果 token 值不同，说明原来的登录信息已经失效,让用户重新登录.
  - 如果没有这个 token 值, 则说明没有登录成功.
  
<br>

**存放:**

- 客户端：token在客户端一般存放于localStorage，cookie，或sessionStorage中
- 服务端：在服务器一般存于数据库中


<br>

# token可以抵抗csrf，cookie+session不行

假如用户正在登陆银行网页，同时登陆了攻击者的网页，并且银行网页未对csrf攻击进行防护。攻击者就可以在网页放一个表单，该表单提交src为`http://www.bank.com/api/transfer`，body为`count=1000&to=Tom`。倘若是`session+cookie`，用户打开网页的时候就已经转给Tom1000元了.因为form 发起的 POST 请求并不受到浏览器同源策略的限制，因此可以任意地使用其他域的 Cookie 向其他域发送 POST 请求，形成 CSRF 攻击。在post请求的瞬间，cookie会被浏览器自动添加到请求头中。但token不同，token是开发者为了防范csrf而特别设计的令牌，浏览器不会自动添加到headers里，攻击者也无法访问用户的token，所以提交的表单无法通过服务器过滤，也就无法形成攻击。

<br>

# 分布式情况下的session和token

我们已经知道session时有状态的，一般存于服务器内存或硬盘中，当服务器采用分布式或集群时，session就会面对负载均衡问题。

- 负载均衡多服务器的情况，不好确认当前用户是否登录，因为多服务器不共享session。这个问题也可以将session存在一个服务器中来解决，但是就不能完全达到负载均衡的效果。当今的几种[解决session负载均衡](https://blog.51cto.com/zhibeiwang/1965018)的方法。

而token是无状态的，token字符串里就保存了所有的用户信息

- 客户端登陆传递信息给服务端，服务端收到后把用户信息加密（token）传给客户端，客户端将token存放于localStroage等容器中。客户端每次访问都传递token，服务端解密token，就知道这个用户是谁了。通过cpu加解密，服务端就不需要存储session占用存储空间，就很好的解决负载均衡多服务器的问题了。这个方法叫做[JWT(Json Web Token)](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)

<br>

# 总结

- session存储于服务器，可以理解为一个状态列表，拥有一个唯一识别符号sessionId，通常存放于cookie中。服务器收到cookie后解析出sessionId，再去session列表中查找，才能找到相应session。依赖cookie
- cookie类似一个令牌，装有sessionId，存储在客户端，浏览器通常会自动添加。
- token也类似一个令牌，无状态，用户信息都被加密到token中，服务器收到token后解密就可知道是哪个用户。需要开发者手动添加。
- jwt只是一个跨域认证的方案


参考
- [cookie,token验证的区别](https://www.jianshu.com/p/c33f5777c2eb)
- [有了cookie为什么需要session](https://segmentfault.com/q/1010000016504003)
- [CSRF Token的设计是否有其必要性](https://segmentfault.com/q/1010000000713614)
- [cookie,token,session三者的问题和解决方案](https://junyiseo.com/php/757.html)
- [负载均衡集群中的session解决方案](https://blog.51cto.com/zhibeiwang/1965018)
- [Json Web Token 入门教程](http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)