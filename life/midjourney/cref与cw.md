
<img width="699" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/43aca920-001e-4e65-a027-96462d2cd532">

# 一、快速理解

`--cref URL` 并输入字符图像的 URL 网址，再使用 --cw 来修改参考强度

- `--cw 100`（默认值）：使用脸部、头发和衣服做参考
- `--cw 0`：它只会关注脸部（适合更换服装/头发等）
  

![image](https://github.com/Vuact/Blog/assets/74364990/60486266-c8c3-4562-a297-da7ec75df93f)

![image](https://github.com/Vuact/Blog/assets/74364990/067defbe-34f6-414d-8349-bf69d6f7285a)

![image](https://github.com/Vuact/Blog/assets/74364990/e766cb78-2e22-4763-8c65-d412492673d6)

# 二、实战

## 1、--cref + --cw 0

Promise: A French beauty is sitting on the sofa drinking coffee, she has an attractive figure with her slender waist, beautiful slender eyes, red lips, fair skin tone, the expression on the face is cold and proud, dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes --v 6.0 

翻译：一位法国美女正坐在沙发上喝咖啡，纤细的腰肢勾勒出迷人的身材，美丽细长的眼睛，红润的嘴唇，白皙的肤色，脸上的表情冷漠而高傲，身着中性风格的套装，佩戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛。

![image](https://github.com/Vuact/Blog/assets/74364990/6a951ff2-2693-4500-93f6-c6f56957bc2c)
![Uploading image.png…]()


之后我们可以使用`--cw 0`修改除脸以外的一切：

Promise: 
