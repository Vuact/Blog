模块化就是将一个大的功能拆分为多个块，每一个块都是独立的，你不需要去担心污染全局变量，命名冲突什么的，它们只是向外暴露特定的变量和函数。

模块化的好处：①解决命名冲突 ②依赖管理 ③代码更加可读 ④提高复用性

目前流行的js模块化规范有AMD、CMD、CommonJS以及ES6的模块系统。

本文重点掌握AMD与CMD的区别、CommonJS与ES6 Module的区别

<br>

# 一、AMD

AMD，`异步模块定义`（Asynchronous Module Definition），它是一个在浏览器端模块化开发的规范。
它是依赖前置(依赖必须一开始就写好)会先尽早地执行(依赖)模块 。换句话说，所有的require都被提前执行（require 可以是全局或局部 ）。

由于不是JavaScript原生支持，使用AMD规范进行页面开发需要用到对应的库函数，也就是大名鼎鼎`RequireJS`。


**（1）定义模块： define()**

`定义一个叫modelName的模块，且该模块的依赖为a,b,c。当加载完所有依赖(即加载完a,b,c)后，再执行回调函数，返回模块的输出值(即对外暴露的值)`。

```js
define('modelName', ["a","b","c"], function(a,b,c){
	//`````
	return {};    //返回模块输出值（由向外暴露的变量 组成）
})
```

 - 参数一：定义的`模块名称`。若没有提供该参数，则默认为该模块所在文件的名称。（可选）
 - 参数二：当前`模块的依赖(是数组)`，且数组里依赖的模块必须是已经定义的。
 若没有提供该参数，它`默认为["require", "exports", "module"]`；（可选）
 - 参数三：`模块初始化要执行的函数或对象`。

> × 模块名格式：
> 模块名命名必须为驼峰形式，且不允许有文件扩展名（如“.js” ） 
> 模块名可以为 "相对的" 或 "顶级的"。如果首字符为“.”或“..”则为相对的模块名  
> 顶级的模块名从根命名空间的概念模块解析  
> 相对的模块名从 "require" 书写和调用的模块解析

**（2）加载模块： require()**

require()函数在加载依赖的函数的时候是异步加载的，这样浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。

```js
require(["a", "b", "c"], function(z,x,d){}); 
```

 - 参数一：是个数组，表示所依赖的模块
 - 参数二：是一个回调函数，`参数一的模块都加载成功后，它将被调用`。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块(即：a与z、b与x、c与d一一对应，我们在回调函数中调用z 即相当于调用a模块)



<br>


**例：**

首先在创建一个index.html，内容如下：

```
<!DOCTYPE html>  
<html lang="en">  
<body>   
  <!--引入require.js，data-main属性指定入口文件为js/main（这里省略后缀.js） -->
  <script src="require.js" data-main="js/main"></script>  
</body>  
</html>
```
在上面的代码中，我们引入了require.js，然后使用data-main属性指定入口文件为js/main（这里省略后缀.js）。

然后在index.html同级下创建一个文件夹js，跟着创建两个文件：math.js、main.js(用来加载math.js),代码如下：

```js
/** 定义math.js模块 **/
define(function(){ 
	//没写模块名，所以默认为该模块所在的文件名称，即math
    var basicNum = 0;
    var add = function (x, y) {
        return x + y;
    };
    return {
        add: add,
        basicNum :basicNum
    };
});

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
  }
});
//加载模块
require(['jquery', 'math'],function($, math){  //没写模块名，所以默认为 main
  var sum = math.add(10,20);
  $("#sum").html(sum);
});
```


<br>


# 二、CMD

CMD，通用模块定义(Common Module Definition)，CMD规范是国内发展出来的，就像AMD有个requireJS，CMD有个浏览器的实现SeaJS。



在 CMD 规范中推崇：

 - 一个文件一个模块，所以经常就用文件名作为模块名称。
 - 依赖就近，所以一般不在define的参数中写依赖，在define的第三个参数函数中写依赖，该函数有三个参数

**（1）定义模块： define()**

CMD推崇依赖就近，实现了懒加载，即什么时候需要用什么模块，就require()加载什么模块 (按需加载)。

```js
define(function(require, exports, module) {    
	var a = require('./a'); //按需加载
	//```
    exports.add = add;  //向外暴露的变量
});
```
 - require 用来获取其他模块提供的接口
 - exports 是一个`对象`，用来向外提供模块接口
 - module 是一个对象，上面存储了与当前模块相关联的一些属性和方法


<br>


**例：**

首先在创建一个index.html，内容如下：

```
<!DOCTYPE html>  
<html lang="en">   
<body>     
  <script src="sea.js"></script>   
  <script>   /* 加载入口模块 */
    seajs.use('./scripts/main');   
  </script>  
