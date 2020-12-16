>以下安装针对mac

<br>

# 一、安装brew

```js
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
之后使用指令 `brew install XXX` 来安装各种软件。


这里再说个小技巧，如果我们想查看某类包有哪些指令，可以用mac里自带的脚本cheat.sh，用curl执行：
```js
curl cheat.sh/brew   //查看brew有哪些指令
curl cheat.sh/npm    //查看npm有哪些指令
```
至于curl存在于系统中的哪？执行`which curl`即可知道

<br>

# 二、安装nvm

node版本管理nvm（Node Version Manager），用来管理切换node版本。

使用brew安装nvm:
```js
brew update
brew install nvm
```
安装完后用`nvm`指令检验是否安装成功。

使用：
```js
nvm ls
nvm use <version> 
nvm install <version>  //安装指定版本
nvm uninstall <version>
```

<br>

# 三、安装node和npm

用nvm安装指定版本node,

例如安装并使用10.15.0版本的node：
```js
nvm install 10.15.0
nvm use 10.15.0
```

<br>


# 二、npm与cnpm

### 1、npm

```js

```


### 2、cnpm
国内使用 npm 速度很慢，你可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm:

```js
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
sudo npm config set registry https://registry.npm.taobao.org
```
这样就可以使用 cnpm 命令来安装模块了：

```js
cnpm install [name]
```

<br>



<br>


