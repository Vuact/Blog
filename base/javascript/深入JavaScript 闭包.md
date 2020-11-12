# 一、理论上的闭包：
----
从技术理论的角度讲，所有的JavaScript函数都是闭包。

闭包定义：`闭包是指那些能够访问自由变量的函数。`

> 自由变量：是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。


由此，可以看出闭包共有两部分组成：`闭包 = 函数 + 函数能够访问的自由变量`


举个例子：
```
var a = 1;

function foo() {
    console.log(a);
}
foo();
```
foo 函数可以访问变量 a，但是 a 既不是 foo 函数的局部变量，也不是 foo 函数的参数，所以 a 就是自由变量。
那么，函数 foo + foo 函数访问的自由变量 a  就构成了一个闭包……

从技术理论的角度讲，所有的JavaScript函数都是闭包。

显然上面讲述的并不是我们实践中用的闭包，我们再接着往下看。
<br>

# 二、实践上的闭包：
---
上面是理论上的闭包，其实还有一个实践角度上的闭包。

先举个栗子：
```javascript
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}

var foo = checkscope();
console.log(foo());  					//'local scope'
```
我们先分析一下这段代码中执行上下文栈和执行上下文的变化情况。
注：如果看不懂以下的执行过程，建议先阅读《[深入JavaScript 执行上下文(五)](https://blog.csdn.net/b954960630/article/details/83933032)》。

这里直接给出简要的执行过程：
- （1）进入全局代码，创建全局执行上下文，全局执行上下文压入执行上下文栈
- （2）全局执行上下文初始化
- （3）执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 执行上下文被压入执行上下文栈
- （4）checkscope 执行上下文初始化，创建活动对象、作用域链、this等
- （5）checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出
- （6）执行 f 函数，创建 f 函数执行上下文，f 执行上下文被压入执行上下文栈
- （7）f 执行上下文初始化，创建变量对象、作用域链、this等
- （8）f 函数执行完毕，f 函数上下文从执行上下文栈中弹出

了解到这个过程，我们应该思考一个问题，那就是：
当 f 函数执行的时候，checkscope 函数上下文已经被销毁了啊(即从执行上下文栈中被弹出)，怎么还会读取到 checkscope 作用域下的 scope 值呢？

**1.  [[scope]]属性**
每个函数都有一个内部属性[[scope]]（即作用域链）
现在我们根据上面谈的程序具体执行过程，来看下f函数的内部属性[[scope]]，即f 执行上下文维护的作用域链：
```javascript
fContext = {
    Scope: [AO, checkscopeContext.AO, globalContext.VO],
}
```
没错，，
就是因为上面这个作用域链，f 函数依然可以读取到 checkscopeContext.AO  的值(即 变量scope)。
说明当 f 函数引用了 checkscopeContext.AO 中的值的时候，即使 checkscopeContext 被销毁了，但是 JavaScript 依然会让 checkscopeContext.AO 活在内存中，f 函数依然可以通过 f 函数的作用域链找到它。从而实现了闭包这个概念。

那问题又来了：checkscopeContext都被销毁了，为什么checkscopeContext.AO 还能活在内存中呢？

如果你知道 JavaScript的垃圾回收机理，你就懂了。

<br>

**2.  JavaScript垃圾回收**
 JavaScript垃圾回收的机理：`垃圾收集器 会跟踪找出不再使用的变量，然后 每隔固定时间间隔 释放掉其内存。`

再看上面例子：
① checkscope函数没被谁引用或使用着，说明它执行完后会被垃圾收集器销毁；checkscopeContext也没被谁引用或使用着，所以在checkscope函数执行完毕后，它也会被一同销毁。

② checkscope返回的f函数被foo所引用着，说明我们还会使用f函数，所以f函数不被销毁。且f函数执行上下文的[[scope]]属性（即 作用域链）还引用着 checkscopeContext.AO，说明我们还会使用 checkscopeContext.AO，所以不被销毁。


总述：
每个函数都有一个内部属性[[scope]]（即作用域链），而正因为f函数没被销毁，所以该属性也被保留着；又因为作用域链的本质是一个指向 变量对象/活动对象 的指针列表(它只是引用 不包含实际对象)，所以作用域链上的这些对象不会被垃圾收集器销毁，所以我们可以通过f函数的作用域链找到 它的父级乃至父父级的变量。

<br/>

让我们再看一遍实践角度上闭包的定义：
- （1）即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
- （2）在代码中引用了自由变量


------------

再总结一遍~


**ECMAScript中，闭包指的是：**

- **从理论角度**：闭包指所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
- **从实践角度**：以下函数才算是闭包：
  - 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
  - 在代码中引用了自由变量

<br>

# 三、必刷题
------
### 例1：
```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```
输出： 3 3 3

让我们分析一下原因：
当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```javascript
globalContext = {
    VO: { data: [...],   i: 3 }
}
```
当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```javascript
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```
data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。

data[1] 和 data[2] 是一样的道理。

所以让我们改成闭包看看：

```javascript
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```
当执行到 data[0] 函数之前，此时全局上下文的 VO 仍为：

```javascript
globalContext = {
    VO: { data: [...],   i: 3 }
}
```
跟没改之前一模一样。

但当执行 data[0] 函数（即 return的函数）的时候，其作用域链为：

```javascript
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO，globalContext.VO]
}
```
匿名函数执行上下文的 AO 为：

```javascript
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```
data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从`匿名函数Context.AO` 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是 0。
data[1] 和 data[2] 是一样的道理。

----
其实我们要想输出0 1 2，可以直接将上面代码改为：

```javascript
var data = [];

for (let i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();
data[1]();
data[2]();
```
ES6中加入了块级作用域。
我们每创建一个函数会创建一个作用域。同理上面代码，我们用let声明i后，相当于每进行一次for循环就创建了一个(块级)作用域。每个作用域的AO都保存了一个不同的i值。

执行 data[0] 函数时，由于我们要打印i值，所以会沿着作用域链回溯寻找：首先会在当前匿名函数的作用域寻找i值，发现没有；再到块级作用域中找，发现有且为0，所以打印0；之后同理，输出：0 1 2

---
### 例2：
```javascript
var globals = 0;
function test(parameter){
    var outerVal = 0;
    var outerVal2 = 0;
    console.log('outerVal2:',++outerVal2);
    return function(){
        var innerVal = 0;
        console.log('globals:',++globals);
        console.log('outerVal:',++outerVal);
        console.log('innerVal:',++innerVal);
        console.log('parameter:',++parameter);
    }
}

var a = test(0);
a();
a();
```
输出：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181117223315576.png)

