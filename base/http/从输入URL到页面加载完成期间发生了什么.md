- [从输入URL到页面加载完成期间经历了什么？（总览篇）](https://blog.csdn.net/didudidudu/article/details/80181505?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161466722716780262594752%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=161466722716780262594752&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-4-80181505.pc_search_result_hbase_insert&utm_term=%E4%BB%8E%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%BE%93%E5%85%A5URL%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88)
- [从输入URL到页面加载完成期间经历了什么？（细节篇--JS运行机制）](https://blog.csdn.net/didudidudu/article/details/80305284?spm=1001.2014.3001.5501)
- [从输入URL到页面加载发生了什么](https://blog.csdn.net/w372426096/article/details/82012229?ops_request_misc=&request_id=&biz_id=102&utm_term=%E4%BB%8E%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%BE%93%E5%85%A5URL%E5%88%B0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E8%BD%BD%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~sobaiduweb~default-0-82012229.pc_v2_rank_blog_default)
- [从输入URL开始建立前端知识体系](https://juejin.cn/post/6935232082482298911#comment)


## 浏览器输入URL后，依次涉及的协议

- DNS 服务：解析域名至对应的IP地址
- HTTP 协议：生成针对目标Web服务器的HTTP请求报文
- TCP 协议：将请求报文按序号分割成多个报文段
- IP 协议：搜索对方的地址，一边中转一边传送
- TCP 协议：按序号以原来的顺序重组请求报文请求的处理结果也同样利用TCP/IP协议向用户进行回传

![image](https://user-images.githubusercontent.com/74364990/110167848-4c16ec00-7e31-11eb-9c91-c7a10a9dcfd7.png)
