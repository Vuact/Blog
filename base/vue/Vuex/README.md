vuex三大样：
- mutations：相当于vue里的methods(同步)，无返回值
- action：相当于vue里的methods(异步)，无返回值
- getter：获取state，有返回值


<br>

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
			|- action.js
			|- getter.js
			|- index.js
			|- mutations.js
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

**/store/plugins.js**
```js
import createLogger from "@plugin/store-logger";

const debug = process.env.NODE_ENV !== "production";

export default debug ? [createLogger()] : [];
```

**state.js\getter.js\mutations.js\action.js**
```js
export default {};

//或

export const test = () => {};
```

**/store/modules/index.js**
```js
import moduleA from "./moduleA/index";
import moduleB from "./moduleB/index";
import moduleN from "./moduleN/index";

export default {
	moduleA,
	moduleB,
	moduleN
};
```

