# mutation
- 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
- Mutation 必须是同步函数

## 1、在vue中的调用
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
