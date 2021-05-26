
**getter**

就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

<br>

# 声明

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    doThing(state, getters, rootState, rootGetters) => { 
       return state.count;
    }
  }
})；
  
/*  
  state,       // 等同于 `store.state`, 如果在模块中定义则为模块的局部状态
  getters,     // 等同于 `store.getters`
  rootState    // 只存在于模块中: 等同于 `store.state`
  rootGetters  // 只存在于模块中: 等同于 `store.getters`
*/
```

<br>

# 调用

## 1、store.getters

```js
this.$store.getters.doThing              //访问doThing方法
this.$store.getters["moduleA/doThing"]   //访问moduleA下的doThing方法
```
传参写法：
```js
//声明：
getters: {
  getTodoById: (state) => (id) => {
    return ····;
  }
}

//vue中使用：
this.$store.getters.getTodoById(2)
```

<br>

## 2、mapGetters

```js
mapGetters(namespace?: string, map: Array<string> | Object<string>): Object
```

使用：
```js
import { mapGetters } from 'vuex'

export default {
  computed: {
    //数组写法：
    ...mapGetters([
      'funcA', // `this.funcA` 映射为 `this.$store.getters.funcA`
      'funcB', // `this.funcB` 映射为 `this.$store.getters.funcB`
    ]),
    ...mapGetters("moduleC", [
      'funcC' // `this.funcC` 映射为 `this.$store.getters["moduleC.funcC"]`
    ]),
    
    //对象写法：
    ...mapGetters({
      dothings: 'funcA'    // `this.dothings` 映射为 `this.$store.getters.funcA`,
      dothings2: 'funcB'   // `this.dothings2` 映射为 `this.$store.getters.funcB`
    }),
    ...mapGetters("moduleC", {
       dothings3: 'funcC'  // `this.dothings3` 映射为 `this.$store.getters["moduleC.funcC"]`
    })
    
    //无自定义函数写法
  }
}
```
