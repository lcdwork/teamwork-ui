<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="70%">
    <el-container>
      <el-aside width="55%" style="background: #fff;">
        <el-form ref="form" :model="dialogForm" label-width="80px">
          <el-form-item label="所属项目">
            <span><i class="el-icon-s-order" />{{ dialogForm.projectName }}</span>
          </el-form-item>
          <el-form-item label="任务标题" style="margin-right: 40px" prop="taskName">
            <el-input disabled v-model="dialogForm.taskName" placeholder="任务标题" />
          </el-form-item>
          <el-form-item label="任务状态">
            <span :style="{'color': statusDropdown.cssClass === null ? '#FFFFFF' : statusDropdown.cssClass}" class="status-dropdown">{{statusDropdown.dictLabel}}</span>
          </el-form-item>
          <el-form-item label="任务时间" prop="dialogDate">
            <el-date-picker
              disabled
              v-model="dialogDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="设置开始时间"
              end-placeholder="设置结束时间"
              align="left" />
          </el-form-item>
          <el-form-item label="任务标签">
            <el-tag effect="light" size="large" :type="tagBtn.listClass">{{tagBtn.dictLabel}}</el-tag>
          </el-form-item>
          <el-form-item label="任务人员">
            <el-popover v-for="item in dialogForm.userList" :key="item.userId" placement="bottom-start" :title="item.nickName" width="200" trigger="hover">
              <span>联系方式：{{ item.phonenumber }}</span>
              <el-avatar v-if="item.avatar === null || item.avatar === ''" slot="reference" style="margin: 0 5px -15px 0;font-size: 12px">{{ item.nickName }}</el-avatar>
              <el-avatar v-else slot="reference" style="margin: 0 5px -15px 0" :src="url + item.avatar" />
            </el-popover>
          </el-form-item>
          <el-form-item label="任务描述" style="margin-right: 40px">
            <el-input v-model="dialogForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="需求和描述" />
          </el-form-item>
        </el-form>
      </el-aside>
      <div style="background-color:#E6E3E3; width:1px;"></div>
      <el-main>
        <div style="height: 350px; margin: -10px 0px 0px -40px">
          <el-timeline>
            <el-timeline-item v-for="activity in activities" :type="activity.type" placement="bottom">
              <el-card :body-style="{padding: '0px'}" shadow="hover">
                <div style="margin-left: 10px">
                  <h4>{{activity.content}}</h4>
                  <p>{{activity.userName}} 提交于 {{activity.operateTime}}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="dialogForm.taskUserStatus == 2" type="success" :disabled="loading" @click="commitTask">提交任务</el-button>
      <el-button v-else-if="dialogForm.taskUserStatus == 1" type="warning" :disabled="loading" @click="receiveTask">领取任务</el-button>
      <el-button :disabled="loading" @click="handleCancel" style="margin-left: 50px;">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTaskLog } from "@/api/task"
export default {
  props: {
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    projectList: {
      type: Array,
      default () {
        return []
      }
    },
    dialogVisible: {
      type: Boolean,
      default () {
        return false
      }
    },
    dialogTitle: {
      type: String,
      default () {
        return '查看任务'
      }
    },
    dialogForm: {
      type: Object,
      default () {
        return {
          userId: null,
          projectName: null,
          projectId: null,
          taskName: null,
          remark: null,
          taskStatus: null
        }
      }
    }
  },
  name: "taskDialog",
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      tagBtn: {},
      dialogDate: [],
      taskTagList: [],
      taskStatusList: [],
      statusDropdown: {},
      activities: [],
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
    this.getDicts("task_status").then(response => {
      this.taskStatusList = response.data;
    })
    this.getDicts("task_tag").then(response => {
      this.taskTagList = response.data;
    })
  },
  watch: {
    dialogForm(val) {
      this.dialogDate = [val.startTime, val.stopTime]
      this.tagBtn = this.taskTagList.find(v => v.dictKey === val.taskTag)
      this.statusDropdown = this.taskStatusList.find(v => v.dictKey === val.status)
      this.getTaskLogList(val.taskId)
    }
  },
  methods: {
    getTaskLogList(val) {
      getTaskLog(val).then(response => {
        console.log(response.rows)
        this.activities = response.rows
      })
    },
    commitTask() {
      this.$emit('commitTask', this.dialogForm)
    },
    receiveTask() {
      this.$emit('receiveTask', this.dialogForm)
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    handleClose(done) {
      this.$emit("handleClose")
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if(valid) {
          var val = this.dialogForm;
          val.startTime = null;
          val.stopTime = null;
          this.dialogForm.taskTag = this.tagBtn.dictKey
          this.dialogForm.status = this.statusDropdown.dictKey
          if (null != this.dialogDate && '' != this.dialogDate) {
            val.startTime = this.dialogDate[0];
            val.stopTime = this.dialogDate[1];
          }
          this.$emit('submitForm', val)
        } else {
          this.$notify.error({
            title: '表单验证失败',
            message: '请检查表单数据'
          })
          this.$emit('submitForm', null)
        }
      })
    }
  }
}
</script>

<style scoped>
.status-dropdown {
  background: rgba(0, 0, 0, .025);
  border-radius: 5px;
  padding: 8px;
}
</style>
