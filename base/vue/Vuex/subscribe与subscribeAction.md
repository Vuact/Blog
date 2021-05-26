# subscribe

https://vuex.vuejs.org/zh/api/#subscribe 

```js
subscribe(handler: Function, options?: Object): Function
```
订阅 store 的 mutation。 

handler 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数：

```js
store.subscribe((mutation, state) => {
  console.log(mutation.type)
  console.log(mutation.payload)
});
```
默认情况下，新的处理函数会被添加到其链的尾端，因此它会在其它之前已经被添加了的处理函数之后执行。这一行为可以通过向 options 添加 prepend: true 来覆写，即把处理函数添加到其链的最开始。

```js
store.subscribe(handler, { prepend: true })
```

<br>

# subscribeAction

```js
subscribeAction(handler: Function, options?: Object): Function
```

https://vuex.vuejs.org/zh/api/#subscribeaction
