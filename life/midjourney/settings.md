<img width="730" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/d41b7662-21c3-4de7-8035-c9f79bfed335">

### 模型版本选择
  - MJ Model V1~6: 写实风格
  - Niji Model: 二次元的风格
    
### Raw Mode（原始风格）
仅限于V5.2和V5.1模型中启用。开启此功能将减少Midjourney对图片的“美化”处理，令其更加忠实于你的描述与提供的照片参考。尽管我不常用此功能，但如果你希望结果更接近真实照片，不妨试一试。
![image](https://github.com/Vuact/Blog/assets/74364990/dfce5108-8291-4a84-a68f-0ea8277172e0)

> 小贴士：当你只想为单张图片指定按原始风格生成时，仅需在提示词后加上“--style raw”，无需改变全局设定即可生效。

### Stylize X（艺术风格化参数）
Stylize X用于设定图片艺术风格的。低Stylize值意味着生成的图像更符合描述，但艺术氛围略显稀薄；而高Stylize值则为生成的图像带来浓烈的艺术感受，但与描述的关联度降低。你可以在0-1000之间自由调节Stylize值，其中这四个预设按钮对应的值分别是：
- Stylize Low = --s 50
- Stylize Med = --s 100
- Stylize High = --s 250
- Stylize Very High = --s 750

一般情况下，Med和High的设定较为合适。
![image](https://github.com/Vuact/Blog/assets/74364990/eb6d9649-b5c1-4458-a73a-31010e80db3a)

> 小贴士：当你只想为单张图片指定艺术风格时，仅需在提示词后加上“--s ”或“--stylize ”后跟数字（例如“--s 500”），无需改变全局设定即可生效。

### Public/Private mode
  - Public mode: 所创作的图都是公开的
  - Private mode: 创作的图只有你自己才能看到的

### Remix mode（带提示词重新生成）

带提示词重新生成（Remix）。不少用户在使用AI绘图时，可能对初次生成的图片感到满意，但随后想要做出些许变化。这时，仅通过简单的“重新生成”操作，结果可能并不如意。但“带提示词重新生成”功能却能让你细致指导图像的变化方向，比如你可以为其添加“夕阳”或“樱花”等提示词，使图像更符合你的预期。此外，结合参数--ar和--no（后面会详细讲到），可以进一步调整图像的宽高比或排除某些不需要的元素。

<img width="868" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5a5d393c-51fd-4692-84cd-9b1bd4415f9a">

> 小贴士：除了点击按钮，你也可以直接使用命令“/prefer remix”来快速开关此模式

### Turbo/Fast/Relax mode
  - Turbo mode: 比Fast更快的出图
  - Fast mode: 快速通道，出图不用排队
  - Relax mode: 则需要排队，创作图片的速度就根据服务器当前的情况来决定



