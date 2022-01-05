# 节流

节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

<br>

## 第一版(leading)：使用时间戳

让我们来看第一种方法：使用时间戳，当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

看了这个表述，是不是感觉已经可以写出代码了…… 让我们来写第一版的代码：

```js
// 第一版
function throttle(func, wait) {
  let previous = 0;

  return function () {
    const now = +new Date();

    if(now - previous > wait) {
      previous = now;
      func.apply(this, arguments);
    }
  };
}
```

例子依然是用讲 debounce 中的例子，如果你要使用：

```js
container.onmousemove = throttle(getUserAction, 1000);
```

效果演示如下：

![使用时间戳](https://github.com/mqyqingfeng/Blog/raw/master/Images/throttle/throttle1.gif)

我们可以看到：当鼠标移入的时候，事件立刻执行，每过 1s 会执行一次，如果在 4.2s 停止触发，以后不会再执行事件。


<br>

## 第二版(trailing)：使用定时器

接下来，我们讲讲第二种实现方式，使用定时器。

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```js
// 第二版
function throttle(func, wait) {
  let timer = null;

  return function () {
    if(!timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(this, arguments);
      }, wait);
    }
  };
}
```

为了让效果更加明显，我们设置 wait 的时间为 3s，效果演示如下：

![使用定时器](https://github.com/mqyqingfeng/Blog/raw/master/Images/throttle/throttle2.gif)

我们可以看到：当鼠标移入的时候，事件不会立刻执行，晃了 3s 后终于执行了一次，此后每 3s 执行一次，当数字显示为 3 的时候，立刻移出鼠标，相当于大约 9.2s 的时候停止触发，但是依然会在第 12s 的时候执行一次事件。

所以比较两个方法：

1. 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
2. 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

<br>

## 第三版：双剑合璧

那我们想要一个什么样的呢？

有人就说了：我想要一个有头有尾的！就是鼠标移入能立刻执行，停止触发的时候还能再执行一次！

所以我们综合两者的优势，然后双剑合璧，写一版代码：

```js
// 第三版

/**
 * 节流函数
 * @param {Function} func
 * @param {Number} [wait=800]
 * @return {Function}
 */
function throttle(func, wait = 800) {
  if (typeof func !== 'function') throw "argument[0] must be the function";

  let timer = null;
  let previous = 0;

  const throttled = function () {
    const now = +new Date();
    const remaining = wait - (now - previous); // 下次触发 func 剩余的时间

    if (remaining <= 0 || remaining > wait) {
      // 如果没有剩余的时间了或者你改了系统时间
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      previous = now;
      func.apply(this, arguments);
    } else if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        previous = +new Date();
        func.apply(this, arguments);
      }, remaining);
    }
  };

  return throttled;
}
```

效果演示如下：

![throttle3](https://github.com/mqyqingfeng/Blog/raw/master/Images/throttle/throttle3.gif)

我们可以看到：鼠标移入，事件立刻执行，晃了 3s，事件再一次执行，当数字变成 3 的时候，也就是 6s 后，我们立刻移出鼠标，停止触发事件，9s 的时候，依然会再执行一次事件。

<br>

## 第四版：优化

但是我有时也希望无头有尾，或者有头无尾，这个咋办？

那我们设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

- leading：false 表示禁用第一次执行
- trailing: false 表示禁用停止触发的回调

我们来改一下代码：

```js
// 第四版

/**
 * 节流函数
 * @param {Function} func
 * @param {Number} [wait=800]
 * @param {Object} [options={}]
 * @param {Boolean} options.leading - 为false 表示禁用第一次执行
 * @param {Boolean} options.trailing - 为false 表示禁用停止触发的回调
 * @return {Function}
 */
function throttle(func, wait = 800, options = {}) {
  if (typeof func !== 'function') throw "argument[0] must be the function";
  
  let timer = null;
  let previous = 0;

  const throttled = function () {
    const now = +new Date();
    // 等价于 const now = new Date().getTime();
    
    if (!previous && options.leading === false) previous = now;

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      
      previous = now;
      func.apply(this, arguments);
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(() => {
        previous = options.leading === false ? 0 : +new Date();
        timer = null;
        func.apply(this, arguments);
      }, remaining);
    }
  };
  
  return throttled;
}
```

<br>

## 第五版：取消

在 debounce 的实现中，我们加了一个 cancel 方法，throttle 我们也加个 cancel 方法：

```js
// 第五版 非完整代码，完整代码请查看最后的演示代码链接
...
throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
}
...
```

<br>

## 注意

我们要注意 underscore 的实现中有这样一个问题：

那就是 `leading：false` 和 `trailing: false` 不能同时设置。

如果同时设置的话，比如当你将鼠标移出的时候，因为 trailing 设置为 false，停止触发的时候不会设置定时器，所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 leading: false，bug 就出来了，所以，这个 throttle 只有三种用法：

```js
container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
    leading: false
});
container.onmousemove = throttle(getUserAction, 1000, {
    trailing: false
});
```

至此我们已经完整实现了一个 underscore 中的 throttle 函数，恭喜，撒花！

<br>

## 演示代码

相关的代码可以在 [Github 博客仓库](https://github.com/mqyqingfeng/Blog/tree/master/demos/throttle) 中找到

<br>

## 节流的应用场景

节流有一些很经典的应用场景

比如对于一个Button短时间内进行多次点击，可能没有必要触发多次handler，这时候就可以对click的响应函数进行节流处理。

或者一个使用键盘控制的飞机大战的游戏，子弹的射出速度是有限制的，不管你在短时间内触发多少次发射按键，永远只会有一枚子弹被发射。

再或者是在实现无限滚动时，需要去监测内容底部是否已经接近window底部，如果是的话就需要去请求新的内容。关于无限滚动，有一个很棒的 [codePen](https://codepen.io/dcorb/pen/eJLMxa) demo。

<br>

## requestAnimationFrame

在最后要提一下requestAnimationFrame这个浏览器API。这个函数可以理解为 throttle(handler, 16) (16为60fps计算得出) 的浏览器原生实现。当然浏览器不仅做了简单的throttle，还有一些分片和空闲thread监测功能，来保证被这个函数处理的函数能满足每秒60帧的要求。

在某些情况下我们也可以调用这个函数来完成类似throttle的功能。但是需要注意的是

- 你需要手动触发requestAnimationFrame，但是throttle一旦被设置好后是自动触发的
- requestAnimationFrame不支持IE9及以下
- requestAnimationFrame是一个浏览器API，nodejs无法使用。

<br><br>

# 防抖节流总结
- 防抖是指某个函数在空闲x ms后才被调用，如果该段时间内该函数被触发，则重置计时器。常用场景有resize事件或者input框的onChang事件
- 节流是指某个函数在x ms内只能被触发一次。常用场景有button的click事件或者键盘事件等。
- requestAnimationFrame是浏览器提供的API，提供了throttle(handler,16)类似的功能但是会有更多浏览器级别的优化来保证每秒16帧的渲染结果。
