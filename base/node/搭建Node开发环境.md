>以下安装针对mac

# 1、安装nvm 和 node

### （1）安装nvm
node版本管理nvm（Node Version Manager），用来管理切换node版本。

```js
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
```
安装完后用`nvm`指令检验是否安装成功。

使用：
```js
nvm ls
nvm use <version> 
nvm install <version>  //安装指定版本
nvm uninstall <version>
```

### (2) 用nvm安装指定版本node

例如安装并使用10.15.0版本的node

```js
nvm install 10.15.0
nvm use 10.15.0
```

<br>

# 2、
