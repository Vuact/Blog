# 一、从使用看特点

`Promise.all` 接收一个 `promise 对象的数组`作为参数，当这个数组里的所有 promise 对象 `全部变为resolve` 或 `有任意一个为reject` 状态出现的时候，它才会去调用 `.then` 方法,它们是并发执行的。

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

Promise.all 的参数是一个可迭代对象，如 Array 、 String、Map、Set、包含length属性的对象等，所以应该兼容一下参数。

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
