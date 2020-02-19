<template>
  <div>
    <!-- 自定义属性进行传值 -->
    <slot :msg="message"></slot>
    <div id="son">{{message2}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '我是slot-components向slot-parent.vue传递的值',
      message2: '哈哈哈哈哈哈哈啊哈'
    }
  }
}
</script>

<style scoped>
#son {
  width: 300px;
  height: 50px;
  background: lightpink;
}
</style>
