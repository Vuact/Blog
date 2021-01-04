# 一、安装与启动

- Windows 用户向导：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- Linux 用户向导：https://docs.mongodb.com/manual/administration/install-on-linux/
- Mac 用户向导：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

以mac为例，

<br>

## 1、安装mongodb

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

## 3、启动mongodb

```sh
$ sudo mongod --dbpath=/Users/XXXX/data
```
这里的dbpath值是上面创建的data文件夹的路径。

<br>

# 二、Robomongo 和 Mongochef

## 1、Robomongo

[Robomongo](https://robomongo.org/) 是一个基于 Shell 的跨平台开源 MongoDB 可视化管理工具，支持 Windows、Linux 和 Mac，嵌入了 JavaScript 引擎和 MongoDB mongo，只要你会使用 mongo shell，你就会使用 Robomongo，它还提供了语法高亮、自动补全、差别视图等。

[Robomongo 下载地址](https://robomongo.org/download)

下载并安装成功后点击左上角的 `Create` 创建一个连接，给该连接起个名字如: `localhost`，使用默认地址（localhost）和端口（27017）即可，点击 `Save` 保存。

![](https://github.com/nswbmw/N-blog/blob/master/book/img/1.2.1.png)


双击 `localhost` 连接到 MongoDB 并进入交互界面，尝试插入一条数据并查询出来，如下所示:

![](https://github.com/nswbmw/N-blog/blob/master/book/img/1.2.2.png)


## 2、MongoChef

[MongoChef](http://3t.io/mongochef/) 是另一款强大的 MongoDB 可视化管理工具，支持 Windows、Linux 和 Mac。

[MongoChef 下载地址](http://3t.io/mongochef/#mongochef-download-compare)，我们选择左侧的非商业用途的免费版下载。

![](https://github.com/nswbmw/N-blog/raw/master/book/img/1.2.3.png)

安装成功后跟 Robomongo 一样，也需要创建一个新的连接的配置，成功后双击进入到 MongoChef 主页面，如下所示:

![](https://github.com/nswbmw/N-blog/raw/master/book/img/1.2.4.png)

还可以使用 shell 模式:

![](https://github.com/nswbmw/N-blog/raw/master/book/img/1.2.5.png)

> 小提示: MongoChef 相较于 Robomongo 更强大一些，但 Robomongo 比较轻量也能满足大部分的常规需求，所以哪一个适合自己还需读者自行尝试。


