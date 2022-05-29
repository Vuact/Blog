>为什么叫 useState 而不叫 createState?<br>
>“Create” 可能不是很准确，因为 state 只在组件首次渲染的时候被创建。在下一次重新渲染时，useState 返回给我们当前的 state。


## useState更新状态

- 用值更新状态
- 使用回调更新状态


```js
import React, { useState } from 'react';

function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount((prevCount) => prevCount - 1)}>-</button>
      <button onClick={() => setCount((prevCount) => prevCount + 1)}>+</button>
    </>
  );
}
 ```
 
 ```js
// 更新数组
const [list, setList] = useState([]);
setList(list => [...list, 'New Item']);

// 更新对象
const [dataObj, setDataObj] = useState({});
setDataObj(dataObj => {...dataObj, {a: 1} });
 ```
 
 
 ## useState的坑
 
### 1、在使用useState() Hook 时，必须遵循 Hook 的规则

- 仅顶层调用 Hook ：不能在循环，条件，嵌套函数等中调用useState()。在多个useState()调用中，渲染之间的调用顺序必须相同。

以下都是不正确的：
```js
// 错误的：不应在条件中调用
function Switch({ isSwitchEnabled }) {
  if (isSwitchEnabled) {
    const [on, setOn] = useState(false);
  }
}
```
```js
// 错误的：不应嵌套函数中调用
function Switch() {
  let on = false;
  let setOn = () => {};

  function enableSwitch() {
    // Bad
    [on, setOn] = useState(false);
  }

  return (
    <button onClick={enableSwitch}>
      Enable light switch state
    </button>
  );
}
```

