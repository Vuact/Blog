在 React 中，我们使用 useState 为函数组件设置内部数据，React.useState()接收一个参数作为变量的初始值，返回一个数组，数组的第一项用于变量的读，数组的第二项用于变量的写，如下代码：

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

# 一、1.0版本

通过实际的效果，我们可以分析到 `setN` 一定会改变某个数据 `x` ，并且会触发页面再次渲染，否则我们就不能在页面上看到变化的 `n` 值，而 `useState` 一定会从 `x` 取到 `n` 的最新值，我们模拟 `useState` 函数创建一个 `myUseState` 函数，如下代码：

```js
const rootElement = document.getElementById("root");
let x;

function myUseState(initialValue) {
  x = x === undefined ? initialValue : x;
  
  function setX(newState) {
    x = newState;
    render();
  }
  
  return [x, setX];
}

// 模拟的render函数
const render = () => ReactDOM.render(<App />, rootElement);

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

ReactDOM.render(<App />, rootElement);
```

如上所示，当我们调用 `myUseState` 函数的时候，就可以达到与之前一样的效果，为了确保 `n` 值的变化，所以必须要把 `x` 放在函数的外面。

但是很显然上面的代码是有问题的，因为如果我们有多个变量的话，也就是使用多次 `myUseState` ，一个单一的 `x` 中间值并不能存放我们的多个变量，那怎么办呢？ 

# 二、2.0版本

很简单，一个单一的 `x` 值不能存放多个变量，那我们就把 `x` 变成一个对象，例如 `{n:0,m:0}`，聪明的你肯定很快会发现我们在使用 `useState(0)` 的时候并不能知道变量是叫 `n` 还是 `m`，所以使用对象是不行的，既然这样，那就只能使用数组了，通过调用的顺序来指明中间值 `x` 保存在哪里，而且事实上React 貌似也正是这样做的，如下代码所示：

```js
let x = [];
let index = 0;

const myUseState = initial => {
    let currentIndex = index;
    x[currentIndex] = x[currentIndex] === undefined ? initial : x[currentIndex];
   
    const setInitial = value => {
      x[currentIndex] = value;
      render();
    }
    
    index += 1;
    return [x[currentIndex],setInitial]
}

// 模拟的render函数
const render = () => {
  index = 0;  //将 index 重置
  ReactDOM.render(<App/>,document.querySelector('#root'))
}

const App = () => {
  const [n, setN] = myUseState(0)
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
```

这样做，即使我们要执行多次 useState，变量之间也不会相互干扰，从而达到了要求，但是仍然需要注意的是当使用数组方案的时候，就特别依赖调用顺序，因为如果首次渲染的时候 n 是第一个，m 是第二个，k 是第三个，那么在第二次渲染的时候必须保证顺序完全一致，因此在 React 中不允许出现下列代码，否则就会报错：

![image](https://user-images.githubusercontent.com/74364990/171037994-10557466-dc67-44e3-973c-6762c5ca69ec.png)

你可能会有疑问，上述的 App 组件用了 `x` 和 `index` ，那么其他组件用什么呢？很显然 React 会给每一个组件创建一个 `x` 和 `index`，但是如果全部放在全局作用域下，就会很容易导致重名，为了避免这个问题，React 将其放在了每个组件对应的虚拟节点对象上。

### 小总结：
>`每个函数组件对应一个 React 节点，每个节点保存着 x 和 index ，useX 会读取 x[index] ，index 由 useState 出现的顺序决定，setX 会改变 state 的值并触发页面更新`。

<br>

# 三、每次创建的新值
