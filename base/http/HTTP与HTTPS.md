# 一、HTTP

HTTP (HyperText Transfer Protocol)，即超文本运输协议，是实现网络通信的一种规范。

HTTP传输的数据并不是计算机底层中的二进制包，而是完整的、有意义的数据，如HTML 文件, 图片文件, 查询结果等超文本，能够被上层应用识别，所以说HTTP不安全。

存在问题：

- 通信使用明文（不加密），内容可能被窃听
- 不验证通信方的身份，因此有可能遭遇伪装

## HTTP 中间人攻击

HTTP 协议使用起来确实非常的方便，但是它存在一个致命的缺点：`不安全`。

我们知道 HTTP 协议中的报文都是以明文的方式进行传输，不做任何加密，这样会导致什么问题呢？下面来举个例子：

1、小明在 JAVA 贴吧发帖，内容为：`我爱JAVA`

![image](https://user-images.githubusercontent.com/74364990/174847063-bf6238de-eeb9-47c1-a807-1410dad7a8ac.png)

2、被中间人进行攻击，内容修改为：`我爱PHP`

![image](https://user-images.githubusercontent.com/74364990/174847167-42940751-916b-4573-a24e-70455f5733b7.png)

3、小明被群嘲(手动狗头)

可以看到在 HTTP 传输过程中，中间人能看到并且修改 HTTP 通讯中所有的请求和响应内容，所以使用 HTTP 是非常的不安全的。


## 防止中间人攻击

这个时候可能就有人想到了，既然内容是明文那我使用`对称加密`的方式将报文加密这样中间人不就看不到明文了吗，于是如下改造：

1、双方约定加密方式

![image](https://user-images.githubusercontent.com/74364990/174847838-2845055c-f3e8-4814-84cc-078ba65c1c4c.png)

2、使用 AES 加密报文

![image](https://user-images.githubusercontent.com/74364990/174847902-c0914452-af05-4fd5-bf49-19f77c0c9d1b.png)

这样看似中间人获取不到明文信息了，但其实在通讯过程中还是会以明文的方式暴露加密方式和秘钥，如果第一次通信被拦截到了，那么秘钥就会泄露给中间人，中间人仍然可以解密后续的通信：

![image](https://user-images.githubusercontent.com/74364990/174848003-a24438c7-c055-4183-ad8b-739eca9c5990.png)

那么对于这种情况，我们肯定就会考虑能不能将秘钥进行加密不让中间人看到呢？答案是有的，采用`非对称加密`，我们可以通过 RSA 算法来实现。

在约定加密方式的时候由服务器生成一对`公私钥`，服务器将`公钥`返回给客户端，客户端本地生成一串秘钥(`AES_KEY`)用于`对称加密`，并通过服务器发送的`公钥`进行加密得到(`AES_KEY_SECRET`)，之后返回给服务端，服务端通过`私钥`将客户端发送的`AES_KEY_SECRET`进行解密得到`AEK_KEY`,最后客户端和服务器通过`AEK_KEY`进行报文的加密通讯，改造如下：

![image](https://user-images.githubusercontent.com/74364990/174848381-1008abce-fc06-49a2-b4bb-041989d2cfa2.png)

可以看到这种情况下中间人是窃取不到用于`AES加密`的秘钥，所以对于后续的通讯是肯定无法进行解密了，那么这样做就是绝对安全了吗？

所谓道高一尺魔高一丈，中间人为了对应这种加密方法又想出了一个新的破解方案，既然拿不到`AES_KEY`，那我就把自己模拟成一个客户端和服务器端的结合体，`在用户->中间人`的过程中中间人模拟服务器的行为，这样可以拿到用户请求的明文，在`中间人->服务器`的过程中中间人模拟客户端行为，这样可以拿到服务器响应的明文，以此来进行中间人攻击：

![image](https://user-images.githubusercontent.com/74364990/174848744-c7cccefa-c181-488f-a15b-501540fdf44c.png)

这一次通信再次被中间人截获，中间人自己也伪造了一对公私钥，并将公钥发送给用户以此来窃取客户端生成的`AES_KEY`，在拿到`AES_KEY`之后就能轻松的进行解密了。

中间人这样为所欲为，就没有办法制裁下吗，当然有啊，接下来我们看看 HTTPS 是怎么解决通讯安全问题的。


<br><br>

# 二、HTTPS

`HTTPS`的出现正是解决上面`HTTP`的那些问题，`HTTPS`是建立在`SSL`之上，其安全性由`SSL`来保证

在采用`SSL`后，`HTTP`就拥有了`HTTPS`的加密、证书和完整性保护这些功能。

>SSL(Secure Sockets Layer 安全套接字协议),及其继任者传输层安全（Transport Layer Security，TLS）是为网络通信提供安全及数据完整性的一种安全协议

![image](https://user-images.githubusercontent.com/74364990/174455143-86ee142d-59fa-4b1f-bfb3-8e6fbe24bd26.png)

https://segmentfault.com/a/1190000023936425



# 三、HTTP 与 HTTPS的区别

![image](https://user-images.githubusercontent.com/74364990/174846397-f86ca6c8-cf54-474e-9c71-2b6319a1ad7a.png)
