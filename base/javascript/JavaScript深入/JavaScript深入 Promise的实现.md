
Promise特点：
- Promise有三种状态：pending(进行中)、fullfilled(成功)、rejected(失败)；
- Promise是一个类，它的构造函数接受一个回掉函数作为参数，该回掉函数接受俩个参数，resolve(成功回调)和reject(失败回调)
- 在传入的函数中执行resolve表示成功，执行reject表示失败，传入的值会传给then方法的回调函数
- Promise有一个叫做then的方法，该方法有两个参数，第一个参数是成功之后执行的回调函数，第二个参数是失败之后执行的回调函数。then方法在resolve或者reject执行之后才会执行，并且then方法中的值是传给resolve或reject的参数
- Promise支持链式调用

<br>

# 小时牛刀
### 例1
```js
new Promise((resolve) => resolve(1)).then(a => console.log(a));
```
输出：

<img width="266" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5dcf333f-e942-4696-bacc-af68288d806a">

### 例2
```js
new Promise((_, reject) => reject(1)).then(a => console.log(a));
```
输出：

<img width="249" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/02279dd7-84e3-47dd-b64a-e12d70f3c27e">

### 例3
```js
new Promise((_, reject) => reject(1)).then(
  a => console.log('resolve', a),
  a => console.log('reject', a)
);

// 等价于
new Promise((_, reject) => reject(1)).then(
  a => console.log('resolve', a)
).catch(err => console.log('reject', err));
```
输出：

<img width="276" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/b990b988-8e4a-425b-b8da-0f6e3cd38538">


### 例4
```js
new Promise((resolve, reject) => { throw new Error('test'); })
  .then(() => {}, a => console.log('reject', a))
  .catch((error) => console.log(error));

// 等价于
new Promise((resolve, reject) => { reject(new Error('test')); })
  .then(() => {}, a => console.log('reject', a))
  .catch((error) => console.log(error));
```
输出：

<img width="280" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/c8b2fd82-88be-490c-9161-7fe8ab2fe098">

<br><br><br>

> Promise本质就是3个状态之间的来回转换：
>   - 主动触发resolve则执行then的第一个参数
>   - 代码报错或触发rejected，则执行then的第二个参数 并 被catch捕获

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
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (err) {
      this.#reject(err);
    }
  }

  #resolve() {}

  #reject() {}
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
    this.value = null; // 存储 this.#resolve 即操作成功 返回的值
    this.reason = null; // 存储 this.#reject 即操作失败 返回的值

    try {
      // 这里绑定this是为了防止执行时this的指向改变，this的指向问题，这里不过多赘述
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (err) {
      this.#reject(err);
    }
  }

  #resolve(value) {
    this.value = value;
    this.status = Promise.FULFILLED; // 将状态设置为成功
  }

  #reject(reason) {
    this.reason = reason;
    this.status = Promise.REJECTED; // 将状态设置为失败
  }
}
```
## 第三步：then方法及其两个参数

Promise有一个叫做then的方法，该方法有两个参数，第一个参数是成功之后执行的回调函数，第二个参数是失败之后执行的回调函数。then方法在resolve或者reject执行之后才会执行，并且then方法中的值是传给resolve或reject的参数

需要注意的是这句`then方法在resolve或者reject执行之后才会执行`，我们知道Promise是异步的，也就是说then传入的函数是不能立马执行，需要存储起来，在resolve函数执行之后才拿出来执行。

换句话说，这个过程有点类似于`发布订阅者模式`：我们使用then来注册事件，那什么时候来通知这些事件是否执行呢？答案就是在resolve方法执行或者reject方法执行时。

```js
class WPromise {
  static pending = 'pending';
  static fulfilled = 'fulfilled';
  static rejected = 'rejected';

