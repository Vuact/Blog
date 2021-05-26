**mutation**
- 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
- mutation 必须是同步函数，且无返回值
- mutation 需遵守 Vue 的响应规则：<br><br>
既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：<br><br>
    当需要`在对象上添加新属性`时，你应该

    - 使用 `Vue.set(obj, 'newProp', 123)`, 或者
    - 以新对象替换老对象。例如，利用对象展开运算符：  `state.obj = { ...state.obj, newProp: 123 }`


<br><br>

# 声明

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    //参数一： state（如果定义在模块中，则为模块的局部状态）
    //参数二： payload 作为第二个参数（可选）
    increment (state, { myCount }) {
      state.count = state.count + myCount;
    }
  }
});
```

<br>

# 调用

## 1、store.commit

```js
this.$store.commit("doThing");          //访问doThing方法
this.$store.commit("moduleA/doThing");  //访问moduleA下的doThing方法

//载荷形式：写法一：
this.$store.commit("moduleA/doThing", {
  amount: 10
});

//载荷形式：写法二：
this.$store.commit({
  type: 'moduleA/doThing',
  amount: 10
});
```

## 2、mapMutations

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
      'funcA',      //`this.funcA()` 映射为 `this.$store.commit('funcA')`
      'funcB'       //`this.funcB(params)` 映射为 `this.$store.commit('funcB', payload)` (载荷形式)
    ]),
    ...mapMutations("moduleC", [
      'funcC1',     //`this.funcC1()` 映射为 `this.$store.commit('moduleC/funcC1')`
      'funcC2',     //`this.funcC2()` 映射为 `this.$store.commit('moduleC/funcC2', payload)` (载荷形式)
    ]),
    
    
    //对象形式：
    ...mapMutations({
      dothings: 'funcA',         //`this.dothings()` 映射为 `this.$store.commit('funcA')`,
      dothings2: 'funcB',        //`this.dothings2(params)` 映射为 `this.$store.commit('funcB', payload)`  (载荷形式)
      myFunc(commit, payload) {   //自定义函数形式 
        commit("funcB", payload);         //执行`this.$store.commit('funcB', payload)`
        commit("moduleC/funcC1", payload); //执行`this.$store.commit('moduleC/funcC1', payload)`
      }
    }),
    ...mapMutations("moduleC", {
      dothings3: 'funcC1',         //`this.dothings3()` 映射为 `this.$store.commit('moduleC/funcC1')`
      dothings4: 'funcC2',         //`this.dothings4()` 映射为 `this.$store.commit('moduleC/funcC2', payload)` (载荷形式)
      myFunc2(commit, payload) {    //自定义函数形式 
        commit("funcC1", payload);            //执行`this.$store.commit('moduleC/funcC1')`
        commit("moduleK/funcK", payload, {    //执行`this.$store.commit('moduleK/funcK')`
          root: true
        });
      }
    }),
  }
};
```
