
## 执行上下文
------------------
- [深入JavaScript 执行上下文(一)：作用域](https://blog.csdn.net/b954960630/article/details/83932313)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://blog.csdn.net/b954960630/article/details/83932469)
- [深入JavaScript 执行上下文(三)：变量对象](https://blog.csdn.net/b954960630/article/details/83998358)
- [深入JavaScript 执行上下文(四)：作用域链](https://blog.csdn.net/b954960630/article/details/83932775)
- [深入JavaScript 执行上下文(五)：整个过程](https://blog.csdn.net/b954960630/article/details/83933032)


---
现在加上this, 来详细的解析执行上下文栈和执行上下文的具体变化过程~ 整个过一遍。

以下面例子为例：
```
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```
执行过程如下：

（1）执行js程序，创建全局执行上下文，全局上下文被压入执行上下文栈
```
  ECStack = [
      globalContext
  ];
```
（2）全局上下文初始化

    globalContext = {
        VO: [global],
        Scope: [globalContext.VO],
        this: globalContext.VO
    }
（3）在(2)初始化的同时，checkscope 函数被创建，保存作用域链到函数的内部属性[[scope]]

    checkscope.[[scope]] = [
      globalContext.VO
    ];
（4）执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈

    ECStack = [
        checkscopeContext,
        globalContext
    ];
（5）checkscope 函数执行上下文初始化：

- 复制函数 [[scope]] 属性创建作用域链，
- 用 arguments 创建活动对象，
- 初始化活动对象，即加入形参、函数声明、变量声明，
- 将活动对象压入 checkscope 作用域链顶端。

 同时 f 函数被创建，保存作用域链到 f 函数的内部属性[[scope]]


```
    checkscopeContext = {
        AO: {
            arguments: {
                length: 0
            },
            scope: undefined,
            f: reference to function f(){}
        },
        Scope: [AO, globalContext.VO],
        this: undefined
    }
```

（6）执行 f 函数，创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈

    ECStack = [
        fContext,
        checkscopeContext,
        globalContext
    ];
（7）f 函数执行上下文初始化, 以下跟第 4 步相同：

复制函数 [[scope]] 属性创建作用域链
用 arguments 创建活动对象
初始化活动对象，即加入形参、函数声明、变量声明
将活动对象压入 f 作用域链顶端

```
    fContext = {
        AO: {
            arguments: {
                length: 0
            }
        },
        Scope: [AO, checkscopeContext.AO, globalContext.VO],
        this: undefined
    }
```

（8）f 函数执行，沿着作用域链查找 scope 值，返回 scope 值

（9）f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

    ECStack = [
        checkscopeContext,
        globalContext
    ];
（10）checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

    ECStack = [
        globalContext
    ];
