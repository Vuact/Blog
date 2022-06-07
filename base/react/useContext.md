在看本文前，请先将 `context API` 用法了然于胸：[链接](https://zh-hans.reactjs.org/docs/context.html)


Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

useContext可以很方便的去订阅 context 的改变，并在合适的时候重新渲染组件。我们先来熟悉下标准的 context API 用法：

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
