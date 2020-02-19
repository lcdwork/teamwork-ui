<template>
<div>
  <el-button @click="dialogVisible = true"></el-button>
  <added-editor-dialog
    :dialogForm="dialogForm"
    :dialogVisible.sync="dialogVisible"
    @getCancel="handleCancel"
    @closeBindWarnStandard="handleCloseBindWarnStandard"
    @submitForm="submitForm">
  </added-editor-dialog>
</div>
</template>

<script>
  import addedEditorDialog from '@/views/tests/diglog-components'
    export default {
      name: "diglog-parent",
      components: {
        addedEditorDialog
      },
      data() {
        return {
          //弹窗
          dialogVisible: false,
          dialogForm: {
            name: '2222',
            statusCode: '222'
          },
        }
      },
      methods: {
        // 点击弹框下的取消
        handleCancel(){
          this.dialogVisible = false;
        },
        //关闭弹窗
        handleCloseBindWarnStandard(){
          this.dialogVisible = false;
        },
        //拍品新增、修改弹窗提交
        submitForm(val) {
          console.log(val)
          this.dialogVisible = false;

        }
      }
    }
</script>

<style scoped>

</style>
