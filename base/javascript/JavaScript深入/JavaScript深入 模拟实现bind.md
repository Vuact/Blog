# bind
bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

由此我们可以首先得出 bind 函数的两个特点：
- 返回一个函数
- 可以传入参数

<br>

### 例1
```javascript
var foo = { value: 1};

function bar() {
    console.log(this.value);
}

var bindFoo = bar.bind(foo); 
bindFoo(); // 1
```
让我们看看发生了什么？
（1） bind返回了一个函数
（2） 传入的第一个参数改变了bar的指针


#### 模拟bind第一版：
```javascript
Function.prototype.myBind = function (context) {
    var self = this;
    return function () {
        self.apply(context);
    }
}
```

<br>

### 例2

```javascript
var foo = {value: 1};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
}

var bindFoo = bar.bind(foo, 'bty', '18');
bindFoo();   // 1  bty  18

var bindFoo = bar.bind(foo, 'bty');
bindFoo('18');   // 1  bty  18

var bindFoo = bar.bind(foo);
bindFoo('bty', '18');   // 1  bty  18
```
让我们看看发生了什么？

name和age两个参数，
（1）可以都在bind的时候传入
（2）也可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age
（3）还可以在返回函数的时候都传入

这里我们用 arguments 进行处理，

<br>

#### 模拟bind第二版：
```javascript
Function.prototype.myBind = function (context) {
    var self = this;
    // 获取myBind从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
       // 这时的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(context, args.concat(bindArgs));
    }
}
```

<br>

### 例3
bind 另一个特点:
一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

```javascript
var value = 2;
var foo = {value: 1};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'bty';

var bindFoo = bar.bind(foo, 'dadd');

var obj = new bindFoo('18'); // undefined dadd  18
console.log(obj.habit);  // shopping
console.log(obj.friend);  //bty
```
让我们看看发生了什么？
全局和 foo 中都声明了 value 值，但最后返回了 undefind，说明绑定的 this 失效了。
如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

<br>

#### 模拟bind第三版：
```javascript
Function.prototype.myBind = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fbound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。
        // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。
        self.apply(this instanceof self ? this : context, args.concat(bindArgs));
    }
    fbound.prototype = this.prototype;
    return fbound;
}
```

上面代码的问题：
（1）fbound.prototype = this.prototype：我们直接修改 fbound.prototype 时，也会直接修改函数的 prototype。这个时候，我们可以通过一个空函数来进行中转
（2）如果调用bind不是函数怎么办？

<br>

#### 模拟bind第四版：
```javascript
Function.prototype.myBind = function (context) {
    if (typeof this !== "function") {      //（2）
       throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};
    var fbound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? this : context, args.concat(bindArgs));
    }
    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();   //（1）
    return fbound;
}
```
