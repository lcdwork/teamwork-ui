<template>
  <el-dialog title="" :visible.sync="dialogVisible" :before-close="handleCloseBindWarnStandard" width="50%">
    <el-form label-width="100px">
      <el-form-item prop="name" label="拍品">
        <el-input v-model.trim="dialogForm.name"
                  :rules="{required: true, message: '拍品不能为空', trigger: 'blur'}"
                  placeholder="拍品名称"
                  style="width: 90%;"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="code" label="拍品代码">
        <el-input v-model.trim="dialogForm.code" placeholder="拍品代码" style="width: 90%;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
      },
      dialogForm: {
        type: Object,
      }
    },
    created(){
      console.log(this.dialogForm)
    },
    computed: {
    },
    methods: {
      //提交
      submitForm(val) {
        this.$emit('submitForm',this.dialogForm)
        //console.log(this.handleType)
      },
      //关闭弹窗
      handleCancel(){
        this.$emit('getCancel')
      },
      //关闭弹窗，不可以删这个方法。不用这个方法点击遮罩层关闭会报错
      handleCloseBindWarnStandard() {
        this.$emit("closeBindWarnStandard");
      }
    }
  }
</script>

<style scoped>

</style>
