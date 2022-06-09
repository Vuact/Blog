# 一、简介

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
  value: number;
}

// 步骤一：声明reducer函数
const personReducer = (state: ReducerStateProps, action: ReducerActionProps) => {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        age: state.age + action.value,
      };
    case 'decrement':
      return {
        ...state,
        age: state.age - action.value,
      };
    case 'reset':
      return {
        ...state,
        age: action.value,
      };
    default:
      return state;
  }
};

function PersonAge() {
  // 步骤二：使用useReducer
  const [personObj, dispatch] = useReducer(personReducer, {
    name: 'bty',
    age: 12,
  });

  // 步骤三：调用dispatch
  return (
    <div>
      <div>Hello, {personObj.name}</div>
      <div>age: {personObj.age}</div>
      <button key="increment" onClick={() => dispatch({ type: 'increment', value: 1 })}>
        Increment 1
      </button>
      <button key="decrement" onClick={() => dispatch({ type: 'decrement', value: 1 })}>
        Decrement 1
      </button>
      <button key="increment5" onClick={() => dispatch({ type: 'increment', value: 5 })}>
        Increment 5
      </button>
      <button key="decrement5" onClick={() => dispatch({ type: 'decrement', value: 5 })}>
        Decrement 5
      </button>
      <button key="reset" onClick={() => dispatch({ type: 'reset', value: 12 })}>
        Reset
      </button>
    </div>
  );
}
```

![Jun-08-2022 22-39-21](https://user-images.githubusercontent.com/74364990/172645097-a985f901-0c6f-49c5-b566-cc30f3211c6b.gif)

# 二、

注意上面的例子都是返回一个`新的state object`：
```js
····

switch (action.type) {
  case 'increment':
    return {
      ...state,
      age: state.age + action.value,
    };
    
   ····
}
```

https://juejin.cn/post/6844903854807482382#comment

https://juejin.cn/post/6844903869437181960
