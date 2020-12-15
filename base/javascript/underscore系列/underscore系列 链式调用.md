# jQuery

我们都知道 jQuery 可以链式调用，比如：

```js
$("div").eq(0).css("width", "200px").show();
```

我们写个简单的 demo 模拟链式调用：

```js
function JQuery(selector) {
    this.elements = [];
    var nodeLists = document.getElementsByTagName(selector);
    for (var i = 0; i < nodeLists.length; i++) {
        this.elements.push(nodeLists[i]);
    }
    return this;
}

JQuery.prototype = {
    eq: function(num){
        this.elements = [this.elements[num]];
        return this;
    },
    css: function(prop, val) {
        this.elements.forEach(function(el){
            el.style[prop] = val;
        })
        return this;
    },
    show: function() {
        this.css('display', 'block');
        return this;
    }

}

window.$ = function(selector){
    return new JQuery(selector)
}

$("div").eq(0).css("width", "200px").show();
```

jQuery 之所以能实现链式调用，关键就在于通过 return this，返回调用对象。再精简下 demo 就是：

```js
var jQuery = {
    eq: function(){
        console.log('调用 eq 方法');
        return this;
    },
    show: function(){
        console.log('调用 show 方法');
        return this;
    }
}

jQuery.eq().show();
```

<br>

# _.chain

在 underscore 中，默认不使用链式调用，但是如果你想使用链式调用，你可以通过 _.chain 函数实现：

```js
_.chain([1, 2, 3, 4])
.filter(function(num) { return num % 2 == 0; })
.map(function(num) { return num * num })
.value(); // [4, 16]
```

我们看看 _.chain 这个方法都做了什么：

```js
_.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
};
```

我们以 [1, 2, 3] 为例，_.chain([1, 2, 3]) 会返回一个对象：

```js
{
    _chain: true,
    _wrapped: [1, 2, 3]
}
```

该对象的原型上有着 underscore 的各种方法，我们可以直接调用这些方法。

但是问题在于原型上的这些方法并没有像 jQuery 一样，返回 this ，所以如果你调用了一次方法，就无法接着调用其他方法了……

但是试想下，我们将函数的返回值作为参数再传入 _.chain 函数中，不就可以接着调用其他方法了？

写一个精简的 Demo:

```js
var _ = function(obj) {
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
};

_.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
};

_.prototype.push = function(num) {
    this._wrapped.push(num);
    return this._wrapped
}

_.prototype.shift = function(num) {
    this._wrapped.shift()
    return this._wrapped
}

var res = _.chain([1, 2, 3]).push(4);
// 将上一个函数的返回值，传入 _.chain，然后再继续调用其他函数
var res2 = _.chain(res).shift();

console.log(res2); // [2, 3, 4]
```

然而这也太复杂了吧，难道 chain 这个过程不能是自动化的吗？如果我是开发者，我肯定希望直接写成：

```js
_.chain([1, 2, 3]).push(4).shift()
```

所以我们再优化一下实现方式：

```js
var _ = function(obj) {
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
};

var chainResult = function (instance, obj) {
    return instance._chain ? _.chain(obj) : obj;
};

_.chain = function (obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
};

_.prototype.push = function(num) {
    this._wrapped.push(num);
    return chainResult(this, this._wrapped)
}

_.prototype.shift = function() {
    this._wrapped.shift();
    return chainResult(this, this._wrapped)
}

var res = _.chain([1, 2, 3]).push(4).shift();

console.log(res._wrapped);
```

我们在每个函数中，都用 chainResult 将函数的返回值包裹一遍，再生成一个类似以下这种形式的对象：

```js
{
    _wrapped: some value, 
    _chain: true
}
```
该对象的原型上有各种函数，而这些函数的返回值作为参数传入了 chainResult，该函数又会返回这样一个对象，函数的返回值就保存在 `_wrapped` 中，这样就实现了链式调用。

`_.chain`链式调用原理就是这样，可是这样的话，我们需要对每个函数都进行修改呀……

幸运的是，在 underscore 中，所有的函数是挂载到 `_` 函数对象中的，`_.prototype` 上的函数是通过 `_.mixin` 函数将 `_` 函数对象中的所有函数复制到 `_.prototype` 中的。

所以为了实现链式调用，我们还需要对上一篇《underscore系列 如何写自己的underscore》 中的 `_.mixin` 方法进行一定修改：

```js
// 修改前
var ArrayProto = Array.prototype;
var push = ArrayProto.push;

_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return func.apply(_, args);
        };
    });
    return _;
};

_.mixin(_);
```

```js
// 修改后
var ArrayProto = Array.prototype;
var push = ArrayProto.push;

var chainResult = function (instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
};

_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
        };
    });
    return _;
};

_.mixin(_);
```

<br>

# _.value

根据上面的分析过程，我们知道如果我们打印：

```js
console.log(_.chain([1, 2, 3]).push(4).shift());
```
其实会打印一个对象 `{_chain: true, _wrapped: [2, 3, 4] }`

可是我希望获得值是 `[2, 3, 4]` 呀！

所以，我们还需要提供一个 value 方法，当执行 value 方法的时候，就返回当前 `_wrapped` 的值。

```js
_.prototype.value = function() {
    return this._wrapped;
};
```

此时调用方式为：

```js
var arr = _.chain([1, 2, 3]).push(4).shift().value();
console.log(arr) // [2, 3, 4]
```

<br>

# 最终代码

结合上一篇文章，最终的 underscore 代码组织结构如下：

```js
(function() {

    var root = (typeof self == 'object' && self.self == self && self) ||
        (typeof global == 'object' && global.global == global && global) ||
        this || {};

    var ArrayProto = Array.prototype;

    var push = ArrayProto.push;

    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    _.VERSION = '0.2';

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var isArrayLike = function(collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = function(obj, callback) {
        var length, i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        }

        return obj;
    }

    _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };

    _.functions = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    /**
     * 在 _.mixin(_) 前添加自己定义的方法
     */
    _.reverse = function(string){
        return string.split('').reverse().join('');
    }

    _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    var chainResult = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return chainResult(this, func.apply(_, args));
            };
        });
        return _;
    };

    _.mixin(_);

    _.prototype.value = function () {
        return this._wrapped;
    };

})()
```
