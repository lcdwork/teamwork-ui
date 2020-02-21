<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="70%">
    <el-container>
      <el-aside width="55%" style="background: #fff;">
        <el-form ref="form" :model="dialogForm" label-width="80px">
          <el-form-item label="所属项目">
            <span><i class="el-icon-s-order" />{{ dialogForm.projectName }}<i class="el-icon-arrow-down el-icon&#45;&#45;right" /></span>
          </el-form-item>
          <el-form-item label="任务标题" style="margin-right: 40px">
            <el-input v-model="dialogForm.taskName" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="任务标题" />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-dropdown trigger="click" @command="statusCommand">
              <span :style="{'color': statusDropdown.cssClass}" class="status-dropdown">{{statusDropdown.dictLabel}}</span>
              <el-dropdown-menu align="center">
                <el-dropdown-item v-for="item in taskStatusList" :key="item.dictValue" :style="{'color': item.cssClass}" :command="{dictValue:item.dictValue,dictLabel:item.dictLabel}"> {{ item.dictLabel }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="任务时间">
            <el-date-picker v-model="taskTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="设置开始时间" end-placeholder="设置结束时间" align="left" />
          </el-form-item>
          <el-form-item label="任务标签">
            <el-popover v-model="tagBtnPopover" placement="bottom" trigger="click">
              <el-button v-for="item in taskTag" :key="item.dictValue" size="small" :type="item.listClass" plain @click.native="chooseTag(item)">{{item.dictLabel}}</el-button>
              <el-button size="small" slot="reference" :type="tagBtn.listClass" plain>{{tagBtn.dictLabel}}</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="任务人员">
            <el-popover v-for="item in dialogForm.userList" :key="item.userId" placement="bottom-start" :title="item.name" width="200" trigger="click">
              <span>联系方式：{{ item.phonenumber }}</span>
              <div style="text-align: right; margin: 0">
                <el-button type="danger" @click="removeUser(item)">移除</el-button>
              </div>
<!--                <el-avatar slot="reference" style="margin: 0 5px -15px 0">{{item.name}}</el-avatar>-->
              <el-avatar slot="reference" style="margin: 0 5px -15px 0" :src="item.avatar"/>
            </el-popover>
            <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
              <el-card v-for="item in userList" :key="item.userId" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
                <el-avatar style="margin-bottom: -5px" :src="item.avatar" />
                <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.nickName }}</span>
              </el-card>
              <el-button slot="reference" icon="el-icon-plus" circle />
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
            <el-timeline-item v-for="activity in activities" :type="activity.type" :key="index" placement="bottom">
              <el-card :body-style="{padding: '0px'}" shadow="hover">
                <div style="margin-left: 10px">
                  <h4>{{activity.content}}</h4>
                  <p>{{activity.name}} 提交于 {{activity.timestamp}}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="loading" @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listUser } from "@/api/system/user";
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
    activities: {
      type: Array,
      default () {
        return [
          {
            content: '活动按期开始',
            name: '张三',
            type: 'success',
            timestamp: '2018-04-15'
          }, {
            content: '通过审核',
            name: '张三',
            timestamp: '2018-04-13'
          }, {
            content: '创建成功',
            name: '张三',
            timestamp: '2018-04-11'
          },
          {
            content: '活动按期开始',
            name: '张三',
            type: 'success',
            timestamp: '2018-04-15'
          }, {
            content: '通过审核',
            name: '张三',
            timestamp: '2018-04-13'
          }, {
            content: '创建成功',
            name: '张三',
            timestamp: '2018-04-11'
          }
        ]
      }
    },
    dialogVisible: {
      type: Boolean,
    },
    tagBtn: {
      type: Object,
      default () {
        return {}
      }
    },
    dialogTitle: {
      type: String,
      default () {
        return '编辑任务'
      }
    },
    statusDropdown: {
      type: Object,
      default () {
        return {}
      }
    },
    dialogForm: {
      type: Object,
      default () {
        return {
          projectName: '选择项目',
          projectId: null,
          taskName: null,
          remark: null,
          taskStatus: null
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
      tagBtnPopover: false,
      userPopover: false,
      taskTag: [],
      userList: [],
      taskStatusList: [],
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
    this.getUserList()
    this.getDicts("task_status").then(response => {
      console.log(response.data)
      this.taskStatusList = response.data;
    })
    this.getDicts("task_tag").then(response => {
      this.taskTag = response.data;
    })
  },
  methods: {
    getUserList() {
      listUser().then(response => {
        this.userList = response.rows;
      })
    },
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
    },
    statusCommand(command) {
      console.log(command)
      this.statusDropdown.dictLabel = command.dictLabel
      this.statusDropdown.dictValue = command.dictValue
    }
  }
}
</script>

<style scoped>
.el-icon-arrow-down {
  font-size: 12px;
}
.status-dropdown {
  cursor: pointer;
  background: rgba(0, 0, 0, .025);
  border-radius: 5px;
  padding: 8px;
}
.status-dropdown:hover {
  color: #409EFF;
  transition: color 0.3s ease;
}
.status-dropdown:focus {
  outline: none;
}
</style>
