>在Vue和Vuex的源码中，作者都使用了Object.create(null)来初始化一个新对象。为什么不用更简洁的{}呢？

# Object.create()的定义

照搬一下MDN上的定义：

Object.create(proto,[propertiesObject])

- proto:新创建对象的原型对象
- propertiesObject:可选。要添加到新对象的可枚举（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。

举个例子：
```js
const car = {
  isSportsCar: false,
  introduction: function () {
    console.log(`Hi girl, this is a ${this.name}. 
    Do you like to have a drink with me ? ${this.isSportsCar}`);
  }
};

const porsche = Object.create(car,{
    //color成为porsche的数据属性
    //颜色不喜欢，可以改色或贴膜，所以可修改
    color:{
        writable:true,
        configurable:true,
        value:'yellow'
    },
    //type成为porsche的访问器属性
    type:{
        // writable、configurable等属性，不显式设置则默认为false
        // 想把普通车改成敞篷，成本有点大了，所以就设成不可配置吧
        get:function(){return 'convertible'},
        set:function(value){"change this car to",value}
    }
});

porsche.name = "Porsche 911"; // "name"是"porsche"的属性, 而不是"car"的
porsche.isSportsCar = true; // 继承的属性可以被覆写

porsche.introduction();
// expected output: "Hi girl, this is a Porsche 911. Do you like to have a drink with me ? true"
```
<br>

# Object.create()、{…}的区别

先看看我们经常使用的{}创建的对象是什么样子的：

```js
var o = {a：1};
console.log(o)
```

在chrome控制台打印如下：

![](https://user-gold-cdn.xitu.io/2018/4/11/162b2eeff41e8f5d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

https://juejin.cn/post/6844903589815517192
