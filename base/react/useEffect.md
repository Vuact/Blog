

> 推荐：<br>
> - [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/#%E9%82%A3effect%E4%B8%AD%E7%9A%84%E6%B8%85%E7%90%86%E5%8F%88%E6%98%AF%E6%80%8E%E6%A0%B7%E7%9A%84%E5%91%A2%EF%BC%9F)
> - [从源码理清 UseEffect 第二个参数是怎么处理的](https://developer.51cto.com/article/705749.html)


<br>

简介

useEffect支持两个参数，第一个参数是回调函数，第二个参数是依赖。

```js
type DependencyList = ReadonlyArray<any>;

function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```



<br>

# 参数一：effect

第一个参数是一个`函数`，`必传项`。是组件要执行的副作用。可以看做`componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 这三个函数的组合（但实际与其并不等价，这里只是类比）

```js
useEffect(() => {
  // 普通函数，执行副作用，可以实现componentDidMount、componentDidUpdate
  console.log('执行副作用');

  return () => {
    // return函数, 组件销毁时清除副作用，可以实现componentWillUnmount
    console.log('清除副作用');
  };
}, [count]);
```
<br>

# 参数二：deps

第二个参数不传 或为 null 或 undefined 的时候，回调函数每次 render 都会执行。

第二个参数传`数组` 时，数组里依赖改变，回调函数才会重新更新。所谓依赖改变就是 `[ 之前值 === 之后值 ]` ，如果`为true不执行回调函数`，`为false重新执行回调函数`。

>注意: useEffect并不是去监听第二个参数是否改变来决定是否执行回调的。而是每次重新执行函数式组件后，执行到useEffect再去判断依赖是否发生变化，从而决定是否触发回调的。
>所以函数式组件不重新执行，即使useEffect依赖发生变化也不会触发回调。

## 1、不传值

```tsx
const [count, setCount] = useState<number>(1);

useEffect(() => {
  setTimeout(() => {
     setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 不传值, 第 ${count} 次执行`);
});

// 打印log，无限循环
第二个参数: 不传值, 第 1 次执行
第二个参数: 不传值, 第 2 次执行
第二个参数: 不传值, 第 3 次执行
第二个参数: 不传值, 第 ... 次执行
```
现象： useEffect 会在第一次渲染以及每次更新渲染后都执行。

<img width="1294" alt="image" src="https://user-images.githubusercontent.com/74364990/172063594-c0c8c91c-0e4e-443c-b74c-e037d4cc9972.png">

原因： 第一次渲染后执行一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect没有比较值，useEffect重新执行，useEffect中回调函数改变state值，state值改变触发组件重新渲染，无限循环。

## 2、空数组作为依赖

```tsx
const [count, setCount] = useState<number>(1);

useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 空数组, 第 ${count} 次执行`);
}, []);

// 打印log，执行一次
第二个参数: 空数组, 第 1 次执行
```
现象： useEffect 会在第一次渲染后执行一次。

<img width="1290" alt="image" src="https://user-images.githubusercontent.com/74364990/172063602-4fc46c6a-56e1-41bd-b6a6-a74dd01f0b17.png">

原因： 第一次渲染后执行一次一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect中 [] 没有值，依赖没变，不触发useEffect，不执行回调函数, state 无更新，不触发组件重新渲染，至此结束。


## 3、基本类型作为依赖

```tsx
const [count, setCount] = useState<number>(1); // 基本类型以number为例

useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 基本类型, 第 ${count} 次执行`);
}, [count]);

// 打印log，无限循环
第二个参数: 基本类型, 第 1 次执行
第二个参数: 基本类型, 第 2 次执行
第二个参数: 基本类型, 第 3 次执行
第二个参数: 基本类型, 第 ... 次执行
```
现象： useEffect 会在第一次渲染以及每次更新渲染后都执行。

<img width="1298" alt="image" src="https://user-images.githubusercontent.com/74364990/172063647-527c0d52-4de8-42e3-be84-51bdcb10193f.png">

原因： 第一次渲染后执行一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect比较值（count）改变，useEffect重新执行，useEffect中回调函数改变state值，state值改变触发组件重新渲染，无限循环。


## 4、数组作为依赖

```tsx
const [count, setCount] = useState(1);

const newArr = [4, 5];
useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 数组, 第 ${count} 次执行`);
}, [newArr]);

