- [深入JavaScript 执行上下文(一)：作用域](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%80)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F.md)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%8C)%EF%BC%9A%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%88.md)
- [深入JavaScript 执行上下文(三)：变量对象](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%89)%EF%BC%9A%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1.md)
- [深入JavaScript 执行上下文(四)：作用域链](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E5%9B%9B)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE.md)
- [深入JavaScript 执行上下文(五)：整个过程](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%94)%EF%BC%9A%E6%95%B4%E4%B8%AA%E8%BF%87%E7%A8%8B.md)

# 作用域链
----------------------

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181110195914704.png)



-------
当要查找某变量的时候，会先从`当前上下文`的`变量对象`中查找，如果没有找到，就会从`父级`(词法层面上的父级)执行上下文的变量对象中查找，一直找到全局上下文的变量对象，也就是全局对象。这样`由多个执行上下文的变量对象构成的链表就叫做作用域链`。

下面，让我们以一个函数的创建和激活两个时期来讲解作用域链是如何创建和变化的。

## 1、函数创建
js函数的作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性` [[scope]]`，
- ` [[scope]]`: 当`函数创建的时候，就会保存所有父变量对象到其中`，你可以理解 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！

举个例子：

```javascript
function foo() {
    function bar() {
        ...
    }
}
```
函数创建时，各自的[[scope]]为：

```javascript
foo.[[scope]] = [
  globalContext.VO			//全局环境的变量对象
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```

## 2、函数激活
当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端。

这时候执行上下文的作用域链，我们命名为 Scope：

```javascript
Scope = [AO].concat([[Scope]]);
```

至此，作用域链创建完毕。

## 3、结合前面几篇来一遍
- [深入JavaScript 执行上下文(一)：作用域](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%80)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F.md)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%8C)%EF%BC%9A%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%88.md)
- [深入JavaScript 执行上下文(三)：变量对象](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%89)%EF%BC%9A%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1.md)

以下面的例子为例，结合着之前讲的变量对象 和 执行上下文栈，我们来总结一下函数执行上下文中作用域链和变量对象的创建过程：

```javascript
var scope = "global scope";
function checkscope(){
    var scope2 = 'local scope';
    return scope2;
}
checkscope();
```
执行过程如下：

**（0）**
执行全局代码，创建全局上下文，并将其压入执行上下文栈中；

```javascript
ECStack = [
    globalContext
];
```
**（1）**
全局上下文初始化
```javascript
globalContext = {
    VO: [global],
    Scope: [globalContext.VO],
}
```

**（2）**
在(1)初始化的同时，checkscope 函数被创建，保存作用域链到 函数内部属性[[scope]]


```javascript
checkscope.[[scope]] = [
    globalContext.VO
]; 
```
**（3）**
执行 checkscope 函数，创建 checkscope 函数执行上下文，并将其压入执行上下文栈中；

```javascript
ECStack = [
    checkscopeContext,
    globalContext
];
```
**（4）**
checkscope 函数并不立刻执行，开始做准备工作，即
###### `checkscope 函数执行上下文`初始化：
**第一步：** 
复制函数[[scope]]属性创建作用域链

```javascript
checkscopeContext = {
    Scope: checkscope.[[scope]],      
}
 //此时：checkscope.[[scope]] = [ globalContext.VO];
```
**第二步：** 
用 arguments 创建活动对象，随后初始化活动对象，加入形参、函数声明、变量声明

```javascript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    }，
    Scope: checkscope.[[scope]],
}
```
**第三步：** 
将活动对象压入 checkscope 作用域链顶端
Scope = [AO].concat([[Scope]]);

```javascript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: undefined
    },
    Scope: [AO, [[Scope]]]
}
```
**（5）**
准备工作做完，`开始执行函数`，随着函数的执行，修改 AO 的属性值

```javascript
checkscopeContext = {
    AO: {
        arguments: {
            length: 0
        },
        scope2: 'local scope'
    },
    Scope: [AO, [[Scope]]]
}
```
**（6）**
查找到 scope2 的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出

```javascript
ECStack = [
    globalContext
];
```

