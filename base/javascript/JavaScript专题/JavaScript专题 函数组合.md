需求：

我们需要写一个函数，输入 'kevin'，返回 'HELLO, KEVIN'。

# 一、尝试

```js
var toUpperCase = function(x) { return x.toUpperCase(); };
var hello = function(x) { return 'HELLO, ' + x; };

var greet = function(x){
    return hello(toUpperCase(x));
};

greet('kevin');
```

还好我们只有两个步骤，首先小写转大写，然后拼接字符串。如果有更多的操作，greet 函数里就需要更多的嵌套，类似于 `fn3(fn2(fn1(fn0(x))))`。

<br>

# 二、优化

试想我们写个 compose 函数：

```js
var compose = function(f,g) {
    return function(x) {
        return f(g(x));
    };
};
```

greet 函数就可以被优化为：

```js
var greet = compose(hello, toUpperCase);
greet('kevin');
```

利用 compose 将两个函数组合成一个函数，让代码从右向左运行，而不是由内而外运行，可读性大大提升。这便是函数组合。

但是现在的 compose 函数也只是能支持两个参数，如果有更多的步骤呢？我们岂不是要这样做：

```js
compose(d, compose(c, compose(b, a)))
```

为什么我们不写一个帅气的 compose 函数支持传入多个函数呢？这样就变成了：

```js
compose(d, c, b, a)
```
<br>

# 三、compose

## 1、实现
我们直接抄袭 underscore 的 compose 函数的实现：

```js
function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
    };
};

//使用
var toUpperCase = function(x) { return x.toUpperCase(); };
var hello = function(x) { return 'HELLO, ' + x; };
var greet = compose(hello, toUpperCase);
greet('kevin'); //HELLO, KEVIN
```

用ES6实现 compose：
```js
const compose = (...funcs) => {
  return (val) => {
    return funcs.reduceRight((a, b) => b(a), val);
  };
};
```



## 2、React中的使用

现在的 compose 函数已经可以支持多个函数了，然而有了这个又有什么用呢？

在React中的应用：

### （1）组合高阶组件
比如我们想为MyComponent组件添加 获取用户信息 和 打印日志 两个功能，那我们可以这么写：
```js
const compose = (...funcs) => {
  return (component) => {
    return funcs.reduceRight((a, b) => b(a), component);
  };
};

// 原始组件
const MyComponent = ({ user, ...props }) => {
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your age is {user.age}.</p>
      {/* 其他组件内容 */}
    </div>
  );
};

// 高阶组件1：添加日志功能
const withLogging = (WrappedComponent) => {
  return (props) => {
    console.log('Logging props:', props);
    return <WrappedComponent {...props} />;
  };
};

// 高阶组件2：添加用户信息
const withUser = (WrappedComponent) => {
  const userInfo = getUserMess();

  return (props) => {
    return <WrappedComponent {...props} user={userInfo} />;
  };
};

// 应用高阶组件
const enhance = compose(withLogging, withUser);

// 增强后的组件
const EnhancedMyComponent = enhance(MyComponent);

// 在应用中使用增强后的组件
const App = () => {
  return <EnhancedMyComponent someProp="Some value" />;
};
```

### （2）组合Context提供者

假设我们有三个不同的Context：UserContext、ThemeContext和LanguageContext。每个Context都有一个对应的Provider组件，我们希望在应用的顶层组合这些Provider，以便它们的值在整个组件树中都可用。

首先，我们定义三个Context和它们的Provider组件：

```js
import React, { createContext } from 'react';

// 创建三个Context
export const UserContext = createContext();
export const ThemeContext = createContext();
export const LanguageContext = createContext();

// 创建三个Provider组件
export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

export const ThemeProvider = ({ children, theme }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const LanguageProvider = ({ children, language }) => (
  <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
);
```
接下来，我们可以使用compose函数来组合这些Provider组件：

