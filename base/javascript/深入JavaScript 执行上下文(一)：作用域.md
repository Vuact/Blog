- [深入JavaScript 执行上下文(一)：作用域](https://blog.csdn.net/b954960630/article/details/83932313)
- [深入JavaScript 执行上下文(二)：执行上下文栈](https://blog.csdn.net/b954960630/article/details/83932469)
- [深入JavaScript 执行上下文(三)：变量对象](https://blog.csdn.net/b954960630/article/details/83998358)
- [深入JavaScript 执行上下文(四)：作用域链](https://blog.csdn.net/b954960630/article/details/83932775)
- [深入JavaScript 执行上下文(五)：整个过程](https://blog.csdn.net/b954960630/article/details/83933032)



## 作用域
------------------
作用域是指程序源代码中定义变量的区域。
作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。下面我们来看看作用域的两种解析方式。

作用域两种解析方式：
- 静态作用域：js使用
- 动态作用域：java、c++等使用

------------------
#### 1、静态作用域：
JavaScript 采用就是词法作用域(lexical scoping)，也就是静态作用域。使用词法环境来管理。 一段代码执行前，先初始化词法环境。 

下面代码若使用静态作用域：
```
var x = 10;
function foo(){
    console.log(x);
}
function bar(){
    var x = 20;
    foo();
}
bar();//10
```
看下面作用域链:执行bar函数时，在bar的作用域(scope)中找不到foo函数，然后再到全局作用域(global scope)中找，正好全局作用域中有，然后执行foo; 
执行foo时又找不到x变量，然后到全局作用域中找，发现x=10，然后打印 10 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181110163806875.png)

#### 2、动态作用域：
程序运行时决定。动态作用域一般是使用动态栈来管理。 
下面代码若使用动态作用域：

```
var x = 10;
function foo(){
    console.log(x);
}
function bar(){
    var x = 20;
    foo();
}
bar();//20
``` 
看下图动态栈：在执行过程中， 
（1）首先var x = 10，把x:10放入栈内； 
（2）之后再依次执行foo,bar函数的声明，我们再把foo，bar函数放入栈内 
（3）在执行bar()时，首先执行var x = 20，我们把x:20放入栈内 
（4）然后执行bar函数里面的foo函数，由于foo要打印x变量，所以我们在栈里找到最近的x值。为20，所以打印结果为20. 
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018111016404625.png)
