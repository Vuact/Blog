
# getter

## 1、在vue中的调用：
```js
this.$store.getters.doThing

this.$store.getters["moduleA/doThing"]
```

## 2、声明参数
```js
getters: {
    doThing: (state, getters, rootState, rootGetters) => { 
      return ·····;
    }
}
  
/*  
  state,       // 如果在模块中定义则为模块的局部状态
  getters,     // 等同于 store.getters
  rootState    // 等同于 store.state
  rootGetters  // 所有 getters
*/
```

高级用法：外界传参
```js
//声明：
getters: {
  getTodoById: (state) => (id) => {
    return ····;
  }
}

//使用
this.$store.getters.getTodoById(2)
```

<br>

# mapGetters

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```
