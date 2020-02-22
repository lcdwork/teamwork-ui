<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <el-form ref="form" :model="dialogForm" label-width="80px">
      <el-form-item label="项目名称">
        <el-input placeholder="项目名称" v-model="dialogForm.projectName" />
      </el-form-item>
      <el-form-item label="计划时间">
        <el-date-picker
          v-model="dialogDate"
          value-format="yyyy-MM-dd"
          type="daterange" align="left"
          unlink-panels range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="projectOptions"/>
      </el-form-item>
      <el-form-item label="项目人员">
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
import { listUser } from "@/api/system/user";
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
    dialogForm: {
      type: Object,
      default () {
        return {
          userList: [],
          projectName: null,
          remark: null
        }
      }
    }
  },
  data() {
    return {
      userList: [],
      dialogDate: [],
      userPopover: false,
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
  created() {
    this.getUserList()
  },
  watch: {
    dialogForm(val) {
      if(val.dialogDate !== undefined && val.dialogDate.length === 2) {
        this.dialogDate = val.dialogDate
      }
    }
  },
  methods: {
    getUserList() {
      listUser().then(response => {
        this.userList = response.rows;
      })
    },
    chooseUser(item) {
      this.userPopover = false
      if(this.dialogForm.userList === undefined) {
        this.dialogForm.userList = []
      }
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
      // TODO 临时解决删除人员不刷新问题
      this.userPopover = true
      this.userPopover = false
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