// 打印log，无限循环
第二个参数: 数组, 第 1 次执行
第二个参数: 数组, 第 2 次执行
第二个参数: 数组, 第 3 次执行
第二个参数: 数组, 第 ... 次执行
```
现象：useEffect 会在第一次渲染以及每次更新渲染后都执行。

<img width="1294" alt="image" src="https://user-images.githubusercontent.com/74364990/172063658-433d471d-0978-423c-b950-fc28d2f8cba6.png">

原因：第一次渲染后执行一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect依赖项arr发生变化，此处依赖数组执行`浅层比较`（`[...] === [...] 为false`）useEffect重新执行，useEffect中回调函数改变state值，state值改变触发组件`重新渲染，无限循环`。


### 上述数组作为依赖代码，去除setTimeout会出现什么情况？

```tsx
const [count, setCount] = useState(1);
const newArr = [4,5];

useEffect(() => {
  setCount(count+1);
  console.log(`第二个参数: 基本类型, 第 ${count} 次执行`);
}, [newArr]);
    
// 打印log报错，如下图
```
<img width="1020" alt="image" src="https://user-images.githubusercontent.com/74364990/172063721-c3831986-c45b-492f-b1bd-f31c5a7c274e.png">

因为useEffect在短时间内疯狂调用setCount，导致state不断改变，从而疯狂渲染，所以导致控制台报错：`"超过最大更新深度"`。

### 如何解决：使用useRef

useRef会在每次渲染时返回同一个ref对象，返回的ref在组件的整个生命周期内保持不变，且ref值改变不会导致重新渲染

```tsx
const [count, setCount] = useState(1);
const refArr = useRef([4, 5, 6]);

useEffect(() => {
  setCount(count+1);
  console.log(`第二个参数: 数组, 第 ${count} 次执行`);
}, [refArr.current]);

// 打印log，执行一次
第二个参数: 数组, 第 1 次执行
```

## 5、函数作为依赖

```tsx
const [count, setCount] = useState(1);

const consoleFunction = () => {
  console.log('consoleFunction');
};

useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 函数, 第 ${count} 次执行`);
}, [consoleFunction]);

// 打印log，无限循环
第二个参数: 函数, 第 1 次执行
第二个参数: 函数, 第 2 次执行
第二个参数: 函数, 第 3 次执行
第二个参数: 函数, 第 ... 次执行
```
现象：useEffect 会在第一次渲染以及每次更新渲染后都执行。

<img width="1296" alt="image" src="https://user-images.githubusercontent.com/74364990/172063794-7f7d39b6-28b9-4f4c-812e-c8846a704c3f.png">

原因：第一次渲染后执行一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect依赖项consoleFunction函数发生变化，此处依赖函数执行`浅层比较`（每次渲染都重新创建一个新的函数 `function(前) === function（后）为false`）useEffect重新执行，useEffect中回调函数改变state值，state值改变触发组件`重新渲染，无限循环`。

### 上述函数作为依赖代码，去除setTimeout会出现什么情况？

```tsx
const [count, setCount] = useState(1);

const consoleFunction = () => {
  console.log('consoleFunction');
};

useEffect(() => {
  setCount(count + 1);
  console.log(`第二个参数: 函数, 第 ${count} 次执行`);
}, [consoleFunction]);

// 打印log报错，如下图
```
<img width="1020" alt="image" src="https://user-images.githubusercontent.com/74364990/172063721-c3831986-c45b-492f-b1bd-f31c5a7c274e.png">

因为useEffect在短时间内疯狂调用setCount，导致state不断改变，从而疯狂渲染，所以导致控制台报错：`"超过最大更新深度"`。

### 如何解决：使用useCallback

useCallback返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。

```jsx
const [count, setCount] = useState(1);

const consoleFunction = useCallback(() => {
  console.log('consoleFunction');
}, []);

useEffect(() => {
  setCount(count + 1);
  console.log(`第二个参数: 函数, 第 ${count} 次执行`);
}, [consoleFunction]);

// 打印log，执行一次
第二个参数: 函数, 第 1 次执行
```
> 注：若将上面 useCallback改为 `useCallback(() => { ···· }, [count])`，也会导致控制台报错：`"超过最大更新深度"`。


## 6、对象作为依赖

