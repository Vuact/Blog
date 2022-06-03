# 什么是useRef

```js
const refContainer = useRef(initialValue);
```

- 返回一个可变的 `ref对象`，该对象只有个 `current` 属性，初始值为传入的参数( initialValue )。
- 返回的 `ref对象` 在组件的整个生命周期内保持不变
- 当更新 `current` 值时并不会 re-render ，这是与 `useState` 不同的地方
- 可以保存任何类型的值: dom、对象等任何可辨值
- useRef 类似于类组件的 this

Dome
```tsx
import React, { MutableRefObject, useRef } from 'react'

const TextInputWithFocusButton: React.FC = () => {
   const inputEl: MutableRefObject<any> = useRef(null)
   const handleFocus = () => {
       // `current` 指向已挂载到 DOM 上的文本输入元素
       inputEl.current.focus()
   }
   
   return (
       <p>
           <input ref={inputEl} type="text" />
           <button onClick={handleFocus}>Focus the input</button>
       </p>
   )
}

export default TextInputWithFocusButton;
```
