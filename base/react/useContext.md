在看本文前，请先将 `context API` 用法了然于胸：[链接](https://zh-hans.reactjs.org/docs/context.html)


Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

useContext可以很方便的去订阅 context 的改变，并在合适的时候重新渲染组件。我们先来熟悉下标准的 context API 用法：

`Class Component`版本
```js
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间层组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 通过定义静态属性 contextType 来订阅
  static contextType = ThemeContext;
  
  render() {
    return <Button theme={this.context} />;
  }
}
```
`Function Component`版本

```js
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间层组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  // 通过定义 Consumer 来订阅
  return (
    <ThemeContext.Consumer>
      {value => <Button theme={value} />}
    </ThemeContext.Consumer>
  );
}
```
`Function Component Hook`版本
```js
// 第一步：创建需要共享的context
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // 第二步：使用 Provider 提供 ThemeContext 的值，Provider所包含的子树都可以直接访问ThemeContext的值
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
// Toolbar 组件并不需要透传 ThemeContext
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton(props) {
  // 第三步：使用共享 Context
  const theme = useContext('ThemeContext');
  render() {
    return <Button theme={theme} />;
  }
}
```
