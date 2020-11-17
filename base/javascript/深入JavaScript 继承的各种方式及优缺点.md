# 一、原型链继承
### 1、优点
可以属性复用

```javascript
function Parent () {
    this.name = 'bty';
}
Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child () {}
Child.prototype = new Parent();
Child.prototype.constructor = Child;   

var child1 = new Child();
console.log(child1.getName()) //'bty'
```
### 2、缺点
（1）引用类型的属性被所有实例共享

```javascript
function Parent () {
    this.names = ["hourse", "pig"];
}
Parent.prototype.getName = function () {
	console.log(this.names);
};
function Child () {}
Child.prototype = new Parent();
Child.prototype.constructor = Child; 

var child1 = new Child();
child1.names.push('rabbit');
child1.getName();    // ["hourse", "pig", "rabbit"]

var child2 = new Child();
child2.getName();    // ["hourse", "pig", "rabbit"]

```
（2）在创建 Child 的实例时，不能向Parent传参
### 3、思考
**问：** 
要让Child继承Parent，为什么非要Child.prototype = new Parent();
改成`Child.prototype = Parent.prototype;`不行吗？

**答：** 这样的话，增加 Child.prototype.testProp = 1; 同时会影响 Parent.prototype 的。


<br>

# 二、借用构造函数(经典继承)
经典继承解决了 上面的两个缺点，但却没有原型链继承的属性复用 的优点。
### 1、优点：
（1）避免了引用类型的属性被所有实例共享

```javascript
function Parent () {
    this.names = ["hourse", "pig"];
    this.getName = function() {
    	console.log(this.names);	
    };
}
function Child () {
	Parent.call(this); 
}

var child1 = new Child();
child1.names.push('rabbit');
child1.getName();     // ["hourse", "pig", "rabbit"]

var child2 = new Child();
child2.getName();     // ["hourse", "pig"]
```
（2）可以在 Child 中向 Parent 传参
```javascript
function Parent (name) {
    this.name = name;
    this.getName = function () {
    	console.log(this.name);	
    };
}
function Child (name) {
	Parent.call(this, name);  //或Parent.apply(this, [name]);
}

var child1 = new Child('bty');
child1.getName();     // 'bty'

var child2 = new Child('web');
child2.getName();     // 'web'
```
### 2、缺点：
（1）方法都在构造函数中定义，因此属性复用就无从谈起了，而且这样每次创建实例都会创建一遍方法。


<br>

# 三、组合继承
- 原型链继承 优点：属性复用
- 经典继承 优点：① 子类可以向父类传参 ② 避免了引用类型的属性被所有实例共享

组合继承就是集两者优点于一身，是 JavaScript 中最常用的继承模式。
`组合继承 = 原型链继承 + 经典继承`


### 1、优点：
```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name)
}

function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;   

var child1 = new Child('bty', '18');
child1.colors.push('black');
console.log(child1.name); // 'bty'
console.log(child1.age); // '18'
console.log(child1.colors); // ["red", "blue", "green", "black"]

var child2 = new Child('sam', '20');
console.log(child2.name); // 'sam'
console.log(child2.age); // '20'
console.log(child2.colors); // ["red", "blue", "green"]
```
### 2、缺点：
（1）无论在什么情况下，都调用了两次父构造函数。

- 第一次调用：是设置子类原型 的时候：
```javascript
Child.prototype = new Parent();
```


- 第二次调用：在创建实例`var child1 = new Child('bty', '18')`后，执行了如下语句的时候：
```javascript
Parent.call(this, name);
```
最关键的是第一次调用，在执行`Child.prototype = new Parent()`的时候：`Child.prototype一方面会继承Parent.prototype里的属性和方法；
另一方面会继承构造函数Parent new出实例的属性和方法。而从原型链的继承角度来看，后者显然是多余的，它只会让Child.prototype变得不纯净。`这就是new Parent()所带来的副作用。

那么我们应该怎么优化呢？继续往下看····

<br>

# 四、原型式继承

- 思想： 借助原型并基于已有的对象 来 创建新对象。

- 原型链继承与原型式继承：
  - 原型链继承：Child.prototype连接着Parent.prototype；即将Parent的实例 作为 Child的实例 的原型。
  - 原型式继承：Child.prototype连接着 传入的对象；即将传入的对象作为创建的对象的原型。

实现：
```javascript
function createObj(o) {
    function F(){}
    F.prototype = o;
    return new F();
}
```
`本质：createObj()对传入其中的对象进行了一次浅复制。`
其实上面代码就是 Object.create() 的模拟实现

### 1、缺点：
（1）引用类型的属性被所有实例共享

```javascript
var person = {
    name: 'bty',
    friends: ['sam', 'luncy']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); //'bty'

person1.firends.push('zz');
console.log(person2.friends); // ["sam", "luncy", "zz"]
```

（2）缺乏属性复用，每次创建实例都会创建一遍方法。

<br>

