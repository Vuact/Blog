
- 在正常的React的事件流里（如onClick等）
  - setState和useState是异步执行的（不会立即更新state的结果）
  - 多次执行setState和useState，只会调用一次重新渲染render
  - 不同的是，setState会进行state的合并，而useState则不会


- 在setTimeout，Promise.then等异步事件中
  - setState和useState是同步执行的（立即更新state的结果）
  - 多次执行setState和useState，每一次的执行setState和useState，都会调用一次render


<br>

# 一、Demo

## 1、先看useState

### 同步和异步情况下，连续执行两个 useState [(示例)](https://codesandbox.io/s/does-react-batches-state-update-functions-when-using-hooks-forked-4gxr2?file=/src/index.js)

```js
function Component() {
  const [a, setA] = useState(1);
  const [b, setB] = useState('b');

  console.log('render');

  // 异步情况下
  function handleClickWithPromise() {
    Promise.resolve().then(() => {
      setA((a) => a + 1);
      setB('bb');
    });
  }
  
  // 同步情况下
  function handleClickWithoutPromise() {
    setA((a) => a + 1);
    setB('bb');
  }

  return (
    <>
      <button onClick={handleClickWithPromise}>
        {a}-{b} 异步执行
      </button>
      <button onClick={handleClickWithoutPromise}>
        {a}-{b} 同步执行
      </button>
    </>
  );
}
```
- 当点击`同步执行`按钮时，只重新 render 了`一次`
- 当点击`异步执行`按钮时，render 了`两次`


### 同步和异步情况下，连续执行两次同一个 useState [(示例)](https://codesandbox.io/s/does-react-batches-state-update-functions-when-using-hooks-forked-btodx?file=/src/index.js)

```js
function Component() {
  const [a, setA] = useState(1);
  console.log('a', a);
  
  // 异步情况下
  function handleClickWithPromise() {
    Promise.resolve().then(() => {
      setA((a) => a + 1);
      setA((a) => a + 1);
    });
  }
  
  // 同步情况下
  function handleClickWithoutPromise() {
    setA((a) => a + 1);
    setA((a) => a + 1);
  }

  return (
    <>
      <button onClick={handleClickWithPromise}>{a} 异步执行</button>
      <button onClick={handleClickWithoutPromise}>{a} 同步执行</button>
    </>
  );
}
```
- 当点击`同步执行`按钮时，两次 setA 都执行，但由于 render 的合并，所以只渲染了一次，打印: `3`
- 当点击`异步执行`按钮时，两次 setA 各自 render 一次，分别打印: `2` `3`

## 2、再看 setState

### 同步和异步情况下，连续执行两个 setState [(示例)](https://codesandbox.io/s/does-react-batches-state-update-functions-when-using-hooks-forked-uleks?file=/src/index.js)

```js
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 1,
      b: 'b',
    };
  }

  handleClickWithPromise = () => {
    Promise.resolve().then(() => {
      this.setState({ ...this.state, a: 'aa' });
      this.setState({ ...this.state, b: 'bb' });
    });
  };

  handleClickWithoutPromise = () => {
    this.setState({ ...this.state, a: 'aa' });
    this.setState({ ...this.state, b: 'bb' });
  };

  render() {
    console.log('render');
    
    return (
      <>
        <button onClick={this.handleClickWithPromise}>异步执行</button>
        <button onClick={this.handleClickWithoutPromise}>同步执行</button>
      </>
    );
  }
}
```
#### 跟useState的结果一样

- 当点击`同步执行`按钮时，只重新 render 了`一次`
- 当点击`异步执行`按钮时，render 了`两次`

### 同步和异步情况下，连续执行两次同一个 setState [(示例)](https://codesandbox.io/s/does-react-batches-state-update-functions-when-using-hooks-forked-q3dhy?file=/src/index.js)

```js
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 1,
    };
  }

  handleClickWithPromise = () => {
    Promise.resolve().then(() => {
      this.setState({ a: this.state.a + 1 });
      this.setState({ a: this.state.a + 1 });
    });
  };

  handleClickWithoutPromise = () => {
    this.setState({ a: this.state.a + 1 });
    this.setState({ a: this.state.a + 1 });
  };

  render() {
    console.log('a', this.state.a);

    return (
      <>
        <button onClick={this.handleClickWithPromise}>异步执行</button>
        <button onClick={this.handleClickWithoutPromise}>同步执行</button>
      </>
    );
  }
}
```
- 当点击`同步执行`按钮时，两次 setState 合并，只执行了最后一次，打印: `2`
- 当点击`异步执行`按钮时，两次 setState 各自 render 一次，分别打印: `2` `3`

# 二、分析

为什么会有同步执行和异步执行结果不同呢？这里就涉及到 react 的 batchUpdate 机制，合并更新。

- 首先，为什么需要合并更新呢？<br>
  如果没有合并更新，在每次执行 useState 的时候，组件都要重新 render 一次，会造成无效渲染，浪费时间（因为最后一次渲染会覆盖掉前面所有的渲染效果）。
所以 react 会把一些可以一起更新的 useState/setState 放在一起，进行合并更新。

- 怎么进行合并更新?<br>
  这里 react 用到了事务机制
  
>React 中的 Batch Update 是通过「Transaction」实现的。在 React 源码关于 Transaction 的部分，用一大段文字及一幅字符画解释了 Transaction 的作用：

```
*                       wrappers (injected at creation time)
*                                      +        +
*                                      |        |
*                    +-----------------|--------|--------------+
*                    |                 v        |              |
*                    |      +---------------+   |              |
*                    |   +--|    wrapper1   |---|----+         |
*                    |   |  +---------------+   v    |         |
*                    |   |          +-------------+  |         |
*                    |   |     +----|   wrapper2  |--------+   |
*                    |   |     |    +-------------+  |     |   |
*                    |   |     |                     |     |   |
*                    |   v     v                     v     v   | wrapper
*                    | +---+ +---+   +---------+   +---+ +---+ | invariants
* perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
* +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
*                    | |   | |   |   |         |   |   | |   | |
*                    | |   | |   |   |         |   |   | |   | |
*                    | |   | |   |   |         |   |   | |   | |
*                    | +---+ +---+   +---------+   +---+ +---+ |
*                    |  initialize                    close    |
*                    +-----------------------------------------+
```
用大白话说就是在实际的 useState/setState 前后各加了段逻辑给包了起来。只要是在同一个事务中的 setState 会进行合并（注意，useState不会进行state的合并）处理。

- 为什么 setTimeout 不能进行事务操作?<br>
  由于 react 的事件委托机制，调用 onClick 执行的事件，是处于 react 的控制范围的。<br>
  而 setTimeout 已经超出了 react 的控制范围，react 无法对 setTimeout 的代码前后加上事务逻辑（除非 react 重写 setTimeout）。<br>
  所以当遇到 `setTimeout/setInterval/Promise.then(fn)/fetch 回调/xhr 网络回调`时，react 都是无法控制的。
  
