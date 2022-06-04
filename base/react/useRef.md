# 什么是useRef？

```js
const refContainer = useRef(initialValue);
```

- 返回一个可变的 `ref对象`，该对象只有个 `current` 属性，初始值为传入的参数( initialValue )。
- 返回的 `ref对象` 在组件的整个生命周期内保持不变
- 当更新 `current` 值时并不会 re-render ，这是与 `useState` 不同的地方
- 可以保存任何类型的值: dom、对象等任何可辨值
- useRef 类似于类组件的 this

### Demo

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
<br>

# 为什么使用useRef？

需求： 跨渲染取到状态值


### 用useState实现:
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

![Jun-05-2022 02-57-37](https://user-images.githubusercontent.com/74364990/172021914-21fc3198-825b-47a5-b533-e759ca575fea.gif)


### 用useRef实现:

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

<br>

# useRef与createRef的区别

```tsx
import React, { useState, useRef, createRef } from 'react';

const RefDifference: React.FC = () => {
    const [renderIndex, setRenderIndex] = useState(1);
    
    const refFromUseRef = useRef<number>();
    const refFromCreateRef = createRef();
    
    console.info(refFromUseRef.current, 'refFromUseRef.current')
    console.info(refFromCreateRef.current, 'refFromCreateRef.current')
    
    if (!refFromUseRef.current) {
        refFromUseRef.current = renderIndex
    }

    if (!refFromCreateRef.current) {
        refFromCreateRef.current = renderIndex
    }
    
    return (
        <>
         <p>Current render index: {renderIndex}</p>
         <p>
            <b>refFromUseRef</b> value: {refFromUseRef.current}
         </p>
         <p>
            <b>refFromCreateRef</b> value: {refFromCreateRef.current}
         </p>
         <button onClick={() => setRenderIndex((prev) => prev + 1)}>
            Cause re-render
         </button>
        </>
    );
}

export default RefDifference;
```
现象：
点击按钮时，从控制台可以看到`refFromUseRef.current`一直为1(因为`refFromUseRef.current`已经存在该引用)，而`refFromCreateRef.current`却是`undefined`(因为`createRef` 每次渲染都会返回一个新的引用，所以`if`判断时为`true`，会被重新赋值，页面就会显示出新的值)

![Jun-05-2022 02-25-05](https://user-images.githubusercontent.com/74364990/172020828-657738da-974a-4717-86b2-f5d65cf7e743.gif)


小结： `createRef` 每次渲染都会返回一个新的引用，而 `useRef` 每次都会返回相同的引用


