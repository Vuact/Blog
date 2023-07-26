
# 一、一些缓存钩子

主题虽然是`useCallback`，但顺面就把 `useMemo` 和 `React.memo` 也提一下吧。

useCallback、useMemo、React.memo 设计的初衷都是用来做性能优化的。

在Class Component中考虑以下的场景：

```js
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <Button onClick={() => this.handleClick()}>Click Me</Button>;
  }
}
```
传给 Button 的 onClick 方法每次都是重新创建的，这会导致每次 Foo render 的时候，Button 也跟着 render。优化方法有 2 种，箭头函数和 bind。下面以 bind 为例子：

```js
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <Button onClick={this.handleClick}>Click Me</Button>;
  }
}
```
同样的，`Function Component`也有这个问题：

```js
function Foo() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log(`Click happened with dependency: ${count}`)
  }
  return <Button onClick={handleClick}>Click Me</Button>;
}
```
## useCallback

以上问题， React 给出的方案是`useCallback` Hook。在依赖不变的情况下 (在我们的例子中是 count )，它会返回相同的引用，避免子组件进行无意义的重复渲染：

```js
function Foo() {
  const [count, setCount] = useState(0);

  const memoizedHandleClick = useCallback(
    () => console.log(`Click happened with dependency: ${count}`), [count],
  ); 
  return <Button onClick={memoizedHandleClick}>Click Me</Button>;
}
```

## useMemo

`useCallback`缓存的是方法的引用，而`useMemo`缓存的则是方法的返回值。使用场景是减少不必要的子组件渲染：

```js
function Parent({ a, b }) {
  // 当 a 改变时才会重新渲染
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 当 b 改变时才会重新渲染
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```
## React.memo

如果想实现`Class Component`的`shouldComponentUpdate`方法，可以使用`React.memo`方法，区别是它只能比较 props，不会比较 state：

```js
const Parent = React.memo(({ a, b }) => {
  // 当 a 改变时才会重新渲染
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 当 b 改变时才会重新渲染
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
});
```

<br><br>

# 二、useCallback

## 1、介绍

useCallback 接收一个内联回调函数以及一个依赖项数组作为参数。

作用:
- 缓存回调函数实例,避免每次渲染时重新创建函数
- 配合依赖项数组实现依赖变更时才更新函数

```js
const memoizedCallback = useCallback(() => {
  // 函数体
}, [依赖项]) 
```

useCallback的返回值是一个函数，所以它包裹的函数是个典型的闭包（即：拥有了保存上一个状态的变量）

`相当于相机，包裹的函数相当于照片，仅有在 相机的依赖项改变时，才会更新照片`(即包裹的函数)。

举个例子：
```js
let count = 0;

const Chat = () => {
  const [text, setText] = useState('init');
  const countRef = useRef(0);

  console.log('updateComponent', text, count, countRef.current);

  const onConsole = useCallback(() => {
    console.log('onClick', count);
    console.log('onClick', countRef.current);
    console.log('onClick', text);
  }, []);

  const onUpdate = () => {
    setText('update');
    count++;
    countRef.current++;
  };

  return (
    <>
      <button onClick={onUpdate}>修改值</button>
      <button onClick={onConsole}>打印</button>
    </>
  );
};
```

