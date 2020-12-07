js数据类型分两大类

- 简单类型：Number、String、Boolean、Null、Undefined、Symbol
- 复杂类型：Object

从内存的角度讲：简单类型存储在栈中，复杂数据类型存储在堆中。

------
#### 目录

##### 一、类型判断的方法

 - typeof 
 - instanceof
 - constructor
 - Object.prototype.toString.call()
 - Array.isArray()
 
##### 二、类型判断进阶

- EmptyObject
- Window对象
- isElement
- isArrayLike
- plainObject

------

<br>

# 一、类型判断的方法

# 1、typeof
- 可以识别标准类型(Null除外)
- 不能识别 内置对象 类型(Function除外)
- 不能识别自定义类型及父子关系

```js
//（1）标准类型
typeof null;	     //object
typeof undefined;    //undefined
typeof true;	     //boolean
typeof 12;           //number
typeof "bty";        //string
typeof Symbol();     //symbol
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

<br>

# 2、instanceof

instanceof是沿着原型链来查找的。

- 不能判断标准类型 
- 能判断内置对象类型
- 能判断自定义对象类型及父子关系（原型链）

```js
//（1）不能判断标准类型
1 instanceof Number;	//false
"bty" instanceof String //false


//（2）能判断内置对象类型
[] instanceof Array;	//true
[] instanceof Object;   //true
/\d/ instanceof RegExp;	//true
/\d/ instanceof Object; //true
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
Circle.prototype = Object.create(Point.prototype);
Circle.prototype.constructor = Circle;

var c = new Circle(1,1,2);
c instanceof Object;    //true
c instanceof Circle 	//true
c instanceof Point	//true
```

>注：对于判别是否为一个数组，比较好的方式是用Array.isArray()

<br>

# 3、constructor

- 可以识别标准类型(Undefined/Null除外)
- 可以识别内置对象类型
- 可以识别自定义对象类型，不能识别父子关系

缺点：不能识别Undefined/Null，不能检测祖先类型，
			若完全重写prototype，自定义对象类型会无法识
```js
//（1）可以识别标准类型(Undefined/Null除外)
"bty".constructor === String;    //true
1.constructor === Number;        //报错
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
####  注："bty".constructor 的实质 

字符串bty是基本类型值，而却访问了constructor属性

```
其实在后台发生了 ① 创建String类型的一个实例。②在实例上调用指定的方法。 ③ 销毁这个实例

即相当于执行了 ① var temp = new String("bty"); ② temp.constructor ③ temp = null;
```
`true.constructor`、`(1).constructor` 也是同样的原理。

<br>

# 4、Object.prototype.toString.call()


当 toString 方法被调用的时候，下面的步骤会被执行：

```
1. 如果 this 值是 undefined，就返回 [object Undefined]
2. 如果 this 的值是 null，就返回 [object Null]
3. 让 O 成为 ToObject(this) 的结果
4. 让 class 成为 O 的内部属性 [[Class]] 的值
5. 最后返回由 "[object " 和 class 和 "]" 三个部分组成的字符串
```

通过上述步骤我们知道了调用 Object.prototype.toString 会返回一个由 "[object " 和 class 和 "]" 组成的字符串，而 class 是要判断的对象的内部属性。

举个例子：

```js
console.log(Object.prototype.toString.call(undefined)) // [object Undefined]
console.log(Object.prototype.toString.call(null)) // [object Null]

var date = new Date();
console.log(Object.prototype.toString.call(date)) // [object Date]
console.log(Object.prototype.toString.call(location)); // [object Location]
console.log(Object.prototype.toString.call(history)); // [object History]
console.log(Object.prototype.toString.call(new Promise(function() {}))); // [object Promise]
```

由此我们可以看到这个 class 值就是识别对象类型的关键！我们可以用 Object.prototype.toString 方法识别出更多类型！


## 4.1、优缺点：

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
var symbol = Symbol(); // [object Symbol]


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
checkType(number, string, boolean, und, nul, symbol, obj, array, date, error, reg, func, sam, Person, sam2);
```

```js
console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]

