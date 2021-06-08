
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
    return {
    	user: {age: 123}
    };
  },
  components: {
     "ui-load-state": () => import("../../components/UI/ui-load-state"),
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  filters: {},
  watch: {
     a(val, oldVal) {},
     b: {
        handler(val, oldVal) {},
	deep: true,
     },
     "user.age": function(val, oldVal) {}
  },
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
     	funB(dispatch, payload) {
	   dispatch("moduleB/funB", payload)
	}
     }),
     ...mapMutations({
        doA: "funA",
        funA(commit, payload) {
	   commit("funA", payload);
	   commit("moduleK/funcK", payload, {  
             root: true
           });
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
