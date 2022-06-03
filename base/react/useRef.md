# 什么是useRef

```js
const refContainer = useRef(initialValue);
```

- 返回一个可变的 `ref对象`，该对象只有个 `current` 属性，初始值为传入的参数( initialValue )。
- 返回的 `ref对象` 在组件的整个生命周期内保持不变
- 当更新 `current` 值时并不会 re-render ，这是与 `useState` 不同的地方
- 可以保存任何类型的值: dom、对象等任何可辨值
- useRef 类似于类组件的 this

### Dome

通过useRef定义个inputEl变量，在input 元素上定义`ref={inputEl}`, 这样通过`inputEl.current`就可以获取到`input Dom` 元素
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

# 为什么使用useRef

**需求： 跨渲染取到状态值**


### 只用useState实现:
```tsx
import React, { useState } from "react";

const LikeButton: React.FC = () => {
    const [like, setLike] = useState(0);
    
    function handleAlertClick() {
        setTimeout(() => {
            alert(`you clicked on ${like}`) 
            //形成闭包，所以弹出来的是当时触发函数时的like值
        }, 3000)
    }
    
    return (
        <>
            <button onClick={() => setLike(like + 1)}>{like}赞</button>
            <button onClick={handleAlertClick}>Alert</button>
        </>
    )
}

export default LikeButton
```
现象： 在like为6的时候, 点击 alert , 再继续增加like到10, 弹出的值为 6, 而非 10.

![image](https://user-images.githubusercontent.com/74364990/171949864-6dee6497-7468-48bb-aa48-e7a3afed71a7.png)

### 采用useRef实现:

```jsx
import React, { useRef } from "react";

const LikeButton: React.FC = () => {
  const like = useRef(0);
  
  function handleAlertClick() {
    setTimeout(() => {
      alert(`you clicked on ${like.current}`);
    }, 3000);
  }
  
  return (
    <>
      <button
        onClick={() => {
          like.current = like.current + 1;
        }}
      >
        {like.current}赞
      </button>
      <button onClick={handleAlertClick}>Alert</button>
    </>
  );
};

export default LikeButton;
```
现象：在like为6的时候, 点击 alert , 再继续增加like到10, 弹出的值为10.跟上面使用全局变量现象一致

![image](https://user-images.githubusercontent.com/74364990/171950399-19e9030f-d517-4b42-80ea-37e4570cbd72.png)

>小结：采用useRef,作为组件实例的变量，保证获取到的数据肯定是最新的。