![image](https://github.com/Vuact/Blog/assets/74364990/a0849c74-af47-4495-8629-9fa95b467aa6)

先点击 "打印" button，控制台输出: 
<img width="273" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/43952c5d-941f-4a1e-86a3-25d6594d4b78">

再点击 "修改值" button，控制台输出: 
<img width="297" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/eed4ce18-9fcd-44c2-b03a-e6c180674e51">

再次点击 "打印" button，控制台输出:
<img width="327" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/8e1412fa-c3aa-4377-baf8-5f8a10d40b84">


上面的useCallback包裹的`匿名函数就是一张照片`，由于`依赖项为空`，所以`相片永远都不更新`，`因而 匿名函数 中 text 始终为 init`

## 2、实战
看下面一段代码：
```js
let count = 0;

function App() {
  const [val, setVal] = useState('');
  
  // getData 模拟发起网络请求
  const getData = () => {
    setTimeout(() => {
      setVal('new data ' + count);
      count++;
    }, 500);
  };

  return <Child val={val} getData={getData} />;
}

function Child({ val, getData }) {
  useEffect(() => {
    getData();
  }, [getData]);

  return <div>{val}</div>;
}
```
上面是一段问题代码，是个死循环

![Jun-06-2022 02-44-58](https://user-images.githubusercontent.com/74364990/172065765-54653267-dbd8-4c54-a349-2174a317f022.gif)


先来分析下这段代码的用意，Child组件是一个纯展示型组件，其业务逻辑都是通过外部传进来的，这种场景在实际开发中很常见。

再分析下代码的执行过程：

- ① App渲染Child，将val和getData传进去
- ② Child使用useEffect获取数据。因为对getData有依赖，于是将其加入依赖列表
- ③ getData执行时，调用setVal，导致App重新渲染
- ④ App重新渲染时生成新的getData方法，传给Child
- ⑤ Child发现getData的引用变了，又会执行getData
- ⑥ 3 -> 5 是一个死循环

#### 解决：使用useCallback

只需要将上面getData改为如下写法即可：

```js
const getData = useCallback(() => {
  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, []);
```

#### 新需求：useCallback需要依赖state

假如在`getData`中需要用到`val`( useState 中的值)，就需要将其加入依赖列表，这样的话又会导致每次`getData`的引用都不一样，死循环又出现了...

```js
const getData = useCallback(() => {
  console.log(val);
  
  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, [val]);
```

如果我们希望无论val怎么变，getData的引用都保持不变，同时又能取到val最新的值，可以通过自定义 hook 实现。注意这里不能简单的把val从依赖列表中去掉，否则getData中的val永远都只会是初始值（闭包原理）。

```js
function useRefCallback(fn, dependencies) {
  const ref = useRef(fn);

  // 每次调用的时候，fn 都是一个全新的函数，函数中的变量有自己的作用域
  // 当依赖改变的时候，传入的 fn 中的依赖值也会更新，这时更新 ref 的指向为新传入的 fn
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```
使用：

```js
const getData = useRefCallback(() => {
  console.log(val);

  setTimeout(() => {
    setVal('new data ' + count);
    count++;
  }, 500);
}, [val]);
```
完整代码可以看[这里](https://codesandbox.io/s/userefcallback-zi2ff)

<br><br>

# 三、useCallback应用

注意： useCallback 的目的不是为了减少函数创建的次数，而是为了性能优化，所以不要滥用useCallback

useCallback真正有助于性能改善的，有 2 种场景：

- 当函数的计算成本较高：如果一个函数在执行时需要进行大量的计算、数据处理、或涉及昂贵的计算操作，那么使用useCallback可以减少不必要的计算开销。
- 当函数作为回调函数传递给子组件时：比较函数前后的引用，一般配合[React.Memo](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo)使用。在React中，如果一个函数作为props传递给子组件，而该函数没有通过useCallback进行优化，每次父组件重新渲染时都会创建一个新的函数实例，导致子组件可能会重新渲染。使用useCallback可以确保相同的函数实例被传递给子组件，从而避免不必要的子组件渲染。

### 函数的计算成本较高

**优化前：**

```js
import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  // 大量运算的函数
  const calculateExpensiveValue = (num) => {
    console.log('Performing expensive calculation...');
    // 假设这里有很复杂的计算逻辑
    return num * 2;
  };

  const handleIncrement = () => {
    const newValue = calculateExpensiveValue(count + 1);
    setCount(newValue);
  };

  return (
    <div>
      <button onClick={handleIncrement}>增加计数器</button>
      <div>count：{count}</div>
    </div>
  );
};
```
在上述代码中，每次App重新渲染时，calculateExpensiveValue函数都会被重新创建，即使函数的逻辑和参数都没有变化。这可能会导致不必要的计算开销。

![image](https://github.com/Vuact/Blog/assets/74364990/17493dc0-394b-41e9-b8da-627fc8c13537)


现在，我们使用useCallback来优化calculateExpensiveValue函数的定义

**优化后：**
只需要修改calculateExpensiveValue即可：
```js
const calculateExpensiveValue = useCallback((num) => {
  console.log('Performing expensive calculation...');
  // 假设这里有很复杂的计算逻辑
  return num * 2;
}, []);
```
现在，calculateExpensiveValue函数使用useCallback进行了优化，并通过空依赖项[]来指示该函数没有外部依赖。这样，每次ParentComponent重新渲染时，calculateExpensiveValue函数都将保留相同的引用，避免不必要的重新创建。


### `useCallback`配合`React.Memo`使用的场景：

**优化前：**
```js
const Child = React.memo(function ({ val, onChange }) {
  console.log('render...');

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  const onChange1 = (evt) => {
    setVal1(evt.target.value);
  };

  const onChange2 = (evt) => {
    setVal2(evt.target.value);
  };

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```
现象：任何一个输入框的变化都会导致另一个输入框重新渲染。
具体分析:
1. App 组件中的 onChange1 和 onChange2 在每次渲染时会作为新的函数被创建,所以它们的引用总是变化的。
2. Child 组件使用 React.memo 进行了记忆化,只有当 props 变化时才会重新渲染。
3. 每次 App 重新渲染,会将新的 onChange1 和 onChange2 函数引用传递给对应的 Child 组件。
4. 因此每个 Child 组件接收到的 props.onChange 函数引用发生了变化,会触发重新渲染。
5. 这样当一个输入框变化,整个 App 组件重新渲染,另一个 Child 组件由于接收到新的函数引用也会跟着重新渲染。

![Jun-06-2022 03-20-01](https://user-images.githubusercontent.com/74364990/172067104-2ba8c80d-e17c-4326-b03c-3fa6f89cf4ed.gif)

**优化后：**
```js
const Child = React.memo(function({ val, onChange }) {
  console.log("render...");

  return <input value={val} onChange={onChange} />;
});

function App() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");

  const onChange1 = useCallback(evt => {
    setVal1(evt.target.value);
  }, []);

  const onChange2 = useCallback(evt => {
    setVal2(evt.target.value);
  }, []);

  return (
    <>
      <Child val={val1} onChange={onChange1} />
      <Child val={val2} onChange={onChange2} />
    </>
  );
}
```
现象：一个输入框的变化，不再会导致另一个输入框的重新渲染。代码在[这里](https://codesandbox.io/s/reactmemo-rmt1e?file=/src/index.js)

![Jun-06-2022 03-22-13](https://user-images.githubusercontent.com/74364990/172067155-a34e012a-cee3-4448-b625-47994dc424fe.gif)


<br>

# 四、使用useMemoizedFn取代useCallback

下面例子：我们用useCallback，解决了点击button按钮，Button组件不更新的问题。

```js
import React, { useState, useCallback, memo } from 'react'

const Button = memo(({ handleClick }) => {
    return (
        <button onClick={handleClick}>Click!</button>
    )
})

const Index = () => {
    const [clickCount, increaseCount] = useState(0);
    
    // 使用 useCallback 将 handleClick 缓存起来
    const handleClick = useCallback(() => {
        increaseCount(count => count + 1);
    },[])

    return (
        <div>
            <p>{clickCount}</p>
            <Button handleClick={handleClick} />
        </div>
    )
}
```
现在有特殊情况：如果 useCallback 的依赖是时刻变化的，那 useCallback 就无效了 上面的例子改一下写法就会产生这样的问题

```js
import React, { useState, useCallback, memo } from 'react'

const Button = memo(({ handleClick }) => {
    return (
        <button onClick={handleClick}>Click!</button>
    )
});

const Index = () => {
    const [clickCount, increaseCount] = useState(0);
    
    // clickCount 作为依赖，每次点击都会改变 clickCount 的值
    // 即 useCallback 都会返回最新的函数，无法缓存 Button 组件
    const handleClick = useCallback(() => {
        increaseCount(clickCount + 1);
    }, [clickCount])

    return (
        <div>
            <p>{clickCount}</p>
            <Button handleClick={ handleClick } />
        </div>
    )
}
```
**解决方案：使用ahooks的useMemoizedFn**

```js
import React, { useState, memo } from 'react'
import { useMemoizedFn } from 'ahooks'

const Button = memo(({ handleClick }) => {
    return (
        <button onClick={handleClick}>Click!</button>
    )
})

const Index = () => {
     const [clickCount, increaseCount] = useState(0);
	
     // 使用 useMemoizedFn 进行持久化
     const handleClick = useMemoizedFn(() => {
 	increaseCount(clickCount + 1);
     });
	
     return (
	<div>
	   <p>{clickCount}</p>
	   <Button handleClick={ handleClick } />
	</div>
     )
}
```

也一起来看看 useMemoizedFn 的源码看看它是怎么实现的：
```js
import { useMemo, useRef } from 'react';

function useMemoizedFn(fn) {
  const fnRef = useRef(fn);

  // 这行代码确实是无意义的，但是可以避免在 devtool 模式下的异常行为
  fnRef.current = useMemo(() => fn, [fn]);
  
  const memoizedFn = useRef();

  // 仅第一次会赋值给 memoizedFn
  if (!memoizedFn.current) {
    memoizedFn.current = function (this, ...args) {
      // 将 this 和 args 等传递给 fn
      return fnRef.current.apply(this, args);
    };
  }
  
  return memoizedFn.current;
}

export default useMemoizedFn;
```
内容参考：https://juejin.cn/post/7074938135544594463