```js
import { compose } from 'redux'; // 或者你可以自己实现一个compose函数

// 假设我们有一个compose函数
const composeProviders = (...providers) => {
  return providers.reduce(
    (Combined, Provider) => ({ children }) => (
      <Provider>
        <Combined>{children}</Combined>
      </Provider>
    ),
    ({ children }) => <>{children}</>
  );
};

// 使用composeProviders来组合Provider组件
const CombinedProviders = composeProviders(
  UserProvider,
  ThemeProvider,
  LanguageProvider
);

// 在App组件中使用CombinedProviders
const App = () => {
  const user = { name: 'Alice' };
  const theme = { color: 'blue' };
  const language = 'en';

  return (
    <CombinedProviders user={user} theme={theme} language={language}>
      {/* 应用的其余部分 */}
    </CombinedProviders>
  );
};
```


<br>

compose还有什么用？我们再了解一个概念叫做 pointfree。

<br>

# 四、pointfree

pointfree 指的是函数无须提及将要操作的数据是什么样的。依然是以最初的需求为例：

```js
// 需求：输入 'kevin'，返回 'HELLO, KEVIN'。

// 非 pointfree，因为提到了数据：name
var greet = function(name) {
    return ('hello ' + name).toUpperCase();
}

// pointfree
// 先定义基本运算，这些可以封装起来复用
var toUpperCase = function(x) { return x.toUpperCase(); };
var hello = function(x) { return 'HELLO, ' + x; };

var greet = compose(hello, toUpperCase);
greet('kevin');
```

我们再举个稍微复杂一点的例子，为了方便书写，我们需要借助在《JavaScript专题之函数柯里化》中写到的 curry 函数：

```js
// 需求：输入 'kevin daisy kelly'，返回 'K.D.K'

// 非 pointfree，因为提到了数据：name
var initials = function (name) {
    return name.split(' ').map(compose(toUpperCase, head)).join('. ');
};

// pointfree
// 先定义基本运算
var split = curry(function(separator, str) { return str.split(separator) })
var head = function(str) { return str.slice(0, 1) }
var toUpperCase = function(str) { return str.toUpperCase() }
var join = curry(function(separator, arr) { return arr.join(separator) })
var map = curry(function(fn, arr) { return arr.map(fn) })

var initials = compose(join('.'), map(compose(toUpperCase, head)), split(' '));

initials("kevin daisy kelly");
```

从这个例子中我们可以看到，利用柯里化（curry）和函数组合 (compose) 非常有助于实现 pointfree。

