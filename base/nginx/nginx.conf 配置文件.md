只有涉及到 nginx 配置就找 `nginx.conf` 文件即可，其中的 include 即其他配置的位置

不同的操作系统其位置会有区别：

- MacOs：/usr/local/etc/nginx/nginx.conf
- Linux：/usr/local/nginx/conf/nginx.conf


<br><br>

# nginx.conf 的主体结构

我们将 nginx.conf 精简了下，内容如下：

```nginx
#user  nobody;
worker_processes  4;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
}
```

根据上述文件，我们可以很明显的将 nginx.conf 配置文件分为三部分：

- 全局块
- events 块
- http 块

# 一、全局块

全局块：从配置文件开始到 events 块之间的内容。主要会设置一些`影响nginx`服务器`整体运行的配置`指令。

主要包括配置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数，进程 PID 存放路径、日志存放路径和类型以及配置文件的引入等。

比如上面第一行配置的：

```nginx
# 这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的并发处理量也越多，但是会受到硬件、软件等设备的制约
worker_processes  4;
```

# 二、events 块

events块：涉及的指令主要影响 Nginx 服务器与用户的网络连接

常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。

比如上面的配置：

```nginx
# 表示每个 `worker_processes` 支持的最大连接数为 1024
events {
    worker_connections  1024;
}
```

# 三、http 块

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;


    sendfile        on;

    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

这算是 Nginx 服务器配置中最频繁的部分，`代理`、`缓存`和`日志定义`等绝大多数功能和第三方模块的配置都在这里。

http 块也可以包括 ：
- http全局块：包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接请求数上限等
- N个server块：这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了节省互联网服务器硬件成本；每个 server块 就相当于一个虚拟主机

每个 server 块也分为
- 全局`server块`：最常见的配置是本虚拟机主机的监听配置和本虚拟主机的名称或IP配置。
- N个`locaton块`：特定的请求进行处理。地址定向、数据缓存和应答控制等




