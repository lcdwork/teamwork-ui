<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="55%">
    <el-form ref="form" :model="dialogForm" :rules="rules" label-width="80px">
      <el-form-item label="项目名称" style="margin-right: 40px" prop="projectName">
        <el-input clearable v-model="dialogForm.projectName" placeholder="项目名称" />
      </el-form-item>
      <el-form-item label="项目状态">
        <el-dropdown trigger="click" @command="statusCommand">
          <span :style="{'color': statusDropdown.cssClass === null ? '#FFFFFF' : statusDropdown.cssClass}" class="status-dropdown">{{statusDropdown.dictLabel}}</span>
          <el-dropdown-menu align="center">
            <el-dropdown-item v-for="item in proStatusList" :key="item.dictKey" :style="{'color': item.cssClass}" :command="item"> {{ item.dictLabel }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="项目时间" prop="dialogDate">
        <el-date-picker
          v-model="dialogDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="设置开始日期"
          end-placeholder="设置结束日期"
          align="left" />
      </el-form-item>
      <el-form-item label="项目人员">
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
      <el-form-item label="项目描述" style="margin-right: 40px">
        <el-input v-model="dialogForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="项目描述" />
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
        return '编辑项目'
      }
    },
    dialogForm: {
      type: Object,
      default() {
        return {
          projectName: null,
          userList: [],
          status: null,
          remark: null
        }
      }
    }
  },
  name: "EditProDialog",
  data() {
    return {
      url: process.env.VUE_APP_BASE_API,
      dialogDate: [],
      userPopover: false,
      userList: [],
      proStatusList: [],
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
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
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
    console.log(process.env.VUE_APP_BASE_API)
    this.getUserList()
    this.getDicts("project_status").then(response => {
      this.proStatusList = response.data;
    })
  },
  watch: {
    dialogVisible(val) {
      if(val === true) {
        this.dialogDate = [this.dialogForm.startDate, this.dialogForm.endDate]
        this.statusDropdown = this.proStatusList.find(v => v.dictKey === this.dialogForm.status)
        this.resetForm("form")
      } else {
        this.userPopover = false
      }
    }
  },
  methods: {
    getUserList() {
      listUser().then(response => {
        var list = response.rows
        if(this.dialogForm.userList === undefined || this.dialogForm.userList === null) {
          this.dialogForm.userList.forEach((item) => {
            list = list.filter(t => t.userId != item.userId)
          })
        }
        this.userList = list
      })
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
      this.$refs["form"].validate(valid => {
        if(valid) {
          var val = this.dialogForm;
          val.startDate = "";
          val.endDate = "";
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
