维基百科中对柯里化 (Currying) 的定义为：

在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举个例子：

```js
function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3
```

<br>

# 一、用途

我们会讲到如何写出这个 curry 函数，并且会将这个 curry 函数写的很强大，但是在编写之前，我们需要知道柯里化到底有什么用？

举个例子：

```js
// 示意而已
function ajax(type, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.send(data);
}

// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', "name=kevin")
ajax('POST', 'www.test2.com', "name=kevin")
ajax('POST', 'www.test3.com', "name=kevin")

// 利用 curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', "name=kevin");

// 以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest("name=kevin");
```

想想 jQuery 虽然有 $.ajax 这样通用的方法，但是也有 $.get 和 $.post 的语法糖。(当然 jQuery 底层是否是这样做的，我就没有研究了)。

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

可是即便如此，是不是依然感觉没什么用呢？

如果我们仅仅是把参数一个一个传进去，意义可能不大，但是如果我们是把柯里化后的函数传给其他函数比如 map 呢？

举个例子：

比如我们有这样一段数据：

```js
var person = [{name: 'kevin'}, {name: 'daisy'}]
```

如果我们要获取所有的 name 值，我们可以这样做：

```js
var name = person.map(function (item) {
    return item.name;
})
```

不过如果我们有 curry 函数：

```js
var prop = curry(function (key, obj) {
    return obj[key]
});

var name = person.map(prop('name'))
```

我们为了获取 name 属性还要再编写一个 prop 函数，是不是又麻烦了些？

但是要注意，prop 函数编写一次后，以后可以多次使用，实际上代码从原本的三行精简成了一行，而且你看代码是不是更加易懂了？

`person.map(prop('name'))` 就好像直白的告诉你：person 对象遍历(map)获取(prop) name 属性。

<br>

其实bind也是柯里化实现的：

```js
function a(a, b){
    console.log(a, b);
}

var fn = a.bind(this, "a");
fn("b");
```

<br>

# 二、实现

## 1、第一版

未来我们会接触到更多有关柯里化的应用，不过那是未来的事情了，现在我们该编写这个 curry 函数了。

一个经常会看到的 curry 函数的实现为：

```js
// 第一版
var curry = function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        return fn.apply(this, newArgs);
    };
};
```
我们可以这样使用：

```js
function add(a, b) {
    return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry() // 3
//或者
var addCurry = curry(add, 1);
addCurry(2) // 3
//或者
var addCurry = curry(add);
addCurry(1, 2) // 3
```

从上面我们可以看出curry函数的功能：

`将后来的参数全部传给第一个参数(即函数)，执行第二次时返回结果。`

已经有柯里化的感觉了，但是还没有达到要求，不过我们可以把这个函数用作辅助函数，帮助我们写真正的 curry 函数。

## 2、第二版

```js
// 第二版
function sub_curry(fn) {
    //功能：将后来的参数全部传给第一个参数(即函数)，执行第二次时返回结果。
    
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)));
    };
}

function curry(fn, length) {

    length = length || fn.length;

    var slice = Array.prototype.slice;

    return function() {
        if (arguments.length < length) {
            var combined = [fn].concat(slice.call(arguments));
            return curry(sub_curry.apply(this, combined), length - arguments.length);
        } else {
            return fn.apply(this, arguments);
        }
    };
}
```

我们验证下这个函数：

```js
var fn = curry(function(a, b, c) {
    return [a, b, c];
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("c") // ["a", "b", "c"]
fn("a")("b")("c") // ["a", "b", "c"]
fn("a")("b", "c") // ["a", "b", "c"]
```
由上我们可以看出：`柯里化用到了递归，每执行一次就调用一次自身，直到所有参数补全，递归结束，返回结果`。

## 3、第三版

curry 函数写到这里其实已经很完善了，但是注意这个函数的传参顺序必须是从左到右，根据形参的顺序依次传入，如果我不想根据这个顺序传呢？

我们可以创建一个占位符，比如这样：

```js
var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", _, "c")("b") // ["a", "b", "c"]
```

我们直接看第三版的代码：

```js
// 第三版
function curry(fn, args, holes) {
  args = args || [];
  holes = holes || [];

  var length = fn.length;

  return function () {
    var _args = args.slice(0),
      _holes = holes.slice(0);

    for (var i = 0; i < arguments.length; i++) {
      var argsLen = args.length,
        holesLen = holes.length,
        arg = arguments[i],
        index = 0;

      if (arg === _ && holesLen) {
        // 处理类似 fn(1, _, _, 4)(_, 3) 这种情况，index 需要指向 holes 正确的下标
        index++;
        if (index > holesLen) {
          _args.push(arg);
          _holes.push(argsLen - 1 + index - holesLen);
        }
      } else if (arg === _) {
        // 处理类似 fn(1)(_) 这种情况
        _args.push(arg);
        _holes.push(argsLen + i);
      } else if (holesLen) {
        // 处理类似 fn(_, 2)(1) 这种情况

        // fn(_, 2)(_, 3)
        if (index >= holesLen) {
          _args.push(arg);
        } else {
          // fn(_, 2)(1) 用参数 1 替换占位符
          _args.splice(_holes[index], 1, arg);
          _holes.splice(index, 1);
        }
      } else {
        _args.push(arg);
      }
    }

    if (_holes.length || _args.length < length) {
      return curry.call(this, fn, _args, _holes);
    } else {
      return fn.apply(this, _args);
    }
  };
}

var _ = {};

var fn = curry(function (a, b, c, d, e) {
  console.log([a, b, c, d, e]);
});

// 验证 输出全部都是 [1, 2, 3, 4, 5]
fn(1, 2, 3, 4, 5);
fn(_, 2, 3, 4, 5)(1);
fn(1, _, 3, 4, 5)(2);
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5);

```

<br>

# 三、关于额外开销


函数柯里化可以用来构建复杂的算法 和 功能， 但是滥用也会带来额外的开销。

从上面实现部分的代码中，可以看到，使用柯里化函数，离不开闭包， arguments， 递归。

- 闭包，函数中的变量都保存在内存中，内存消耗大，有可能导致内存泄漏。
- 递归，效率非常差，
- arguments, 变量存取慢，访问性很差,

<br>

# 四、面试题

### 例1：
编写一个sum函数，实现如下功能：
```js
console.log(sum(1)(2)(3)) // 6
```
答：
```js
function sum(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

//或者
const sum = a => b => c => a + b + c;
```
<br>

### 例2：
根据例1，实现sum(1)(2)(3)(4)(5)...(n),无限累加

 答：如果想实现 sum(1)(2)(3)(4)(5)...(n)就得嵌套n-1个匿名函数，
```js
function sum(a) {
  return function(b) {
       ...
      return function(n) {
          
      }
  }
}

//或者
const sum = a => b => c => d => ... => a+b+c+d+...+n
```
最终实现即上面 版本3

<br>
