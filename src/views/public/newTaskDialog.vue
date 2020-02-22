<template>
  <el-dialog title="新建任务" :visible.sync="dialogVisible" :before-close="handleClose" width="50%">
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="所属项目">
        <el-select v-model="dialogForm.projectId" placeholder="所属项目" clearable size="small">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务标题">
        <el-input v-model="dialogForm.taskName" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="任务标题" />
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="taskTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="设置开始时间"
          end-placeholder="设置结束时间"
          align="left" />
      </el-form-item>
      <el-form-item label="任务标签">
        <el-popover v-model="tagBtnPopover" placement="bottom" trigger="click">
          <el-button v-for="item in taskTag" :key="item.dictKey" size="small" :type="item.listClass" plain @click.native="chooseTag(item)">{{item.dictLabel}}</el-button>
          <el-button size="small" slot="reference" :type="tagBtn.listClass" plain>{{tagBtn.dictLabel}}</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="任务人员">
        <el-popover v-for="item in dialogForm.userList" :key="item.userId" placement="bottom-start" :title="item.nickName" width="200" trigger="hover">
          <span>联系方式：{{ item.phonenumber }}</span>
          <div style="text-align: right; margin: 0">
            <el-button type="danger" size="small" @click="removeUser(item)">移除</el-button>
          </div>
          <el-avatar slot="reference" style="margin: 0 5px -15px 0" :src="item.avatar" />
        </el-popover>
        <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
          <el-card v-for="item in userList" :key="item.userId" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
            <el-avatar style="margin-bottom: -5px" :src="item.avatar" />
            <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.nickName }}</span>
          </el-card>
          <el-button slot="reference" icon="el-icon-plus" circle @click="userPopover = true"/>
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
import { listUser } from "@/api/system/user";
import { listProject } from "@/api/project";
export default {
  props: {
    loading: {
      type: Boolean
    },
    dialogVisible: {
      type: Boolean,
    }
  },
  name: "taskDialog",
  data() {
    return {
      defaultTaskTag: null,
      defaultStatus: null,
      tagBtn: {},
      userList: [],
      taskTag: [],
      taskTime: [],
      projectList: [],
      taskStatusList: [],
      dialogForm: {
        projectId: null,
        taskName: null,
        taskTag: this.defaultTaskTag,
        userList: [],
        remark: null,
        status: this.defaultStatus
      },
      userPopover: false,
      tagBtnPopover: false,
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
  created() {
    this.getList()
    this.getUserList()
    this.getDicts("task_tag").then(response => {
      this.taskTag = response.data;
      this.tagBtn = this.taskTag.find(v => v.isDefault === 'Y')
      this.defaultTaskTag = this.tagBtn.dictKey
    });
    this.getDicts("task_status").then(response => {
      this.taskStatusList = response.data;
      this.defaultStatus = this.taskStatusList.find(v => v.isDefault === 'Y')
    })
  },
  watch: {
    dialogVisible(val) {
      if(val === true) {
        this.dialogForm = {
          projectId: null,
          taskName: null,
          userList: [],
          taskTag: this.defaultTaskTag,
          remark: null,
          status: this.defaultStatus,
        }
      }
    }
  },
  methods: {
    getList() {
      listProject().then(response => {
        this.projectList = response.rows
      })
    },
    getUserList() {
      listUser().then(response => {
        this.userList = response.rows;
      })
    },
    chooseTag(item) {
      this.dialogForm.taskTag = item.dictKey
      this.tagBtnPopover = false
      this.tagBtn = item
    },
    submitForm(val) {
      this.$emit('submitForm',this.dialogForm)
    },
    chooseUser(item) {
      this.userPopover = false
      if(this.dialogForm.userList.filter(t => t.userId == item.userId).length > 0) {
        this.$notify({
          title: '添加失败',
          message: '不允许重复添加同一人员',
          type: 'danger'
        })
      } else {
        this.dialogForm.userList.push(item)
      }
    },
    removeUser(item) {
      this.dialogForm.userList = this.dialogForm.userList.filter(t => t.userId != item.userId)
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    handleClose(done) {
      this.$emit("handleClose")
    },
    submitForm() {
      var val = this.dialogForm;
      val.startTime = null;
      val.stopTime = null;
      if (null != this.taskTime && '' != this.taskTime) {
        val.startTime = this.taskTime[0];
        val.stopTime = this.taskTime[1];
      }
      console.log(this.dialogForm)
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
/deep/ .el-tooltip__popper is-my-style {
  background: #303133;
  color: #FFF;
  margin-bottom: 24px;
}
</style>
