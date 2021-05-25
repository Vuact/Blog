# mutation
- 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
- mutation 必须是同步函数

## 1、Mutation 需遵守 Vue 的响应规则
既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

当需要在对象上添加新属性时，你应该

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
