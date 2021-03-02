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

<br><br>


## 3、总结

下面，简单总结两种报文结构

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS01N2FlYzU5OWNmZWYzZjBmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>


# 五、额外知识

下面将讲解一些关于HTTP的额外知识：

- `HTTP1.1` 与 `HTTP1.0` 的区别

- `HTTP` 与 `HTTPS`的区别

- `HTTP` 处理长连接的方式

## 1、HTTP1.1 与 HTTP1.0的区别

`Http1.1` 比 `Http1.0` 多了以下优点：

- 引入持久连接，即 在同一个`TCP`的连接中可传送多个`HTTP`请求 & 响应

- 多个请求 & 响应可同时进行、可重叠

- 引入更加多的请求头 & 响应头

>如 与身份认证、状态管理 & `Cache`缓存等机制相关的、`HTTP1.0`无host字段

<br>

## 2、HTTP 与HTTPS的区别

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS04MjBmOTU1YWZkNTcxODVmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)

<br>

## 3、HTTP处理长连接的方式

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS0xYWU4Yzk1YWNiYjFiMzY0LmpwZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)