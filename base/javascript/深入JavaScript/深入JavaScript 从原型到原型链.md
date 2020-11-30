![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211113523701.png)

# 一、构造函数、原型对象、实例对象的关系 及延伸
```javascript
function Foo(){}   	  			//Foo为构造函数
Foo.prototype.name = 'Feidian';  //Foo.prototype即原型对象
var f1 = new Foo()	 	        //f1 为 实例对象
```
要想了解Foo、Foo.prototype、f1 之间的关系，我们就要理解
prototype、__proto __、constructor 。

<br>

### 1、prototype
函数都有 prototype属性（即原型对象)：该原型对象保存着所有实例对象的 公共属性和方法。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211142552339.png)
```javascript
function Foo(){}   	  			
Foo.prototype.name = 'Feidian';  
var f1 = new Foo();	 	      

console.log(f1.name);   //'Feidian'
```
f1是Foo函数new出来的实例，访问 f1.name，实际访问的
是Foo.prototype中的name属性。

> 注：
> 基本上所有函数都有 prototype 属性，除了下面例子：
> `let fun = Function.prototype.bind()`


<br>

### 2、__proto __
每个js对象(除了 null )都有 __proto__属性(指针)：
__proto__指向着创造该js对象的构造函数 的prototype.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211142451451.png)

```javascript
function Foo(){}   	  			
Foo.prototype.name = 'Feidian';  
var f1 = new Foo();

console.log(f1.__proto__ === Foo.prototype);  // true
```
f1通过__proto__，指向着Foo的原型对象。

<br>

### 3、constructor
原型对象都有 constructor属性(指针)：它指向着该原型对象的拥有者。

                             
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211143338258.png)

```javascript
function Foo(){}   	  			
Foo.prototype.name = 'Feidian';  
var f1 = new Foo();

console.log(Foo.prototype.constructor === Foo)     // true
```
Foo.prototype的constructor，指向着构造函数Foo
<br>

##### （1）注意:
若完全重写prototype，需要为重写后的prototype增加constructor属性，并指定其指向。
参考：[关于 “JavaScript重写原型对象后设置constructor” 的误解](https://blog.csdn.net/b954960630/article/details/84997144)


例：
```javascript
console.log(Foo.prototype.constructor);  //ƒ Foo(){}
Foo.prototype = {};    //重写prototype
console.log(Foo.prototype.constructor);  //ƒ Object() { [native code] }
```


改：
```javascript
console.log(Foo.prototype.constructor);  //ƒ Foo(){}
Foo.prototype = {constructor:Foo}        //重写，让constructor重新指向Foo
console.log(Foo.prototype.constructor);  //ƒ Foo(){}
```

##### （2）注意:
实例对象调用constructor，实际上调用的是原型对象的constructor。

```javascript
console.log(f1.constructor === Foo.prototype.constructor); //true
```

<br>

### 4、继续拓展关系
##### （1）Foo.prototype.__proto __指向哪里？

我们知道：`原型对象是一个对象，对象是由Object构造函数创造的`；因而得知Foo.prototype是由构造函数Object创造的。

前面又提到：__proto__指向着创造该js对象的构造函数 的prototype。所以`Foo.prototype.__proto __ 指向着Object.prototype`

再根据前面讲的prototype、constructor，可以将图更新为：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211181515874.png)

##### （2）Object.prototype.__proto __指向哪里？
我们用 (1) 的理论推测Object.prototype.__proto __的指向，发现按上面理论讲它应该指向它自己，但实际并不是。

```javascript
console.log(Object.prototype.__proto__ === null) // true
```
通过上面代码，我们发现`Object.prototype.__proto __指向为null`。意味着Object.prototype没有原型。

所有对象都可以通过原型链最终找到 Object.prototype ，虽然 Object.prototype 也是一个对象，但是这个对象却不是 Object 创造的，而是`引擎自己创建了 Object.prototype` 。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211172001439.png)
##### （3）Object.__proto __指向哪里？
我们知道：`Object()是一个构造函数，函数都是由new Function()生成的`；因而Object()也是由构造函数Function创造的。

前面又提到：__proto__指向着创造该js对象的构造函数 的prototype。所以`Object.__proto__ 指向着Function.prototype`

再根据前面讲的prototype、constructor，可以将图更新为：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211184009901.png)


##### （4）Function.__proto __指向哪儿？Function.prototype.__proto __又指向哪儿？

