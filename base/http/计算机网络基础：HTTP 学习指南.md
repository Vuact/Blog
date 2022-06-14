![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0zOGJkZGQ0Mjc5MjM4NTUxLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

# 一、储备知识
讲解HTPP协议前，先了解一些基础的计算机网络相关知识

## 1、计算机网络体系结构

- 定义: 计算机网络的各层 + 其协议的集合

- 作用: 定义该计算机网络的所能完成的功能

- 结构介绍: 计算机网络体系结构分为3种：`OSI`体系结构、`TCP / IP`体系结构、五层体系结构

>- OSI体系结构：概念清楚 & 理念完整，但复杂 & 不实用
>- `TCP / IP`体系结构：含了一系列构成互联网基础的网络协议，是Internet的核心协议 & 被广泛应用于局域网 和 广域网
>- 五层体系结构：融合了`OSI` 与 `TCP / IP`的体系结构，目的是为了学习 & 讲解计算机原理

<br>

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1iM2RlZGE3YzNmM2I5MmM2LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- `TCP / IP`的体系结构详细介绍

由于 `TCP / IP`体系结构较为广泛，故主要讲解

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS03M2Q3ZDU2YjFmNTRkOTQ1LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

## 2、HTTP 协议通信的基础模型

- `HTTP`协议传输信息的基础：`TCP/IP`协议模型

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS00OTJmMWNmMzk4MWNiMDc4LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- `HTTP`协议 属于 最高层的应用层

<br>

# 二、简介

下面，将简单介绍一下 `HTTP`

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1hNmM2ZTI0YjdiYjdiZmM3LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

# 三、工作方式

- `HTTP`协议采用 请求 / 响应 的工作方式

- 具体工作流程如下:

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0yOGU0MDIwZGQ2NDQxMWI0LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

# 四、HTTP报文详解

- `HTTP`在 应用层 交互数据的方式 = 报文

- `HTTP`的报文分为：请求报文 & 响应报文

>分别用于 发送请求 & 响应请求时

下面，将详细介绍这2种报文。

<br>

## 1、HTTP请求报文

### 1.1 报文结构

- `HTTP`的请求报文由 **请求行、请求头 & 请求体** 组成，如下图

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS03NmY2MjViNTRjMTAzOWJlLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 下面，将详细介绍每个组成部分

<br>

### 1.2 结构详细介绍

#### 组成1：请求行

- 作用: 声明 请求方法 、主机域名、资源路径 & 协议版本

- 结构: 请求行的组成 = 请求方法 + 请求路径 + 协议版本

>注：空格不能省

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1lZTIzYjE1M2Y2ZDY1NGM2LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 组成介绍

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0zMzJjY2RhNGViODYyNWJmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 此处特意说明`GET`、`POST`方法的区别：

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1hY2NlMmYyMzIzZmQyOGE2LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

**示例**

设 请求报文采用`GET`方法、 `URL`地址 = `http://www.tsinghua.edu.cn/chn/yxsz/index.htm`、`HTTP1.1`版本

则 请求行是：`GET /chn/yxsz/index.htm HTTP/1.1`

<br>

#### 组成2：请求头

- 作用：声明 客户端、服务器 / 报文的部分信息

- 使用方式：采用 **`header（字段名）：value（值）`** 的方式

- 常用请求头

**请求和响应报文的通用Header**

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0yNTRlYjVhN2RiM2QzZmU1LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)


**常见请求Header**

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0yMmYxMDdhZmQwODM5YzFhLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 举例：

