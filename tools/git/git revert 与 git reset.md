git revert 撤销 某次操作，此次操作之前和之后的commit和history都会保留，并且把这次撤销
作为一次最新的提交

```sh
git revert HEAD                        # 撤销前一次 commit
git revert HEAD^                       # 撤销前前一次 commit
git revert commit <要回滚到的commitID>   #（比如：fa042ce57ebbe5bb9c8db709f719cec2c58ee7ff）撤销指定的版本，撤销也会作为一次提交进行保存。
```

git revert是提交一个新的版本，将需要revert的版本的内容再反向修改回去，
版本会递增，不影响之前提交的内容

<br>

Git代码回滚有两种方式：git reset 和 git revert

<br>

# 1、git reset

原理： git reset的作用是修改HEAD的位置，即将HEAD指向的位置改变为之前存在的某个版本，如下图所示，假设我们要回退到版本一：

![image](https://user-images.githubusercontent.com/74364990/142867063-780c0e28-188b-4755-8ee0-84e4a39b1148.png)

适用场景： 如果想恢复到之前某个提交的版本，且那个版本之后提交的版本我们都不要了，就可以用这种方法。

# 2、git revert

原理： git revert是用于“反做”某一个版本，以达到撤销该版本的修改的目的。比如，我们commit了三个版本（版本一、版本二、 版本三），突然发现版本二不行（如：有bug），想要撤销版本二，但又不想影响撤销版本三的提交，就可以用 git revert 命令来反做版本二，生成新的版本四，这个版本四里会保留版本三的东西，但撤销了版本二的东西。如下图所示：

![image](https://user-images.githubusercontent.com/74364990/142867214-ea12d35a-e489-4e91-8a13-9cd568cfd96b.png)

适用场景： 如果我们想撤销之前的某一版本，但是又想保留该目标版本后面的版本，记录下这整个版本变动流程，就可以用这种方法。
