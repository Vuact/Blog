`useState()` 用于管理简单状态。对于复杂的状态管理，可以使用 `useReducer()`。

<br>

`useReducer(reducer, initialState)` 接受2个参数，分别为 `reducer 函数` 和 `初始状态`

其中 reducer 是一个函数`(state, action) => newState`：接收当前应用的state和触发的动作action，计算并返回最新的state。

来个🌰：
```jsx
import React, { useReducer } from 'react';

interface ReducerStateProps {
  name: string;
  age: number;
}

interface ReducerActionProps {
  type: string;
}

const personReducer = (state: ReducerStateProps, action: ReducerActionProps) => {
  switch (action.type) {
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
      <button key="increment" onClick={() => dispatch({ type: 'increment' })}>
        Increment
      </button>
      <button key="decrement" onClick={() => dispatch({ type: 'decrement' })}>
        Decrement
      </button>
      <button key="reset" onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

![Jun-08-2022 22-24-08](https://user-images.githubusercontent.com/74364990/172641772-a310687e-db85-4f0c-bc7e-e09f2881ed48.gif)


https://juejin.cn/post/6844903854807482382#comment

https://juejin.cn/post/6844903869437181960
