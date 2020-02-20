<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="项目名称">
        <el-input placeholder="项目名称" v-model="dialogForm.projectName" />
      </el-form-item>
      <el-form-item label="计划时间">
        <el-date-picker v-model="dialogDate" value-format="yyyy-MM-dd" type="daterange" align="left" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="projectOptions" />
      </el-form-item>
      <el-form-item label="项目人员">
        <el-tooltip v-for="item in userInfo" :key="item.id" effect="my-style" :content="item.name" placement="top">
          <el-popover placement="bottom-start" :title="item.name" width="200" trigger="click">
            <span>联系方式：{{ item.phone }}</span>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" @click="removeUser(item)">移除</el-button>
            </div>
            <el-avatar slot="reference" style="margin: 0 5px -15px 0" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </el-popover>
        </el-tooltip>
        <el-popover v-model="userPopover" placement="bottom" width="200" trigger="click">
          <el-card v-for="item in userInfo" :key="item.id" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
            <el-avatar style="margin-bottom: -5px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.name }}</span>
          </el-card>
          <el-button slot="reference" icon="el-icon-plus" circle />
        </el-popover>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input v-model="dialogForm.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="项目描述" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </span>
  </el-dialog>
</template>

<script>
// import '@/styles/overwrite-element-ui.scss'
export default {
  name: "newProjectDialog",
  props: {
    dialogTitle: {
      type: String,
      default () {
        return '新建项目'
      }
    },
    dialogVisible: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    dialogDate: {
      type: Array
    },
    dialogForm: {
      type: Object,
      default () {
        return {
          projectName: null,
          remark: null
        }
      }
    }
  },
  data() {
    return {
      userPopover: {},
      userInfo: [],
      projectOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近十二个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 360)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  methods: {
    removeUser(item) {
      console.log(item)
    },
    chooseUser(item) {
      this.userPopover = false
      console.log(item)
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    handleClose(done) {
      this.$emit("handleClose")
    },
    submitForm() {
      var val = this.dialogForm;
      val.startDate = "";
      val.endDate = "";
      if (null != this.dialogDate && '' != this.dialogDate) {
        val.startDate = this.dialogDate[0];
        val.endDate = this.dialogDate[1];
      }
      this.$emit('submitForm', val)
    }
  }
}
</script>

<style scoped>

</style>
