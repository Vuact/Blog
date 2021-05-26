# 命名空间

- namespaced
- createNamespacedHelpers

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```

<br>

# 模块动态注册

- registerModule
- unregisterModule
- hasModule

```js
import Vuex from 'vuex'

const store = new Vuex.Store({ /* 选项 */ })

// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

你可以通过 `store.hasModule(moduleName)` 方法检查该模块是否已经被注册到 store。

也可以使用 `store.unregisterModule(moduleName)` 来动态卸载模块。

>注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。


<br>

# 模块重用

模块重用, 解决办法也是相同的——使用一个函数来声明模块状态（仅 2.3.0+ 支持）：

```js
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutation, action 和 getter 等等...
};
```

