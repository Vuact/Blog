# 一、安装与启动

- Windows 用户向导：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- Linux 用户向导：https://docs.mongodb.com/manual/administration/install-on-linux/
- Mac 用户向导：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

以mac为例，

## 1、安装

由于mongodb不再开源，因而我们只能暂时使用社区版本，这里我们使用 `4.4`版本。

在终端输入
```sh
$ brew tap mongodb/brew
$ brew tap | grep mongodb
$ brew install mongodb-community@4.4  
```

## 2、配置

mongodb默认有自己的执行配置文件（/usr/local/etc/mongod.conf），但是在mac某些版本的系统下执行会出问题，所以我们采用自定义配置的方式。

（1）创建data文件
```sh
mkdir ~/data   
```

（2）此时路径为：/Users/XXXX/data， 给 data 设置读写权限
```sh
# 查看当前所系统在的username
$ whoami
->XXXX

# 设置权限
$ sudo chown baitianyu /Users/XXXX/data
```

（3）设置环境变量
```sh
$ vim ~/.bash_profile
```
在 `bash_profile` 中添加如下内容：
```sh
export MONGODB_HOME=/usr/local/Cellar/mongodb-community/4.4.3
export PATH=$PATH:$MONGODB_HOME/bin  #注意这个路径就是mongodb安装包的路径，不要写错了
```

保存后执行生效命令：
```sh
$ source ~/.bash_profile
```

## 3、启动

```sh
$ sudo mongod --dbpath=/Users/XXXX/data
```
这里的dbpath值是上面创建的data文件夹的路径。

<br>

# 二、MongoDB Compass

MongoDB Compass 是 mongoDB 的可视化工具。

下载地址：[Download](https://www.mongodb.com/try/download/compass)

我们在本地启动了个server, 预览地址`http://localhost:3000/`, 其中mongodb的默认访问端口为27017，接下来我们要使用这个例子的mongodb。

## 1、启用

（1）在终端执行：
```sh
$ sudo mongod --dbpath=/Users/XXXX/data
```

（2）New Connection：输入`mongodb://localhost:27017`，再点击 CONNECT 即可：

![](https://github.com/Vuact/Blog/blob/main/base/node/images/8C786D98F7E64A96D99003CADD265377.jpg?raw=true)

进去之后，就可以看到相关的信息

![](https://github.com/Vuact/Blog/blob/main/base/node/images/86D7151F-F4AF-441C-AB02-46F9C6D24286.png?raw=true)

## 1、使用

![](https://github.com/Vuact/Blog/blob/main/base/node/images/87498038A15699AB11718587DED63679.jpg?raw=true)

<br>

创建数据库:
![](https://github.com/Vuact/Blog/blob/main/base/node/images/QQ20210105-0.png?raw=true)

<br>

插入数据:





