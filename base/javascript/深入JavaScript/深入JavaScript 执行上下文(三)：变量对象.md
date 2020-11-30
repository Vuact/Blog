# 变量对象

变量对象是与执行上下文相关的数据作用域，存储了在上下文中定义的变量和函数声明。因为不同执行上下文下的变量对象稍有不同，所以我们来聊聊全局上下文下的变量对象和函数上下文下的变量对象。

- 变量对象 / 活动对象：每个执行环境都有一个变量对象，环境中定义的所有变量和函数都保存在这个对象中。如果这个环境是函数，则将其 活动对象 作为变量对象。

<br>

### 1、全局上下文
我们先了解一个概念，叫全局对象。在 W3School 中也有介绍：

> （1）全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。
（2）在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。

其实 `全局对象 就是 全局上下文中的 变量对象`~~

```javascript
//（1）可以通过 this 引用，在客户端 JavaScript 中，全局对象就是 Window 对象。
console.log(this);  //window

//（2）全局对象是由 Object 构造函数实例化的一个对象。
console.log(this instanceof Object);  //true

//（3）作为全局变量的宿主。
var a = 1;
console.log(this.a);   //1

//（4）客户端 JavaScript 中，全局对象有 window 属性指向自身。
var a = 1;
console.log(window.a);  //1

this.window.b = 2;
console.log(this.b);   //2
```
<br>

### 2、函数上下文
在函数上下文中，我们用活动对象(activation object, AO)来表示变量对象。

活动对象和变量对象其实是一个东西，只是变量对象是规范上的或者说是引擎实现上的，不可在 JavaScript 环境中访问，`只有当 变量对象 进入一个函数执行上下文中，这个执行上下文的变量对象才会被激活，所以才叫 activation object` ，而只有被激活的变量对象，也就是`活动对象`上的各种属性才能被访问。

活动对象是在进入函数上下文时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性值是 Arguments 对象。

<br>

### 3、执行过程
执行上下文的代码会分成两个阶段进行处理：分析和执行，我们也可以叫做：

- （1）进入执行上下文（分析阶段）
- （2）代码执行（执行阶段）

------
**（1）进入执行上下文 (分析阶段)**

当进入执行上下文时，这时候还没有执行代码，

变量对象会包括：（处理顺序由上到下：形参 > 函数声明 > 变量声明）

- 1、函数的所有形参 (如果是函数上下文)
  - 由名称和对应值组成的一个变量对象的属性被创建
  - 没有实参，属性值设为 undefined
- 2、函数声明
  - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建
  - 如果变量对象已经存在相同名称的属性，则完全替换这个属性
- 3、变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性

举个例子：

```javascript
function foo(a) {
  	var b = 2;
  	function c() {}
  	var d = function() {};
  	b = 3;
}

foo(1);
```
在进入执行上下文后，这时候的 AO 是：

```javascript
//变量初始化顺序：看序号

AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,								  //（1）
    b: undefined,						  //（3）
    c: reference to function c(){},	      //（2）
    d: undefined						  //（4）
}
```

**（2）代码执行 (执行阶段)**
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值。
还是上面的例子，当代码执行完后，这时候的 AO 是：

```javascript
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c(){},
    d: reference to FunctionExpression "d"
}
```

> 总结上述：
1、 全局上下文的变量对象初始化是全局对象
2、函数上下文的变量对象初始化只包括 Arguments 对象
3、在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
4、在代码执行阶段，会再次修改变量对象的属性值

<br>

### 4、思考题
**例1：**

```javascript
function foo() {
    console.log(a);
    a = 1;
}

foo(); // ???

function bar() {
    a = 1;
    console.log(a);
}
bar(); // ???
```
第一段会报错：Uncaught ReferenceError: a is not defined。
第二段会打印：1。

这是因为函数中的 “a” 并没有通过 var 关键字声明，所有不会被存放在 AO 中。
第一段执行 console 的时候， AO 的值是：

```javascript
AO = {
    arguments: {
        length: 0
    }
}
```
没有 a 的值，然后就会到全局去找，全局也没有，所以会报错。

当第二段执行 console 的时候，全局对象已经被赋予了 a 属性，这时候就可以从全局找到 a 的值，所以会打印 1。


**例2：**


```javascript
console.log(foo);  //???

function foo(){
    console.log("foo");
}

var foo = 1;
```
打印: `ƒ foo(){console.log("foo");}`，而不是 undefined 。

在进入执行上下文时，首先会处理函数声明，其次会处理变量声明，如果如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

**例2.1**

```javascript
var foo = 1;
console.log(foo); //???
function foo(){
  	console.log("foo");
};
```
打印: 1

有些人会问：为什么不打印foo函数呢？是例2说法错了吗？
并不是！
因为我们在上面提到了：`在分析阶段的  变量声明时，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性`

我们可以把上面代码分解成如下顺序执行：
```javascript
//******************  进入执行上下文（分析）  阶段  ******************
function foo(){
  	console.log("foo");
};
var foo; 	// 如果如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性//所以不用管这句

//*** 到此，VO为：VO = { foo: reference to function foo(){}}

//*********************  代码执行（执行） 阶段  *********************

foo = 1;	// 这里是代码执行阶段，foo=1覆盖了原来的函数。// 如果没有这行，打印结果是 function foo()
//*** 到此，VO为：VO = { foo: 1}

console.log(foo); // 1
```
**例2.2**
```javascript
console.log(foo);  //？？？
var foo = 1;
console.log(foo); //？？？
function foo(){};
```
第一行打印：ƒ foo(){console.log(“foo”);}
第二行打印：1

可以这么理解：
```javascript
foo() 			     //函数提升
var foo			     //和函数重名了，被忽略
console.log(foo);	 //打印函数
foo = 1;		     //全局变量foo
console.log(foo);	 //打印1，事实上函数foo已经不存在了，变成了1
```


