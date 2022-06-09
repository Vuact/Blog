- useReducer 用于复杂的状态管理
- useContext 解决层级较深的组件内的通信
- 用`Reducer`改变state数据，再用`Context`来传递`state`数据和`dispatch`操作，从而实现了被包裹组件的状态管理
- useReducer + useContext：替代redux，来进行组件状态管理，无论层级深浅


废话不多说，直接上例子：

# 一、Demo换肤

实现一个换肤功能

![Jun-09-2022 22-06-01](https://user-images.githubusercontent.com/74364990/172867025-b2ca137c-141d-499b-991d-c1bd47704b0d.gif)


### index.js
主文件，通过核心组件`ThemeBox`的包裹, 来实现将所需的变量传递给 `ShowArea` 和 `OptionArea`

```js
import React from "react";
import ReactDOM from "react-dom";
import ShowArea from './showArea';
import OptionArea from './optionArea';
import { ThemeBox } from './themeBox';

function App() {
  return (
    <div>
      <ThemeBox>
        <ShowArea></ShowArea>
        <OptionArea></OptionArea>
      </ThemeBox>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

### showArea.js

展示区组件，直接通过 `Context` 取reducer里的数据(themeObj)或操作函数(dispatch)

```js
import React, { useContext } from 'react';
import { ThemeBoxContext } from './themeBox';

const ShowArea = (props) => {
  const { themeObj } = useContext(ThemeBoxContext);
  return <div style={{ color: themeObj.color, backgroundColor: themeObj.backgroundColor }}>都看我，我会变色~</div>;
};

export default ShowArea;
```

### optionArea.js

操作区组件，直接通过 `Context` 取reducer里的数据(themeObj)或操作函数(dispatch)

```js
import React, { useContext } from 'react';
import { ThemeBoxContext, UPDATE_COLOR, UPDATE_BACKGROUND_COLOR } from './themeBox';

const OptionArea = (props) => {
  const { dispatch } = useContext(ThemeBoxContext);

  return (
    <React.Fragment>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: 'red' });
        }}
      >
        字体变红
      </button>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_COLOR, color: 'blue' });
        }}
      >
        字体变蓝
      </button>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_BACKGROUND_COLOR, backgroundColor: 'black' });
        }}
      >
        背景变黑
      </button>
      <button
        onClick={() => {
          dispatch({ type: UPDATE_BACKGROUND_COLOR, backgroundColor: 'pink' });
        }}
      >
        背景变粉
      </button>
    </React.Fragment>
  );
};

export default OptionArea;
```

### themeBox.js

核心组件。

用`Reducer`改变state数据，再用`Context`来传递`state`数据和`dispatch`操作，从而达到了 useContext+useReducer 替代redux的目的。

```js
import React, { createContext, useReducer } from 'react';

// 创建 context
export const ThemeBoxContext = createContext({});

// reducer
export const UPDATE_COLOR = 'UPDATE_COLOR';
export const UPDATE_BACKGROUND_COLOR = 'UPDATE_BACKGROUND_COLOR';
const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_COLOR:
      return {
        ...state,
        color: action.color,
      };
    case UPDATE_BACKGROUND_COLOR:
      return {
        ...state,
        backgroundColor: action.backgroundColor,
      };
    default:
      return state;
  }
};

/**
 * 创建一个 Theme 组件
 * Theme 组件包裹的所有子组件都可以通过调用 ThemeBoxContext 访问到 value
 */
export const ThemeBox = (props) => {
  const [themeObj, dispatch] = useReducer(reducer, {
    color: '#fff',
    backgroundColor: '#000',
  });

  return <ThemeBoxContext.Provider value={{ themeObj, dispatch }}>{props.children}</ThemeBoxContext.Provider>;
};
```

https://juejin.cn/post/6844903869609148430
