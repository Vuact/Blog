在阅读前，请先阅读《深入JavaScript 共享传递》中的《二、从底层角度讲》，它能让你对JS参数传递的具体机理有一定了解。其实两者差别不大。

也可以看看这篇文章，也不错[《可视化分析js的内存分配与回收》](https://juejin.im/post/597c5b71f265da3e3d122a3b)


<br>
<br>



现在开始进入正题


#### 关键点:
- 运算符=就是创建或修改变量在内存中的指向.
- 初始化变量时为创建,重新赋值即为修改.

<br>

# 一、

**例1**
```javascript
var a = {b: 1};   // a = {b: 1}
var c = a;        // c = {b: 1}
a = 2;            // 重新赋值a
console.log(c);   // {b: 1}
```
这段代码在内存中的分布:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181120161703798.png)
然后一步一步执行代码:
（1）创建变量a指向对象{b: 1};
（2）创建变量c指向对象{b: 1};
（3）a重新指向常量区的2;
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181120161807109.png)
所以c从始至终都是指向对象{b: 1},  所以最后输出 {b: 1}
<br>

**例1.2**
我们现在再分析《深入JavaScript 共享传递》中 按值传递 的例子。
```javascript
var value = 1;
function foo(v) {
    v = 2;
    console.log(v); //2
}
foo(value);
console.log(value) // 1
```
可以将其等价替换为:

```javascript
var value = 1;
function foo() {
    var v = value; // 创建变量v指向value所指向的值
    v = 2;// v重新指向另外的值
    console.log(v); //2
}
foo(value);
console.log(value) // 1,value从始至终都未改变指向.
```
《深入JavaScript 共享传递》中 共享传递 的例子同理。

<br>

# 二、

**例2**

```javascript
var a = {b: 1};   // a = {b: 1}
var c = a;        // c = {b: 1}
a.b = 2;          // 重新赋值对象a中的属性b
console.log(c);   // {b: 2},// c也随着修改,从
```
前两句执行完后 在内存中的分布:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181120162238994.png)
再执行完a.b = 2后:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181120162408290.png)
那么a,c从始至终都未改变指向,只是b改变了而已

**例2.2**
我们现在再分析[《深入JavaScript 共享传递》](https://blog.csdn.net/b954960630/article/details/84286555)中 按值传递 的例子。

```javascript
var obj = {
    value: 1
};
function foo(o) {
    o.value = 2;
    console.log(o.value); //2
}
foo(obj);
console.log(obj.value) // 2
```
可以将其等价替换为:
```javascript
var obj = {
   value: 1
};
function foo() {
   var o = obj;
   o.value = 2;        // 变量value改变了指向,而o并未改变
   console.log(o.value); //2
}
foo(obj);
console.log(obj.value) // 2
```
