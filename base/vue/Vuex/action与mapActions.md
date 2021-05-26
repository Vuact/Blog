Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

<br>

# 声明

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++;
    }
  },
  actions: {
    increment (context) {
      context.commit('increment');
    }
  }
});
```

<br>

# 使用

## 1、store.dispatch

## 2、mapActions
