
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
    //this.$store.store.a;
    //this.$store.getters.doThing
    //this.$store.dispatch("moduleB/funB", {a:1})
    //this.$store.commit("moduleA/funA", {b:1}) 
    return {};
  },
  components: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  filters: {},
  watch: {},
  computed: {
     ...mapState({
     	my_a: "a",
	do_a(state) {
           return this.n + state.a
	}
     }),
     ...mapGetters({
     	do_thing: "doThing"
     })
  },
  methods: {
     ...mapActions("moduleB", {
        doB: "funB",
     	funB(commit, payload) {
	   commit("funB", payload);
	   commit("moduleK/funcK", payload, {  
             root: true
           });
	}
     }),
     ...mapMutations({
        doA: "funA",
        funA(dispatch, payload) {
	   dispatch("moduleA/funA", payload)
	}
     }),
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
