<template>
  <div id="app">
    <slot-components>
      <!-- 必须用template标签包裹，val为自定义的属性值，接收到的是一个对象 -->
      <template scope="val">
        <!--msg为子组件的自定义属性  -->
        <div>{{val.msg}}</div>

        <!--将son-com组件当标签使用，必须都写在template中，否则，不会显示 -->
        <div class="con">
          这是我用slot插槽显示的值
        </div>

      </template>

    </slot-components>
  </div>
</template>

<script>
import slotComponents from '@/views/tests/slot-components'
export default {
  name: 'SlotParent',
  components: {
    slotComponents
  },
  data() {
    return {
    }
  }
}
</script>

<style>
</style>
