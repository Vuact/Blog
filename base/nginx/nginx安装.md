
## 一、安装
```shell
brew install nginx
```

## 二、启动Nginx

```shell
# 进入对应版本的目录，这里我安装的是 1.19.4
cd /usr/local/Cellar/nginx/1.19.4/bin/

# 启动
./nginx
```

## 三、更便捷的启动Nginx

### 1、本地启动

现在nginx已经安装完成，但是每次启动nginx都要cd到 “/usr/local/Cellar/nginx/1.19.4/bin/” 不太友好，所以需要`配置环境变量`

终端内执行：

```shell
sudo vim /etc/profile
```

在文件底部添加一行

```shell
export PATH=$PATH:/usr/local/Cellar/nginx/1.19.4/bin
```
保存并退出编辑，然后再执行以下命令，可以使文件的改动生效

```shell
source /etc/profile
```

现在启动等nginx操作只需要：
```shell
nginx # 启动nginx
nginx -s stop   # 停止nginx
nginx -s reload # 重新加载nginx
```

### 2、服务器启动

由于我们可能有大量服务器，一个个去改环境变量不现实，为了方便统一管理，我们采用 `service` 命令 来启动 nginx

service命令其实是去 `/etc/init.d` 目录下去执行对应脚本；这些脚本都需要我们自己编写，比如：

 ```shell
# 重启nginx
service nginx reload 

# 启动redis脚本 (等价于执行：/etc/init.d/redis start)
service redis start

# 开机自启动等
update-rc.d redis defaults
 ```
 
 >既然service命令就是去 `/etc/init.d` 目录下去执行对应脚本，所以我们只需新建一个service项目 批量统一复制到各个机器的对应目录下，就可实现统一管理

