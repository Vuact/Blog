
- 在正常的react的事件流里（如onClick等）
  - setState和useState是异步执行的（不会立即更新state的结果）
  - 多次执行setState和useState，只会调用一次重新渲染render
  - 不同的是，setState会进行state的合并，而useState则不会


- 在setTimeout，Promise.then等异步事件中
  - setState和useState是同步执行的（立即更新state的结果）
  - 多次执行setState和useState，每一次的执行setState和useState，都会调用一次render
