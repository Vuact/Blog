

# 一、Demo

## 1、先看useState

同步和异步情况下，连续执行多个 useState [(示例)](https://codesandbox.io/s/does-react-batches-state-update-functions-when-using-hooks-forked-4gxr2?file=/src/index.js)

```js
function Component() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState("init");

  console.log("render", `a => ${a}; b => ${b}; c => ${c};`);

  // 模拟网络请求
  const ajaxAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // 异步情况下
  async function handleClickWithPromise() {
    await ajaxAsync();

    setA((a) => a + 1);
    setA((a) => a + 1);
    setB(b + 1);
    setB(b + 1);
    setC("change1");
    setC("change2");
  }

  // 同步情况下
  function handleClickWithoutPromise() {
    setA((a) => a + 1);
    setA((a) => a + 1);
    setB(b + 1);
    setB(b + 1);
    setC("change1");
    setC("change2");
  }

  return (
    <>
      <button onClick={handleClickWithPromise}>
        {a}-{b}-{c} 异步执行
      </button>
      <button onClick={handleClickWithoutPromise}>
        {a}-{b}-{c} 同步执行
      </button>
    </>
  );
}
```
- 当点击`同步执行`按钮时，只重新 render 了`1次`

![image](https://github.com/Vuact/Blog/assets/74364990/a8e09022-63f0-4b5e-959d-22ed387323af)

- 当点击`异步执行`按钮时，render 了`6次`

![image](https://github.com/Vuact/Blog/assets/74364990/6702057b-fccf-43a4-bf59-8b41c38b3cb3)



## 2、再看 setState

同步和异步情况下，连续执行多个 setState

```js
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: 0,
      b: 0,
      c: "init"
    };
  }

  // 模拟网络请求
  ajaxAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  handleClickWithPromise = async () => {
    await this.ajaxAsync();

    this.setState({ ...this.state, c: "change1" });
    this.setState({ ...this.state, c: "change2" });
    this.setState({ ...this.state, b: this.state.b + 1 });
    this.setState({ ...this.state, b: this.state.b + 1 });
    this.setState((prevState) => ({ ...prevState, a: prevState.a + 1 }));
    this.setState((prevState) => ({ ...prevState, a: prevState.a + 1 }));
  };

  handleClickWithoutPromise = () => {
    this.setState({ ...this.state, c: "change1" });
    this.setState({ ...this.state, c: "change2" });
    this.setState({ ...this.state, b: this.state.b + 1 });
    this.setState({ ...this.state, b: this.state.b + 1 });
    this.setState((prevState) => ({ ...prevState, a: prevState.a + 1 }));
    this.setState((prevState) => ({ ...prevState, a: prevState.a + 1 }));
  };

  render() {
    const { a, b, c } = this.state;

    console.log("render", `a => ${a}; b => ${b}; c => ${c};`);

    return (
      <>
        <button onClick={this.handleClickWithPromise}>异步执行</button>
        <button onClick={this.handleClickWithoutPromise}>同步执行</button>
      </>
    );
  }
}
```

- 当点击`同步执行`按钮时，只重新 render 了`1次`

![image](https://github.com/Vuact/Blog/assets/74364990/d999f9c2-ba1d-457b-93ad-b585d0c97c30)

> 注意：这里c的输出一直为init，原因是因为：React中每次调用setState都需要手动合并state，而这里的c的state被后来的 `this.setState({ ...this.state, b: this.state.b + 1 });` 覆盖为了init

- 当点击`异步执行`按钮时，render 了`6次`

![image](https://github.com/Vuact/Blog/assets/74364990/0e52ae51-151e-49a4-a563-f9e704bee3f8)


# 二、分析

当你在React中调用`useState`或`setState`函数时，React并不会立即更新组件的状态，而是会将更新操作放入一个队列中，然后在稍后的渲染过程中进行合并更新。这种行为叫做批处理（batching），它可以提高React的性能，因为React可以通过一次性的更新操作，而不是多次独立的更新，来减少不必要的渲染和DOM操作。

那为什么会有同步执行和异步执行结果不同呢？因为同步操作是在React的事件流里，而异步操作脱离了React的事件流。


#### 1、首先，为什么需要合并更新呢？
  
如果没有合并更新，在每次执行 useState 的时候，组件都要重新 render 一次，会造成无效渲染，浪费时间（因为最后一次渲染会覆盖掉前面所有的渲染效果）。
所以 react 会把一些可以一起更新的 useState/setState 放在一起，进行合并更新。

#### 2、怎么进行合并更新?

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

#### 3、为什么 setTimeout 不能进行事务操作?

由于 react 的事件委托机制，调用 onClick 执行的事件，是处于 react 的控制范围的。<br>
而 setTimeout 已经超出了 react 的控制范围，react 无法对 setTimeout 的代码前后加上事务逻辑（除非 react 重写 setTimeout）。<br>
所以当遇到 `setTimeout/setInterval/Promise.then(fn)/fetch 回调/xhr 网络回调`时，react 都是无法控制的。
  

<br><br>

## 总结：

无论在 函数式组件 还是 类组件 ：
- 在`同步执行`中（即在正常的React的事件流里）：多次执行 setState或useState 都只会调用一次重新渲染render。
- 在`异步执行`中（即脱离了正常的React的事件流）：多次执行 setState或useState，每一次的执行setState和useState，都会调用一次render

>异步执行例如：setTimeout，Promise.then、await等事件


<br><br>

# 三、React18抹平了同步异步之间的差异

上面Demo提及的同步异步的输出，在React17及以前版本均适用，但 React18 对于脱离React事件流引发的多次组件执行进行了优化合并，与同步情况下的行为保持了一致。

代码：
```js
function Component() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState('init');

  console.log('render', a, b, c);

  // 模拟网络请求
  const ajaxAsync = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // 异步情况下
  async function handleClickWithPromise() {
    await ajaxAsync();

    setA((a) => a + 1);
    setA((a) => a + 1);
    setB(b + 1);
    setB(b + 1);
    setC('change1');
    setC('change2');
  }

  // 同步情况下
  function handleClickWithoutPromise() {
    setA((a) => a + 1);
    setA((a) => a + 1);
    setB(b + 1);
    setB(b + 1);
    setC('change1');
    setC('change2');
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
- 点击 同步执行 按钮，输出：

<img width="197" alt="企业微信截图_fd30d280-2aee-4f74-b18f-f31da09d9264" src="https://github.com/Vuact/Blog/assets/74364990/d37e15f9-ad9b-4d15-ad87-0d2a57d92eb8">

- 点击 异步执行 按钮，输出：

<img width="215" alt="企业微信截图_a5fa0ba5-aa39-46a4-88fb-22fe75916f05" src="https://github.com/Vuact/Blog/assets/74364990/9081c2e7-604f-49eb-a002-ba0cbdb7b568">


