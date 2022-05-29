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