</body>  
</html>
```
然后在index.html同级下创建一个scripts文件夹，跟着创建两个js文件：math.js、main.js，代码如下：

```js
/** 定义模块 math.js **/
define(function(require, exports, module) {
    var $ = require('jquery.js');//按需加载
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});

/** main.js (入口文件)**/
// 加载模块math
seajs.use(['math.js'], function(math){
    var sum = math.add(1+2);
});
```


<br>

# 三、AMD与CMD的比较

 - AMD：依赖前置，预执行（异步加载：依赖先执行）
 - CMD：依赖就近，懒（延迟）执行（运行到需加载，根据顺序执行）
 - AMD用户体验好，因为没有延迟，依赖模块提前执行了; 
   CMD性能好，因为只有用户需要的时候才执行

```js
/** AMD写法 **/
define('modelName',["a", "b", "c", "d", "e", "f"], function(a, b, c, d, e, f) { 
     // 在最前面声明并初始化了要用到的所有模块（先下载再执行）
     // 依赖模块的执行顺序和书写顺序不一定一致：看网络速度，哪个模块先下载下来，就先执行哪个模块
    var x = a.doSomething();
    if (false) {
        // 即便没用到某个模块 b，但 b 还是提前执行了
        b.doSomething()
    }
    return {x:x}; 
});

/** CMD写法 **/
define(function(require, exports, module) {
    var a = require('./a'); //在需要时申明，不需要就不用加载
    var x= a.doSomething();
    if (false) {
        var b = require('./b');
        b.doSomething();
    }
    exports.x = x;
});
```

AMD依赖前置，js可以方便知道依赖模块是谁，立即加载，而CMD就近依赖，需要使用把模块变为字符串解析一遍才知道依赖了那些模块，这也是很多人诟病CMD的一点，牺牲性能来带来开发的便利性，实际上解析模块用的时间短到可以忽略为什么我们说两个的区别是依赖模块执行时机不同.

AMD在加载模块完成后就会执行改模块，所有模块都加载执行完后会进入require的回调函数，执行主逻辑，这样的效果就是依赖模块的执行顺序和书写顺序不一定一致，看网络速度，哪个先下载下来，哪个先执行，但是主逻辑一定在所有依赖加载完成后才执行。
CMD`加载完某个依赖模块后并不执行`，`只是下载而已`，在所有依赖模块加载完成后进入主逻辑，`遇到require语句的时候才执行对应的模块`，这样模块的执行顺序和书写顺序是完全一致的.
这也是很多人说AMD用户体验好，因为没有延迟，依赖模块提前执行了，CMD性能好，因为只有用户需要的时候才执行的原因

<br>


# 四、CommonJS

最早期在网页端没有模块化编程只是页面JavaScript逻辑复杂，但也可以工作下去，在`服务器端`却一定要有模块，所以`CommonJS`出现了。CommonJS规范是由NodeJS发扬光大。

 - 定义模块: 根据CommonJS规范，一个单独的文件就是一个模块。每一个模块都是一个单独的作用域，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性
 - 模块输出：模块只有一个出口，`module.exports对象`，我们需要把模块希望输出的内容放入该对象
 - 加载模块：加载模块使用require方法，该方法读取一个文件并执行，返回文件内部的module.exports对象



```js
/** 定义模块 math.js **/
var basicNum = 0;
function add(a, b) {
  return a + b;
}
module.exports = { //在这里写上需要向外暴露的函数、变量
  add: add,
  basicNum: basicNum
}

/** 引用自定义模块: 参数包含路径，可省略.js **/
var math = require('./math');
math.add(2, 5);


/** 引用核心模块: 参数不需要带路径 **/
var http = require('http');
http.createService(...).listen(3000);

```
commonJS用同步的方式加载模块。在`服务端`，模块文件都存在本地磁盘，读取非常快，所以这样做`不会有问题`。但是在`浏览器端`，限于网络原因，更`合理的方案是使用异步加载`，所以在浏览器端一般就不使用commonJS了。

<br>


# 五、ES6 Module

ES6 Module主要由两个命令构成：export和import。

 - export命令：用于规定模块的对外接口
 - import命令：用于输入其他模块提供的功能。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export { basicNum, add }; //暴露给外部的变量

/** 引用模块 **/
import { basicNum, add } from './math';
function test(ele) {
    ele.textContent = add(99 + basicNum);
}

```
如上例所示，使用import命令的时候，用户需要知道所要加载的变量名或函数名。其实ES6还提供了`export default`命令，`为模块指定默认输出，对应的import语句不需要使用大括号`。

```js
/** 定义模块 math.js **/
var basicNum = 0;
var add = function (a, b) {
    return a + b;
};
export default { basicNum, add };

/** 引用模块 **/
import math from './math';
function test(ele) {
    ele.textContent = math.add(99 + math.basicNum);
}

```



<br>


# 六、ES6 模块与 CommonJS 模块

**1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。**

 - CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
 - ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

**2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。**

 - 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
 - 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
