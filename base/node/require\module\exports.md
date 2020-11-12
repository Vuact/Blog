>- NodeJS是一个JS脚本解析器，任何操作系统下安装NodeJS本质上做的事情都是把NodeJS执行程序复制到一个目录，然后保证这个目录在系统PATH环境变量下，以便终端下可以使用`node`命令。
>- 终端下直接输入`node`命令可进入命令交互模式，很适合用来测试一些JS代码片段，比如正则表达式。
>- NodeJS使用[CMD](http://wiki.commonjs.org/)模块系统，主模块作为程序入口点，所有模块在执行过程中只初始化一次。
>- 除非JS模块不能满足需求，否则不要轻易使用二进制模块

# 模块

---

- require：引用exports或module导出的变量
- module：导出(单个变量)  module.exports
- exports：导出(多个变量)

注：exports = module.exports = {...}

1. require() 返回的是 module.exports 而不是 exports

2. module.exports 初始值为一个空对象 {}

3. exports 是指向的 module.exports 的引用

   

## 1、exports

----

### （1）导出多个变量

```javascript
exports.hello = function () {
	console.log(1);
};
exports.hello2 = function () {
  console.log(2);
};
```

使用

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

### （2）导出单个变量

```javascript
exports.hello = function () {
	console.log(1);
};
```

使用

```javascript
const obj = require('./test.js');
obj.hello();

//或者（解构赋值）
const { hello } = require('./test.js');
hello();
```

输出：1



## 2、module

----

```javascript
module.exports = function () {
    console.log(1);
};

//引用
const hello = require('./test.js');
hello();
```



## require在同一文件多次引用同一个模块，引用模块只初始化一次

----

test.js

```javascript
let i = 0;

function count() {
	i++;
	console.log(i);
}

exports.count = count;
```

```javascript
const count1 = require('./test.js'),
	count2 = require('./test.js');

count1.count();
count1.count();
count2.count();
```

输出：1 2 3