function a() {
    console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
}
a();
```

## 4.2、type API

既然有了 Object.prototype.toString 这个神器！那就让我们写个 type 函数帮助我们以后识别各种类型的值吧！

我的设想：

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

考虑到实际情况下并不会检测 Math 和 JSON，所以去掉这两个类型的检测。

我们来写一版代码：

```js
// 第一版
var class2type = {};

// 生成class2type映射
"Null Undefined Symbol Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}

console.log(type(null));     //object
console.log(type(undefined));//undefined
console.log(type([]));       //array
console.log(type(Array));    //function
```
我们发现type(null)输出的是object，与理想不符，

而且在 IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]！

那我们再改写一版：
```js
// 第二版
var class2type = {};

// 生成class2type映射
"Symbol Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
    class2type["[object " + item + "]"] = item.toLowerCase();
})

function type(obj) {
    // 一箭双雕 （undefined == null 为 true）
    if (obj == null) {
        return obj + "";  // (XXX + "")用来将XXX转换为字符串
    }
    
    return typeof obj === "object" || typeof obj === "function" ?
        class2type[Object.prototype.toString.call(obj)] || "object" :
        typeof obj;
}

console.log(type(null));     //null
console.log(type(undefined));//undefined
console.log(type([]));       //array
console.log(type(Array));    //function
```

>- 问：实现type方法的时候为什么不直接用Object.prototype.toString.call()的形式判断所有类型，而是将基本数据类型使用typeof呢？<br>
>- 答：用typeof判断效率更高一点 !![](https://user-images.githubusercontent.com/10160349/54362391-d180bf00-46a3-11e9-80f8-a590d3f49a12.png)

<br>

----

个人感觉写成下面这样更好些，（当然jQuery有其自身的考虑所以写成上形式）
```js
const class2type = "Symbol Boolean Number String Function Array Date RegExp Object Error"
  .split(" ")
  .reduce((prev, item) => {
    prev[`[object ${item}]`] = item.toLowerCase();
    return prev;
  }, {});

function type(obj) {
  //解决IE6 中的兼容
  if(null == obj) return '' + obj;

  return typeof obj !== "object"
    ? typeof obj
    : class2type[Object.prototype.toString.call(obj)] || 'object';
}

console.log(type(null)); //null
console.log(type([])); //array
```

----

<br>

# 5、数组isArray

jQuery 判断数组类型，旧版本是通过判断 Array.isArray 方法是否存在，如果存在就使用该方法，不存在就使用 type 函数。

```js
var isArray = Array.isArray || function( obj ) {
     // return Object.prototype.toString.call(obj) === '[object Array]';
     return type(obj) === "array";
}
```
<br><br>



# 二、类型判断进阶

## 1、EmptyObject

jQuery提供了 isEmptyObject 方法来判断是否为空对象，代码简单，我们直接看源码：

```js
function isEmptyObject( obj ) {
    var name;
    
    for ( name in obj ) {
       return false;
    }
    return true;
}

console.log(isEmptyObject({})); // true
console.log(isEmptyObject([])); // true

//但是根据这个源码我们可以看出isEmptyObject实际上判断的并不仅仅是空对象。
console.log(isEmptyObject(null)); // true
console.log(isEmptyObject(undefined)); // true
console.log(isEmptyObject(1)); // true
console.log(isEmptyObject('')); // true
console.log(isEmptyObject(true)); // true
```

其实所谓的 isEmptyObject 就是判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false。

<br>

#### 不建议使用Object.keys()方法来判断是否为空对象：

因为for in 还会遍历原型上的属性，而Object.keys()不会。
```js
function isEmptyObject2(obj) {
  return !!obj ? Object.keys(obj).length === 0 : true;
}

function Person() {}
Person.prototype.name = "111";
var person = new Person();

