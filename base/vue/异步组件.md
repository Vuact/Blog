
好文：
- [Vue中的异步组件](https://juejin.cn/post/6844903761022812168)
- [Vue异步组件处理路由组件加载状态](https://juejin.cn/post/6844903670937550861)

<br>

# Dome

效果

![May-08-2021 20-48-33](https://user-images.githubusercontent.com/74364990/117539824-ea484d80-b03e-11eb-8bd1-3d70515b7665.gif)

**App.vue**

```vue
<template>
  <div id="app">
    <template v-if="show">
      <later></later>
      <later2></later2>
    </template>
    <button @click="toggle">加载</button>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      show: false,
    };
  },
  components: {
    later: () => ({
      component: new Promise((resolve) => {
        setTimeout(() => {
          resolve(import("./components/later"));
        }, 1000);
      }),
      loading: require("./components/loading").default,
      error: require("./components/error").default,
      timeout: 900,
    }),
    later2: () => ({
      component: import("./components/later2"),
      loading: require("./components/loading").default,
      error: require("./components/error").default,
    }),
  },
  methods: {
    toggle: function () {
      this.show = !this.show;
    },
  },
};
</script>
```

**later.vue**
```vue
<template>
  <div>load me later 11111</div>
</template>
<script>
export default {
  data: function () {
    return {};
  },
};
</script>
```

**later2.vue**
```vue
<template>
  <div>load me later 22222</div>
</template>
<script>
export default {
  data: function () {
    return {};
  },
};
</script>
```

**loading.vue**
```vue
<template>
  <div>加载中</div>
</template>
<script>
export default {
  data: function () {
    return {};
  },
};
</script>
```

**error.vue**
```vue
<template>
  <div>加载失败</div>
</template>
<script>
export default {
  data: function () {
    return {};
  },
};
</script>
```
