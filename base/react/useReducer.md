`useState()` 用于管理简单状态。对于复杂的状态管理，可以使用 `useReducer()`。

<br>

`useReducer(reducer, initialState)` 接受2个参数，分别为 `reducer 函数` 和 `初始状态`

其中 reducer 是一个函数`(state, action) => newState`：接收当前应用的state和触发的动作action，计算并返回最新的state。


```js
import React, {} from 'react';
```



https://juejin.cn/post/6844903854807482382#comment

https://juejin.cn/post/6844903869437181960