  constructor(executor) {
    this.status = WPromise.pending; // 初始化状态为pending
    this.value = undefined; // 存储 this.#resolve 即操作成功 返回的值
    this.reason = undefined; // 存储 this.#reject 即操作失败 返回的值
    // 存储then中传入的参数
    // 至于为什么是数组呢？因为同一个Promise的then方法可以调用多次
    this.callbacks = [];
    executor(this.#resolve.bind(this), this.#reject.bind(this));
  }

  // onFulfilled 是成功时执行的函数
  // onRejected 是失败时执行的函数
  then(onFulfilled, onRejected) {
    // 这里可以理解为在注册事件
    // 也就是将需要执行的回调函数存储起来
    this.callbacks.push({
      onFulfilled,
      onRejected,
    });
  }

  #resolve(value) {
    this.value = value;
    this.status = WPromise.fulfilled; // 将状态设置为成功

    // 通知事件执行
    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #reject(reason) {
    this.reason = reason;
    this.status = WPromise.rejected; // 将状态设置为失败

    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #handler(callback) {
    const { onFulfilled, onRejected } = callback;

    if (this.status === WPromise.fulfilled && onFulfilled) {
      // 传入存储的值
      onFulfilled(this.value);
    }

    if (this.status === WPromise.rejected && onRejected) {
      // 传入存储的错误信息
      onRejected(this.reason);
    }
  }
}
```
这个时候的Promise已经渐具雏形，现在可以来简单测试一下

```js
function fetchData(success) {
    return new WPromise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve("willem");
            } else {
                reject('error');
            }
        }, 1000);
    });
}

fetchData(true).then(data => {
    console.log(data); // after 1000ms: willem
});

fetchData(false).then(null, (reason) => {
    console.log(reason); // after 1000ms: error
});
```

但需要注意的是，以上代码除了链式调用外，还是有缺陷的，比如以下代码，console.log永远不会执行。再往下看会修复这个问题

```js
function fetchData() {
  return new WPromise(resolve => resolve('willem'));
}

fetchData().then((data) => {
  console.log(111, data); // 永远不会执行
});
```

## 第四步：链式调用

```js
class WPromise {
  static pending = 'pending';
  static fulfilled = 'fulfilled';
  static rejected = 'rejected';

  constructor(executor) {
    this.status = WPromise.pending; // 初始化状态为pending
    this.value = undefined; // 存储 this.#resolve 即操作成功 返回的值
    this.reason = undefined; // 存储 this.#reject 即操作失败 返回的值
    // 存储then中传入的参数
    // 至于为什么是数组呢？因为同一个Promise的then方法可以调用多次
    this.callbacks = [];
    executor(this.#resolve.bind(this), this.#reject.bind(this));
  }

  // onFulfilled 是成功时执行的函数
  // onRejected 是失败时执行的函数
  then(onFulfilled, onRejected) {
    // 返回一个新的Promise
    return new WPromise((nextResolve, nextReject) => {
      // 这里之所以把下一个Promsie的resolve函数和reject函数也存在callback中
      // 是为了将onFulfilled的执行结果通过nextResolve传入到下一个Promise作为它的value值
      this.#handler({
        nextResolve,
        nextReject,
        onFulfilled,
        onRejected,
      });
    });
  }

  #resolve(value) {
    this.value = value;
    this.status = WPromise.fulfilled; // 将状态设置为成功

    // 通知事件执行
    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #reject(reason) {
    this.reason = reason;
    this.status = WPromise.rejected; // 将状态设置为失败

    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #handler(callback) {
    const { onFulfilled, onRejected, nextResolve, nextReject } = callback;

    if (this.status === WPromise.pending) {
      this.callbacks.push(callback);
      return;
    }

    if (this.status === WPromise.fulfilled) {
      // 传入存储的值
      // 未传入onFulfilled时，将undefined传入
      const nextValue = onFulfilled ? onFulfilled(this.value) : undefined;
      nextResolve(nextValue);
      return;
    }

    if (this.status === WPromise.rejected) {
      // 传入存储的错误信息
      // 同样的处理
      const nextReason = onRejected ? onRejected(this.reason) : undefined;
      nextResolve(nextReason);
    }
  }
}
```

拿例子来测试一下
```js
fetchData().then(
  (data) => {
    console.log(data); // willem
    return 'wei';
  },
  (err) => {},
)
  .then((data2) => {
    console.log(data2); // wei
  });