console.log(isEmptyObject(person)); //false
console.log(isEmptyObject2(person));//true
```
>注：用 !! 是做强制类型转换，将值转换为布尔值。

<br>

## 2、Window对象

Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身。我们可以利用这个特性判断是否是 Window 对象。

```js
function isWindow( obj ) {
    return !!obj && obj === obj.window;
    //return obj != null && obj === obj.window;
}
```
<br>

## 3、isElement

isElement 判断是不是 DOM 元素。
```js
isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
};
```
问：`!!(obj && obj.nodeType === 1)`为什么不能直接写成 `obj && obj.nodeType === 1`

答：isElement 函数用来判断元素是否是 Element，返回值只能是布尔值（true 或 false）。

|| 和 && 的返回值实际上不是布尔值，而是返回比较中的两个值中的一个，用 !! 是做强制类型转换，将值转换为布尔值。

<br>

## 4、isArrayLike

现在我们来看jQuery 中的 isArrayLike 函数

isArrayLike 看名字可能会让我们觉得这是判断伪数组对象的，其实不仅仅是这样，

jQuery 实现的 isArrayLike，`数组和伪数组`都会返回 true。

因为源码比较简单，我们直接看源码：

```js
function isArrayLike(obj) {

    // obj 必须有 length属性
    var length = !!obj && "length" in obj && obj.length;
    var typeRes = type(obj);

    // 排除掉函数和 Window 对象
    if (typeRes === "function" || isWindow(obj)) {
        return false;
    }

    return typeRes === "array" || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}
```
注：用 !! 是做强制类型转换，将值转换为布尔值。



>满足以下3个条件即为：伪数组
>- 是对象，不是数组（ obj instanceof Array === false）
>- 必须有length属性，但如果这个对象的length不为0，那么必须要按照数组下标存储数据  （ `{ length: 0 } 就是个伪数组` ）
>- 不能调用push()、indexOf()等 数组方法

重点分析 return 这一行，使用了或语句，只要一个为 true，结果就返回 true。

所以如果 isArrayLike 返回true，至少要满足三个条件之一：

1. 是数组
2. 长度为 0 （ `{ length: 0 } 就是个伪数组` ）
3. lengths 属性是大于 0 的数组，并且obj[length - 1]必须存在

第一个就不说了（是功能要求），看第二个，为什么长度为 0 就可以直接判断为 true 呢？

那我们写个对象：

```js
var obj = {a: 1, b: 2, length: 0}
```

isArrayLike 函数就会返回 true，那这个合理吗？

回答合不合理之前，我们先看一个例子：

```js
function a(){
    console.log(isArrayLike(arguments))
}
a();
```

如果我们去掉length === 0 这个判断，就会打印 false，然而我们都知道 arguments 是一个伪数组对象，这里是应该返回 true 的。

所以是不是为了放过空的 arguments 时也放过了一些存在争议的对象呢？

第三个条件：length 是数字，并且 length > 0 且最后一个元素存在。

为什么仅仅要求最后一个元素存在呢？

让我们先想下数组是不是可以这样写：

```js
var arr = [,,3]
```

当我们写一个对应的伪数组对象就是：

```js
var arrLike = {
    2: 3,
    length: 3
}
```

也就是说当我们在数组中用逗号直接跳过的时候，我们认为该元素是不存在的，伪数组对象中也就不用写这个元素，但是最后一个元素是一定要写的，要不然 length 的长度就不会是最后一个元素的 key 值加 1。比如数组可以这样写

```js
var arr = [1,,];
console.log(arr.length) // 2
```

但是伪数组对象就只能写成：

```js
var arrLike = {
    0: 1,
    length: 1
}
```

所以符合条件的伪数组对象是一定存在最后一个元素的！

这就是满足 isArrayLike 的三个条件，其实除了 jQuery 之外，很多库都有对 isArrayLike 的实现，比如 underscore:

```js
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1; //避免内存溢出

var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};
```
<br>

----
个人感觉这么写更好些：
```js
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1; //避免内存溢出

