# 问题
本地装了nvm，nvm的default版本为14.15.0，但每次打开新终端窗口，仍是旧的node版本v8.9.0。

<img width="264" alt="image" src="https://user-images.githubusercontent.com/74364990/183333577-b141daa5-3460-4e07-8702-e3505bbc7ee9.png">

# 原因

系统文件先读取了default值，又被node的环境变量值覆盖

# 解决

### 一、检查PATH配置是否正确

1、查看npm全局包可执行文件路径：`npm -g bin`

<img width="275" alt="image" src="https://user-images.githubusercontent.com/74364990/183334502-0d52ea42-34fb-47bf-9dc2-4d6830ff2ad0.png">

2、查看PATH环境变量

```shell
echo $PATH
```

如果PATH里不包括第一步的路径 `/usr/local/bin`，说明环境变量没有配置好。

### 二、配置PATH

1、打开配置文件

```shell
vim ~/.bash_profile
```

<img width="501" alt="image" src="https://user-images.githubusercontent.com/74364990/183335083-7ed85cc0-864d-4741-8b96-789db74de1ba.png">

其中`MVM_DIR`代表nvm的环境变量配置。 `export PATH="/usr/local/bin:$PATH"`代表`HomeBrew的npm`的配置；

我们发现 `MVM_DIR` 在 `npm` 上面，说明`HomeBrew的npm环境变量 把 nvm的环境变量 给覆盖了`。我们只需将上面红框内容移到npm配置之下即可。

2、修改文件

<img width="490" alt="image" src="https://user-images.githubusercontent.com/74364990/183335748-669b28ca-1a8c-4177-aae5-7f36d468026a.png">
