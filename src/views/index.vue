<template>
  <div class="dashboard-container">
    <span class="my-title-font">{{ name }}，欢迎登陆项目管理系统</span>
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
      <el-card v-for="item in taskList" :key="item.id" shadow="hover" @click.native="showTask(item)" class="my-card-hover">
        <span class="text item">{{ item.taskName }}</span>
        <div style="float: right;">
          <span style="padding: 3px 10px;font-size: 13px; color: #97a8be">{{ item.taskTime }}</span>
<!--          <el-button style="padding: 3px 0" type="text" @click="showTask(item)">查看任务</el-button>-->
        </div>
      </el-card>
    </div>
<!--    新建任务-->
    <new-task-dialog :projectList="allPojectList" :dialogVisible.sync="newTaskDialog" @handleCancel="newTaskDialog = false" @handleClose="handleNewTaskClose" @submitForm="submitNewTaskForm"></new-task-dialog>
<!--    新建项目-->
    <new-project-dialog :dialogVisible.sync="newProjectDialog" @handleCancel="newProjectDialog = false" @handleClose="handleNewProClose" @submitForm="submitNewProForm"></new-project-dialog>
<!--    查看任务-->
    <edit-task-dialog :dialogVisible.sync="editTaskDialog" @handleCancel="editTaskDialog = false" @handleClose="handleEditTaskClose" @submitForm="submitEditTaskForm"></edit-task-dialog>
  </div>
</template>

<script>
import newTaskDialog from '@/views/public/newTaskDialog'
import newProjectDialog from '@/views/public/newProjectDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  components: {
    newTaskDialog,
    newProjectDialog,
    editTaskDialog
  },
  data() {
    return {
      newTaskDialog: false,
      editTaskDialog: false,
      newProjectDialog: false,
      taskList: [
        {
          id: 1,
          taskName: '新增任务模块待完成',
          taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
        },
        {
          id: 2,
          taskName: '任务管理系统对接后台',
          taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
        },
        {
          id: 3,
          taskName: '前端路由配置',
          taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
        }
      ],
      allPojectList: [
        {
          id: 1,
          value: '测试项目1'
        },
        {
          id: 2,
          value: '测试项目2'
        },
        {
          id: 3,
          value: '测试项目3'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    showTask(item) {
      console.log(item)
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
      console.log(val)
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
      console.log(val)
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
      console.log(val)
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
