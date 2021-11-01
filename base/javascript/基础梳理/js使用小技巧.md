
### 1、将类数组对象转换成数组
```js
function sumArguments() {
    return Array.from(arguments).reduce((sum, num) => sum + num);
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
