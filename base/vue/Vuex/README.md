# 目录结构

```js
- store
	|- action.js
	|- getter.js
	|- index.js
	|- mutations.js
	|- plugins.js
	|- state.js
	|- modules
		|- moduleA
		|- moduleB
		·········
		|- moduleN
		|- index.js 
```
- /store/index.js：整个store的入口文件
- /store/modules/index.js：modules的入口文件

<br>

**/store/index.js**
```js
import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import plugins from "./plugins";
import modules from "./modules/index";

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== "production",
	state,
	getters,
	actions,
	mutations,
	plugins,
	modules
});
```
