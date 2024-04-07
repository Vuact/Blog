
- base
- options
- settings
- 图生图
- 图生文
- v6图像续写
- v6图中加文本
- --cref与--cw
- --sref与--sw


------

### 提示词
- [提示词概述](https://docs.midjourney.com/docs/prompts-2)
- [图像提示](https://docs.midjourney.com/docs/image-prompts)
- [多重提示](https://docs.midjourney.com/docs/multi-prompts)
- [缩短提示词](https://docs.midjourney.com/docs/shorten-1)
  

### 参数
- 宽高比: [--ar n:n](https://docs.midjourney.com/docs/aspect-ratios-1)
- 排除事物: [--no item1, item2, item3, item4](https://docs.midjourney.com/docs/no-1)
- 风格参数
  - 原始风格: [--style raw](https://docs.midjourney.com/docs/style-1)
  - 艺术氛围参数: [--s <0~1000>](https://docs.midjourney.com/docs/stylize-1)（默认值为 100）
  - 初始图混乱: [--c <0~100>](https://docs.midjourney.com/docs/chaos-1) (默认值为0)
  - NIji V5风格: --style expressive/cute/scenic/original
  - 诡异风格: [--weird <0~3000>](https://docs.midjourney.com/docs/weird-1) (默认值为0)
- 相似性:
  - 图片相似性: [--seed <0–4294967295>](https://docs.midjourney.com/docs/seeds-1)
  - 角色一致性: [--cref <URL> + cw <0~100>](https://docs.midjourney.com/docs/character-reference) (默认值为 100) 
  - 风格一致性: [--sref <URL> + sw <0~1000>](https://docs.midjourney.com/docs/style-reference) (默认值为 100) 值越大与原始风格越相似，一般250左右效果比较好，超500容易变形
  - 图像Prompt: 会覆盖--cref、--sref的效果
    - [URL + Prompt](https://docs.midjourney.com/docs/image-prompts)
    - [--iw <0~2/3>](https://docs.midjourney.com/docs/en/image-prompts-1) (默认值为1)
- 其他
  - 质量: [--q](https://docs.midjourney.com/docs/quality) (默认值为1)
  - 视频: [--video](https://docs.midjourney.com/docs/video-1)
  - 纹理无缝拼接: [--tile](https://docs.midjourney.com/docs/tile-2)

> 如果你希望V6完全遵循你的提示词的话，“--s”值的最佳点在55到默认值100之间，强烈倾向于75。最低值0往往产生类似草图的图像，有时容易出错。随着值的增加，更普遍的“美丽”美学开始占据主导。在最大“--s”值下，提示词的关键部分会“丢失”。这个显然比V5要低不少，在V5，这个值我一般设置在250。

### 相关链接
- 参数表: https://docs.midjourney.com/docs/parameter-list
- 命令表: https://docs.midjourney.com/docs/command-list
- 提示词网站: [midlibrary](https://midlibrary.io/)

### 应用
- [如何用AI工具快速设计微信红包封面](https://zhuanlan.zhihu.com/p/679742855)

### 工具
- [prompt提示](https://moonvy.com/apps/ops/)


待学习：
- https://zhuanlan.zhihu.com/p/672492640
- https://zhuanlan.zhihu.com/p/681960971
- https://zhuanlan.zhihu.com/p/681987018
- https://zhuanlan.zhihu.com/p/682027926
- https://zhuanlan.zhihu.com/p/681495115
