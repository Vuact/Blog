
```js
<template>
  <div></div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "template name",
  inheritAttrs: false,
  props: {
    my_txt: {
      type: String,
      default: "",
    },
    my_Arr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  components: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  filters() {},
  computed() {
	...mapState({}),
	...mapGetters({})
  },
  methods() {
	...mapActions({}),
	...mapMutations({}),
  },
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
};
</script>
```