**（1）** 
在执行到 a() 函数（即return的匿名函数）之前，此时全局上下文的 VO 为：

```javascript
globalContext = {
    VO: { 
    	globals: 0, 
    	test：ƒ test(parameter)，
    	a：ƒ() 
    }
}
```
而test函数执行上下文的 AO 为：
```javascript
testContext = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        parameter: 0,
        outerVal: 0,
        outerVal2: 0,
    }
}
```

**（2）**
当执行 a() 函数的时候，a() 函数的作用域链为：

```javascript
aContext = {
    Scope: [AO, testContext.AO, globalContext.VO]
}
```
用上面的理论，解释这个例子，输出同理。

这里需要注意的是：`第一次执行a()时，创建了a函数的执行上下文（aContext），执行完后销毁；第二次执行a()时，再次创建aContext，然后再次销毁`。`虽然aContext两次被销毁，但a函数的[[scope]]属性一直都留在内存里。`

-----
下面我们看一个误用闭包的例子~

### 例3：


```javascript
function test(){
    var outerVal = 0;
    return function(){
        console.log(++outerVal);
    }
}
test()();
test()();
```
输出：1  1

为什么不是输出 1 2 呢？
首先你要知道，test()即返回的匿名函数，test()()即执行匿名函数。

再根据 JS垃圾回收的机理：
因为test函数返回的匿名函数没有被其他变量引用或使用着，说明我们不再继续使用该匿名函数，所以垃圾收集器会将其销毁。所以每次执行test()()后，变量outerVal都会被销毁。

