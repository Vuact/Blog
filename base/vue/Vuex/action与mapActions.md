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
    addCount (state) {
      state.count++;
    }
  },
  actions: {
    increment (context) {
      setTimeout(() => {
         context.commit('addCount');
      }, 1000);
    },
    
    /* 
      context 对象包含以下属性:
        {
          commit,     // 等同于 `store.commit`
          dispatch,   // 等同于 `store.dispatch`  
          state,      // 等同于 `store.state`，若在模块中则为局部状态
          getters,    // 等同于 `store.getters`
          rootState,  // 只存在于模块中: 等同于 `store.state`
          rootGetters // 只存在于模块中: 等同于 `store.getters`
        }
    */
    doThing ({state, getters, commit, dispatch}) {
      commit('addCount');
      dispatch('increment');
    }
  }
});
```

<br>

# 使用

## 1、store.dispatch

```js
this.$store.dispatch("doThing");          //访问doThing方法
this.$store.dispatch("moduleA/funcA");    //访问moduleA下的funcA方法

//载荷形式：写法一：
this.$store.dispatch("moduleA/funcA", {   //访问moduleA下的funcA方法，传参：`{amount: 10}`
  amount: 10
});

//载荷形式：写法二：
this.$store.dispatch({                    //访问moduleA下的funcA方法，传参：`{amount: 10}`
  type: 'moduleA/funcA',
  amount: 10
});
```

## 2、mapActions
