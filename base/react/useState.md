
> [深究useState的原理](https://juejin.cn/post/6867077120691011591)
> https://juejin.cn/post/6959885030063603743
> https://juejin.cn/post/6844904072168865800


# 一、useState基本使用

>为什么叫 useState 而不叫 createState?<br>
>“Create” 可能不是很准确，因为 state 只在组件首次渲染的时候被创建。在下一次重新渲染时，useState 返回给我们当前的 state。

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
<br>

# 二、useState的坑
 
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

### 2、过时状态

组件<DelayedCount>延迟3秒计数按钮点击的次数:
```js
function DelayedCount() {
  const [count, setCount] = useState(0);

  const handleClickAsync = () => {
    setTimeout(function delay() {
      setCount(count + 1);
    }, 3000);
  }

  return (
    <div>
      {count}
      <button onClick={handleClickAsync}>Increase async</button>
    </div>
  );
}
```
  
[打开演示](https://codesandbox.io/s/react-usestate-async-broken-uzzvg)，快速多次点击按钮。`count` 变量不能正确记录实际点击次数，有些点击被吃掉。
  
<img width="163" alt="image" src="https://user-images.githubusercontent.com/74364990/170886312-8ed50cec-479b-4ba1-915d-cb2e122d4c21.png">

原因：`delay()` 是一个过时的闭包，它从初始渲染（使用0初始化时）中捕获了过时的`count`变量。
  
为了解决这个问题，使用函数方法来更新`count`状态：

```js
function DelayedCount() {
  const [count, setCount] = useState(0);

  const handleClickAsync = () => {
    setTimeout(function delay() {
      setCount(count => count + 1);
    }, 3000);
  }

  return (
    <div>
      {count}
      <button onClick={handleClickAsync}>Increase async</button>
    </div>
  );
}
```
现在 `etCount(count => count + 1)` 在 `delay()` 中正确更新计数状态。React 确保将最新状态值作为参数提供给更新状态函数，过时闭包的问题解决了。

[打开演示](https://codesandbox.io/s/react-usestate-async-fixed-5y2o8)，快速单击按钮。 延迟过去后，`count` 能正确表示点击次数。

### 3、useState的初始值，只在第一次有效
  
下面的例子是有问题的：
  
当点击按钮修改name的值的时候，你会发现在Child组件，是收到了，但是并没有通过useState赋值给name！原因就是：useState的初始值，只在第一次有效！！！
  
```js
const Child = memo(({data}) =>{
    console.log('child render...', data)
    const [name, setName] = useState(data)
    return (
        <div>
            <div>child</div>
            <div>{name} --- {data}</div>
        </div>
    );
})

const Hook =()=>{
    console.log('Hook render...')
    const [count, setCount] = useState(0)
    const [name, setName] = useState('rose')

    return(
        <div>
            <div>
                {count}
            </div>
            <button onClick={()=>setCount(count+1)}>update count </button>
            <button onClick={()=>setName('jack')}>update name </button>
            <Child data={name}/>
        </div>
    )
}
```
  
<br>

# 三、复杂状态管理（useReducer）
 
`useState()` 用于管理简单状态。对于复杂的状态管理，可以使用 `useReducer()`
 
假设需要编写一个最喜欢的电影列表。用户可以添加电影，也可以删除已有的电影，实现方式大致如下：
 
```js
import React, { useState } from 'react';

function FavoriteMovies() {
  const [movies, setMovies] = useState([{ name: 'Heat' }]);

  const add = movie => setMovies([...movies, movie]);

  const remove = index => {
    setMovies([
      ...movies.slice(0, index),
      ...movies.slice(index + 1)
    ]);
  }

  return (
    // Use add(movie) and remove(index)...
  );
}
```
[尝试演示](https://codesandbox.io/s/react-usestate-complex-state-5dplv)：添加和删除自己喜欢的电影。

<img width="269" alt="image" src="https://user-images.githubusercontent.com/74364990/170886245-c01d8065-1e7f-479c-9ef5-086cd0fa38b6.png">

 
 状态列表需要几个操作:添加和删除电影，状态管理细节使组件混乱。
 
 更好的解决方案是将复杂的状态管理提取到 `reducer` 中：
 
```js
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.item];
    case 'remove':
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1)
      ];
    default:
      throw new Error();
  }
}

function FavoriteMovies() {
  const [state, dispatch] = useReducer(reducer, [{ name: 'Heat' }]);

  return (
    // Use dispatch({ type: 'add', item: movie })
    // and dispatch({ type: 'remove', index })...
  );
}
```
`reducer`管理电影的状态，有两种操作类型：
- "add"将新电影插入列表
- "remove"从列表中按索引删除电影

[尝试演示](https://codesandbox.io/s/react-usestate-complex-state-usereducer-gpw87)并注意组件功能没有改变。但是这个版本的`<FavoriteMovies>`更容易理解，因为状态管理已经被提取到`reducer`中。

还有一个好处:可以将 `reducer` 提取到一个单独的模块中，并在其他组件中重用它。另外，即使没有组件，也可以对 `reducer` 进行单元测试。

 
 