```tsx
const [count, setCount] = useState(1);

const obj = { name: 'zhangsan' };

useEffect(() => {
  setTimeout(() => {
    setCount(count + 1);
  }, 1000);
  console.log(`第二个参数: 对象, 第 ${count} 次执行`);
}, [obj]);

// 打印log，无限循环
第二个参数: 对象, 第 1 次执行
第二个参数: 对象, 第 2 次执行
第二个参数: 对象, 第 3 次执行
第二个参数: 对象, 第 ... 次执行
```

现象：useEffect 会在第一次渲染以及每次更新渲染后都执行。

<img width="1293" alt="image" src="https://user-images.githubusercontent.com/74364990/172063775-598c1e0b-0f55-44d0-80ce-647c080b4ac6.png">

原因：第一次渲染后执行一次useEffect，useEffect中回调函数改变state值，state值改变触发组件重新渲染，useEffect依赖项obj发生变化，此处依赖对象执行`浅层比较`（ `{...}=== {...} 为false`）useEffect重新执行，useEffect中回调函数改变state值，state值改变触发组件`重新渲染，无限循环`。

### 上述对象作为依赖代码，去除setTimeout会出现什么情况？

```tsx
const obj = { name: 'zhangsan' };

useEffect(() => {
  setCount(count + 1);
  console.log(`第二个参数: 对象, 第 ${count} 次执行`);
}, [obj]);

// 打印log报错, 如下图
```

<img width="1020" alt="image" src="https://user-images.githubusercontent.com/74364990/172063721-c3831986-c45b-492f-b1bd-f31c5a7c274e.png">

因为useEffect在短时间内疯狂调用setCount，导致state不断改变，从而疯狂渲染，所以导致控制台报错：`"超过最大更新深度"`。


### 如何解决：使用useMemo

useMemo该回调函数仅在某个依赖项改变时才会更新。此处使用[]依赖，组件重新渲染后对象不再重新定义。

```jsx
const [count, setCount] = useState(1);

const obj = useMemo(() => ({ name: 'zhangsan' }), []);

useEffect(() => {
  setCount(count + 1);
  console.log(`第二个参数: 对象, 第 ${count} 次执行`);
}, [obj]);

// 打印log
第二个参数: 对象, 第 1 次执行
```

> 注：若将上面 useMemo 改为 `useMemo(() => (···), [count])`<br>
> 也会导致控制台报错：`"超过最大更新深度"`。

<br><br><br>



# 其他

### 自定义Hook：初始不执行useEffect

```js
function useUpdate(fn, deps) {
  const initRef = useRef();
  
  return useEffect(() => {
    if (initRef.current) {
      return fn();
    } else {
      initRef.current = true;
    }
  }, deps);
}
```

### 练习
写出输出结果：
```js
function Dong() {
  const ref = useRef(1);
  const [, setState] = useState();
	
  useEffect(() => {
    console.log(111);
  });

  useEffect(() => {
    console.log(222);
  }, []);

  useEffect(() => {
    console.log(333);
  }, [ref.current]);

  useEffect(() => {
    setInterval(() => {
      setState([]);
    }, 1000);

    setTimeout(() => {
      ref.current = 2;
    }, 3000);
  }, []);

  return <div>dong</div>;
}
```

![Jun-06-2022 02-22-51](https://user-images.githubusercontent.com/74364990/172064955-f3a211b6-99c4-4934-bca6-26a7d786e5e3.gif)

你可能会疑惑，为什么连续输出 4次 111 ，才会输出 333；不应该是连续输出 3次 111 就输出 333吗？

看这个例子你就懂了：
```
function Dong() {
  const ref = useRef(1);
  const [, setState] = useState();

  console.log("render");

  useEffect(() => {
    console.log(111);
  });

  useEffect(() => {
    console.log(333);
  }, [ref.current]);

  useEffect(() => {
    setTimeout(() => {
      ref.current = 2;
    }, 1000);
  }, []);

  return <div>dong</div>;
}
```
控制台自始至终，都只会输出下图，且不会在1秒后有任何变化：

![image](https://github.com/Vuact/Blog/assets/74364990/7251938e-0563-49bd-8874-38f68ccba850)

因为React中改变 `ref` 并不会触发再次渲染，即使 useEffect监听了 `ref.current` 这个变量。




