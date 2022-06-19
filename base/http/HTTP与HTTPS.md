# 简介

## HTTP

HTTP (HyperText Transfer Protocol)，即超文本运输协议，是实现网络通信的一种规范。

HTTP传输的数据并不是计算机底层中的二进制包，而是完整的、有意义的数据，如HTML 文件, 图片文件, 查询结果等超文本，能够被上层应用识别，所以说HTTP不安全。

存在问题：

- 通信使用明文（不加密），内容可能被窃听
- 不验证通信方的身份，因此有可能遭遇伪装

## HTTPS

`HTTPS`的出现正是解决上面`HTTP`的那些问题，`HTTPS`是建立在`SSL`之上，其安全性由`SSL`来保证

在采用`SSL`后，`HTTP`就拥有了`HTTPS`的加密、证书和完整性保护这些功能。

>SSL(Secure Sockets Layer 安全套接字协议),及其继任者传输层安全（Transport Layer Security，TLS）是为网络通信提供安全及数据完整性的一种安全协议

![image](https://user-images.githubusercontent.com/74364990/174455143-86ee142d-59fa-4b1f-bfb3-8e6fbe24bd26.png)

https://segmentfault.com/a/1190000023936425



# HTTP 与HTTPS的区别

![](https://imgconvert.csdnimg.cn/aHR0cDovL3VwbG9hZC1pbWFnZXMuamlhbnNodS5pby91cGxvYWRfaW1hZ2VzLzk0NDM2NS04MjBmOTU1YWZkNTcxODVmLnBuZz9pbWFnZU1vZ3IyL2F1dG8tb3JpZW50L3N0cmlwJTdDaW1hZ2VWaWV3Mi8yL3cvMTI0MA)