也许你会想，这种写法好麻烦呐，我们还需要定义那么多的基础函数……可是如果有工具库已经帮你写好了呢？比如 [ramda.js](http://ramda.cn/docs/)：

```js
// 使用 ramda.js
var initials = R.compose(R.join('.'), R.map(R.compose(R.toUpper, R.head)), R.split(' '));
```

而且你也会发现：

> Pointfree 的本质就是使用一些通用的函数，组合出各种复杂运算。上层运算不要直接操作数据，而是通过底层函数去处理。即不使用所要处理的值，只合成运算过程。

那么使用 pointfree 模式究竟有什么好处呢？

> pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用，更符合语义，更容易复用，测试也变得轻而易举。

<br>

## 实战

这个例子来自于 [Favoring Curry](http://fr.umio.us/favoring-curry/)：

假设我们从服务器获取这样的数据：

```js
var data = {
    result: "SUCCESS",
    tasks: [
        {id: 104, complete: false,            priority: "high",
                  dueDate: "2013-11-29",      username: "Scott",
                  title: "Do something",      created: "9/22/2013"},
        {id: 105, complete: false,            priority: "medium",
                  dueDate: "2013-11-22",      username: "Lena",
                  title: "Do something else", created: "9/22/2013"},
        {id: 107, complete: true,             priority: "high",
                  dueDate: "2013-11-22",      username: "Mike",
                  title: "Fix the foo",       created: "9/22/2013"},
        {id: 108, complete: false,            priority: "low",
                  dueDate: "2013-11-15",      username: "Punam",
                  title: "Adjust the bar",    created: "9/25/2013"},
        {id: 110, complete: false,            priority: "medium",
                  dueDate: "2013-11-15",      username: "Scott",
                  title: "Rename everything", created: "10/2/2013"},
        {id: 112, complete: true,             priority: "high",
                  dueDate: "2013-11-27",      username: "Lena",
                  title: "Alter all quuxes",  created: "10/5/2013"}
    ]
};
```

我们需要写一个名为 getIncompleteTaskSummaries 的函数，接收一个 username 作为参数，从服务器获取数据，然后筛选出这个用户的未完成的任务的 ids、priorities、titles、和 dueDate 数据，并且按照日期升序排序。

以 Scott 为例，最终筛选出的数据为：

```js
[
    {id: 110, title: "Rename everything", 
        dueDate: "2013-11-15", priority: "medium"},
    {id: 104, title: "Do something", 
        dueDate: "2013-11-29", priority: "high"}
]
```

普通的方式为：

```js
// 第一版 过程式编程
var fetchData = function() {
    // 模拟
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
     return fetchData()
         .then(function(data) {
             return data.tasks;
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return task.username == membername
             })
         })
         .then(function(tasks) {
             return tasks.filter(function(task) {
                 return !task.complete
             })
         })
         .then(function(tasks) {
             return tasks.map(function(task) {
                 return {
                     id: task.id,
                     dueDate: task.dueDate,
                     title: task.title,
                     priority: task.priority
                 }
             })
         })
         .then(function(tasks) {
             return tasks.sort(function(first, second) {
                 var a = first.dueDate,
                     b = second.dueDate;
                 return a < b ? -1 : a > b ? 1 : 0;
             });
         })
         .then(function(task) {
             console.log(task)
         })
};

getIncompleteTaskSummaries('Scott')
```

如果使用 pointfree 模式：

```js
// 第二版 pointfree 改写
var fetchData = function() {
    return Promise.resolve(data)
};

// 编写基本函数
var prop = curry(function(name, obj) {
    return obj[name];
});

var propEq = curry(function(name, val, obj) {
    return obj[name] === val;
});

var filter = curry(function(fn, arr) {
    return arr.filter(fn)
});

var map = curry(function(fn, arr) {
    return arr.map(fn)
});

var pick = curry(function(args, obj){
    var result = {};
    for (var i = 0; i < args.length; i++) {
        result[args[i]] = obj[args[i]]
    }
    return result;
});

var sortBy = curry(function(fn, arr) {
    return arr.sort(function(a, b){
        var a = fn(a),
            b = fn(b);
        return a < b ? -1 : a > b ? 1 : 0;
    })
});

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(prop('tasks'))
        .then(filter(propEq('username', membername)))
        .then(filter(propEq('complete', false)))
        .then(map(pick(['id', 'dueDate', 'title', 'priority'])))
        .then(sortBy(prop('dueDate')))
        .then(console.log)
};

getIncompleteTaskSummaries('Scott')
```

如果直接使用 ramda.js，你可以省去编写基本函数:

```js
// 第三版 使用 ramda.js
var fetchData = function() {
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.prop('tasks'))
        .then(R.filter(R.propEq('username', membername)))
        .then(R.filter(R.propEq('complete', false)))
        .then(R.map(R.pick(['id', 'dueDate', 'title', 'priority'])))
        .then(R.sortBy(R.prop('dueDate')))
        .then(console.log)
};

getIncompleteTaskSummaries('Scott')
```

当然了，利用 compose，你也可以这样写：

```js
// 第四版 使用 compose
var fetchData = function() {
    return Promise.resolve(data)
};

var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.compose(
            console.log,
            R.sortBy(R.prop('dueDate')),
            R.map(R.pick(['id', 'dueDate', 'title', 'priority'])
            ),
            R.filter(R.propEq('complete', false)),
            R.filter(R.propEq('username', membername)),
            R.prop('tasks'),
        ))
};

getIncompleteTaskSummaries('Scott')
```

compose 是从右到左依此执行，当然你也可以写一个从左到右的版本，但是从右向左执行更加能够反映数学上的含义。

ramda.js 提供了一个 R.pipe 函数，可以做的从左到右，以上可以改写为：

```js
// 第五版 使用 R.pipe
var getIncompleteTaskSummaries = function(membername) {
    return fetchData()
        .then(R.pipe(
            ),
            R.prop('tasks'),
            R.filter(R.propEq('username', membername)),
            R.filter(R.propEq('complete', false)),
            R.map(R.pick(['id', 'dueDate', 'title', 'priority'])
            R.sortBy(R.prop('dueDate')),
            console.log,
        ))
};
```

