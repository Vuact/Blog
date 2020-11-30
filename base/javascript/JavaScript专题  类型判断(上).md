js数据类型分两大类

- 简单类型：Number、String、Boolean、Null、Undefined、Symbol
- 复杂类型：Object

从内存的角度讲：简单类型存储在栈中，复杂数据类型存储在堆中。


类型识别四种方法：

 - typeof 
 - instanceof
 - constructor
 - Object.prototype.toString.call()

注：检测数组用	Array.isArray()

<br><br>

# 一、typeof
- 可以识别标准类型(Null除外)
- 不能识别 内置对象 类型(Function除外)
- 不能识别自定义类型及父子关系

```js
//（1）标准类型
typeof "bty";    //string
typeof 12;       //number
typeof true;	  //boolean
typeof undefined; //undefined
typeof null;	  //object
typeof {name:'bty'}; //object

//（2）内置对象类型
typeof function(){}   //function
typeof [];	      //object  
typeof new Date;      //object
typeof	/\d/;	      //object

//（3）自定义对象类型
function Person(){};
typeof new Person;  //object
```

<br><br>

# 二、instanceof

- 不能判断标准类型 
- 能判断内置对象类型
- 能判断自定义对象类型及父子关系（原型链）

```js
//（1）不能判断标准类型
1 instanceof Number;	//false
"bty" instanceof String //false

//（2）能判断内置对象类型
[] instanceof Array;	//true
/\d/ instanceof RegExp;	//true
new Boolean(null) instanceof Object; //true
new Boolean(null) instanceof Boolean; //true

//（3）能判断自定义对象类型及父子关系
function Point(x,y){
    this.x = x;
    this.y = y;
}
function Circle(x,y,r){
    Point.call(this,x,y);
    this.radius = r;
}
Circle.prototype = new Point();
Circle.prototype.constructor = Circle;

var c = new Circle(1,1,2);
c instanceof Object;    //true
c instanceof Circle 	//true
c instanceof Point	//true
```

>注：对于判别是否为一个数组，比较好的方式是用Array.isArray()

<br><br>

# 三、constructor

- 可以识别标准类型(Undefined/Null除外)
- 可以识别内置对象类型
- 可以识别自定义对象类型，不能识别父子关系

缺点：不能识别Undefined/Null，不能检测祖先类型，
			若完全重写prototype，自定义对象类型会无法识
```js
//（1）可以识别标准类型(Undefined/Null除外)
"bty".constructor === String;    //true
(1).constructor === Number;      //true
true.constructor === Boolean;    //true
({}).constructor === Object;     //true

//（2）可以识别内置对象类型
[].constructor === Array;   //true
{}.constructor === Object;  //true
[].constructor === Object; //false  //说明不能识别继承关系

//（3）可以识别自定义对象类型，不能识别父子关系
function Person(name){
   this.name = name;
}
new Person('bty').constructor === Person; //true
new Person('bty').constructor === Object; //false

//自定义对象,重写prototype的部分属性
function Person(name){
    this.name = name;
}
Person.prototype.sayHello = function(){};
new Person('bty').constructor === Person; //true

//自定义对象,完全重写prototype，会无法识别
function Person(name){
    this.name = name;
}
Person.prototype={};
new Person('bty').constructor === Person; //false
```
将constructor进行下封装:

```js
//将constructor进行下封装
function getConstructorName(obj){
     return obj && obj.constructor && obj.constructor.toString().match(/function\s*([^(]*)/)[1];
}
getContructorName([]) === "Array"; //true
```

<br><br>

# 四、Object.prototype.toString.call()


当 toString 方法被调用的时候，下面的步骤会被执行：

1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 让 O 成为 ToObject(this) 的结果
4. 让 class 成为 O 的内部属性 [[Class]] 的值
5. 最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

通过规范，我们至少知道了调用 Object.prototype.toString 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，而 class 是要判断的对象的内部属性。

让我们写个 demo:

```js
console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
console.log(Object.prototype.toString.call(null)) // [object Null]

var date = new Date();
console.log(Object.prototype.toString.call(date)) // [object Date]
```

由此我们可以看到这个 class 值就是识别对象类型的关键！我们可以用 Object.prototype.toString 方法识别出更多类型！

优缺点：

- 可以识别标准类型
- 可以识别 内置对象 类型 
- 不能识别自定义对象类型及父子关系

```js
//（1）可以识别标准类型
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]


//（2）可以识别 内置对象 类型
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]


//（3）不能识别自定义对象类型及父子关系
var sam = Object.create({}); //[object Object]
function Person(){}   //[object Function]
var sam2 = new Person();  //[object Object]

function checkType() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(Object.prototype.toString.call(arguments[i]))
    }
}
checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func, sam, Person, sam2);
```






