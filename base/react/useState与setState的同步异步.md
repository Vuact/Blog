
- 在正常的React的事件流里（如onClick等）
  - setState和useState是异步执行的（不会立即更新state的结果）
  - 多次执行setState和useState，只会调用一次重新渲染render
  - 不同的是，setState会进行state的合并，而useState则不会


- 在setTimeout，Promise.then等异步事件中
  - setState和useState是同步执行的（立即更新state的结果）
  - 多次执行setState和useState，每一次的执行setState和useState，都会调用一次render


<br>

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
