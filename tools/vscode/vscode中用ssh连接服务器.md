1、在官网（https://code.visualstudio.com/）下载vscode。

2、在vscode 的应用商店中搜索扩展插件并安装。
- remote-ssh
- chinese(Simplified) Language

3、重启vscode，加载中文语言包。

4、配置config文件

- Ctrl + Shift + p，选择 `Remote-SSH: Open Configuration File...`
- 选择 config 配置文件，如`/Users/baitianyu/.ssh/config`
- 配置.ssh/config

```sh
Host myServer # 设置ssh host缩写
    Hostname 47.***.***.10 # 服务器ip
    User root # 服务器用户名
    Port 22 # 服务器端口
    IdentityFile ~/.ssh/id_rsa # 密钥
    # 注意：可以添加多个服务器
```

![](https://github.com/Vuact/document/blob/main/tools/images/QQ20201228-0.jpg?raw=true)

5、默认情况下，vscode 是不支持输入目标机密码的。可以通过在settings中配置，允许用户输入密码登录目标机。

![](https://github.com/Vuact/document/blob/main/tools/images/image007.png?raw=true)

在settins.json文件的json中，新增如下两行即可。

```json
 "remote.SSH.showLoginTerminal": true,
 "remote.SSH.useLocalServer": false,
```


6、在vscode终端使用：

```js
//连接机器
ssh [Host值，eg: myServer]

//退出机器
exit
```