function isArrayLike(obj) {
  if (isWindow(obj) || type(obj) === "function") {
    return false;
  }

  const length =
    !!obj &&
    typeof obj.length === "number" &&
    obj.length >= 0 &&
    obj.length <= MAX_ARRAY_INDEX &&
    obj.length;

  if (isElement(obj) && length) {
    return true;
  }

  return (
    Array.isArray(obj) || length === 0 || (length > 0 && length - 1 in obj)
  );
}
```
----

<br>

## 5、plainObject

https://segmentfault.com/a/1190000013403810



plainObject 来自于 jQuery，可以翻译成纯粹的对象。

所谓 纯粹的对象 即：
- 该对象由 `Object` 构造函数创建：即由 `{ }`、`new Object()` 创建
- 或该对象的`原型对象`为 null ： 即由 `Object.create(null)`创建


之所以要判断是不是 plainObject，是为了跟其他的 JavaScript对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回object。

jQuery提供了 isPlainObject 方法进行判断，先让我们看看使用的效果：

```js
function Person(name) {
    this.name = name;
}

//由 `Object` 构造函数创建
console.log($.isPlainObject({})) // true
console.log($.isPlainObject({a:1})) // true
console.log($.isPlainObject(Object.assign({a: 1}, {b: 2}))); // true
console.log($.isPlainObject(new Object)) // true
console.log($.isPlainObject(new Object())) // true
console.log($.isPlainObject(new Object({1:2}))) // true
console.log($.isPlainObject(new Person('yayu'))); // false

//该对象的`原型对象`为 null
console.log($.isPlainObject(Object.create(null))); // true
console.log($.isPlainObject(Object.create({}))); // false
console.log($.isPlainObject(Object.create(new Object()))); // false
```

由此我们可以看到，除了 {} 和 new Object 创建的之外，jQuery 认为一个没有原型的对象也是一个纯粹的对象。

实际上随着 jQuery 版本的提升，isPlainObject 的实现也在变化，我们今天讲的是 3.3.1 版本下的 isPlainObject，我们直接看源码：

```js
var class2type = {};

//Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。
var getProto = Object.getPrototypeOf;

//相当于  Object.prototype.toString
var toString = class2type.toString;

//hasOwnProperty() 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性
//相当于 Object.prototype.hasOwnProperty
var hasOwn = class2type.hasOwnProperty;

//因为 hasOwn 是一个函数，所以这里调用的是内置对象 Function 的toString() 方法
//相当于  Function.prototype.toString
var fnToString = hasOwn.toString;

//相当于  Function.prototype.toString.call(Object)
//就是Object 构造函数 转字符串的结果
// ObjectFunctionString 其实就是 "function Object() { [native code] }" 这样的一个字符串
var ObjectFunctionString = fnToString.call(Object);

function isPlainObject(obj) {
  var proto, Ctor;

  //先去掉类型不是 Object 的
  //也就是用 Object.prototype.toString.call(obj) 这种方式，返回值不是 "[object Object]" 的，比如 数组 window history
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }

  //获取对象原型，赋值给 proto
  proto = getProto(obj);

  //如果对象没有原型，那也算纯粹的对象，比如用 Object.create(null) 这种方式创建的对象
  if (!proto) {
    return true;
  }

  //最后判断是不是通过 "{}" 或 "new Object" 方式创建的对象
  //如果 proto 有 constructor属性，Ctor 的值就为 proto.constructor，
  //原型的 constructor 属性指向关联的构造函数
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

  //如果 Ctor 类型是  "function" ，并且调用Function.prototype.toString 方法后得到的字符串 与 "function Object() { [native code] }" 这样的字符串相等就返回true
  //用来区分 自定义构造函数和 Object 构造函数
  return (
    typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString
  );
}
```
从源码来看，isPlainObject()方法 的实现，主要分三部分

#### 1、去掉类型不是Object 的

用的是 `Object.prototype.toString.call()` 方法

#### 2、判断对象有没有原型，没有原型的对象算纯粹对象

#### 3、判断是不是通过 `{}` 或 `new Object` 方式创建的对象

这就要判断他们的构造函数了，所以用 `Function.prototype.toString` 方法, 

>Function 对象覆盖了从 Object 继承来的 Object.prototype.toString 方法。
>函数的 toString 方法会返回一个表示函数源代码的字符串。具体来说，包括 function关键字，形参列表，大括号，以及函数体中的内容。

```js
function fn(said) {
  this.say = said;
}

Function.prototype.toString.call(fn);
//"function fn(said){
//    this.say = said;
//}"

Function.prototype.toString.call(Object);
//"function Object() { [native code] }"
```

<br>







