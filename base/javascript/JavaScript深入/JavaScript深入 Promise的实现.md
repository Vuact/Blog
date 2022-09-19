
Promise特点：
- Promise有三种状态：pending(进行中)、fullfilled(成功)、rejected(失败)；
- Promise是一个类，它的构造函数接受一个函数，函数的两个参数也都是函数
- 在传入的函数中执行resolve表示成功，执行reject表示失败，传入的值会传给then方法的回调函数
- Promise有一个叫做then的方法，该方法有两个参数，第一个参数是成功之后执行的回调函数，第二个参数是失败之后执行的回调函数。then方法在resolve或者reject执行之后才会执行，并且then方法中的值是传给resolve或reject的参数
- Promise支持链式调用

<br>

# 实现Promise

## 第一步：架子

Promise是一个类，它的构造函数接受一个函数，函数的两个参数也都是函数

```js
class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise resolver undefined is not a function');
    }

    try {
      // 这里绑定this是为了防止执行时this的指向改变，this的指向问题，这里不过多赘述
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve() {}

  _reject() {}
}
```

使用：
```js
new Promise((resolve, reject) => {
  setTimeout(() => {
     resolve('hhh');
  }, 1000);
});
```

## 第二步：Promise的三种状态；resolve表成功，reject表失败

Promise的三种状态
- pending 初始状态，既不是成功，也不是失败状态。等待resolve或者reject调用更新状态。
- fulfilled 意味着操作成功完成。
- rejected 意味着操作失败。

```js
class Promise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('Promise resolver undefined is not a function');
    }

    this.status = Promise.PENDING; // 初始化状态为pending
    this.value = null; // 存储 this._resolve 即操作成功 返回的值
    this.reason = null; // 存储 this._reject 即操作失败 返回的值

    try {
      // 这里绑定this是为了防止执行时this的指向改变，this的指向问题，这里不过多赘述
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve(value) {
    this.value = value;
    this.status = Promise.FULFILLED; // 将状态设置为成功
  }

  _reject(reason) {
    this.reason = reason;
    this.status = Promise.REJECTED; // 将状态设置为失败
  }
}
```
## 第三步：then方法以及两个参数

Promise有一个叫做then的方法，该方法有两个参数，第一个参数是成功之后执行的回调函数，第二个参数是失败之后执行的回调函数。

then方法在resolve或者reject执行之后才会执行，并且then方法中的值是传给resolve或reject的参数


需要注意的是这句`then方法在resolve或者reject执行之后才会执行`，我们知道Promise是异步的，也就是说then传入的函数是不能立马执行，需要存储起来，在resolve函数执行之后才拿出来执行。

换句话说，这个过程有点类似于`发布订阅者模式`：我们使用then来注册事件，那什么时候来通知这些事件是否执行呢？答案就是在resolve方法执行或者reject方法执行时。

```js
```

--------
先整个大概，晚点写····

---

- Promise有三种状态：pending(进行中)、fullfilled(成功)、rejected(失败)；
- Promise对象接受一个回掉函数作为参数，该回掉函数接受俩个参数，resolve(成功回调)和reject(失败回调)


参考：
- https://segmentfault.com/a/1190000023180502
- https://juejin.cn/post/6844904147884441608#comment
- https://leexiaop.github.io/coding/4/
- https://github.com/M-FE/js-functions-simulation/blob/master/src/promise.ts
