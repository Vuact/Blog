http请求做为影响前端性能极为重要的一环，因为请求受网络影响很大，如果网络很慢的情况下,页面很可能会空白很久。对于首次进入网站的用户可能要通过优化接口性能和接口数量来解决。但是，对于重复进入页面的用户，除了浏览器缓存，http缓存可以很大程度对已经加载过的页面进行优化。

<br>

# 1、缓存位置

![image](https://user-images.githubusercontent.com/74364990/110163134-a2ccf780-7e2a-11eb-9144-88748879864e.png)


从缓存位置上来看，分为4种，从上往下依次检查是否命中，如果但都没有命中则重新发起请求。

- **Service Worker** 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 `Service Worker`的话，传输协议必须为 HTTPS，因为 `Service Worker` 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。`Service Worker` 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

- **Memory Cache** 也就是内存中的缓存，主要包含的是当前中页面中已经抓取到的资源,例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快,内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。<br>
内存缓存中有一块重要的缓存资源是preloader相关指令（例如<link rel="prefetch">）下载的资源。它可以一边解析js/css文件，一边网络请求下一个资源。

- **Disk Cache** 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。<br>
绝大部分的缓存都来自Disk Cache，在HTTP 的协议头中设置。

- **Push Cache**（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。

![image](https://user-images.githubusercontent.com/74364990/110166867-e83ff380-7e2f-11eb-8df0-45e4f9ab7184.png)


<br>

# 2、用户操作对缓存的影响

![image](https://user-images.githubusercontent.com/74364990/110166250-0bb66e80-7e2f-11eb-9726-d81644bb528d.png)

![image](https://user-images.githubusercontent.com/74364990/110166262-107b2280-7e2f-11eb-803a-0a167c3a1bc1.png)

![image](https://user-images.githubusercontent.com/74364990/110166349-2b4d9700-7e2f-11eb-9865-747269dc013c.png)

