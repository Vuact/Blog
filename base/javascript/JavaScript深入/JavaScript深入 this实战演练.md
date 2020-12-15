# 一、漫谈
JavaScript中的this格外的不一样，比如Java语言中的this是在代码的执行阶段是不可更改，而JavaScript的this是在调用阶段，根据执行上下文进行绑定。


**this的定义：** this是在执行上下文创建时确定的一个在执行过程中不可更改的变量。

**只在函数调用阶段确定：** this只在函数调用阶段确定，也就是执行上下文创建的阶段进行赋值，保存在变量对象中。这个特性也导致了this的多变性:即当函数在不同的调用方式下都可能会导致this的值不同。

<br>

# 二、细谈

下面分别就下面几种this使用情况 展开讨论：

 - 在全局环境或普通函数中直接调用
 - 对象中调用
 - 作为构造函数
 - 使用apply和call
 - eval() 中的 this
 - bind() 中的 this
 - DOM 事件处理函数中的 this
 - 内联事件处理函数中的 this



### 1、直接调用（在全局环境或普通函数中）

- 非严格模式：this先指向undefined,然后再自动指向Window。
- 严格模式：this指向undefined

以下的代码均是在 非严格模式下。

#### 例1： 
```javascript
var a = 10;
console.log(this.a); //10 
console.log(this === window);//true

var obj = { a: this }
console.log(obj.a); //Window
//若在严格模式下：this会指向undefined 
```

#### 例2：
```javascript
var a = 1;
function fun() {
	var a = 2;
  	return this.a;
}
fun();//1

//若在严格模式下：运行fun()会报错
```
#### 例3：
```javascript
var a = 1;
var obj = {
    a:2,
    b:function(){
        function fun(){
            return this.a;
        }
        console.log(fun());
    }
};
obj.b();//1
```
fun函数虽然在obj.b方法中定义，但它还是一个普通函数，直接调用在非严格模式下指向undefined，又自动指向了全局对象，正如预料，严格模式会报错undefined.a不成立，a未定义。

<br>

#### 例4：看下面闭包
```javascript
var name = "The Window";　　
var object = {　　　　
    name: "My Object",
    getNameFunc: function() {　　　　　　
        var that = this;　　　　　　
        return function() {
	        //that是在对象方法中调用的
        	console.log(that.name);　//My Object　
        	//this是在普通函数中调用的　　　
            console.log(this.name);　//The Window　　　
        };　　　　
    }　　
};　　
object.getNameFunc()(); 
```
你可能很困惑，其实上面程序 this是在普通函数中调用的，而that是在对象方法中调用的。详见下面（**2、对象中调用**）

<br>

**特殊：** 
在new Function()里面的this，不论它是在构造函数中，还是函数调用中， 
this都指向 全局对象。

<br>

#### 例5 
```javascript
(function(){
    var f = new Function('alert(this)');
    f();
})();

//或
function Foo(){
    this.bar = function(){
        var f = new Function('alert(this)');
        f();
    }
}
var foo = new Foo();
foo.bar();
```

<br>

### 2、对象中调用
（1）作为对象的方法 调用

#### 例1：
```javascript
var a = 1;
var obj = {
    a: 2,
    b: function() {
       return this.a;
    }
}
console.log(obj.b())//2

```
b所引用的匿名函数作为obj的一个方法调用，这时候this指向调用它的对象。这里也就是obj。那么如果b方法不作为对象方法调用呢？看下面

（2）不作为对象的方法 调用

<br>

#### 例2：
```javascript
var a = 1;
var obj = {
    a: 2,
    b: function() {
       return this.a;
    }
}
var t = obj.b;
console.log(t());//1

```
如上，t函数执行结果竟然是全局变量1，为啥呢？这就涉及Javascript的内存空间了，就是说，obj对象的b属性存储的是对该匿名函数的一个引用，可以理解为一个指针。当赋值给t的时候，并没有单独开辟内存空间存储新的函数，而是让t存储了一个指针，该指针指向这个函数。

