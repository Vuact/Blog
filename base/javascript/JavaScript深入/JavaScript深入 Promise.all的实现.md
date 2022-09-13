# 一、从使用看特点

- `Promise.all()` 方法将多个Promise实例包装成一个Promise对象（p），接受一个数组（p1,p2,p3）作为参数，数组中不一定需要都是Promise对象，但是`一定具有Iterator接口`，如果不是的话，就会调用Promise.resolve将其转化为Promise对象之后再进行处理。

- 使用Promise.all()生成的Promise对象（p）的状态是由数组中的Promise对象（p1,p2,p3）决定的；
  - 如果所有的Promise对象（p1,p2,p3）都变成fullfilled状态的话，生成的Promise对象（p）也会变成fullfilled状态，p1,p2,p3三个Promise对象产生的结果会组成一个数组返回给传递给p的回调函数；
  - 如果p1,p2,p3中有一个Promise对象变为rejected状态的话，p也会变成rejected状态，第一个被rejected的对象的返回值会传递给p的回调函数。
Promise.all()方法生成的Promise对象也会有一个catch方法来捕获错误处理，但是如果数组中的Promise对象变成rejected状态时，并且这个对象还定义了catch的方法，那么rejected的对象会执行自己的catch方法，并且返回一个状态为fullfilled的Promise对象，Promise.all()生成的对象会接受这个Promise对象，不会返回rejected状态。

<br>

### 1、全部变为resolve，调用`success.then`

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then((results) => {
  console.log('success then', results); // success then [1, 2, 3]
});
```

### 2、有任意一个为reject，调用`fail.then` 或 `catch`语句

（1）有任意一个为reject，且无`fail.then`时：调用`catch`语句

```js
const p1 = Promise.resolve(1);
const p2 = Promise.reject(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then((results) => {
    // then方法不会被执行
    console.log('success then', results);
  })
  .catch((e) => {
    // catch方法将会被执行，输出结果为：catch 2
    console.log('catch', e);
  });
```

（2）有任意一个为reject，且有`fail.then`时：调用`fail.then`语句，但不执行`catch`语句
```js
Promise.all([p1, p2, p3])
  .then(
    (results) => {
      // then方法不会被执行
      console.log('success then', results);
    },
    (results) => {
      // then方法将会被执行，输出结果为：fail then 2
      console.log('fail then', results);
    },
  )
  .catch((e) => {
    // catch方法不会被执行
    console.log('catch', e);
  });
```

# 二、实现 Promise.all 方法

### 1、第一版
```js
function promiseAll(promises) {
  const promiseNum = promises.length;
  const resolvedArr = [];

  let resolvedNum = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          resolvedNum++;
          resolvedArr[i] = value;

          if (resolvedNum === promiseNum) {
            return resolve(resolvedArr);
          }
        })
        .catch((reason) => {
          return reject(reason);
        });
    }
  });
}
```

### 二、第二版

Promise.all 的参数可以是一个可迭代对象，如 Array、String、Map、Set、包含length属性的对象等，所以应该兼容一下参数。

```js
function promiseAll(iterable) {
  const promises = Array.from(iterable);
  const promiseNum = promises.length;
  const resolvedArr = [];

  let resolvedNum = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < promiseNum; i++) {
      Promise.resolve(promises[i])
        .then((value) => {
          resolvedNum++;
          resolvedArr[i] = value;

          if (resolvedNum === promiseNum) {
            return resolve(resolvedArr);
          }
        })
        .catch((reason) => {
          return reject(reason);
        });
    }
  });
}
```
