- [深入JavaScript 执行上下文(一)：作用域](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%80)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F.md)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%8C)%EF%BC%9A%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%88.md)
- [深入JavaScript 执行上下文(三)：变量对象](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%89)%EF%BC%9A%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1.md)
- [深入JavaScript 执行上下文(四)：作用域链](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E5%9B%9B)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE.md)
- [深入JavaScript 执行上下文(五)：整个过程](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%94)%EF%BC%9A%E6%95%B4%E4%B8%AA%E8%BF%87%E7%A8%8B.md)

<br>

# 执行上下文栈（环境栈）

### 1、可执行代码
这就要说到 JavaScript 的可执行代码的类型有哪些了？
其实很简单，就三种，全局代码、函数代码、eval代码。
举个例子，当执行到一个函数的时候，就会进行准备工作，这里的“准备工作”，让我们用个更专业一点的说法，就叫做"执行上下文(execution context)"。

<br>

### 2、执行上下文栈（环境栈）

接下来问题来了，我们写的函数多了去了，如何管理创建的那么多执行上下文呢？
所以 JavaScript 引擎创建了执行上下文栈（Execution context stack，ECS），也叫环境栈，来管理执行上下文。

为了模拟执行上下文栈的行为，让我们定义执行上下文栈是一个数组：

```javascript
ECStack = [];
```
试想当 JavaScript 开始要解释执行代码的时候，最先遇到的就是全局代码，所以初始化的时候`首先就会向执行上下文栈压入一个全局执行上下文`，我们用` globalContext `表示它，并且只有当`整个应用程序结束的时候，ECStack 才会被清空`，所以程序结束之前， ECStack 最底部永远有个 globalContext：

```javascript
ECStack = [
    globalContext
];
```
现在 JavaScript 遇到下面的这段代码了：

```javascript
function fun3() {
    console.log('fun3')
}
function fun2() {
    fun3();
}
function fun1() {
    fun2();
}
fun1();
```


当执行一个函数的时候，就会创建一个执行上下文，并且压入执行上下文栈，`当函数执行完毕的时候(即离开该函数作用域)，就会将函数的执行上下文从栈中弹出`。知道了这样的工作原理，让我们来看看如何处理上面这段代码：

```javascript
// 伪代码

// fun1()
ECStack.push(<fun1> functionContext);

// fun1中竟然调用了fun2，还要创建fun2的执行上下文
ECStack.push(<fun2> functionContext);

// 擦，fun2还调用了fun3！
ECStack.push(<fun3> functionContext);

// fun3执行完毕
ECStack.pop();

// fun2执行完毕
ECStack.pop();

// fun1执行完毕
ECStack.pop();

// javascript接着执行下面的代码，但是ECStack底层永远有个globalContext
```

<br>

### 3、思考题
下面两段代码执行结果是一样的，如果从执行上下文栈的角度分析，上下两段代码有什么区别？
```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope(); //‘local scope’
```

```javascript
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();  //‘local scope’
```
**答：**
上面两段代码`执行上下文栈`的变化是不一样的。
让我们模拟第一段代码：

```javascript
ECStack.push(<checkscope> functionContext);
ECStack.push(<f> functionContext);
ECStack.pop();
ECStack.pop();
```
让我们模拟第二段代码：

```javascript
ECStack.push(<checkscope> functionContext);
ECStack.pop();
ECStack.push(<f> functionContext);
ECStack.pop();
```


