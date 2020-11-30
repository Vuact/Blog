# 一、伪数组

伪数组，又叫类数组：

- 是对象，不是数组（ obj instanceof Array === false）
- 必须有length属性，但如果这个对象的length不为0，那么必须要按照数组下标存储数据
- 不能调用push()、indexOf()等 数组方法

为了方便大家理解，举几个例子：


```js
// 不是伪数组
var obj = {};
var obj2 = { length: 3 };
var obj3 = { 'a':1 , length:1};

// 是伪数组
var obj4 = { length: 0 };
var obj5 = { 0: '888', length: 1 };
var obj6 = { 0: '1', 1：2 , length: 2 };
var obj7 = { 99: 'abc', length: 100 }
```

概括来说：

伪数组就是：是对象不是数组； 有length属性，有数组的索引特征，但没有数组的push()等方法。

<br>

#### 典型的伪数组：

 - 函数的arguments参数
 - HTMLCollection对象、NodeList对象 (调用getElementsByTagName,document.childNodes之类的,它们返回的是NodeList对象)
 - jQuery对象

<br>

#### 伪数组与真数组：

要知道 `数组是有length属性的，而对象没有`；因而为了让对象也有length属性，所以伪数组诞生了。
其实伪数组和真数组都是对象，也都有length属性，甚至连访问元素的方式(eg：arguments[2])都一样；但不同的是，`伪数组不能像数组那样调用像push()、indexOf()之类的数组方法`。

<br>

#### 怎么判断 是 伪数组 还是 真数组？

我们可以用instanceof、constructor、Object.prototype.toString.call(X)等来判断是否为伪数组。

<br><br>

## 1、调用数组方法
伪数组不能像数组那样调用像push()、indexOf()之类的方法，但我就是任性的想调用，怎么办？

既然无法直接调用，我们可以用 Function.call 间接调用：

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

console.log(Array.prototype.join.call(arrayLike, '&')); // 'name&age&sex'

console.log(Array.prototype.slice.call(arrayLike, 0));// ["name", "age", "sex"] 
// slice可以做到类数组转数组

var a = Array.prototype.map.call(arrayLike, function(item){
    return item.toUpperCase();
});
console.log(a);// ["NAME", "AGE", "SEX"]
```

## 2、伪数组转数组：
我们有四种方法，将伪数据转换为真正的Array对象：
```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

// 1. slice
console.log(Array.prototype.slice.call(arrayLike)); // ["name", "age", "sex"] 

// 2. splice
console.log(Array.prototype.splice.call(arrayLike, 0)); // ["name", "age", "sex"] 

// 3. ES6 Array.from
console.log(Array.from(arrayLike)); // ["name", "age", "sex"] 

// 4. apply
console.log(Array.prototype.concat.apply([], arrayLike));// ["name", "age", "sex"] 
```
上面的四种方法，只有用splice的方法会改变伪数组，另外三种都会返回一个新数组。



<br>
<br>


# 二、Arguments对象

Arguments 对象就是一个伪数组对象.

Arguments 对象只定义在函数体中，包括了函数的参数和其他属性。在函数体中，arguments 指代该函数的 Arguments 对象。

举个例子：

```js
function foo(name, age, sex) {
    console.log(arguments);
}

foo('name', 'age', 'sex')
```

打印结果如下：

![arguments](https://github.com/mqyqingfeng/Blog/raw/master/Images/arguments.png)

我们可以看到除了类数组的索引属性和length属性之外，还有一个callee属性，接下来我们一个一个介绍。

## 1、length属性

Arguments对象的length属性，表示实参的长度，举个例子：

```js
function foo(b, c, d){
    console.log("实参的长度为：" + arguments.length)
}

console.log("形参的长度为：" + foo.length)

foo(1)

// 形参的长度为：3
// 实参的长度为：1
```

<br>

## 2、callee属性

Arguments 对象的 callee 属性，通过它可以调用函数自身。

讲个闭包经典面试题使用 callee 的解决方法：

```js
var data = [];

for (var i = 0; i < 3; i++) {
    (data[i] = function () {
       console.log(arguments.callee.i) 
    }).i = i;
}

data[0]();
data[1]();
data[2]();

// 0
// 1
// 2
```

<br>


## 3、arguments 对象的几个注意要点
#### （1）arguments 和对应参数的联动

```js
function foo(name, age, sex, hobbit) {

    console.log(name, arguments[0]); // name name

    // 改变形参
    name = 'new name';

    console.log(name, arguments[0]); // new name new name

    // 改变arguments
    arguments[1] = 'new age';

    console.log(age, arguments[1]); // new age new age

    // 测试未传入的是否会绑定
    console.log(sex); // undefined

    sex = 'new sex';

    console.log(sex, arguments[2]); // new sex undefined

    arguments[3] = 'new hobbit';

    console.log(hobbit, arguments[3]); // undefined new hobbit

}

foo('name', 'age')
```

传入的参数，实参和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享

除此之外，以上是在非严格模式下，如果是在严格模式下，实参和 arguments 是不会共享的。

>在非严格模式下是因为数组索引对应了数据属性，所以会互相联动的，而在严格模式下则是简单拷贝。
>另外如果一个属性被删除后重新定义或者更改了访问器属性，联动就会消失。

<br>

#### （2）传递参数

将参数从一个函数传递到另一个函数

```js
// 使用 apply 将 foo 的参数传递给 bar
function foo() {
    bar.apply(this, arguments);
}
function bar(a, b, c) {
   console.log(a, b, c);
}

foo(1, 2, 3)
```

#### （3）强大的ES6

使用ES6的 ... 运算符，我们可以轻松转成数组。

```js
function func(...arguments) {
    console.log(arguments); // [1, 2, 3]
}

func(1, 2, 3);
```

<br>

## 4、应用

arguments的应用其实很多

```
1. 参数不定长
2. 函数柯里化
3. 递归调用
4. 函数重载
```

