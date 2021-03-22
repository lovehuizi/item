<!-- 用于公共模态框，用于用户登录、购物 ... -->
<template>
  <div>
  <!-- 根标签 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <!-- <div class="md-title">Login in</div> -->
          <button class="md-close" @click="closeModal">Close</button>
        </div>

        <div class="md-content">
          <div class="confirm-tips">
            <!-- 干掉错误信息提示 -->
            <!-- 将文本框变成插槽-活的数据 -->
            <slot name="message"></slot>
          </div>
          <div class="login-wrap">
            <!-- 按钮也是不固定的 -->
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>

<script>
export default{
  props:['mdShow'],  // 接收变量，父组件传递过来的值，子组件没法直接修改，通过其他的手段可以修改
  data(){
    return{

    }
  },
  methods:{
    closeModal(){
      this.$emit('close')   // 触发父组件自定义事件
    }
  }
}
// 问题：当点击添加到购物车，没有登录mdShow传递到Modal组件中，true，会显示模态框，点击关闭按钮时直接将mdShow设置为false；通过调试发现父组件的这个值并没有改变，所以父组件认为模态框已经处于显示状态。-子组件把mdShow设为false的时候，父组件并不知道。
</script>

<style>
</style>
