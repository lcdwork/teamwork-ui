<template>
  <div class="dashboard-container">
    <span class="my-title-font">欢迎登陆项目管理系统</span>
    <br><br>
    <el-row>
<!--      新建任务-->
<!--      <el-col :span="5">-->
      <el-col style="width: 300px">
        <el-card class="box-card" style="margin-left: 20px; height: 180px">
          <div slot="header" class="clearfix">
            <span>任务</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="newTaskDialog = true">新增任务</el-button>
          </div>
          <div class="text item">录入一个任务，设置截止时间，将自己的任务管理起来</div>
        </el-card>
      </el-col>
<!--      新建项目-->
      <el-col style="width: 300px">
        <el-card class="box-card" style="margin-left: 20px; height: 180px">
          <div slot="header" class="clearfix">
            <span>项目</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="newProjectDialog = true">新增项目</el-button>
          </div>
          <div class="text item">录入一个项目，团队协同开发</div>
        </el-card>
      </el-col>
    </el-row>
    <br><br>
    <span class="my-title-font">正在进行的任务</span>
    <br><br>
<!--    正在进行的任务-->
    <div class="my-mouse-link">
      <el-card v-for="item in taskList" :key="item.taskId" shadow="hover" @click.native="showTask(item)" class="my-card-hover">
        <span class="text item">{{ item.taskName }}</span>
        <div style="float: right;">
          <span style="padding: 3px 10px;font-size: 13px; color: #97a8be">{{ item.stopTime }}</span>
<!--          <el-button style="padding: 3px 0" type="text" @click="showTask(item)">查看任务</el-button>-->
        </div>
      </el-card>
    </div>
<!--    新建任务-->
    <new-task-dialog
      :loading="addTaskLoading"
      :projectList="projectList"
      :dialogVisible.sync="newTaskDialog"
      @handleCancel="newTaskDialog = false"
      @handleClose="handleNewTaskClose"
      @submitForm="submitNewTaskForm"/>
<!--    新建项目-->
    <new-project-dialog
      :loading="addProLoading"
      :dialogVisible.sync="newProjectDialog"
      @handleCancel="newProjectDialog = false"
      @handleClose="handleNewProClose"
      @submitForm="submitNewProForm"/>
<!--    查看任务-->
    <edit-task-dialog
      :dialogForm="taskInfo"
      :loading="editTaskLoading"
      :dialogVisible.sync="editTaskDialog"
      @handleCancel="editTaskDialog = false"
      @handleClose="handleEditTaskClose"
      @submitForm="submitEditTaskForm"/>
  </div>
</template>

<script>
let mainLoading
import newTaskDialog from '@/views/public/newTaskDialog'
import newProjectDialog from '@/views/public/newProjectDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import { addProject, listProject } from "@/api/project";
import { addTask, listTask, updateTask } from "@/api/task"
export default {
  name: 'Dashboard',
  components: {
    newTaskDialog,
    newProjectDialog,
    editTaskDialog
  },
  data() {
    return {
      taskInfo: {},
      addProLoading: false,
      addTaskLoading: false,
      editTaskLoading: false,
      newTaskDialog: false,
      editTaskDialog: false,
      newProjectDialog: false,
      taskList: [],
      projectList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      listProject().then(response => {
        this.projectList = response.rows
      }).catch(
      )
    },
    getTaskList() {
      listTask().then(response => {
        this.taskList = response.rows
      }).catch(
      )
    },
    showTask(item) {
      this.taskInfo = item
      this.editTaskDialog = true
    },
    handleNewTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitNewTaskForm(val) {
      this.addTaskLoading = true
      addTask(val).then(response => {
        this.addTaskLoading = true
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.newTaskDialog = false
        } else {
          this.addTaskLoading = false
          this.msgError(response.msg);
        }
      }).catch(
        this.addTaskLoading = false
      )
    },
    handleNewProClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newProjectDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitNewProForm(val) {
      this.addProLoading = true
      addProject(val).then(response => {
        this.addProLoading = false
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.newProjectDialog = false
        } else {
          this.msgError(response.msg);
        }
      }).catch(
        this.addProLoading = false
      )
    },
    handleEditTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditTaskForm(val) {
      this.editTaskLoading = true
      updateTask(val).then(response => {
        this.editTaskLoading = true
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.editTaskDialog = false
        } else {
          this.editTaskLoading = false
          this.msgError(response.msg);
        }
      }).catch(
        this.editTaskLoading = false
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
/*.el-tooltip__popper.is-my-style {*/
/*  background: #303133;*/
/*  color: #FFF;*/
/*  margin-bottom: 24px;*/
/*}*/
.my-card-hover:hover {
  background: #f7f7f7;
}
.my-mouse-link {
  cursor: pointer;
}
.my-title-font {
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>
