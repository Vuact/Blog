useEffect

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

# 参数二：deps

第二个参数可以不传或者是一个`数组`，`非必传项`。数组里面依赖改变时候副作用函数才会重新更新。所谓依赖改变就是 `[ 之前值 === 之后值 ]` ，如果为`true不执行useEffect`，为`false重新执行useEffect`。

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

https://juejin.cn/post/7083308347331444750

https://developer.51cto.com/article/705749.html
