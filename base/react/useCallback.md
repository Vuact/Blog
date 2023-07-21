# 一、简介

主题虽然是`useCallback`，但顺面就把 `useMemo` 和 `React.memo` 也提一下吧。

useCallback、useMemo、React.memo 设计的初衷都是用来做性能优化的。

在Class Component中考虑以下的场景：

```js
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <Button onClick={() => this.handleClick()}>Click Me</Button>;
  }
}
```
传给 Button 的 onClick 方法每次都是重新创建的，这会导致每次 Foo render 的时候，Button 也跟着 render。优化方法有 2 种，箭头函数和 bind。下面以 bind 为例子：

```js
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <Button onClick={this.handleClick}>Click Me</Button>;
  }
}
```
同样的，`Function Component`也有这个问题：

```js
function Foo() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(`Click happened with dependency: ${count}`)
  }
  return <Button onClick={handleClick}>Click Me</Button>;
}
```
## useCallback

以上问题， React 给出的方案是`useCallback` Hook。在依赖不变的情况下 (在我们的例子中是 count )，它会返回相同的引用，避免子组件进行无意义的重复渲染：

```js
function Foo() {
  const [count, setCount] = useState(0);

  const memoizedHandleClick = useCallback(
    () => console.log(`Click happened with dependency: ${count}`), [count],
  ); 
  return <Button onClick={memoizedHandleClick}>Click Me</Button>;
}
```

## useMemo

`useCallback`缓存的是方法的引用，而`useMemo`缓存的则是方法的返回值。使用场景是减少不必要的子组件渲染：

```js
function Parent({ a, b }) {
  // 当 a 改变时才会重新渲染
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 当 b 改变时才会重新渲染
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```
## React.memo

如果想实现`Class Component`的`shouldComponentUpdate`方法，可以使用`React.memo`方法，区别是它只能比较 props，不会比较 state：

```js
const Parent = React.memo(({ a, b }) => {
  // 当 a 改变时才会重新渲染
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 当 b 改变时才会重新渲染
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
});
```

<br><br>

# 二、useCallback使用

看下面一段代码：
```js
let count = 0;

function App() {
  const [val, setVal] = useState('');
  
  // getData 模拟发起网络请求
  const getData = () => {
    setTimeout(() => {
      setVal('new data ' + count);
      count++;
    }, 500);
  };

  return <Child val={val} getData={getData} />;
}

function Child({ val, getData }) {
  useEffect(() => {
    getData();
  }, [getData]);

  return <div>{val}</div>;
}
```
上面是一段问题代码，是个死循环

![Jun-06-2022 02-44-58](https://user-images.githubusercontent.com/74364990/172065765-54653267-dbd8-4c54-a349-2174a317f022.gif)


先来分析下这段代码的用意，Child组件是一个纯展示型组件，其业务逻辑都是通过外部传进来的，这种场景在实际开发中很常见。

再分析下代码的执行过程：

- ① App渲染Child，将val和getData传进去
- ② Child使用useEffect获取数据。因为对getData有依赖，于是将其加入依赖列表
- ③ getData执行时，调用setVal，导致App重新渲染
- ④ App重新渲染时生成新的getData方法，传给Child
- ⑤ Child发现getData的引用变了，又会执行getData
- ⑥ 3 -> 5 是一个死循环

## 解决：使用useCallback

只需要将上面getData改为如下写法即可：

```js
const getData = useCallback(() => {
  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, []);
```

## 新需求：useCallback需要依赖state

假如在`getData`中需要用到`val`( useState 中的值)，就需要将其加入依赖列表，这样的话又会导致每次`getData`的引用都不一样，死循环又出现了...

```js
const getData = useCallback(() => {
  console.log(val);
  
  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, [val]);
```

如果我们希望无论val怎么变，getData的引用都保持不变，同时又能取到val最新的值，可以通过自定义 hook 实现。注意这里不能简单的把val从依赖列表中去掉，否则getData中的val永远都只会是初始值（闭包原理）。

```js
function useRefCallback(fn, dependencies) {
  const ref = useRef(fn);

  // 每次调用的时候，fn 都是一个全新的函数，函数中的变量有自己的作用域
  // 当依赖改变的时候，传入的 fn 中的依赖值也会更新，这时更新 ref 的指向为新传入的 fn
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```
使用：

```js
const getData = useRefCallback(() => {
  console.log(val);

  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, [val]);
```
完整代码可以看[这里](https://codesandbox.io/s/userefcallback-zi2ff)

<br><br>

# 三、用useCallback优化性能

useCallback真正有助于性能改善的，有 2 种场景：

- 函数定义时需要进行大量运算，这种场景相对少见
- 需要比较引用的场景，又或者是配合[React.Memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)使用：

### 函数定义时需要进行大量运算

**优化前：**

```js
function App() {
  const [data, setData] = useState([]);

  // 需执行大量运算生成过滤条件
  const filter = generateExpensiveFilter(data); 

  const filteredData = useMemo(() => {
    return data.filter(filter);
  }, [data, filter]);

  return <DataView data={filteredData} />;

}

// 生成过滤条件的逻辑
function generateExpensiveFilter(data) {
  // ...大量运算
  return filter;
}
```

**优化后：**

```js
function App() {
  const [data, setData] = useState([]);

  // 使用 useCallback 记忆
  const filter = useCallback(() => {
    return generateExpensiveFilter(data);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(filter); 
  }, [data, filter]);

  return <DataView data={filteredData} />;
}
```


### `useCallback`配合`React.Memo`使用的场景：

**优化前：**
```js
const Child = React.memo(function ({ val, onChange }) {
  console.log('render...');

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const onChange1 = (evt) => {
    setVal1(evt.target.value);
  };

  const onChange2 = (evt) => {
    setVal2(evt.target.value);
  };

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```
现象：任何一个输入框的变化都会导致另一个输入框重新渲染。
具体分析:
1. App 组件中的 onChange1 和 onChange2 在每次渲染时会作为新的函数被创建,所以它们的引用总是变化的。
2. Child 组件使用 React.memo 进行了记忆化,只有当 props 变化时才会重新渲染。
3. 每次 App 重新渲染,会将新的 onChange1 和 onChange2 函数引用传递给对应的 Child 组件。
4. 因此每个 Child 组件接收到的 props.onChange 函数引用发生了变化,会触发重新渲染。
5. 这样当一个输入框变化,整个 App 组件重新渲染,另一个 Child 组件由于接收到新的函数引用也会跟着重新渲染。

![Jun-06-2022 03-20-01](https://user-images.githubusercontent.com/74364990/172067104-2ba8c80d-e17c-4326-b03c-3fa6f89cf4ed.gif)

**优化后：**
```js
const Child = React.memo(function({ val, onChange }) {
  console.log("render...");

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const onChange1 = useCallback(evt => {
    setVal1(evt.target.value);
  }, []);

  const onChange2 = useCallback(evt => {
    setVal2(evt.target.value);
  }, []);

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```
现象：一个输入框的变化，不再会导致另一个输入框的重新渲染。代码在[这里](https://codesandbox.io/s/reactmemo-rmt1e?file=/src/index.js)

![Jun-06-2022 03-22-13](https://user-images.githubusercontent.com/74364990/172067155-a34e012a-cee3-4448-b625-47994dc424fe.gif)



