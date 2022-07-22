以下git操作十分常见：
```sh
# 回滚已提交到本地仓库的记录
git reset <要回滚到的commitID>           # 回滚提交记录，但本地代码不回滚
git reset --hard <要回滚到的commitID>    # 回滚提交记录和本地代码
git reset --hard HEAD^    # 是向前回退版本，其中HEAD后面跟几个^就是往回退几个版本，如果回退100个版本，可以写成 HEAD~100

# 撤回commit提交
git reset --soft HEAD^

# 撤回到 git commit + git add 前的状态
git reset HEAD^

# 撤回到 git commit + git add + 文件修改 前的状态
git reset --hard
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

#### 3、mixed(default）（撤回到 git commit + git add 前的状态）

--mixed是reset的默认参数，也就是当你不指定任何参数时的参数。它将重置HEAD到另外一个commit,并且重置index以便和HEAD相匹配

```sh
# 撤回到 git commit + git add 前的状态
git reset HEAD^
```

# 三、实际操作

首先在一个版本库中修改追踪文件，然后提交，description叫做 `add button`

![image](https://user-images.githubusercontent.com/74364990/142858522-9c1544fb-16da-4b7b-8aaa-72cff7091c88.png)

使用`git log` 查看历史提交

![image](https://user-images.githubusercontent.com/74364990/142858566-c835ffa4-b34a-49b6-9d83-4150539c4d0d.png)

copy记录`add button` 的前一次提交 add label 的哈希ID: “`7c5a658fbceb904ad877c4254d183e68aed1ddd0`”，作为我们reset的给定提交。

git stauts 查看一下当前版本库中文件状态

![image](https://user-images.githubusercontent.com/74364990/142858651-eb031cb0-d400-4b87-9792-2de48dc4e362.png)

显示nothing to commit ，在`add button` 提交后未对版本库中文件做修改

执行`git reset --soft 7c5a658fbceb904ad877c4254d183e68aed1ddd0` 命令，然后使用 `git status` 查看文件状态。

>这里执行：`git reset --soft 7c5a658fbceb904ad877c4254d183e68aed1ddd0`等价于执行 `git reset --soft HEAD^`

![image](https://user-images.githubusercontent.com/74364990/142858799-40b83b2c-3e4b-4b6e-8584-6246d266a712.png)

然后再使用git log 查看历史提交记录

![image](https://user-images.githubusercontent.com/74364990/142858907-fa524f94-0cd4-466f-a4aa-cf665709976f.png)

会发现add button 已经没有了，版本库已经回滚到add label提交的状态了，但是在我们add button 提交修改的文件 里面修改的内容没有丢失，只是回到了未提交的状态。

将文件再次提交，同样取名`add button` ，继续`git reset --mixed` 操作。

![image](https://user-images.githubusercontent.com/74364990/142859023-59214e91-0238-4d9e-bf14-a13205db6187.png)

同样是回滚到了add button 之前的add label 提交即直接 撤回到了 git commit + git add 前的状态。

将文件再次提交，同样取名add button ，继续进行`git reset --hard` 操作。

![image](https://user-images.githubusercontent.com/74364990/142859093-8b7b487c-9a48-4914-aac4-6424d89d79a0.png)

执行完git reset --hard 命令后，使用git status 查看文件状态，回滚到add label 提交，add button被修改的文件内容已经没有了，丢失了。版本库中的文件已经完全回到刚提交完add label时的状态。

git reset 根据需要使用不同的命令，使用 --hard时一定考虑回滚后文件的丢失！

>注意：reset会清掉指定commitID后的所有提交log，已提交远端的记录回滚禁用reset!!!!!!

