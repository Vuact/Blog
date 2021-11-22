以下git操作十分常见：
```sh
# 撤回commit提交
git reset --soft HEAD^

# 回滚已提交到本地仓库的记录
git reset <要回滚到的commitID>           # 回滚提交记录，但本地代码不回滚
git reset --hard <要回滚到的commitID>    # 回滚提交记录和本地代码
git reset --hard HEAD^    # 是向前回退版本，其中HEAD后面跟几个^就是往回退几个版本，如果回退100个版本，可以写成 HEAD~100
```

实际，上面的操作涉及到了git reset的三种模式：soft、mixed、hard

那这三种模式有什么区别呢？往下看

<br>

# 一、首先解释以下这三个相关的状态和概念：


![image](https://user-images.githubusercontent.com/74364990/142854218-1bbe3b1a-4431-4a57-8d2b-3ced8937a2d9.png)


- HEAD：可以描述为当前分支最后一个提交。即本地的信息中的当前版本。
- Stage/Index：在工作副本修改之后执行过git add操作的版本文件，可以commit了的。
- Working Copy：工作副本是你正在修改，但是没有执行任何git操作的文件。

<br>

总的来说：

- 代码修改，还没做任何操作的时候就是 Working Copy
- git add * 操作之后就是 Stage/Index，
- git commit 之后就是HEAD。
- 如果代码修改了之后进行git add 操作，然后git commit，那么所有三者(HEAD,INDEX(STAGING),WORKING COPY)都是相同的状态，内容相同。

<br>

# 二、reset

#### 1、soft（更改HEAD）（恢复git commit的操作）
软重置。本来origin的HEAD和本地的HEAD一样，如果你指定--soft参数，Git只是单纯的把本地HEAD更改到你指定的版本那么，整个过程中，就HEAD的定义发生了变化，其他像Working Copy 和Index都没有变化。该参数用于git commit后，又要恢复还没commit的场景，重新审查代码，然后再推上去。

```sh
# 撤回commit提交
git reset --soft HEAD^
```

#### 2、hard（更改三者）

--hard参数将会将会重置(HEAD,INDEX(STAGING),WORKING COPY)，强制一致。该参数用于在把工作副本改成一塌糊涂的时候，包括工作副本，一股脑恢复。有些就单纯修改文件，其中有些git add了，有些git commit了，通通不管，可以一个命令恢复。

```sh
# 本地仓库: 回滚提交记录和本地代码
git reset --hard <要回滚到的commitID>   
```

#### 3、mixed(default）（恢复git add的操作，包含恢复git commit的操作）

--mixed是reset的默认参数，也就是当你不指定任何参数时的参数。它将重置HEAD到另外一个commit,并且重置index以便和HEAD相匹配

```sh
# 本地仓库: 回滚提交记录，但本地代码不回滚
git reset <要回滚到的commitID>
```