# 五、寄生式继承
虽然寄生式继承是原型式继承的增强版，但原来的不足都没有解决。（这里我们关注的是它的思想）

寄生式继承：创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象。

```javascript
function createObj (o) {
    var clone = Object.create(o);     //创造对象
    clone.sayName = function () {     //增强对象
        console.log('hi');
    }
    return clone;		             //返回对象
}
```
### 缺点：
（1）引用类型的属性被所有实例共享

```javascript
function createObj (o) {
    var clone = Object.create(o);
    clone.showFriends = function(){
    	console.log(this.friends);
    }
    clone.sayName = function () {
        console.log(this.name);
    }
    return clone;
}
var person = {
    name: 'web',
    friends: ['bty', 'bty2']
};

var person1 = createObj(person);
var person2 = createObj(person);

person2.sayName();    //'web'
person1.name = 'pig';
person2.sayName();    //'web'

person2.showFriends();  //["bty", "bty2"]
person1.friends.push('bty3');
person2.showFriends();  //["bty", "bty2", "bty3"]
```

（2）缺乏属性复用，每次创建实例都会创建一遍方法。

<br>

# 六、寄生组合式继承
上面提到组合继承的缺点：总是要调用两次父构造函数。
后来又说到，缺点的关键在于new Parent()会带来的副作用。
即：

> 在执行`Child.prototype = new Parent()`的时候，Child.prototype一方面会继承Parent.prototype里的属性和方法；另一方面会继承构造函数Parent new出的实例的属性和方法。而从原型链的继承角度来看，后者显然是多余的，它只会让Child.prototype变得不纯净。这就是new Parent()所带来的副作用。

我们怎么对Child.prototype = new Parent()进行改进？
即：我们应该怎么既能让Child.prototype继承Parent.prototype，又能避免Child.prototype继承构造函数Parent new出的实例的属性和方法呢？说白了就是怎么避开new带来的副作用。

**解决思路：** 让Child.prototype直接继承Parent.prototype，从而避开new Parent()，还减少了父构造函数的调用。

**方案一：（错）**
直接将`Child.prototype = new Parent()` 改为`Child.prototype = Parent.prototype`。
很明显不行，因为这样的话，增加 Child.prototype.testProp = 1; 同时会影响 Parent.prototype 的。


**方案二：（对）**
方案一不行是因为Parent.prototype和Child.prototype指向了同一个对象，改一个另一个也会发生变化。
那我给Parent.prototype复制个副本，然后再用这个副本给Child.prototype赋值，这样不就解决了方案一的问题了嘛~ 

这就要用到前面的寄生式继承了。

实现：
```javascript
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}

function prototype(child, parent) {
    var prototype = Object.create(parent.prototype);//创建对象
    prototype.constructor = child;                  //增强对象
    child.prototype = prototype;                    //指定对象
}
prototype(Child, Parent);

var child1 = new Child('bty', '18');
console.log(child1.name);		//'bty'
console.log(child1.colors);     //["red", "blue", "green"]
```

> 其实可以这么理解：
`Child.prototype = Object.create(Parent.prototype);`和 `Child.prototype = new Parent();`这两句，除去后者会继承Parent构造函数中多余的属性/方法外，这两句代码是等效的。

**寄生组合式继承的优点：**
这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

<br>

#### 继承核心就三点：
- 通过Parent.call(this, name) ： Child继承Parent的实例属性。   
- 通过Child.prototype = Object.create(Parent.prototype) ：Child.prototype继承Parent.prototype的属性和方法
- 改变Child.prototype.constructor的指向

<br>

# 七、继承练习

根据以下代码，实现Person和Student两个构造函数
```js
var person = new Person('sam', 18);
person.sayHi(); //I am sam

var student = new Student('amy', 18, '清华大学','一年级');
student.sayHi(); //I am amy
student.learn('javascript');//amy learn javascript
```

解：

#### ES5写法
```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.sayHi = function () {
    console.log('I am ' + this.name);
};

function Student(name, age, school, grade) {
    Person.call(this, name, age);
    this.school = school;
    this.grade = grade;
}
extend(Student, Person);
Student.prototype.learn = function (something) {
    console.log(`${this.name} learn ${something}`);
};

//继承函数
function extend(child, parent) {
    //child.prototype = Object.create(parent.prototype);
    //child.prototype.constructor = child;
    
    //与上两句等价
    child.prototype = Object.create(parent.prototype, {
	constructor: {
	    value: child,
	    writable: true,
	    configurable: true,
	    enumerable: false,
	},
    });
	    
    return child;
}
```

#### ES6写法
```js
class Person {
    constructor(name, age) {
	this.name = name;
	this.age = age;
    }

    sayHi() {
	console.log('I am ' + this.name);
    }
}
class Student extends Person {
    constructor(name, age, school, grade) {
	super(name, age); //相当于Person.call(this, name, age);
	this.school = school;
	this.grade = grade;
    }

    learn(something) {
	console.log(`${this.name} learn ${something}`);
    }
}
```

