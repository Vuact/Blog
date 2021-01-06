>- NodeJS是一个JS脚本解析器，任何操作系统下安装NodeJS本质上做的事情都是把NodeJS执行程序复制到一个目录，然后保证这个目录在系统PATH环境变量下，以便终端下可以使用`node`命令。
>- 终端下直接输入`node`命令可进入命令交互模式，很适合用来测试一些JS代码片段，比如正则表达式。
>- NodeJS使用[CMD](http://wiki.commonjs.org/)模块系统，主模块作为程序入口点，所有模块在执行过程中只初始化一次。
>- 除非JS模块不能满足需求，否则不要轻易使用二进制模块

<br>

Node里面的模块系统遵循的是CommonJS规范

- require：引用exports或module导出的变量
- module.exports、exports：导出变量

<br>

# 一、exports = module.exports = {...}

![](https://segmentfault.com/img/bVRMVd?w=596&h=166)

**test.js**
```js
let a = 100;

console.log(module.exports); //打印结果：{}
console.log(exports); //打印结果：{}

exports.a = 200; //这里帮 module.exports 的内容给改成 {a : 200}
/* 
   下面两句话等价：
      exports.a = 200;
      module.exports.a = 200;
*/

exports = '指向其他内存区'; //这里把exports的指向指走
```
**index.js**

```js
var a = require('/utils');
console.log(a) // 打印为 {a : 200} 
```

>从上面可以看出，其实require导出的内容是module.exports的指向的内存块内容，并不是exports的。
>简而言之，区分他们之间的区别就是 exports 只是 module.exports的引用，辅助后者添加内容用的。

用白话讲就是，`exports`只辅助`module.exports`操作内存中的数据，辛辛苦苦各种操作数据完，累得要死，结果到最后真正被`require`出去的内容还是`module.exports`的，真是好苦逼啊。

其实大家用内存块的概念去理解，就会很清楚了。

为了避免糊涂，尽量都用 `module.exports` 导出，然后用`require`导入。


<br>

# 二、使用

## 1、exports

**test.js**
```javascript
exports.hello = function () {
	console.log(1);
};
exports.hello2 = function () {
  console.log(2);
};

//等价于：
module.exports.hello = function () {
   console.log(1);
};
module.exports.hello2 = function () {
   console.log(2);
};
```

使用

**index.js**
```javascript
const obj = require('./test.js');
obj.hello();
obj.hello2();

//或者（解构赋值）
const { hello, hello2 } = require('./test.js');
hello();
hello2();
```

输出：1 2


<br>

## 2、module

**test.js**
```javascript
module.exports = function () {
    console.log(1);
};
```

**index.js**
```js
//引用
const hello = require('./test.js');
hello();
```

<br>

## 3、注意
require在同一文件多次引用同一个模块，引用模块只初始化一次



**test.js**
```javascript
let i = 0;

function count() {
   i++;
   console.log(i);
}

exports.count = count;
```

**index.js**
```javascript
const count1 = require('./test.js'),
      count2 = require('./test.js');

count1.count();
count1.count();
count2.count();
```

输出：1 2 3
