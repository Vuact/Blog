# 一、call()
call() ：在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法。
call()允许为不同的对象分配和调用属于另一个对象的函数/方法。

### 1、实际的call()

```javascript
var value = 2;
var foo = { value: 1 };
function bar(name, age) {
	console.log(this.value);
	console.log(name, age);
}

bar.call(foo ,'bty', 18);  // 1   'bty'   18
bar.call(null, 'bty');     // 2   'bty'  undefined


function bar2(name){
	return {
		value:this.value,
		name:name
	}
}
console.log(bar2.call(foo ,'bty')); //{value: 1, name: "bty"}
```
我们看看执行call的过程中发生了什么：
（1）call 的第一个参数改变了this 的指向
（2）call 将后面的参数依次赋给了bar函数的形参
（3）执行bar函数
（4）若call的第一个参数传 null，则this指向 window
（5）返回bar2函数的return值

<br>

### 2、模拟实现call()
对应上面的步骤，模拟：

（1）改变this指向：我们将bar函数设为call的第一个参数的属性，即foo.fn = bar;

```javascript
Function.prototype.myCall = function (context) {
    context.fn = this;    //（1）
}
```
（2）给bar函数的形参赋值：将call函数的arguments 的第一个元素删除，然后把修改后的arguments传给 foo.fn 作为参数。
（3）执行bar函数，即执行foo.fn；为了不给foo添加多余的属性，执行完bar函数后，我们再删除foo的fn属性，即delete foo.fn
```javascript
Function.prototype.myCall = function (context) {
    context.fn = this;    //（1）
    var args = [];	     //（2）
    for(var i = 1, len = arguments.length; i < len; i++) {     //2
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args +')'); //（3）
    delete context.fn;
}
```
注：关于eval('context.fn(' + args +')')的eval里，其实是进行了字符串的拼接操作：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181214142917369.png)
（4）若call没传参数 或 call的第一个参数为null/undefined，则让this指向window
（5）返回fn函数的return值
**所以最终版：**

```javascript
Function.prototype.myCall = function (context) {
    context = context || window; //（4）
    context.fn = this;    //（1）
    var args = [];	     //（2）
    for(var i = 1, len = arguments.length; i < len; i++) {     //2
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')'); //（3）（5）
    delete context.fn;
    return result;                  //（5）
}
```

<br>

### 3、注意：调用call、apply的函数不能是箭头函数




因而凡是涉及到call、apply的地方，其调用函数都不可以是箭头函数, 否则会导致

```javascript
var value = 2;
var foo = { value: 1 };

var bar = (name, age) => {
    console.log(this.value);
    console.log(name, age);
}

bar.call(foo ,'bty', 18);  // 2   'bty'   18
```
我们看到bar中的this.value值是2，并不是1, 说明this值指向了window对象。

我们都知道箭头函数无this，其this与前上下文相关；箭头函数若调用call，根据上面实现原理中的 `context.fn = this; `得知，
这里this

<br>

# 二、apply()
apply 的实现跟 call 类似，在这里直接给代码：

```javascript
Function.prototype.myApply = function (context, arr) {
    context = context || window;
    context.fn = this;

    var result;
    //如果不是数组抛错
    if(!Array.isArray(arr)) {
    	 throw new Error('CreateListFromArrayLike called on non-object');
    }
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```
