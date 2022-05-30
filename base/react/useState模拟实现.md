在 React 中，我们使用 useState 为函数组件设置内部数据，`React.useState()`接收一个参数作为变量的初始值，返回一个数组，数组的第一项用于变量的读，数组的第二项用于变量的写，如下代码：

当点击按钮的时候，实现变量+1的操作

```js
const App = () => {
  const [n, setN] = React.useState(0);
  return (
     <div>
         <p>n：{n}</p>
         <button onClick={() => setN(n+1)}>+1</button>
     </div>
  )
}

ReactDOM.render(<App/>, document.querySelector('#root'));
```
思考一下点击按钮的时候会发生什么？

显然就是执行 `setN` 函数，同时我们可以在运行的时候看到页面上的 `n` 会随着每一次点击而变化，这说明 `setN` 函数会让页面再次渲染，也就是再次执行 App 函数，而再次执行应该仍然会经历`const [n, setN] = React.useState(0);`，可是 n 为什么没有回到原始值 `0` 呢？`useState()` 到底是怎样执行的？ `setN` 会怎么改变 `n`？

下面我们来模拟实现下useState。

# 一、1.0版：创建一个state

通过实际的效果，我们可以分析到 `setN` 一定会改变某个数据 `x` ，并且会触发页面再次渲染，否则我们就不能在页面上看到变化的 `n` 值，而 `useState` 一定会从 `x` 取到 `n` 的最新值，我们模拟 `useState` 函数创建一个 `myUseState` 函数，如下代码：

```js
let x;

function myUseState(initialState) {
  x = x === undefined ? initialState : x;
  
  function setX(newState) {
    x = newState;
    ReactDOM.render(<App />, rootElement);;
  }
  
  return [x, setX];
}

const App = () => {
  const [n, setN] = myUseState(0);
  return (
    <div>
      <p>{n}</p>
      <p>
        <button onClick={() => setN(n + 1)}>+1</button>
      </p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

如上所示，当我们调用 `myUseState` 函数的时候，就可以达到与之前一样的效果，为了确保 `n` 值的变化，所以必须要把 `x` 放在函数的外面。

但是很显然上面的代码是有问题的，因为如果我们有多个变量的话，也就是使用多次 `myUseState` ，一个单一的 `x` 中间值并不能存放我们的多个变量，那怎么办呢？ 

# 二、2.0版：创建多个state

很简单，一个单一的 `x` 值不能存放多个变量，那我们就把 `x` 变成一个对象，例如 `{n:0,m:0}`，聪明的你肯定很快会发现我们在使用 `useState(0)` 的时候并不能知道变量是叫 `n` 还是 `m`，所以使用对象是不行的，既然这样，那就只能使用数组了，通过调用的顺序来指明中间值 `x` 保存在哪里，而且事实上React 貌似也正是这样做的，如下代码所示：

```js
let x = [];
let index = 0;

const myUseState = initialState => {
  let curIndex = index; 
  x[curIndex] = x[curIndex] === undefined ? initialState : x[curIndex];

  const setState = newState => {
    x[curIndex] = newState;
    ReactDOM.render(<App />, rootElement);
    index = 0;  // 每更新一次都需要将index归零
  };

  index += 1;  // 下一个操作的索引
  
  return [x[curIndex], setState];
}

const App = () => {
  const [n, setN] = myUseState(0);
  const [m, setM] = myUseState(0);
  return (
     <div>
         <p>n：{n}</p>
         <button onClick={()=>setN(n+1)}>+1</button>
         <p>m：{m}</p>
         <button onClick={()=>setM(m+1)}>+1</button>
     </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

这样做，即使我们要执行多次 useState，变量之间也不会相互干扰，从而达到了要求，但是仍然需要注意的是当使用数组方案的时候，就特别依赖调用顺序，因为如果首次渲染的时候 n 是第一个，m 是第二个，k 是第三个，那么在第二次渲染的时候必须保证顺序完全一致，因此在 React 中不允许出现下列代码，否则就会报错：

![image](https://user-images.githubusercontent.com/74364990/171037994-10557466-dc67-44e3-973c-6762c5ca69ec.png)

你可能会有疑问，上述的 App 组件用了 `x` 和 `index` ，那么其他组件用什么呢？很显然 React 会给每一个组件创建一个 `x` 和 `index`，但是如果全部放在全局作用域下，就会很容易导致重名，为了避免这个问题，React 将其放在了每个组件对应的虚拟节点对象上。

### 小总结：
>`每个函数组件对应一个 React 节点，每个节点保存着 x 和 index ，useX 会读取 x[index] ，index 由 useState 出现的顺序决定，setX 会改变 state 的值并触发页面更新`。

<br>

# 三、3.0版：参数是函数时 与 是否更新

我们再优化下：

- 优化点1：如果 `setN` 的参数是个函数呢？
- 优化点2：通过 Object.is() 比较算法来判断 `x[curIndex]` 是否需要更新

```js
let x = [];
let index = 0;

const myUseState = initialState => {
  let curIndex = index; 
    
  // 如果是个函数
  if (typeof initialState === "function") {
    initialState = initialState();
  }
  
  x[curIndex] = x[curIndex] === undefined ? initialState : x[curIndex];

  const setState = newState => {
    // 如果是个函数
    if (typeof newState === "function") {
      newState = newState(x[curIndex]);
    }
    
    // 使用Object.is来比较x[curIndex]是否变化，若无，则跳过更新
    if (Object.is(x[curIndex], newState)) return; 
    
    x[curIndex] = newState;
    ReactDOM.render(<App />, rootElement);
    index = 0;
  };

  index += 1;
  
  return [x[curIndex], setState];
}

const App = () => {
  const [n, setN] = myUseState(0);
  const [m, setM] = myUseState(0);
  return (
     <div>
         <p>n：{n}</p>
         <button onClick={()=>setN(n+1)}>+1</button>
         <p>m：{m}</p>
         <button onClick={()=>setM(m+1)}>+1</button>
     </div>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
> [Object.is()](https://www.apiref.com/javascript-zh/Reference/Global_Objects/Object/is.htm)方法判断两个值是否是相同的值。

至此，我的模拟实现已结束。而实际上， React 并不是真的是这样实现的。上面提到的 `x` 其实对应 React 的 memoizedState ，而 `index` 实际上是利用了链表

<br>

# 每次创建的新值

现在我们继续探讨一下当执行 `setN` 的时候，会不会改变 `n` 的值，我们做一个实验：当点击 +1 按钮的时候，实现 `n` 的值 +1，当点击 `log` 按钮的时候，执行一个 setTimeout 函数，该函数会在三秒之后打印出 `n` 的值，代码如下：

```js
const App = () => {
  const [n, setN] = React.useState(0);
  const log = () => {
    setTimeout(() => console.log(n), 3000);
  };
  return (
    <>
      <p>n:{n}</p>
      <button onClick={() => setN(n + 1)}>+1</button>
      <button onClick={log}>log</button>
    </>
  );
};
```
如果先点击 +1 按钮再点击 `log` 按钮，会看到页面上的 `n` 和控制台打印的 `n` 是一样的;

但是如果我们调换顺序，先点击 `log` 按钮再点击 +1 按钮，就会发现页面上的 `n` 和控制台打印的 `n` 并不是一样的，控制台打印的结果并不是 +1 之后的结果，也就是说当我们执行 `log` 函数的时候，尽管在这个期间已经改变了 `n` 值，但是在三秒钟之后打印的 n 值却不是 +1 之后的结果，由此可以说明 `setN` 并不会改变当前的值，而是每次创建的新值，这也正是 React 所认定的“数据不可变”思想。


