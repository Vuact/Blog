
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
