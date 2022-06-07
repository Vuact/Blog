在看本文前，请先将 `context API` 用法了然于胸：[链接](https://zh-hans.reactjs.org/docs/context.html)

<br><br>

简述
- Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props
- 当Context Provider的value发生变化是，他的所有子级消费者都会rerender

下面我们来看看同一个例子的3个版本：


公共代码
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

// 中间层组件
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}
```


### `Class Component`版本
```js
class ThemedButton extends React.Component {
  // 第三步：通过定义静态属性 contextType 来订阅；使用共享 Context
  static contextType = ThemeContext;
  
  render() {
    return <Button theme={this.context} />;
  }
}
```
### `Function Component`版本
```js
function ThemedButton() {
  // 第三步：使通过定义 Consumer 来订阅，使用共享 Context
  return (
    <ThemeContext.Consumer>
      {value => <Button theme={value} />}
    </ThemeContext.Consumer>
  );
}
```
### `Function Component Hook`版本
```js
function ThemedButton(props) {
  // 第三步：使用共享 Context
  const theme = useContext('ThemeContext');
  render() {
    return <Button theme={theme} />;
  }
}
```
