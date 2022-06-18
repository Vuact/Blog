
# 一、HTTP1.0

`HTTP 1.0` 浏览器与服务器只保持短暂的连接，每次请求都需要与服务器建立一个`TCP`连接，服务器完成请求处理后立即断开`TCP`连接。

简单来讲，`HTTP 1.0`是串行连接，即：每次与服务器交互，都需要新开一个连接。

![image](https://user-images.githubusercontent.com/74364990/174445021-09fee91c-27ae-416e-825f-13ba3ec75bc9.png)


# 二、HTTP1.1

## 1、并行连接

`HTTP 1.1`新增并行连接，即：通过多条TCP连接发起`并发的HTTP连接`。

浏览同时发起多个http事务，因为是并行的，所以时延也并行的，这样总时延较小，页面呈现更快，体验较好。但也不是总是这样，因为如果在网络速度很慢的时候，多个连接会去竞争本来不多的带宽，那么就谈不上加快速度了。还有就是并行连接也是需要付出代价的，比如增加系统内训消耗、服务器负载，比如有一个100客户端同时对服务发起100tcp并行连接的话，那么服务器就得负责10000个处理请求，很快的你的服务器就会爆掉。当然了，并行连接确实能带来视觉上的速度提升，因为相比于串行连接慢慢地显示数据而并行一下子能全部显示完信息，视觉上并行连接会给人速度更快的感觉！

## 2、长连接

长连接，也叫`持久链接`。

HTTP 1.1中，默认支持长连接（`Connection: keep-alive`），即在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟

长连接描述的是：如果对`同ip、同端口`的发起多个http事务连接，那么可以在前一个事务处理完成之后不要关闭tcp连接，以此来减小建立tcp、tcp慢启动所带来的时延。

![image](https://user-images.githubusercontent.com/74364990/174446055-b244c179-08bf-4fe0-a88f-267e34e252c3.png)

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0xYWU4Yzk1YWNiYjFiMzY0LmpwZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

## 3、管道化连接

在`长连接的基础上`，`HTTP 1.1`进一步地支持在持久连接上`使用管道化（pipelining）特性`，这是`相对于keep-alive连接的又一性能优化`。在相应到达之前，可以将多条请求放入队列，当第一条请求发往服务器的时候，第二第三条请求也可以开始发送了，不用等到第一条请求响应回来，在高延时网络条件下，这样做可以降低网络的环回时间，提高性能。

>务必读完：[HTTP详解长短连接，管道化，队头阻塞及它们之间的关系](https://blog.csdn.net/fesfsefgs/article/details/108294050)


**非管道化与管道化的区别示意：**

![image](https://user-images.githubusercontent.com/74364990/173564080-fa6c7a7b-1226-49e7-97bc-2f4e9d074ac7.png)


<br>


# 三、HTTP2.0
