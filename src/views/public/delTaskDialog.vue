<template>
  <el-dialog title="删除任务" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="30%">
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="所属项目">
        <span><i class="el-icon-s-order" />{{ dialogForm.projectName }}</span>
      </el-form-item>
      <el-form-item label="任务标题" style="margin-right: 40px">
        <el-input disabled="disabled" v-model="dialogForm.taskName" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="任务标题" />
      </el-form-item>
      <el-form-item label="任务状态">
        <span>{{ dialogForm.taskStatus }}</span>
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker disabled="disabled" v-model="dialogForm.taskDate" type="datetimerange" range-separator="至" start-placeholder="设置开始时间" end-placeholder="设置结束时间" align="left" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean
    },
    dialogForm: {
      type: Object,
      default () {
        return {
          projectName: null,
          projectId: null,
          taskName: null,
          taskDate: null,
          remark: null,
          taskStatus: null
        }
      }
    },
    dialogVisible: {
      type: Boolean,
    }
  },
  name: "delTaskDialog",
  methods: {
    submitForm(val) {
      this.$emit('submitForm',this.dialogForm)
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    handleClose(done) {
      this.$emit("handleClose")
    }
  }
}
</script>

<style scoped>
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
