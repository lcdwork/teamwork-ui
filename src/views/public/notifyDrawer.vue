<template>
  <el-drawer :withHeader="false" :visible.sync="drawerVisible" direction="rtl" :before-close="handleClose" custom-class="demo-drawer">
    <div class="demo-drawer__content">
      <div class="demo-drawer__header">
        <span style="outline: none;" role="heading" tabindex="0">{{drawerTitle}}</span>
      </div>
      <slot></slot>
      <div class="demo-drawer__footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'notifyDialog',
  props: {
    drawerVisible: {
      type: Boolean
    },
    drawerTitle: {
      type: String
    }
  },
  data() {
    return {
      currentPage: 10,
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.$emit("handleSizeChange")
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.$emit("handleCurrentChange")
    },
    handleClose() {
      this.$emit("handleClose")
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.demo-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 12px;
  padding: 10px 10px 0;
}
.demo-drawer__content{
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
/*.demo-drawer__timeline{*/
/*  padding-top: 5px;*/
/*  flex: 1;*/
/*  overflow: auto;*/
/*  overflow-x: hidden;*/
/*}*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: lightgray;
}
.demo-drawer__footer{
  display: flex;
}
</style>