```
没啥问题。不过上面的版本还有个问题没有处理，当onFulfilled执行的结果不是一个简单的值，而就是一个Promise时，后续的then会等待其执行完成之后才执行。

## 第五步：最终版

```js
class WPromise {
  static pending = 'pending';
  static fulfilled = 'fulfilled';
  static rejected = 'rejected';

  constructor(executor) {
    this.status = WPromise.pending; // 初始化状态为pending
    this.value = undefined; // 存储 this.#resolve 即操作成功 返回的值
    this.reason = undefined; // 存储 this.#reject 即操作失败 返回的值
    // 存储then中传入的参数
    // 至于为什么是数组呢？因为同一个Promise的then方法可以调用多次
    this.callbacks = [];
    executor(this.#resolve.bind(this), this.#reject.bind(this));
  }

  // onFulfilled 是成功时执行的函数
  // onRejected 是失败时执行的函数
  then(onFulfilled, onRejected) {
    // 返回一个新的Promise
    return new WPromise((nextResolve, nextReject) => {
      // 这里之所以把下一个Promsie的resolve函数和reject函数也存在callback中
      // 是为了将onFulfilled的执行结果通过nextResolve传入到下一个Promise作为它的value值
      this.#handler({
        nextResolve,
        nextReject,
        onFulfilled,
        onRejected,
      });
    });
  }

  #resolve(value) {
    // 处理onFulfilled执行结果是一个Promise时的情况
    // 这里可能理解起来有点困难
    // 当value instanof WPromise时，说明当前Promise肯定不会是第一个Promise
    // 而是后续then方法返回的Promise（第二个Promise）
    // 我们要获取的是value中的value值（有点绕，value是个promise时，那么内部存有个value的变量）
    // 怎样将value的value值获取到呢，可以将传递一个函数作为value.then的onFulfilled参数
    // 那么在value的内部则会执行这个函数，我们只需要将当前Promise的value值赋值为value的value即可
    if (value instanceof WPromise) {
      value.then(
        this.#resolve.bind(this),
        this.#reject.bind(this),
      );
      return;
    }

    this.value = value;
    this.status = WPromise.fulfilled; // 将状态设置为成功

    // 通知事件执行
    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #reject(reason) {
    if (reason instanceof WPromise) {
      reason.then(
        this.#resolve.bind(this),
        this.#reject.bind(this),
      );
      return;
    }

    this.reason = reason;
    this.status = WPromise.rejected; // 将状态设置为失败

    this.callbacks.forEach(cb => this.#handler(cb));
  }

  #handler(callback) {
    const {
      onFulfilled,
      onRejected,
      nextResolve,
      nextReject,
    } = callback;

    if (this.status === WPromise.pending) {
      this.callbacks.push(callback);
      return;
    }

    if (this.status === WPromise.fulfilled) {
      // 传入存储的值
      // 未传入onFulfilled时，value传入
      const nextValue = onFulfilled
        ? onFulfilled(this.value)
        : this.value;
      nextResolve(nextValue);
      return;
    }

    if (this.status === WPromise.rejected) {
      // 传入存储的错误信息
      // 同样的处理
      const nextReason = onRejected
        ? onRejected(this.reason)
        : this.reason;
      nextReject(nextReason);
    }
  }
}
```

验证：
```js
fetchData().then(
  data => new WPromise((resolve) => {
    setTimeout(() => {
      resolve(`${data} wei`);
    }, 1000);
  }),
  (err) => {},
)
  .then((data2) => {
    console.log(data2); // willem wei
  });
```




参考：
- https://segmentfault.com/a/1190000023180502
- https://juejin.cn/post/6844904147884441608#comment
- https://leexiaop.github.io/coding/4/
- https://github.com/M-FE/js-functions-simulation/blob/master/src/promise.ts