也可以将Object.prototype.toString.call()进行下封装，如下：
```
//将Object.prototype.toString进行下封装
function type(obj){
  return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
}
//标准类型
type("abb");	//string
type(1);	//number
type(true);	//boolean
type(undefined);//undefined
type(null);     //null
type({});	//object

//内置对象类型
type([]);	    //array
type(new Date);	    //date
type(/\d/);	    //regexp
type(function(){}); //function

//自定义类型
function Point(x,y){
    this.x = x;
    this.y = y;
}

type(new Point(1,2));//object
```

--------


----------




# Obejct.prototype.toString

是的，当然有！这就是 Object.prototype.toString！

那 Object.protototype.toString 究竟是一个什么样的方法呢？

为了更加细致的讲解这个函数，让我先献上 ES5 规范地址：[https://es5.github.io/#x15.2.4.2](https://es5.github.io/#x15.2.4.2)。

在第 15.2.4.2 节讲的就是 Object.prototype.toString()，为了不误导大家，我先奉上英文版：

>When the toString method is called, the following steps are taken:

>1. If the **this** value is **undefined**, return "**[object Undefined]**".
>2. If the **this** value is **null**, return "**[object Null]**".
>3. Let *O* be the result of calling ToObject passing the **this** value as the argument.
>4. Let *class* be the value of the [[Class]] internal property of *O*.
>5. Return the String value that is the result of concatenating the three Strings "**[object** ", *class*, and "**]**".

凡是规范上加粗或者斜体的，在这里我也加粗或者斜体了，就是要让大家感受原汁原味的规范！

如果没有看懂，就不妨看看我理解的：

当 toString 方法被调用的时候，下面的步骤会被执行：

1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 让 O 成为 ToObject(this) 的结果
4. 让 class 成为 O 的内部属性 [[Class]] 的值
5. 最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串

通过规范，我们至少知道了调用 Object.prototype.toString 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，而 class 是要判断的对象的内部属性。

让我们写个 demo:

```js
console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
console.log(Object.prototype.toString.call(null)) // [object Null]

var date = new Date();
console.log(Object.prototype.toString.call(date)) // [object Date]
```

由此我们可以看到这个 class 值就是识别对象类型的关键！

正是因为这种特性，我们可以用 Object.prototype.toString 方法识别出更多类型！

那到底能识别多少种类型呢？

至少 12 种！

你咋知道的？

我数的！

……

让我们看个 demo:

```js
// 以下是11种：
var number = 1;          // [object Number]
var string = '123';      // [object String]
var boolean = true;      // [object Boolean]
var und = undefined;     // [object Undefined]
var nul = null;          // [object Null]
var obj = {a: 1}         // [object Object]
var array = [1, 2, 3];   // [object Array]
var date = new Date();   // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g;          // [object RegExp]
var func = function a(){}; // [object Function]

function checkType() {
    for (var i = 0; i < arguments.length; i++) {
        console.log(Object.prototype.toString.call(arguments[i]))
    }
}

checkType(number, string, boolean, und, nul, obj, array, date, error, reg, func)
```

除了以上 11 种之外，还有：

```js
console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]
```

除了以上 13 种之外，还有：

```js
function a() {
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
a();
```

所以我们可以识别至少 14 种类型，当然我们也可以算出来，[[class]] 属性至少有 12 个。

<br>

# type API

既然有了 Object.prototype.toString 这个神器！那就让我们写个 type 函数帮助我们以后识别各种类型的值吧！

我的设想：

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。

我们来写一版代码：

```js
// 第一版
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error Null Undefined".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}
```

嗯，看起来很完美的样子~~ 但是注意，在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

我去，竟然还有这个兼容性！有什么简单的方法可以解决吗？那我们再改写一版，绝对让你惊艳！

```js
// 第二版
var class2type = {};

// 生成class2type映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    // 一箭双雕
    if (obj == null) {
        return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}
```



# 数组

jQuery 判断数组类型，旧版本是通过判断 Array.isArray 方法是否存在，如果存在就使用该方法，不存在就使用 type 函数。

```js
var isArray = Array.isArray || function( obj ) {
    return type(obj) === "array";
}
```

但是在 jQuery v3.0 中已经完全采用了 Array.isArray。

## 结语

到此，类型判断的上篇就结束了，我们已经可以判断日期、正则、错误类型啦，但是还有更复杂的判断比如 plainObject、空对象、Window对象、类数组对象等，路漫漫其修远兮，吾将上下而求索。

哦， 对了，这个 type 函数抄的 jQuery，[点击查看 type 源码](https://github.com/jquery/jquery/blob/ac9e3016645078e1e42120822cfb2076151c8cbe/src/core.js#L269)。

