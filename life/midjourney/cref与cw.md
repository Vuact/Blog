
<img width="699" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/43aca920-001e-4e65-a027-96462d2cd532">

# 一、快速理解

`--cref URL` 并输入字符图像的 URL 网址，再使用 --cw 来修改参考强度

- `--cw 100`（默认值）：使用脸部、头发和衣服做参考
- `--cw 0`：它只会关注脸部（适合更换服装/头发等）
  

![image](https://github.com/Vuact/Blog/assets/74364990/60486266-c8c3-4562-a297-da7ec75df93f)

![image](https://github.com/Vuact/Blog/assets/74364990/067defbe-34f6-414d-8349-bf69d6f7285a)

![image](https://github.com/Vuact/Blog/assets/74364990/e766cb78-2e22-4763-8c65-d412492673d6)

# 二、实战

Promise: A French beauty is sitting on the sofa drinking coffee, she has an attractive figure with her slender waist, beautiful slender eyes, red lips, fair skin tone, the expression on the face is cold and proud, dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes --niji 6

翻译：一位法国美女正坐在沙发上喝咖啡，纤细的腰肢勾勒出迷人的身材，美丽细长的眼睛，红润的嘴唇，白皙的肤色，脸上的表情冷漠而高傲，身着中性风格的套装，佩戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛。

<img width="380" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/2f3d6f86-1340-42cb-8f43-bd4f30270375">


## 1、--cref + --cw 0

之后我们可以使用`--cw 0`修改除脸以外的一切：

Promise: A French beauty is sitting in front of the mountain, she has an attractive figure with her slender waist, beautiful slender eyes, red lips, fair skin tone, the expression on the face is cold and proud, dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes --cref https://s.mj.run/usFTtuYaFuU --cw 0 --niji 6

翻译：山前坐着一位法国美女，纤细的腰肢勾勒出迷人的身材，美丽细长的眼睛，红润的嘴唇，白皙的肤色，脸上的表情冷漠而高傲，身着中性风格的套装，佩戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛。

<img width="665" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5c835599-722a-4fe4-91e1-1b46bdfcc2be">

## 2、--cref + --cw 100

Promise: Someone sitting in the middle of a concert --cref https://s.mj.run/usFTtuYaFuU --niji 6

翻译：有人坐在音乐会舞台中间

<img width="665" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/231852d5-f93b-483b-90e8-dbef14065bd0">
