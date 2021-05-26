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

```js
computed: {
   //数组写法：
   ...mapState([
       'count'  //映射 this.count 为 this.$store.state.count
   ]),
   
   //对象写法：
   ...mapState({
    countAlias: (state) => state.count,      //映射 this.countAlias 为 this.$store.state.count
    countAlias2: "count",                    //映射 this.countAlias2 为 this.$store.state.count
    countPlusLocalState(state) {             //自定义函数
      return state.count + this.localCount;
    }
  })
}
```

- [参考请戳我](https://vuex.vuejs.org/zh/guide/state.html)

