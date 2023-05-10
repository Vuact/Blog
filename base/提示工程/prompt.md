- 【角色提问】当我提问时，请从`XXX的角度`提出5个更好的问题
  - 场景：通过限制范围，直接让GTP帮你生成合适的提问，同时它可能在给你5个问题的过程中已经帮你探索了一部分深度思考
  - 模板：当我提问时，请从`XXX的角度`提出5个更好的问题，并询问我是否愿意使用你的问题
  - 例如：当我提问时，请从 儿童脑洞小说创作者的角度 提出5个更好的问题，并询问我是否愿意使用你的问题
- 【引导提问】What question remain unanwsered? (有哪些问题还没有得到解答)
  - 场景：当你提出一个`模糊的需求`但没有给出`相关细节`时使用；引导你增加补充信息
  - 模板：XXXX，What question remain unanwsered?
  - 例如：帮我出一个关于长了翅膀的香肠在天上飞的线上活动策划，What question remain unanwsered?
- 【多角度回答】What are some alternative perspectives?（有哪些可以考虑的角度）
  - 场景：用于`多角度回答`问题
  - 模板：XXXXXX，What are some alternative perspectives
  - 例如：我和你妈掉水里了你先救谁？What are some alternative perspectives
- 【控制情感】use temperature of 数值
  - 场景：控制GTP的语气 热情或冰冷
  - 注意：温度参数值有效区间 [0,2]，温度值越高思维越发散越有创意越神经；如果作为文章输出，建议设为0.8，不会太冰冷也不会乱犯病
  - 模板：XXXX，use temperature of 数值
  - 例如：我和你妈掉水里了你先救谁？use temperature of 2


