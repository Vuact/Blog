# mutation
- 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
- mutation 必须是同步函数

<br>

## 1、mutation 需遵守 Vue 的响应规则
既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

当需要`在对象上添加新属性`时，你应该

- 使用 Vue.set(obj, 'newProp', 123), 或者
- 以新对象替换老对象。例如，利用对象展开运算符：
```js
state.obj = { ...state.obj, newProp: 123 }
```


## 2、在vue中的调用
```js
//访问doThing方法
this.$store.commit("doThing");

//访问moduleA下的doThing方法
this.$store.commit("moduleA/doThing");

//传参
this.$store.commit("moduleA/doThing", {
  amount: 10
});

//传参：更高级
this.$store.commit({
  type: 'moduleA/doThing',
  amount: 10
});
```

## 3、mapMutations

```js
mapMutations(namespace?: string, map: Array<string> | Object<string | function>): Object
```
- 参数一：命名空间字符串（可选）
- 参数二：数组或对象。对象形式下可以是一个函数。 `function(commit: function, ...args: any[])`

```js
import { mapMutations } from 'vuex'

export default {
  methods: {
    //数组形式：
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
      'incrementBy' //也支持载荷, 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations("moduleA", [
      'dothings', // 将 `this.dothings()` 映射为 `this.$store.commit('moduleA/dothings')`
    ]),
    
    //对象形式：
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    }),
    ...mapMutations("moduleB", [
      'dothings2', // 将 `this.dothings2()` 映射为 `this.$store.commit('moduleB/dothings2')`
    ]),
  }
};
```
