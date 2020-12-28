1、在官网（https://code.visualstudio.com/）下载vscode。

2、在vscode 的应用商店中搜索扩展插件并安装。
- remote-ssh
- chinese(Simplified) Language

3、重启vscode，加载中文语言包。

4、配置config文件

- Ctrl + Shift + p，选择 `Remote-SSH: Open Configuration File...`
- 选择 config 配置文件，如`/Users/baitianyu/.ssh/config`
- 配置.ssh/config

![]()

```js
Host myServer # 设置ssh host缩写
    Hostname 47.***.***.10 # 服务器ip
    User root # 服务器用户名
    Port 22 # 服务器端口
    IdentityFile ~/.ssh/id_rsa # 密钥
    # 注意：可以添加多个服务器
```
