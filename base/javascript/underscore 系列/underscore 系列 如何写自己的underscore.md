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

然而 underscore 可不会写得如此简单，我们从 var root = this 开始说起。

之所以写这一句，是因为我们要通过 this 获得全局对象，然后将 _ 对象，挂载上去。

然而在严格模式下，this 返回 undefined，而不是指向 Window，幸运的是 underscore 并没有采用严格模式，可是即便如此，也不能避免，因为在 ES6 中模块脚本自动采用严格模式，不管有没有声明 use strict。

如果 this 返回 undefined，代码就会报错，所以我们的思路是对环境进行检测，然后挂载到正确的对象上。我们修改一下代码：

```js
var root = (typeof window == 'object' && window.window == window && window) ||
           (typeof global == 'object' && global.global == global && global);
```
在这段代码中，我们判断了浏览器和 Node 环境，可是只有这两个环境吗？那我们来看看 Web Worker。
