
# getter

就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

## 1、在vue中的调用
```js
//访问doThing方法
this.$store.getters.doThing

//访问moduleA下的doThing方法
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
mapGetters(namespace?: string, map: Array<string> | Object<string>): Object
```

**对象写法：**
```js
computed: {
    ...mapGetters({
      doneCount: 'doneTodosCount'  // `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
    })
}

//访问moduleA下的getters
computed: {
    ...mapGetters("moduleA", {
       //····
    })
}
```

**数组写法：**
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
