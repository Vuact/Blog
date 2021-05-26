官方文档：[https://vuex.vuejs.org/zh/](https://vuex.vuejs.org/zh/)

vuex三大样：
- getter：相当于vue里的computed，获取state或处理后的值，有返回值
- mutations：相当于vue里的methods(同步)，无返回值
- action：相当于vue里的methods(异步)，无返回值; action提交的是mutation，而不是直接变更状态，

辅助函数放置位置：
- mapGetters ：放在computed里
- mapMutations、mapActions：放在methods里

<br>

# Vuex快速使用

- 目录结构.md
- state与mapState.md
- getters与mapGetters.md
- mutation与mapMutations.md
- action与mapActions.md
