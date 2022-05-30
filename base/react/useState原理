在 React 中，我们使用 useState 为函数组件设置内部数据，React.useState()接收一个参数作为变量的初始值，返回一个数组，数组的第一项用于变量的读，数组的第二项用于变量的写，如下代码，当点击按钮的时候，实现变量+1的操作：

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
