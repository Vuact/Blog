


<img width="730" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/d41b7662-21c3-4de7-8035-c9f79bfed335">

> 官方介绍参见: https://docs.midjourney.com/docs/settings-and-presets

-----

## 模型版本选择
  - MJ Model V1~6: 写实风格
  - Niji Model: 二次元的风格


## Raw Mode（原始风格）

使用 [Raw Mode](https://docs.midjourney.com/docs/style-1) 可以让Midjourney较少的使用自动美化。

<img width="914" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/3a7a2ab4-8c82-4d10-9dd1-797cec6788b2">
<img width="894" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/8c1732de-b4ae-4345-b467-9bcfc94bc7da">
<img width="922" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/46b059b2-1358-4dcf-9e45-eec9df382990">


> 小贴士：当你只想为单张图片指定按原始风格生成时，仅需在提示词后加上`--style raw`，无需改变全局设定即可生效。


## Stylize X（艺术氛围参数）
[Stylize X](https://docs.midjourney.com/docs/stylize-1)用于设定图片艺术风格的。低Stylize值意味着生成的图像更符合描述，但艺术氛围略显稀薄；而高Stylize值则为生成的图像带来浓烈的艺术感受，但与描述的关联度降低。你可以在0-1000之间自由调节Stylize值，其中这四个预设按钮对应的值分别是：
- Stylize Low = --s 50
- Stylize Med = --s 100
- Stylize High = --s 250
- Stylize Very High = --s 750

一般情况下，Med和High的设定较为合适。

<img width="908" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/81866da5-50d1-46e7-a52c-ecad5970feff">
<img width="912" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/821ed788-d019-41f8-8771-42d6ece93589">

> 小贴士：当你只想为单张图片指定艺术风格时，仅需在提示词后加上 `--s` 或 `--stylize` 后跟数字（例如`--s 500`），无需改变全局设定即可生效。


## Public/Private mode（权限）
  - Public mode: 所创作的图都是公开的
  - Private mode: 创作的图只有你自己才能看到的


## Remix mode（带提示词重新生成）

带提示词重新生成（Remix）。不少用户在使用AI绘图时，可能对初次生成的图片感到满意，但随后想要做出些许变化。这时，仅通过简单的“重新生成”操作，结果可能并不如意。但“带提示词重新生成”功能却能让你细致指导图像的变化方向，比如你可以为其添加“夕阳”或“樱花”等提示词，使图像更符合你的预期。此外，结合参数--ar和--no（后面会详细讲到），可以进一步调整图像的宽高比或排除某些不需要的元素。

<img width="868" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5a5d393c-51fd-4692-84cd-9b1bd4415f9a">

> 小贴士：除了点击按钮，你也可以直接使用命令 `/prefer remix` 来快速开关此模式


## Low/High Variation Mode（变异程度）

高变异和低变异（Low/High Variation Mode）与下图中的 Vary (Subtle/Strong) 的效果一致。

<img width="823" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/9547f72c-e543-4896-bdf0-fc4942ce2863">

- Low Variation Mode 即 Vary (Subtle)：低变异模式下会保留原始图像的主要构图，但会在细节上引入微妙的变化。低变异模式有助于对图像进行微调或进行轻微的调整。
- High Variation Mode 即 Vary (Strong)：高变异模式下生成的新图像，可能会改变图像的构图、元素数量、颜色以及图像内的细节类型。高变异模式可用于基于单个生成的图像创建多个概念

![image](https://github.com/Vuact/Blog/assets/74364990/c03ba338-783b-461d-ae9b-5d04206da47d)


## Turbo/Fast/Relax mode（出图速度）
- 快速模式（Fast mode）是默认模式，按照正常速度生成图片，并消耗你订购套餐中的GPU分钟数，一般1分钟完成。
- 放松模式（Relax mode）只有在你订购的套餐是$30/月以上时可以选择。放松模式不会消耗任何你购买的GPU时间，但需要排队等待GPU处理，一般需要等待0-10分钟。
- 急速模式（Turbo mode）使用高速实验性GPU，最多可以提高四倍生成图片速度，但消耗的订购套餐中的GPU分钟数是快速模式的两倍。仅适用于模型版本V5、V5.1和V5.2。如果选择了Turbo模式，但GPU不可用，或者与所选的模型版本不兼容，则将在快速模式下生成图片。

> 小贴士：当你只想为单张图片指定生成速度时，仅需在提示词后加上`--fast`、`--turbo` 或 `--relax`，无需改变全局设定即可生效。


## NIji V5风格
当你选择Niji V5作为你的创作模型时，你会发现有一排专门用于风格设定的按钮，为作品赋予更加丰富的风格和特色。

<img width="860" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/f0084145-0c90-4bd2-b23e-fecb6f26d054">

- Default Style：当前版本的默认风格。
- Expressive Style：这种风格倾向于产生细致、充满艺术气息的插画，适合想要展现深度情感和细节的作品。
- Cute Style：如其名，这种风格会生成充满可爱元素的图像，不论是人物、物件还是场景。
- Scenic Style：这是一个打造电影级画面的风格，它可以在梦幻的环境中为你创造出震撼的背景和角色镜头。
- Original Style：这保持了2023年5月26日之前的Niji V5的原始模型风格，对于喜欢早期模型风格的用户来说是个不错的选择。

个人认为，这四种风格各有千秋，适用于不同的创作场景。无论你是要绘制梦中的场景，还是创作一张适合儿童阅读的插图，都能在其中找到最合适的风格。

![image](https://github.com/Vuact/Blog/assets/74364990/a79ddd0d-4174-433e-bc34-dc24bd4c47ff)

> 小贴士：在使用Niji V5版本时，当你只想为单张图片指定生成风格时，仅需在提示词后加上`--style expressive`、`--style cute`、`--style scenic` 或 `--style original`，无需改变全局设定即可生效。

