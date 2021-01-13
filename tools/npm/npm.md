# init



```javascript
npm init  //初始化package.json 文件
npm init --yes //偷懒免去一直按enter
```



# install  / uninstall


依赖管理是 npm 的核心功能，原理就是执行 `npm install` 从 package.json 中的 dependencies, devDependencies 将依赖包安装到当前目录的 ./node_modules 文件夹中。

```javascript
npm install / npm uninstall
npm i  / npm uninstall i

//全局安装
npm install XXXXX -g
npm i XXXXX -g

//写入到 package.json的dependencies 对象
npm install XXXXX --save 
npm i XXXXX -S

// 写入到 package.json的devDependencies 对象
npm install XXXXX --save-dev
npm i XXXXX -D
```

> package.json 文件里面的 devDependencies 和 dependencies 对象的区别：devDependencies 里面的插件只用于开发环境，不用于生产环境，而 dependencies 是需要发布到生产环境的。



# opt flag

| flag                          | description                                                  |
| :---------------------------- | :----------------------------------------------------------- |
| `--global`、`-g`              | 全局安装包，一般来说需要管理员权限                           |
| `--save`、`-S`、`--save-prod` | 对应`dependencies`,  用于开发环境                            |
| `--save-dev`、`-D`            | 对应`devDependencies`, 用于生产环境                          |
| `--save-optional`、`-O`       | 对应`optionalDependencies`，在安装时可以通过指定`--no-optional`来忽略该模块下的依赖 |
| `--no-save`                   | 不将依赖写进`package.json`                                   |
| `--save-exact`、`-E`          | 安装精准的某个版本，在版本号处不会添加`^`之类的标识          |
| `--unsafe-perm=true`          | npm 以 root 用户运行时会自动转成一个叫 nobody (几乎没有任何权限)的用户来运行。加其避免。 |

eg:

```
npm install -g XXXXX --no-optional --unsafe-perm=true --registry=XXX

npm i -g XXXXX --no-optional --unsafe-perm=true --registry=XXX
```



# update


```javascript
//更新已安装模块
npm update <packageName>
```



# registry


```powershell
npm set registry XXXXX
```



# npm run

```javascript
npm run XX //XX为 package.json 文件scripts对象的属性名
```



> 原理详解：
>
> https://juejin.im/post/5ab3f77df265da2392364341
>
> https://www.ruanyifeng.com/blog/2016/01/npm-install.html
