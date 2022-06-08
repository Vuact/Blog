`useState()` 用于管理简单状态。对于复杂的状态管理，可以使用 `useReducer()`。

<br>

`useReducer(reducer, initialState)` 接受2个参数，分别为 `reducer 函数` 和 `初始状态`

其中 reducer 是一个函数`(state, action) => newState`：接收当前应用的state和触发的动作action，计算并返回最新的state。

```js
import React, { useReducer } from 'react';

interface ReducerStateProps {
  name: string;
  age: number;
}

const personReducer = (state: ReducerStateProps, action: string) => {
  switch (action) {
    case 'increment':
      return {
        ...state,
        age: state.age + 1,
      };
    case 'decrement':
      return {
        ...state,
        age: state.age - 1,
      };
    case 'reset':
      return {
        ...state,
        age: 12,
      };
    default:
      return state;
  }
};

function PersonAge() {
  const [personObj, dispatch] = useReducer(personReducer, {
    name: 'bty',
    age: 12,
  });

  return (
    <div>
      <div>Hello, {personObj.name}</div>
      <div>age: {personObj.age}</div>
      <button key="increment" onClick={() => dispatch('increment')}>
        Increment
      </button>
      <button key="decrement" onClick={() => dispatch('decrement')}>
        Decrement
      </button>
      <button key="reset" onClick={() => dispatch('reset')}>
        Reset
      </button>
    </div>
  );
}
```



https://juejin.cn/post/6844903854807482382#comment

https://juejin.cn/post/6844903869437181960
