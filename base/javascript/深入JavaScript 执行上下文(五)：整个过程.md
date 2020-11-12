
## 执行上下文
------------------
- [深入JavaScript 执行上下文(一)：作用域](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%80)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F.md)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%8C)%EF%BC%9A%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87%E6%A0%88.md)
- [深入JavaScript 执行上下文(三)：变量对象](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%B8%89)%EF%BC%9A%E5%8F%98%E9%87%8F%E5%AF%B9%E8%B1%A1.md)
- [深入JavaScript 执行上下文(四)：作用域链](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E5%9B%9B)%EF%BC%9A%E4%BD%9C%E7%94%A8%E5%9F%9F%E9%93%BE.md)
- [深入JavaScript 执行上下文(五)：整个过程](https://github.com/Vuact/document/blob/main/base/javascript/%E6%B7%B1%E5%85%A5JavaScript%20%E6%89%A7%E8%A1%8C%E4%B8%8A%E4%B8%8B%E6%96%87(%E4%BA%94)%EF%BC%9A%E6%95%B4%E4%B8%AA%E8%BF%87%E7%A8%8B.md)


---
现在加上this, 来详细的解析执行上下文栈和执行上下文的具体变化过程~ 整个过一遍。

以下面例子为例：
```javascript
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

1、执行全局代码，创建全局执行上下文，全局上下文被压入执行上下文栈
```javascript
ECStack = [
  globalContext
];
```
2、全局上下文初始化（初始化全局环境的变量对象VO，确定全局环境的Scope，绑定全局环境的this）

```javascript
globalContext = {
    VO: {
        global: window,
        scope: undefined,
        checkscope:reference to function checkscope
    },
    Scope: [globalContext.VO],
    this: globalContext.VO
}
 ```
 变量对象VO：
 - 存储了再上下文中定义的变量和函数声明；除了我们无法访问外，和普通对象没什么区别
 - 对于函数，执行前的初始化阶段叫变量对象，执行中就变成了活动对象
 - 每一个执行环境都有一个与之相关的变量对象，其中存储着上下文中声明的：变量、函数、形式参数
 
 
3、checkscope函数执行前阶段：初始化的同时，checkscope函数被创建，保存全局环境的作用域链，到函数checkscope的内部属性[[scope]]中
```javascript
checkscope.[[scope]] = [
   globalContext.VO
];
```

4、执行 checkscope 函数，创建 checkscope 函数执行上下文，checkscope 函数执行上下文被压入执行上下文栈
```javascript
ECStack = [
    checkscopeContext,
    globalContext
];
```

5、初始化 checkscope 函数执行上下文,会有以下几步：
 1. ⽤ arguments 创建活动对象 checkscopeContext.AO（活动对象初始化：形参 > 函数声明 > 变量声明）
 2. 利⽤ checkscopeContext.AO 与 checkscope.[[scope]]，形成checkscope 函数执⾏环境的作⽤域链 checkscopeContext.Scope
 3. 绑定 this 到 undefined（⾮严格模式下会绑定到全局对象）

```javascript
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
活动对象 AO：
 - 在没有执⾏当前环境之前，变量对象中的属性都不能访问。但是进⼊执⾏阶段之后，变量对象转变为了活动对象，所以活动对象和变量对象其实是⼀个东⻄，只是处于
执⾏环境的不同⽣命周期
 - AO 实际上是包含了 VO 的。因为除了 VO 之外，AO 还包含函数的参数 parameters，以及 arguments 这个特殊对象

6、f 函数执⾏前阶段。更新 f.[[scope]]， checkscopeContext.AO.scope 等赋值
```javascript
f.[[scope]] = [
     checkscopeContext.AO,
     globalContext.VO
];

checkscopeContext = {
    AO: {
         arguments: {
            length: 0
         },
         Scope: "local scope",
         f: reference to function f(){}
    },
    Scope: [AO, globalContext.VO],
    this: undefined
 }
```

7、执行f函数, 创建 f 函数执行上下文，f 函数执行上下文被压入执行上下文栈
```javascript
ECStack = [
    fContext,
    checkscopeContext,
    globalContext
];
 ```
 
8、f 函数执行环境初始化, 跟第 5 步相同：
 1. ⽤ arguments 创建活动对象 fContext.AO（活动对象初始化：形参 > 函数声明 > 变量声明）
 2. 利⽤ fContext.AO 与 f.[[scope]]，形成f函数执⾏环境的作⽤域链 fContext.Scope
 3. 绑定 this 到 undefined（⾮严格模式下会绑定到全局对象）

```javascript
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

9、f 函数中代码执⾏。对 scope 进⾏查找。查找从作⽤域链中当前活动对象，开始沿着作⽤域链向上查找
    // 查找过程：
    1. fContext.AO.scope 没有该变量声明，继续
    2. checkscopeContext.AO.scope 有该变量声明，获取其值为"local scope"

10、f 函数执行完毕，f 函数上下文从执行上下文栈中弹出
```javascript
ECStack = [
    checkscopeContext,
    globalContext
];
```
11、 checkscope 函数在执⾏完 f 处，获取 f 执⾏的返回值 "local scope"，函数继续向下执⾏。
checkscope 函数执行完毕，checkscope 执行上下文从执行上下文栈中弹出

```javascript
ECStack = [
    globalContext
];
```
12、 代码执⾏流回到全局执⾏环境中调⽤ checoscope 处，拿到 checkScope 返回值并继续向下执⾏
13、 直到程序终⽌，或者⻚⾯关闭。全局上下⽂出栈并销毁



   
