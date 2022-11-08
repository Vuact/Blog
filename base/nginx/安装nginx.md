
### 1、安装
```shell
brew install nginx
```

### 2、启动nginx

```shell
# 进入对应版本的目录，这里我安装的是 1.19.4
cd /usr/local/Cellar/nginx/1.19.4/bin/

# 启动
./nginx
```

### 3、更便捷的启动nginx

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