<br>

#### 例3：
当obj在全局声明的时候，obj内部属性中的this指向全局对象，当obj在一个函数中声明的时候，严格模式下this会指向undefined，非严格模式自动转为指向全局对象。
```javascript
var a = 1000;
var obj = {
	a: 1,
  	b: this.a + 1
}
function fun() {
	var obj = {
      	a: 1,
		c: this.a + 2 //严格模式下这块报错 Cannot read property 'a' of undefined
    }
    return obj.c;
}
console.log(fun());//1002
console.log(obj.b);//1001
```

<br>

### 3、作为构造函数

何为构造函数？所谓构造函数就是用来new对象的函数，像Function、Object、Array、Date等都是全局定义的构造函数。其实每一个函数都可以new对象，那些批量生产我们需要的对象的函数就叫它构造函数罢了。注意，构造函数首字母记得大写。

#### 例1
构造函数中的this：指向新创建的对象（红圈部分）
![这里写图片描述](https://img-blog.csdn.net/20180720173237369?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2I5NTQ5NjA2MzA=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
另外还有一点，prototype对象的方法的this指向实例对象，因为实例对象的
__ proto __已经指向了原型函数的prototype。这就涉及原型链的知识了，即方法会沿着对象的原型链进行查找。实际上不仅仅是构造函数的prototype，即便是在整个原型链中，this代表的也都是当前对象的值。

<br>

#### 例2：
下面说明this指向实例 
```javascript
function Person(name){ 
	this.name = name; 
	console.log(this); 
} 
var sam1 = new Person('sam1'); 
var sam2 = new Person('sam2'); 
```
输出： 
Person {name: "sam1"}
Person {name: "sam1"} 
<br> 
**如果我改为这样呢？函数aaa()里的this指向哪呢？** 
```javascript
function Person(name){ 
	this.name = name; 
	function aaa(){ 
		console.log(this); 
	} 
	aaa(); 
} 
var sam1 = new Person('sam1'); 
```
输出: Window 

因为aaa()是个普通函数，有自己的上下文，所以this指向全局变量

<br>

### 4、使用apply和call

#### 例1： apply和call实际只是将 obj.b里的this指针的指向做了改变。
```javascript
var a = 1;
var obj = {
  a: 2,
  b: function() {
    return this.a;
  }
}
console.log(obj.b());   ///2
console.log(obj.b.apply(window));  //1
console.log(obj.b.call(window));   //1

//说明非严格模式下,this先指向undefined,然后再自动指向全局对象
console.log(obj.b.call(undefined)); //1

```


#### 例2：apply和call实际只是将 Point里的this指针的指向做了改变，point.move.call后，move方法开始指向circle对象。

```javascript
function Point(x,y){
    this.x = x;
    this.y = y;
    this.move = function(x,y){
        this.x += x;
        this.y += y;
    }
}
var point = new Point(0,0);
point.move(1,1);//移动到(1,1)

var circle = {x:0, y:0, r:1};//以（0，0）为圆心，1为半径的圆

//移动圆至（1，2）
point.move.apply(circle,[1,1]);
//或point.move.call(circle,1,1);
```
通过下面两行代码是等价的： 
point.move.apply(circle,[1,1]); 
point.move.call(circle,1,1);


**call与apply区别：** 
`两者区别仅在参数上。apply第二个参数必须是个数组(把函数调用的值依次传入)，而call把参数依次传入时用的不是数组，直接用逗号隔开而已，当然call第二个参数也可以是数组`.

注：箭头函数是一个不可以用call和apply改变this的典型。

<br>

### 5、eval() 中的 this
eval()中的this：指向调用上下文中的this

eval() 方法可以将字符串转换为 JavaScript 代码，使用 eval() 方法时，this 指向哪里呢？答案很简单，看谁在调用 eval() 方法，调用者的执行环境中的 this 就被 eval() 方法继承下来了。

#### 例：
```javascript
// 全局上下文
function f1(){
    return eval("this");
}
console.log(f1() === window); // true

// 函数上下文
var o = {
    name: "stone",
    f: function() {
        return eval("this.name");
    }
};
console.log(o.f()); // "stone"
```
<br>

### 6、bind() 中的 this
调用 f.bind(someObject) 会创建一个与 f 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的(即使调用call或apply也不能改变this的指向)

#### 例：

```javascript
function f() {
    return this.a;
}

var g = f.bind({
    a: "stone"
});
console.log(g()); // stone

var o = {
    a: 28,
    f: f,
    g: g
};
console.log(o.f(), o.g()); // 28, stone
g.call(o);                 //即使调用call或apply也不能改变this的指向
console.log(o.f(), o.g()); // 28, stone
```

<br>

### 7、DOM 事件处理函数中的 this
一般来讲，当函数使用 `addEventListener`，被用作事件处理函数时，它的 this 指向触发事件的元素。如下代码所示：

```javascript
<button id="btn" type="button">click</button>

<script>
   var btn = document.getElementById("btn");
   btn.addEventListener("click", function(){
          this.style.backgroundColor = "#A5D9F3";
   }, false);
</script>
```
但在 IE 浏览器中，当函数使用` attachEvent` ，被用作事件处理函数时，它的 this 却指向 window。如下代码所示：

```javascript
 <button id="btn" type="button">click</button>
 
 <script>
	 var btn = document.getElementById("btn");
     btn.attachEvent("onclick", function(){
          console.log(this === window);  // true
     });
 </script>
```

<br>

### 8、内联事件处理函数中的 this
当代码被内联处理函数调用时，它的 this 指向监听器所在的 DOM 元素。如下代码所示：

```javascript
<button onclick="alert(this.tagName.toLowerCase());">
  Show this
</button>
```
上面的 alert 会显示 button，注意只有外层代码中的 this 是这样设置的。如果 this 被包含在匿名函数中，则又是另外一种情况了。如下代码所示：

```javascript
<button onclick="alert((function(){return this})());">
  Show inner this
</button>
```
在这种情况下，this 被包含在匿名函数中，相当于处于全局上下文中，所以它指向 window 对象。

<br>
<br>

# 三、箭头函数
箭头函数是一个不可以用call和apply改变this的典型。

#### 例1

```javascript
var a = 1;
var obj = {
  a: 2
};
var fun = () => console.log(this.a);
fun();       	//1
fun.call(obj)	//1
```
以上，两次调用都是1。

那么箭头函数的this是怎么确定的呢？`箭头函数会捕获其所在上下文的 this 值，作为自己的 this 值，也就是说箭头函数的this在词法层面就完成了绑定。`apply，call方法只是传入参数，却改不了this。


<br>

#### 例2
```javascript
var a = 1;
var obj = {
  a: 2
};
function fun() {
    var a = 3;
	let f = () => console.log(this.a);
  	f();
};
fun();//1
fun.call(obj);//2
```
如上，fun直接调用，fun的上下文中的this值为window，注意，这个地方有点绕。fun的上下文就是此箭头函数所在的上下文，因此此时f的this为fun的this也就是window。当fun.call(obj)再次调用的时候，新的上下文创建，fun此时的this为obj，也就是箭头函数的this值。


<br>

#### 例3
```javascript
function Fun() {
	this.name = 'Damonare';
}
Fun.prototype.say = () => {
	console.log(this);
}
var f = new Fun();
f.say();//window
```
你可能会感觉this应该指向f这个实例对象啊。不是的，此时的箭头函数所在的上下文是__ proto __所在的上下文也就是Object函数的上下文，而Object的this值就是全局对象。

<br>

#### 例4
```javascript
function Fun() {
	this.name = 'Damonare';
  	this.say = () => {
		console.log(this);
	}
}
var f = new Fun();
f.say();   //Fun的实例对象
```
如上，this.say所在的上下文，此时箭头函数所在的上下文就变成了Fun的上下文环境，而因为上面说过当函数作为构造函数调用的时候(也就是new的作用)上下文环境的this指向实例对象。
