# 一、从使用看特点

`Promise.all` 接收一个 `promise 对象的数组`作为参数，当这个数组里的所有 promise 对象 `全部变为resolve` 或 `有任意一个为reject` 状态出现的时候，它才会去调用 `.then` 方法,它们是并发执行的。

### 1、全部变为resolve，调用`success.then`

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then((results) => {
  console.log(results); // [1, 2, 3]
});
```

### 2、有任意一个为reject，调用`fail.then` 或 `catch`语句

有任意一个为reject，且无`fail.then`时：调用`catch`语句
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

有任意一个为reject，且有`fail.then`时：调用`fail.then`语句，但不执行`catch`语句
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

### 3、总结 promise.all 的特点

- 1、接收一个 Promise 实例的数组或具有 Iterator 接口的对象，
- 2、如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
- 3、全部变为resolve，调用`.then`
- 4、只要有一个失败，状态就变为 rejected，返回值将直接传递给回调all() 的返回值也是新的 Promise 对象
