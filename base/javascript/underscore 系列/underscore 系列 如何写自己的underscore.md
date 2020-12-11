我们写了很多的功能函数，比如防抖、节流、去重、类型判断、扁平数组、深浅拷贝、查找数组元素、通用遍历、柯里化、函数组合、函数记忆、乱序等，可以我们该如何组织这些函数，形成自己的一个工具函数库呢？这个时候，我们就要借鉴 underscore 是怎么做的了。

# 自己实现

如果是我们自己去组织这些函数，我们该怎么做呢？我想我会这样做：

```js
(function(){
    var root = this;

    var _ = {};

    root._ = _;

    // 在这里添加自己的方法
    _.reverse = function(string){
        return string.split('').reverse().join('');
    }

})()

_.reverse('hello');
=> 'olleh'
```
我们将所有的方法添加到一个名为 _ 的对象上，然后将该对象挂载到全局对象上。

之所以不直接 window._ = _ 是因为我们写的是一个工具函数库，不仅要求可以运行在浏览器端，还可以运行在诸如 Node 等环境中。

<br>

## 1、root

然而 underscore 可不会写得如此简单，我们从 `var root = this` 开始说起。

之所以写这一句，是因为我们要通过 this 获得全局对象，然后将 _ 对象，挂载上去。

然而在严格模式下，this 返回 undefined，而不是指向 Window，幸运的是 underscore 并没有采用严格模式，可是即便如此，也不能避免，因为在 ES6 中模块脚本自动采用严格模式，不管有没有声明 use strict。

如果 this 返回 undefined，代码就会报错，所以我们的思路是对环境进行检测，然后挂载到正确的对象上。我们修改一下代码：

```js
var root = (typeof window == 'object' && window.window == window && window) ||
           (typeof global == 'object' && global.global == global && global);
```
在这段代码中，我们判断了浏览器和 Node 环境，可是只有这两个环境吗？那我们来看看 Web Worker。

<br>

## 2、Web Worker
在 Web Worker 标准中，定义了解决客户端 JavaScript 无法多线程的问题。其中定义的 “worker” 是指执行代码的并行过程。不过，Web Worker 处在一个自包含的执行环境中，无法访问 Window 对象和 Document 对象，和主线程之间的通信业只能通过异步消息传递机制来实现。

为了演示 Web Worker 的效果，我写了一个 demo，[查看代码](https://github.com/mqyqingfeng/Blog/tree/master/demos/web-worker)

在 Web Worker 中，是无法访问 Window 对象的，所以 typeof window 和 typeof global 的结果都是 undefined，所以最终 root 的值为 false，将一个基本类型的值像对象一样添加属性和方法，自然是会报错的。

那么我们该怎么办呢？

虽然在 Web Worker 中不能访问到 Window 对象，但是我们却能通过 self 访问到 Worker 环境中的全局对象。我们只是要找全局变量挂载而已，所以完全可以挂到 self 中嘛。

而且在浏览器中，除了 window 属性，我们也可以通过 self 属性直接访问到 Winow 对象。

```js
console.log(window.window === window); // true
console.log(window.self === window); // true
```
考虑到使用 self 还可以额外支持 Web Worker，我们直接将代码改成 self：
```js
var root = (typeof self == 'object' && self.self == self && self) ||
           (typeof global == 'object' && global.global == global && global);
```

<br>

## 3、node vm

到了这里，依然没完，让你想不到的是，在 node 的 vm 模块中，也就是沙盒模块，runInContext 方法中，是不存在 window，也不存在 global 变量的，[查看代码](https://github.com/mqyqingfeng/Blog/blob/master/demos/node-vm/index.js)。

但是我们却可以通过 this 访问到全局对象，所以就有人发起了一个 PR，代码改成了：

```js
var root = (typeof self == 'object' && self.self == self && self) ||
           (typeof global == 'object' && global.global == global && global) ||
           this;
```

<br>

## 4、微信小程序

到了这里，还是没完，轮到微信小程序登场了。

因为在微信小程序中，window 和 global 都是 undefined，加上又强制使用严格模式，this 为 undefined，挂载就会发生错误，所以就有人又发了一个 PR，代码变成了：

```js
var root = (typeof self == 'object' && self.self == self && self) ||
           (typeof global == 'object' && global.global == global && global) ||
           this ||
           {};
```

这就是现在 v1.8.3 的样子。

虽然作者可以直接讲解最终的代码，但是作者更希望带着大家看看这看似普通的代码是如何一步步演变成这样的，也希望告诉大家，代码的健壮性，并非一蹴而就，而是汇集了很多人的经验，考虑到了很多我们意想不到的地方，这也是开源项目的好处吧。


<br>

## 5、函数对象

现在我们讲第二句 `var _ = {};`。

如果仅仅设置 _ 为一个空对象，我们调用方法的时候，只能使用 `_.reverse('hello')` 的方式，实际上，underscore 也支持类似面向对象的方式调用，即：

```js
_('hello').reverse(); // 'olleh'
```

再举个例子比较下两种调用方式：

```js
// 函数式风格
_.each([1, 2, 3], function(item){
    console.log(item)
});

// 面向对象风格
_([1, 2, 3]).each(function(item){
    console.log(item)
});
```

可是该如何实现呢？

既然以 `_([1, 2, 3])` 的形式可以执行，就表明 `_`不是一个字面量对象，而是一个函数！

幸运的是，在 JavaScript 中，函数也是一种对象，我们举个例子：

```js
var _ = function() {};
_.value = 1;
_.log = function() { return this.value + 1 };

console.log(_.value); // 1
console.log(_.log()); // 2
```
我们完全可以将自定义的函数定义在 `_` 函数上！

目前的写法为:

```js
var root = (typeof self == 'object' && self.self == self && self) ||
           (typeof global == 'object' && global.global == global && global) ||
           this ||
           {};

var _ = function() {}

root._ = _;
```

如何做到 `_([1, 2, 3]).each(...)`呢？即 _ 函数返回一个对象，这个对象，如何调用挂在 _ 函数上的方法呢？

我们看看 underscore 是如何实现的：

```js
var _ = function(obj) {
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
};

_([1, 2, 3]);
```
我们分析下 _([1, 2, 3]) 的执行过程：

1. 执行 `this instanceof _`，`this` 指向 `window` ，`window instanceof _` 为 false，`!`操作符取反，所以执行 `new _(obj)`。

2. `new _(obj)` 中，`this` 指向实例对象，`this instanceof _` 为 `true`，取反后，代码接着执行

3. 执行 `this._wrapped = obj`， 函数执行结束

4. 总结，`_([1, 2, 3])` 返回一个对象，为 `{_wrapped: [1, 2, 3]}`，该对象的原型指向 `_.prototype`

示意图如下：

![](https://raw.githubusercontent.com/mqyqingfeng/Blog/master/Images/underscore/new-obj.png)

然后问题来了，我们是将方法挂载到 _ 函数对象上，并没有挂到函数的原型上呐，所以返回了的实例，其实是无法调用 _ 函数对象上的方法的！

我们写个例子：

```js
(function(){
    var root = (typeof self == 'object' && self.self == self && self) ||
               (typeof global == 'object' && global.global == global && global) ||
               this ||
               {};

    var _ = function(obj) {
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    }

    root._ = _;

    _.log = function(){
        console.log(1)
    }

})()

_().log(); // _(...).log is not a function
```

确实有这个问题，所以我们还需要一个方法将 `_` 上的方法复制到 `_.prototype` 上，这个方法就是 `_.mixin`。
