
# 一、HTTP

- HTTP协议中的数据是利用TCP协议传输的
- HTTP是应用层协议，定义的是传输数据的内容的规范；

<br>

## HTTP报文

- 请求报文：

![image](https://user-images.githubusercontent.com/74364990/110167285-8207a080-7e30-11eb-8b0a-b18974d7fda6.png)

- 响应报文：

![image](https://user-images.githubusercontent.com/74364990/110167294-8633be00-7e30-11eb-9580-6e1ae7b60684.png)

<br>

## 浏览器输入URL后，依次涉及的协议

- DNS 服务：解析域名至对应的IP地址
- HTTP 协议：生成针对目标Web服务器的HTTP请求报文
- TCP 协议：将请求报文按序号分割成多个报文段
- IP 协议：搜索对方的地址，一边中转一边传送
- TCP 协议：按序号以原来的顺序重组请求报文请求的处理结果也同样利用TCP/IP协议向用户进行回传

![image](https://user-images.githubusercontent.com/74364990/110167848-4c16ec00-7e31-11eb-9c91-c7a10a9dcfd7.png)


<br>

# 二、HTTPS

在HTTP的基础上再加一层TLS（传输层安全性协议）或者SSL（安全套接层），就构成了HTTPS协议。

HTTPS 默认工作在 TCP 协议443端口，它的工作流程一般如以下方式：

（1）TCP 三次同步握手<br>
（2）客户端验证服务器数字证书<br>
（3）DH 算法协商对称加密算法的密钥、hash 算法的密钥<br>
（4）SSL 安全加密隧道协商完成<br>
（5）网页以加密的方式传输，用协商的对称加密算法和密钥加密，保证数据机密性；用协商的hash算法进行数据完整性保护，保证数据不被篡改。

![image](https://user-images.githubusercontent.com/74364990/110168388-16263780-7e32-11eb-8144-d0595e6c98cf.png)

- 客户端向服务端发送 `Client Hello` 消息，其中携带客户端支持的协议版本、加密算法、压缩算法以及客户端生成的随机数；
- 服务端收到客户端支持的协议版本、加密算法等信息后；
  - 向客户端发送 `Server Hello` 消息，并携带选择特定的协议版本、加密方法、会话 ID 以及服务端生成的随机数；
  - 向客户端发送 `Certificate` 消息，即服务端的证书链，其中包含证书支持的域名、发行方和有效期等信息；
  - 向客户端发送 `Server Key Exchange` 消息，传递公钥以及签名等信息；
  - 向客户端发送可选的消息 `Certificate Request`，验证客户端的证书；
  - 向客户端发送 `Server Hello Done` 消息，通知服务端已经发送了全部的相关信息；
- 客户端收到服务端的协议版本、加密方法、会话 ID 以及证书等信息后，验证服务端的证书；
  - 向服务端发送 `Client Key Exchange` 消息，包含使用服务端公钥加密后的随机字符串，即预主密钥（`Pre Master Secret`）；
  - 向服务端发送 `Change Cipher Spec` 消息，通知服务端后面的数据段会加密传输；
  - 向服务端发送 `Finished` 消息，其中包含加密后的握手信息；
- 服务端收到 `Change Cipher Spec` 和 `Finished` 消息后；
  - 向客户端发送 `Change Cipher Spec` 消息，通知客户端后面的数据段会加密传输；
  - 向客户端发送 `Finished` 消息，验证客户端的 `Finished` 消息并完成 TLS 握手；

TLS 握手的关键在于利用通信双发生成的随机字符串和服务端的证书公钥生成一个双方经过协商后的对称密钥，这样通信双方就可以使用这个对称密钥在后续的数据传输中加密消息数据，防止中间人的监听和攻击，保证通讯安全。

>HTTPS连接 需要7次握手，3次TCP + 4次TSL。
