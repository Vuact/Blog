# state

vue中使用：
```js
//访问val
this.$store.store.val;

//访问moduleA下的val
this.$store.store.moduleA.val;
```

# mapState
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

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
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

