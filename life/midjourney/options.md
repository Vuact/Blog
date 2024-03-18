# 微调图片V 与 放大图片U

<img width="924" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/df8e91c7-c929-4fe8-aa25-9d4dde4cdffb">

- U 放大
- V 再迭代4个版本
  
如果你对某张图片比较满意，可以直接点击U行的按钮放大对应的图片，比如点“U3”就会放大右上方的图片。

如果你觉得其中一张图片大体上符合你的需求，但想再做一些调整，可以点击V行对应的按钮，Midjourney机器人会根据你选择的图片重新生成四张相似的图片供你选择。

如果你对这四张图片都不满意，可以点击最右侧的按钮重新生成四张图片。

# 调整并下载大图

<img width="867" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/ac4173d3-14bc-4c89-872a-f252fbd9b6ef">

- ### [Upscale（Subtle/Creative）](https://docs.midjourney.com/docs/upscalers-1)
  Upscale可以理解为将低像素图片，增加为高像素图片（高像素即意味着图片的细节纹理更加清晰）
  - Upscale (Subtle)按钮使图像尺寸加倍(例如像素 由 1024 x 1024 加倍为 2048 x 2048)，并保持细节与原始图像非常相似
  - Upscale (Creative)按钮会使图像尺寸加倍并为图像添加新的细节
 
  <img width="890" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/5ebbfe82-817c-4060-ac05-a6a264da5e2d">

> Subtle放大名副其实，旨在忠实于原始图像。其主要目标是提高分辨率，同时尽可能保留原有的细节。而在某些情况下，Creative放大可能会通过“过度重新想象”或添加太多细节来“损害”图片，而Subtle选项则尽力保持原创作品的完整性，同时为其提供更清晰、更精致的完成效果。就我经验而言，放大的时候基本已经是定稿的时候了，所以Creative放大很少有实用的时候。可参考：https://midlibrary.io/midguide/midjourney-v6-in-depth-review-part-4-upscalers

- ### [Vary (Strong/Subtle)](https://docs.midjourney.com/docs/variations)
  Vary (Strong/Subtle/Region)按钮的功能类似于先前V行的按钮，可以根据这张大图的主题和风格，再次生成四张风格相似的图片供你选择。
  - Vary (Strong)按钮将带来较大的变化
  - Vary (Subtle)按钮则会产生较微妙的变化
  <img width="1142" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/7f43ea47-bc97-4f01-8d1b-c290a36dd1b9">


- ### [Vary Region](https://docs.midjourney.com/docs/vary-region)
  Vary (Region)按钮可以让指定区域发生变化
  <img width="912" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/96e4c687-981a-4984-8222-999128af8945">


- ### [Zoom Out 与 Custom Zoom](https://docs.midjourney.com/docs/zoom-out)
  Zoom Out 与 Custom Zoom按钮允许你缩小图像的显示范围，从而呈现更广阔的场景。点击这里的任意一个按钮都将生成四张新的图片供你选择。
  - Zoom Out 2x: 表示缩小2倍
  - Zoom Out 1.5x: 表示缩小1.5倍
  - Custom Zoom: 允许自定义缩小的倍数，你可以通过修改弹出窗口中的最后一个参数来实现
  <img width="910" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/ecacb2dc-9992-4c65-8c37-eb6f13d034c7">

- ### [Make Square](https://docs.midjourney.com/docs/zoom-out)
  Make Square即制作正方形。Make Square可以调整非方形图像的纵横比使其成为方形。如果原始宽高比较宽（横向），则会垂直扩展。如果它很高（纵向），它将水平扩展。
  <img width="890" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/6e9b3155-7055-46cc-b584-5cb7b0dcbfb4">

  
- ### [上下左右](https://docs.midjourney.com/docs/pan)
  上下左右按钮用于移动视窗，生成你指定方向的内容。例如，如果你刚刚点击 ⬅️ 按钮，那么它就会在原图的左边添加更多的内容，增加的部分将占据原来图片的一半。
  <img width="888" alt="image" src="https://github.com/Vuact/Blog/assets/74364990/4448bdc5-1867-4c45-bad8-1d2e7c853254">