```javascript
console.log(Function.__proto__ === Function.prototype); //true
console.log(Function.prototype.__proto__ === Object.prototype); //true
```
通过上面代码，我们发现：
- 问题一：`Function.__proto __ 指向 Function.prototype`。难道Function自己创造了自己？
- 问题二：`Function.prototype.__proto__ 指向 Object.prototype`。用之前理论分析没毛病，但具体原因不是我们分析的那样。往后看？


如果你在浏览器将`Function.prototype对象`打印出来，会发现`这个对象其实是一个函数`:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211192944847.png)

我们知道函数都是通过 new Function() 生成的，难道Function.prototype 是通过 new Function() 产生的？答案也是否定的。`Function.prototype也是引擎自己创建的`。

`首先引擎创建了 Object.prototype ，然后创建了 Function.prototype ，并且通过 __proto __ 将两者联系了起来。并且是：先有的 Function.prototype ，之后才有的 function Function()。`

> 通过上面，我们就知道了为什么 let fun = Function.prototype.bind() 没有 prototype 属性。
> 因为 Function.prototype 是引擎创建出来的对象，引擎认为不需要给这个对象添加 prototype 属性。


对于为什么 Function.__proto __ 会等于 Function.prototype ，有这么种理解是：其他所有的构造函数都可以通过原型链找到 Function.prototype ，并且 function Function() 本质也是一个函数，为了不产生混乱就将 function Function() 的 __proto __ 联系到了 Function.prototype 上。




<br>

再更新一下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211185751875.png)


##### （5）Foo.__proto __指向哪里？

我们知道：`Foo是一个构造函数，函数都是由new Function()生成的`；因而Foo也是由构造函数Function创造的。

前面又提到：__proto__指向着创造该js对象的构造函数 的prototype。所以`Foo.__proto__ 指向着Function.prototype`

![在这里插入图片描述](https://img-blog.csdnimg.cn/2018121119550756.png)


<br>

### 小结：
- Object 是所有对象的爸爸，所有对象都可以通过 __proto __ 找到它
- Function 是所有函数的爸爸，所有函数都可以通过 __proto __ 找到它
- 引擎先创造了 Object.prototype ，又创造了Function.prototype ，并通过__proto__将两者关联了起来。其中Function.prototype是个函数.
- 除了上面两个，其他对象都是被构造器new出来的。


---

<br>

# 二、原型链及操作
### 1、什么是原型链？
简单点理解，就是由若干__proto__连起来形成的链条，就是原型链。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018121119550756.png)

拿上面例子来说：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211160921419.png)
就是一条原型链;(f1能使用Foo.prototype和Object.prototype里的属性和方法，即实现面向对象编程语言的继承关系)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211210517727.png)
也是一条原型链;

<br>

概念：
构造函数C的prototype有一个指针(__proto__) 指向 构造函数B的prototype；
B的prototype的指针又指向 构造函数A的prototype，以此类推形成的原型的链条
继承关系为C -> B -> A，A是祖先。


<br>

### 2、原型链的操作

```javascript
function Foo(){}   	  			
Foo.prototype.name = 'Feidian'; 
var f1 = new Foo();

f1.name = 'bty';
console.log(f1.name); 	   //'bty'
delete f1.name;
console.log(f1.name);       //'Feidian'
console.log(f1.toString()); //'[object Object]'
```
上面例子的原型链如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181211160921419.png)

下面我们看看执行后五句，发生了什么：

- f1.name = 'bty';
先在f1对象上查找有没有name属性，发现没有，则直接在f1对象上添加name属性,并赋值为’bty’ ；
若发现f1上有name属性，则直接修改f1的name的值。
- console.log(f1.name);
先在f1对象上查找有没有name属性，发现有，则输出 'bty'
- delete f1.name;
删除f1的name属性。
若f1没有name属性，delete f1.name后，也不会对Foo原型上的属性造成影响。
- console.log(f1.name); 
先在f1对象上查找有没有name属性，发现没有；再到看看Foo.prototype上有没有，发现有，则输出 'Feidian'
- console.log(f1.toString());
先在f1对象上找有没有toString()方法，没有；再看看Foo.prototype上有没有，还有没；再沿着原型链到Object.prototype上找，发现有，则调用该方法。


### 3、练习
```js
Object.prototype.a = 'a'

Function.prototype.b = 'b'

function Animal() {}

const obj = new Animal()

console.log(obj.a) // 'a'
console.log(obj.b) // undefined
```
看下面原型链得以上输出
```
原型链：obj => Animal.prototype => Object.prototype
```
