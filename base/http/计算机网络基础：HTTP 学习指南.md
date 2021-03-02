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