(URL地址：http://www.tsinghua.edu.cn/chn/yxsz/index.htm）<br>
Host：www.tsinghua.edu.cn (表示主机域名）<br>
User - Agent：Mozilla/5.0 (表示用户代理是使用Netscape浏览器）<br>

<br>

#### 组成3：请求体

- 作用：存放 需发送给服务器的数据信息

>可选部分，如 `GET请求` 就无请求数据

- 使用方式：共3种

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS02YTM2MWNjNjk2MGViMTEzLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

至此，关于请求报文的请求行、请求头、请求体 均讲解完毕。

<br>

### 1.3 请求报文总结

- 关于 请求报文的总结如下

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS02M2UzOTA0ODFlOTJhZWJlLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 请求报文示例

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS04MDY2NTNkZDhjN2RmMGU3LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)


<br><br>


## 2、HTTP响应报文

### 2.1 报文结构

- `HTTP`的响应报文包括：状态行、响应头 & 响应体

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1lNzRlZjkxMTZhMWI1ZGY4LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 其中，响应头、响应体 与请求报文的请求头、请求体类似

- 这2种报文最大的不同在于 状态行 & 请求行

下面，将详细介绍每个组成部分

<br>

### 2.2 结构详细介绍

#### 组成1：状态行

- 作用：声明 协议版本，状态码，状态码描述

- 组成: 状态行有协议版本、状态码 &状态信息组成

>其中，空格不能省

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS04MzRlM2ExYjMxNmYyNjVjLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 具体介绍

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1iZDI3ZTczNjViMGIyODU1LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

- 状态行

示例: `HTTP/1.1 202 Accepted`(接受)、`HTTP/1.1 404 Not Found`(找不到)

<br>

#### 组成2：响应头 

- 作用：声明客户端、服务器 / 报文的部分信息

- 使用方式：采用**`header（字段名）：value（值）`**的方式

- 常用请求头

**请求和响应报文的通用Header**

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0yNTRlYjVhN2RiM2QzZmU1LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

**常见响应Header**

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1hOWYwYTIxMmM0ZWE3MmI5LnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

#### 组成3：响应体

- 作用：存放需返回给客户端的数据信息

- 使用方式：和请求体是一致的，同样分为：任意类型的数据交换格式、键值对形式和分部分形式

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS05ZTgyOWE5ZWRkYTljZWIwLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

### 2.3 响应报文总结

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS1jYzI0YTliOGVmZmNiZDQyLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

![](https://camo.githubusercontent.com/e452ec352be5d3e3154e6057be780c89e7df9b5ce7716d532e5f79df539ff9bd/68747470733a2f2f696d672d626c6f672e6373646e696d672e636e2f32303139303231363232333432313931322e6a7067)

![image](https://user-images.githubusercontent.com/74364990/109918250-9729e580-7cf1-11eb-8b21-b3cd02eff683.png)


<br><br>


## 3、总结

下面，简单总结两种报文结构

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS01N2FlYzU5OWNmZWYzZjBmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>


# 五、额外知识

下面将讲解一些关于HTTP的额外知识：

- `HTTP1.1` 与 `HTTP1.0` 的区别

- `HTTP` 与 `HTTPS`的区别

- `HTTP` 连接的处理

- `HTTP` 处理长连接的方式

## 1、HTTP1.1 与 HTTP1.0的区别

`Http1.1` 比 `Http1.0` 多了以下优点：

- 引入长连接，即 在同一个`TCP`的连接中可传送多个`HTTP`请求 & 响应

- 多个请求 & 响应可同时进行、可重叠

- 引入更加多的请求头 & 响应头

>如 与身份认证、状态管理 & `Cache`缓存等机制相关的、`HTTP1.0`无host字段

<br>

## 2、HTTP 与HTTPS的区别

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS04MjBmOTU1YWZkNTcxODVmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

## 3、HTTP连接的处理

串行处理事务时延: 

- 此种机制描述了http事务一个一个接着发起，不能同时下载更多的资源，使得界面上用户看不到东西，体验不够好。串行连接没有很好的利用tcp/ip连接的慢启动机制！

- 优化方法主要有：
	- 并行连接：通过多条TCP连接发起并发的HTTP连接
	- 长连接：重用TCP连接，以消除连接及关闭时延
	- 管道化连接：通过共享的TCP连接发起并发的HTTP请求

<br>

### 并行连接

浏览同时发起多个http事务，因为是并行的，所以时延也并行的，这样总时延较小，页面呈现更快，体验较好。但也不是总是这样，因为如果在网络速度很慢的时候，多个连接会去竞争本来不多的带宽，那么就谈不上加快速度了。还有就是并行连接也是需要付出代价的，比如增加系统内训消耗、服务器负载，比如有一个100客户端同时对服务发起100tcp并行连接的话，那么服务器就得负责10000个处理请求，很快的你的服务器就会爆掉。当然了，并行连接确实能带来视觉上的速度提升，因为相比于串行连接慢慢地显示数据而并行一下子能全部显示完信息，视觉上并行连接会给人速度更快的感觉！


### 长连接

长连接描述的是：如果对同ip、同端口的发起多个http事务连接，那么可以在前一个事务处理完成之后不要关闭tcp连接，以此来减小建立tcp、tcp慢启动所带来的时延。也叫持久链接。

![image](https://user-images.githubusercontent.com/74364990/173563201-cebc6100-589e-45d4-a56e-ce419da6c931.png)

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0xYWU4Yzk1YWNiYjFiMzY0LmpwZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

### 管道化连接

在`长连接的基础上`，HTTP1.1进一步地支持在持久连接上`使用管道化（pipelining）特性`，这是`相对于keep-alive连接的又一性能优化`。在相应到达之前，可以将多条请求放入队列，当第一条请求发往服务器的时候，第二第三条请求也可以开始发送了，不用等到第一条请求响应回来，在高延时网络条件下，这样做可以降低网络的环回时间，提高性能。

>务必读完：[HTTP详解长短连接，管道化，队头阻塞及它们之间的关系](https://blog.csdn.net/fesfsefgs/article/details/108294050)


**非管道化与管道化的区别示意：**

![image](https://user-images.githubusercontent.com/74364990/173564080-fa6c7a7b-1226-49e7-97bc-2f4e9d074ac7.png)


<br>

## 4、http2中的多路复用和http1.1中的keep-alive有什么区别？

![image](https://user-images.githubusercontent.com/74364990/173565509-34493d2e-d5e7-4153-ba96-3fc919cd8a5b.png)

共同点： 都可以复用同一条TCP通道

区别：
keep-alive ：有顺序，有阻塞的请求
1.请求 a.html
2.响应 a.html
3.请求 b.css
4.响应 b.css

https多路复用：并发请求，非阻塞的

详细描述：
keep-alive虽然可以复用同一条TCP通道，但必须等到服务端响应了前一次请求，才能发起第二次请求 -> 阻塞。 按顺序发送请求，按顺序接收请求，这样接收端才不会乱掉。从HTTP/1.1起，默认都开启了Keep-Alive，保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接，Keep-Alive不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间

```
Connection: Keep-Alive
Keep-Alive: max=5, timeout=120
```

http2 的多路复用可以在一条TCP通道同时发送多个请求，不一定要按照顺序，非阻塞的，先响应先回来，响应式时也不用等上一个请求先响应，这些请求都有唯一标识，所以可以无序。

