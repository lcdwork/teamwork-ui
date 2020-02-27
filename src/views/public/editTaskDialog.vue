<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="70%">
    <el-container>
      <el-aside width="55%" style="background: #fff;">
        <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
          <el-form-item label="所属项目">
            <span><i class="el-icon-s-order" />{{ dialogForm.projectName }}</span>
          </el-form-item>
          <el-form-item label="任务标题" style="margin-right: 40px" prop="taskName">
            <el-input clearable v-model="dialogForm.taskName" placeholder="任务标题" />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-dropdown trigger="click" @command="statusCommand">
              <span :style="{'color': statusDropdown.cssClass}" class="status-dropdown">{{statusDropdown.dictLabel}}</span>
              <el-dropdown-menu align="center">
                <el-dropdown-item v-for="item in taskStatusList" :key="item.dictKey" :style="{'color': item.cssClass}" :command="item"> {{ item.dictLabel }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="任务时间" prop="dialogDate">
            <el-date-picker
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
            <el-popover v-model="tagBtnPopover" placement="bottom" trigger="click">
              <el-button v-for="item in taskTagList" :key="item.dictKey" size="small" :type="item.listClass" plain @click.native="chooseTag(item)">{{item.dictLabel}}</el-button>
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
import { listUserByProject } from "@/api/system/user";
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
      default () {
        return false
      }
    },
    dialogTitle: {
      type: String,
      default () {
        return '编辑任务'
      }
    },
    dialogForm: {
      type: Object,
      default () {
        return {
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
      tagBtn: {},
      dialogDate: [],
      tagBtnPopover: false,
      userPopover: false,
      taskTagList: [],
      userList: [],
      taskStatusList: [],
      statusDropdown: {},
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
      },
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        dialogDate: [
          {
            type: 'array',
            required: true,
            trigger: "change",
            validator: (rule, value, cb) =>{
              if(this.dialogDate === null || this.dialogDate.length === 0){
                cb(new Error("请选择时间"));
              } else {
                cb()
              }
            }
          }
        ]
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
      this.resetForm("form")
      this.getUserList(val.projectId)
      // if(val.status === undefined || val.status === null) {
      //   this.statusDropdown = this.taskStatusList.find(v => v.isDefault === 'Y')
      // } else {
      //   this.statusDropdown = this.taskStatusList.find(v => v.dictKey === val.status)
      // }
      // if(val.taskTag === undefined || val.taskTag === null) {
      //   this.tagBtn = this.taskTagList.find(v => v.isDefault === 'Y')
      // } else {
      //   this.tagBtn = this.taskTagList.find(v => v.dictKey === val.taskTag)
      // }
    }
  },
  methods: {
    getUserList(val) {
      listUserByProject(val).then(response => {
        this.userList = response.rows;
      })
    },
    chooseTag(item) {
      this.tagBtnPopover = false
      this.tagBtn = item
    },
    chooseUser(item) {
      if(this.dialogForm.userList === undefined || this.dialogForm.userList === null) {
        this.dialogForm.userList = []
      }
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
      // this.userPopover = true
      // this.userPopover = false
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
    },
    statusCommand(command) {
      this.statusDropdown = command
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
