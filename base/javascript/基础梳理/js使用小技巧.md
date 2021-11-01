
### 1、将类数组对象转换成数组
```js
function sumArguments(...args) {
    return Array.from(args).reduce((sum, num) => sum + num);
}

sumArguments(1, 2, 3); // => 6
```

### 2、深\浅拷贝
- 浅拷贝
```js
const numbers = [3, 6, 9];
const numbersCopy = Array.from(numbers);

numbers === numbersCopy; // => false
```
- 深拷贝
```js
function recursiveClone(val) {
    return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}

const numbers = [[0, 1, 2], ['one', 'two', 'three']];
const numbersClone = recursiveClone(numbers);

numbersClone; // => [[0, 1, 2], ['one', 'two', 'three']]
numbers[0] === numbersClone[0] // => false
```
### 3、填充数组

```js
const length = 3;
const init   = 0;
const result = Array(length).fill(init); // => [0, 0, 0]
```
使用对象填充数组:

```js
const length = 3;
const resultA = Array.from({ length }, () => ({}));
const resultB = Array(length).fill({});

resultA; // => [{}, {}, {}]
resultB; // => [{}, {}, {}]

resultA[0] === resultA[1]; // => false
resultB[0] === resultB[1]; // => true
```
由 Array.from 返回的 resultA 使用不同空对象实例进行初始化。之所以发生这种情况是因为每次调用时，mapFunction，即此处的 () => ({}) 都会返回一个新的对象。
然后，fill() 方法创建的 resultB 使用相同的空对象实例进行初始化。
