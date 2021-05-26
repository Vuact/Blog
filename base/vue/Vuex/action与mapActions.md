Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而`不是直接变更状态`。
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
       参数一： context 对象包含以下属性:
            commit,     // 等同于 `store.commit`
            dispatch,   // 等同于 `store.dispatch`  
            state,      // 等同于 `store.state`，若在模块中则为局部状态
            getters,    // 等同于 `store.getters`
            rootState,  // 只存在于模块中: 等同于 `store.state`
            rootGetters // 只存在于模块中: 等同于 `store.getters`
            
        参数二： payload 作为第二个参数（可选）
    */
    doThing ({state, getters, commit, dispatch}, payload) {
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

```js
mapActions(namespace?: string, map: Array<string> | Object<string | function>): Object
```
- 参数一：命名空间字符串（可选）
- 参数二：数组或对象。对象形式下可以是一个函数。 `function(dispatch: function, ...args: any[])`

```js
import { mapActions } from 'vuex'

export default {
  methods: {
    //数组形式：
    ...mapActions([
      'funcA',      //`this.funcA()` 映射为 `this.$store.dispatch('funcA')`
      'funcB'       //`this.funcB(payload)` 映射为 `this.$store.dispatch('funcB', payload)` (载荷形式)
    ]),
    ...mapActions("moduleC", [
      'funcC1',     //`this.funcC1()` 映射为 `this.$store.dispatch('moduleC/funcC1')`
      'funcC2',     //`this.funcC2(payload)` 映射为 `this.$store.dispatch('moduleC/funcC2', payload)` (载荷形式)
    ]),
    
    //对象形式：
    ...mapActions({
      dothings: 'funcA',            //`this.dothings()` 映射为 `this.$store.dispatch('funcA')`,
      dothings2: 'funcB',           //`this.dothings2(payload)` 映射为 `this.$store.dispatch('funcB', payload)`  (载荷形式)
      myFunc(dispatch, payload) {   //自定义函数形式 
        dispatch("funcB", payload);           //执行`this.$store.dispatch('funcB', payload)`
        dispatch("moduleC/funcC1", payload);  //执行`this.$store.dispatch('moduleC/funcC1', payload)`
      }
    }),
    ...mapActions("moduleC", {
      dothings3: 'funcC1',            //`this.dothings3()` 映射为 `this.$store.dispatch('moduleC/funcC1')`
      dothings4: 'funcC2',            //`this.dothings4(payload)` 映射为 `this.$store.dispatch('moduleC/funcC2', payload)` (载荷形式)
      myFunc2(dispatch, payload) {    //自定义函数形式 
        dispatch("funcC1", payload);            //执行`this.$store.dispatch('moduleC/funcC1', payload)`
        dispatch("moduleK/funcK", payload, {    //执行`this.$store.dispatch('moduleK/funcK', payload)`
          root: true
        });
      }
    })
  }
};
```
