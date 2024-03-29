
<img width="699" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/43aca920-001e-4e65-a027-96462d2cd532">

# 一、快速理解

--cref即角色一致性。
`--cref URL` 并输入字符图像的 URL 网址，再使用 --cw 来修改参考强度。

- `--cw 100`（默认值）：使用脸部、头发和衣服做参考
- `--cw 0`：它只会关注脸部（适合更换服装/头发等）
  

![image](https://github.com/Vuact/Blog/assets/74364990/60486266-c8c3-4562-a297-da7ec75df93f)

![image](https://github.com/Vuact/Blog/assets/74364990/067defbe-34f6-414d-8349-bf69d6f7285a)

![image](https://github.com/Vuact/Blog/assets/74364990/e766cb78-2e22-4763-8c65-d412492673d6)

# 二、基本使用

> 官方说 `--cref` 此功能不是为真人/照片设计的，很可能会像普通图像提示一样使其变形 

Prompt: A French beauty is sitting on the sofa drinking coffee, she has an attractive figure with her slender waist, beautiful slender eyes, red lips, fair skin tone, the expression on the face is cold and proud, dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes --niji 6

翻译：一位法国美女正坐在沙发上喝咖啡，纤细的腰肢勾勒出迷人的身材，美丽细长的眼睛，红润的嘴唇，白皙的肤色，脸上的表情冷漠而高傲，身着中性风格的套装，佩戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛。

<img width="380" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/2f3d6f86-1340-42cb-8f43-bd4f30270375">


## 1、--cref 与 --cw 0

之后我们可以使用`--cw 0`修改除脸以外的一切：

Prompt: A French beauty is sitting in front of the mountain, she has an attractive figure with her slender waist, beautiful slender eyes, red lips, fair skin tone, the expression on the face is cold and proud, dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes --cref https://s.mj.run/usFTtuYaFuU --cw 0 --niji 6

翻译：山前坐着一位法国美女，纤细的腰肢勾勒出迷人的身材，美丽细长的眼睛，红润的嘴唇，白皙的肤色，脸上的表情冷漠而高傲，身着中性风格的套装，佩戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛。

<img width="665" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5c835599-722a-4fe4-91e1-1b46bdfcc2be">

## 2、--cref 与 --cw 100

Prompt: Someone sitting in the middle of a concert --cref https://s.mj.run/usFTtuYaFuU --niji 6

翻译：有人坐在音乐会舞台中间

<img width="665" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/231852d5-f93b-483b-90e8-dbef14065bd0">

#### 使用更高的 --s 值重试，可以让 --cref 图像更好的融入场景
`如果 --cref 图像已包含想要的姿势和其他细节，可以仅描述设置、周围环境、上下文或背景，MJ 将努力将角色融入场景中`，但是可能会看到一些不连贯的结果，所以需要`使用更高的样式值(--s)重试，让--cref 图像更好的融入场景`，下面的例子中，使用--s 1000 之后的图片明显融合的更加好。

<img width="857" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/4764e041-1192-482e-9be6-6e6404a4dd0b">

## 3、--cref更适用于动漫角色
一样的Prompt, 使用 `--v 6` 生成的效果人脸会和`--cref`的参考图有所不同；不如 `--niji 6` 的效果好

使用 `--niji 6` 生成（第一张的url用作后续 --cref 的值）
<img width="1385" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/9918b6c9-6953-43d3-b389-cf8c3e378878">

使用 `--v 6` 生成（第一张的url用作后续 --cref 的值）：与参照图比较，我们发现嘴有些变化
<img width="1341" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/0244c89c-17d9-4798-a579-ea3e73a5a820">


而且使用V6生成的图作为--cref的值，然后再使用 `--niji 6` 绘画，效果出奇的好：

<img width="1110" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/f14122d1-b76b-4746-a7ac-89207b4c596c">

这也再次证明了 --cref更适用于动漫角色。

# 三、高级使用

## 1、在一个画布上放置多个角色

想要在一个画面中出现多个角色，可以直接使用 pan 功能，同时对提示词做一些微调，比如这里我要在已有图片上加上一个男性的角色，这里需要对男性角色进行描述

<img width="230" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/07204c3a-47e6-4220-a905-11bf81af4558">

Prompt: A French couple are sitting on the sofa drinking coffee, She has an attractive figure with her slender waist, Beautiful slender eyes, red lips, fair skin tone, The expression on the face is cold and proud, Dressed in a neutral-style suit, and wearing conspicuous necklaces, rings, and earrings, with brown short hair and blue eyes, He is wearing a black suit and a gold watch --niji 6

翻译：一对法国夫妇正坐在沙发上喝咖啡，她身材窈窕，腰肢纤细，眼睛细长美丽，嘴唇红润，肤色白皙，脸上的表情冷漠而高傲，身着中性风格的西装，戴着显眼的项链、戒指和耳环，棕色短发，蓝色眼睛，他身着黑色西装，戴着金表。

<img width="505" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/222859bb-5332-4691-acd9-ac43abc4d5d5">

## 2、使用多个 URL 来混合多张图片中的信息

我们可以使用多个 URL 来混合多张图片中的信息，例如 --cref URL1 URL2（这类似于多张图片或样式提示）

底图：

<img width="484" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/4a54b269-7c21-4f8d-852e-09f297fda3fc">

Prompt: A beautiful brunette women and a handsome man are in a restaurant, realistic photo, style natural photo --cref https://s.mj.run/MY-ng9ZtRV0 https://s.mj.run/00fx_IWnX68 --cw 0 --v 6.0

翻译：一位褐发美女和一位英俊男子在一家餐厅用餐，写实照片, 风格自然照片

<img width="505" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/25cc4a20-3505-43bf-8c61-ac660a9776cb">

## 3、与 --sref 结合使用

使用多个 URL 来混合图片，也可以同时与--sref 结合使用，效果也是很不错的

### 例1

<img width="956" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/86a272ae-6d57-492b-a955-5b44ada348c9">

Prompt: A beautiful brunette women --cref https://s.mj.run/MY-ng9ZtRV0 --sref https://s.mj.run/usFTtuYaFuU --niji 6

### 例2

<img width="949" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/347b5770-d404-4936-a024-d425a4977b55">

Prompt: A beautiful brunette women --cref https://s.mj.run/MY-ng9ZtRV0 --sref https://s.mj.run/cFj-cHNgVzw --niji 6 

