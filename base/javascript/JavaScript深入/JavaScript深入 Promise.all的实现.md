# 一、使用


`Promise.all` 接收一个 `promise 对象的数组`作为参数，当这个数组里的所有 promise 对象 `全部变为resolve` 或 `有任意一个为reject` 状态出现的时候，它才会去调用 `.then` 方法,它们是并发执行的。

### 1、全部变为resolve，调用`.then`

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then((results) => {
  console.log(results); // [1, 2, 3]
});
```

### 2、有任意一个为reject，调用`.then`

```js
const p1 = Promise.resolve(1);
const p2 = Promise.reject(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then((results) => {
    // then方法不会被执行
    console.log(results);
  })
  .catch((e) => {
    // catch方法将会被执行，输出结果为：2
    console.log(2);
  });
```
