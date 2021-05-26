# 使用

## 1、store.store

```js
//访问val
this.$store.store.val;

//访问moduleA下的val
this.$store.store.moduleA.val;
```

## 2、mapState

```js
mapState(namespace?: string, map: Array<string> | Object<string | function>): Object
```

- 参数一：命名空间字符串（可选）
- 参数二：数组或对象。对象形式下可以是一个函数。 `function(state: any)`

<br>

例子：
```js
import { mapState } from "vuex";

const app = new Vue({
  el: "#app",
  store,
  template: `<div class="app">{{ count }}</div>`,
  data() {
    return {
	localCount: 4
    };
  },
});
```

**对象写法：**
```js
computed: {
  ...mapState({
    // 箭头函数可使代码更简练
    count: (state) => state.count,

    // 更高级的写法（'count' 等同于 `state => state.count`）
    countAlias: "count",

    // 自定义函数
    countPlusLocalState(state) {
      return state.count + this.localCount;
    }
  })
}
```

**数组写法：**
```js
computed: {
   ...mapState([
       'count'  // 映射 this.count 为 store.state.count
   ])
}
```

- [参考请戳我](https://vuex.vuejs.org/zh/guide/state.html)

