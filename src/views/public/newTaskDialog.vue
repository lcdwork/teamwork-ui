<template>
  <el-dialog title="新建任务" :visible.sync="dialogVisible" :before-close="handleClose" width="50%">
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="所属项目">
        <el-dropdown @command="chooseProject">
          <span class="el-dropdown-link"><i class="el-icon-s-order" />{{ dialogForm.projectName }}<i class="el-icon-arrow-down el-icon--right" /></span>
          <el-dropdown-menu align="center">
            <el-dropdown-item v-for="item in projectList" :key="item.id" :command="{value:item.id,label:item.value}"> {{ item.value }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="任务标题">
        <el-input v-model="dialogForm.taskName" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="任务标题" />
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker v-model="taskTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="设置开始时间" end-placeholder="设置结束时间" align="left" />
      </el-form-item>
      <el-form-item label="任务标签">
        <el-popover v-model="tagBtnPopover" placement="bottom" trigger="click">
          <el-button v-for="item in tagBtnList" :key="item.id" size="small" :type="item.type" plain @click.native="chooseTag(item)">{{item.name}}</el-button>
          <el-button size="small" slot="reference" :type="tagBtn.type" plain>{{tagBtn.name}}</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="任务人员">
        <el-tooltip v-for="item in userIfo" :key="item.id" effect="my-style" :content="item.name" placement="top">
          <el-popover placement="bottom-start" :title="item.name" width="200" trigger="click">
            <span>联系方式：{{ item.phone }}</span>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" @click="removeUser(item)">移除</el-button>
            </div>
            <el-avatar slot="reference" style="margin: 0 5px -15px 0" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </el-popover>
        </el-tooltip>
        <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
          <el-card v-for="item in userIfo" :key="item.id" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
            <el-avatar style="margin-bottom: -5px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.name }}</span>
          </el-card>
          <el-button slot="reference" icon="el-icon-plus" circle />
        </el-popover>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input v-model="dialogForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="需求和描述" />
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
    projectList: {
      type: Array,
      default () {
        return []
      }
    },
    dialogVisible: {
      type: Boolean,
    },
    tagBtn: {
      type: Object,
      default () {
        return {
          id: 2,
          type: 'primary',
          name: '普通任务'
        }
      }
    },
    dialogForm: {
      type: Object,
      default () {
        return {
          projectId: null,
          projectName: '选择项目',
          taskName: null,
          remark: null
        }
      }
    },
    taskTime: {
      type: Array
    }
  },
  name: "taskDialog",
  data() {
    return {
      projectName: '选择项目',
      tagBtnPopover: false,
      tagBtnList: [
        {
          id: 1,
          type: 'success',
          name: '优化任务'
        },
        {
          id: 2,
          type: 'primary',
          name: '普通任务'
        },
        {
          id: 3,
          type: 'warning',
          name: '优先任务'
        },
        {
          id: 4,
          type: 'danger',
          name: '紧急任务'
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    chooseTag(item) {
      this.tagBtnPopover = false
      this.tagBtn = item
    },
    submitForm(val) {
      this.$emit('submitForm',this.dialogForm)
    },
    chooseProject(command) {
      console.log(command)
      this.dialogForm.projectName = command.label
      this.dialogForm.projectId = command.value
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
      val.startTime = "";
      val.stopTime = "";
      if (null != this.taskTime && '' != this.taskTime) {
        val.startTime = this.taskTime[0];
        val.stopTime = this.taskTime[1];
      }
      this.$emit('submitForm', val)
    }
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
