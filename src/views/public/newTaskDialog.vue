<template>
  <el-dialog title="新建任务" :visible.sync="dialogVisible" :before-close="handleClose" width="50%">
    <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="dialogForm.projectId" placeholder="所属项目" @change="proUsers" clearable size="small">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="任务标题" prop="taskName">
        <el-input clearable v-model="dialogForm.taskName" placeholder="任务标题" />
      </el-form-item>
<!--      <el-form-item label="项目时间" prop="projectTime">-->
<!--        <el-date-picker-->
<!--          v-model="projectTime"-->
<!--          value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          type="datetimerange"-->
<!--          range-separator="至"-->
<!--          start-placeholder="开始时间"-->
<!--          end-placeholder="结束时间"-->
<!--          align="left" />-->
<!--      </el-form-item>-->
      <el-form-item label="任务时间" prop="taskTime">
        <el-date-picker
          v-model="taskTime"
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
          <el-avatar v-if="item.avatar === null || item.avatar === ''" slot="reference" style="margin: 0 5px -15px 0;font-size: 12px">{{ item.nickName }}</el-avatar>
          <el-avatar v-else slot="reference" style="margin: 0 5px -15px 0" :src="url + item.avatar" />
        </el-popover>
        <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
          <el-card v-for="item in userList" :key="item.userId" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
            <el-avatar v-if="item.avatar === null || item.avatar === ''" style="margin-bottom: -5px;font-size: 12px">{{ item.nickName }}</el-avatar>
            <el-avatar v-else style="margin-bottom: -5px;" :src="url + item.avatar"/>
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
      <el-button type="primary" :loading="loading" @click="submitForm"
                 v-hasPermi="['system:task:add']"
      >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { listUserByProject } from "@/api/system/user";
import { listProjectByUser } from "@/api/project";
export default {
  computed: {
    ...mapGetters([
      'loginUserId',
      'loginUserDept'
    ]),
  },
  props: {
    // loading: {
    //   type: Boolean
    // },
    dialogVisible: {
      type: Boolean,
    }
  },
  name: "taskDialog",
  data() {
    return {
      loading: false,
      url: process.env.VUE_APP_BASE_API,
      getProjectUser: {
        projectId: null,
      },
      tagBtn: {},
      userList: [],
      taskTag: [],
      projectTime: [],
      taskTime: [],
      projectList: [],
      taskStatusList: [],
      dialogForm: {
        projectId: null,
        taskName: null,
        taskTag: null,
        userList: [],
        remark: null,
        status: null
      },
      userPopover: false,
      tagBtnPopover: false,
      ProjectListParams:{
        userId: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      rules: {
        projectId: [
          { required: true, message: "请选择所属项目", trigger: ["blur", 'change'] }
        ],
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        taskTime: [
          {
            type: 'array',
            required: true,
            trigger: "change",
            validator: (rule, value, cb) =>{
              if(this.taskTime === null || this.taskTime.length === 0){
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
    this.getList()
    this.getDicts("task_tag").then(response => {
      this.taskTag = response.data;
      this.tagBtn = this.taskTag.find(v => v.isDefault === 'Y')
    });
    this.getDicts("task_status").then(response => {
      this.taskStatusList = response.data;
    })
  },
  watch: {
    dialogVisible(val) {
      if(val === true) {
        this.dialogForm = {
          projectId: null,
          taskName: null,
          userList: [],
          taskTag: null,
          remark: null,
          status: null,
        }
        this.resetForm("form")
      } else {
        this.userPopover = false
      }
    }
  },
  methods: {
    getList() {
      this.ProjectListParams.userId = this.loginUserId
      listProjectByUser(this.ProjectListParams).then(response => {
        this.projectList = response.rows
      })
    },
    proUsers(row) {
      console.log(row)
      this.getProjectUser.projectId = this.dialogForm.projectId
      listUserByProject(this.getProjectUser).then(response => {
        var list = response.rows
        if(this.dialogForm.userList === undefined || this.dialogForm.userList === null) {
          this.dialogForm.userList.forEach((item) => {
            list = list.filter(t => t.userId != item.userId)
          })
        }
        this.userList = list
      })
    },
    chooseTag(item) {
      this.tagBtnPopover = false
      this.tagBtn = item
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
        this.userList = this.userList.filter(t => t.userId != item.userId)
      }
    },
    removeUser(item) {
      this.dialogForm.userList = this.dialogForm.userList.filter(t => t.userId != item.userId)
      this.userList.push(item)
    },
    handleCancel(){
      this.$emit('handleCancel')
    },
    handleClose(done) {
      this.$emit("handleClose")
    },
    submitForm() {
      this.loading = true
      this.$refs["form"].validate(valid => {
        if(valid) {
          var val = this.dialogForm;
          val.startTime = "";
          val.stopTime = "";
          val.status = this.taskStatusList.find(v => v.isDefault === 'Y').dictKey
          val.taskTag = this.tagBtn.dictKey
          if (null != this.taskTime && '' != this.taskTime) {
            val.startTime = this.taskTime[0];
            val.stopTime = this.taskTime[1];
          }
          this.$emit('submitForm', val)
          this.loading = false
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
