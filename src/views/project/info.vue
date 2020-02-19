<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="projectInfo.projectName">
    </el-page-header>
    <div style="float: right;">
      <sort-task @statusCommand="statusCommand" @sortCommand="sortCommand"></sort-task>
      <el-dropdown @command="projectCommand">
        <span class="el-dropdown-link">项目管理<i class="el-icon-arrow-down el-icon--right"/></span>
        <el-dropdown-menu align="center">
          <el-dropdown-item command="add"> 新建任务</el-dropdown-item>
          <el-dropdown-item command="edit"> 编辑项目</el-dropdown-item>
          <el-dropdown-item command="history"> 操作记录</el-dropdown-item>
          <el-dropdown-item style="color: #F56C6C" command="del" divided> 删除项目</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--      <el-popover-->
      <!--        placement="bottom"-->
      <!--        width="160"-->
      <!--        v-model="delProject">-->
      <!--        <p>确定删除项目？操作不可逆！</p>-->
      <!--        <div style="text-align: right; margin: 0">-->
      <!--          <el-button type="danger" size="mini" @click="delProjectFun">确定</el-button>-->
      <!--        </div>-->
      <!--        <el-link slot="reference" type="danger" :underline="false" style="margin-right: 10px; font-size: 14px">删除项目</el-link>-->
      <!--      </el-popover>-->
    </div>
    <br><br>
    <task-card-list :taskList="taskList" @showTask="showTask">
      <el-link type="danger" :underline="false" slot-scope="val" style="float: right; font-size: 13px" @click.stop="delTaskFun(val.data)">删除任务</el-link>
      <!--        <el-button slot="taskCardListSlot" slot-scope="iv-tem" style="float: right; font-size: 13px">{{item.taskName}}</el-button>-->
      <!--        <template scope="val">-->
      <!--          {{val.data.taskName}}-->
      <!--        </template>-->
    </task-card-list>
    <new-task-dialog :dialogForm="newTaskForm" :projectList="allPojectList" :dialogVisible.sync="newTaskDialog" @handleCancel="newTaskDialog = false" @handleClose="handleNewTaskClose" @submitForm="submitNewTaskForm"></new-task-dialog>
    <edit-task-dialog :dialogVisible.sync="editTaskDialog" @handleCancel="editTaskDialog = false" @handleClose="handleEditTaskClose" @submitForm="submitEditTaskForm"></edit-task-dialog>
    <del-task-dialog :dialogVisible.sync="delTaskDialog" @handleCancel="delTaskDialog = false" @handleClose="handleDelTaskClose" @submitForm="submitDelTaskForm"></del-task-dialog>
    <el-dialog title="删除项目" :visible.sync="delProjectDialog" width="30%" :before-close="handleNewTaskClose">
      <span>确认删除项目？此操作不可逆！</span>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="delLoading" @click="delProjectDialog = false">取 消</el-button>
        <el-button type="danger" @click="submitProjectDelForm" :loading="delLoading">{{ delLoading ? '提交中 ...' : '删 除' }}</el-button>
      </span>
    </el-dialog>
    <new-project-dialog dialogTitle="编辑项目" :dialogVisible.sync="editProjectDialog" @handleCancel="editProjectDialog = false" @handleClose="handleEditProjectClose" @submitForm="submitEditProjectForm"></new-project-dialog>
    <notify-drawer drawerTitle="操作历史" :drawerVisible="historyDrawer" @handleClose="handleHistoryClose">
      <el-timeline class="demo-drawer__timeline" :style="{'height': drawerHeight + 'px'}">
        <el-timeline-item v-for="activity in activities" :type="activity.type" placement="bottom">
          <el-card :body-style="{padding: '0px'}" shadow="hover">
            <div style="margin-left: 10px">
              <h4>{{activity.content}}</h4>
              <p>{{activity.name}} 提交于 {{activity.timestamp}}</p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </notify-drawer>
  </div>
</template>

<script>
import notifyDrawer from '@/views/public/notifyDrawer'
import newProjectDialog from '@/views/public/newProjectDialog'
import delTaskDialog from '@/views/public/delTaskDialog'
import newTaskDialog from '@/views/public/newTaskDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import sortTask from '@/views/public/sortTask'
import taskCardList from '@/views/public/taskCardList'
export default {
  name: 'ProjectInfo',
  components: {
    editTaskDialog,
    sortTask,
    newTaskDialog,
    taskCardList,
    delTaskDialog,
    newProjectDialog,
    notifyDrawer
  },
  data() {
    return {
      delLoading: false,
      currentPage: 10,
      drawerHeight: null,
      historyDrawer: false,
      editProjectDialog: false,
      delTaskDialog: false,
      delProjectDialog: false,
      projectInfo: {
        projectId: null,
        projectName: null
      },
      editProjectInfo: {},
      newTaskDialog: false,
      editTaskDialog: null,
      newTaskForm: {
        projectId: null,
        projectName: null,
        taskName: null,
        taskDate: null,
        remark: null
      },
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
      ],
      activities: [
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
  created() {
    this.getParams()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    showTask(val) {
      console.log(val)
      this.editTaskDialog = true
    },
    delTaskFun(item) {
      console.log(item)
      this.delTaskDialog = true
    },
    goBack() {
      this.$router.go(-1)
    },
    getParams() {
      var routerParams = this.$route.params
      if (routerParams.projectId === null || routerParams.projectId === undefined) {
        this.$message.error('未获取到项目ID，请重新选择项目！')
        this.$router.push('/manage/projectManage')
        return
      }
      this.projectInfo = routerParams
      console.log(routerParams)
    },
    newTaskFun() {
      this.newTaskForm.projectId = this.projectInfo.projectId
      this.newTaskForm.projectName = this.projectInfo.projectName
      this.newTaskDialog = true
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
    },
    handleDelTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.delTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitDelTaskForm(val) {
      console.log(val)
    },
    handleEditProjectClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editProjectDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditProjectForm(val) {
      console.log(val)
    },
    statusCommand(val) {
      console.log(val)
    },
    sortCommand(val) {
      console.log(val)
    },
    historyWindow() {
      this.historyDrawer = true
    },
    projectCommand(val) {
      switch (val) {
        case 'add':
          this.newTaskFun()
          break
        case 'del':
          this.delProjectDialog = true
          break
        case 'edit':
          this.editProjectWindow()
          break
        case 'history':
          this.historyWindow()
          break
      }
    },
    editProjectWindow() {
      this.editProjectDialog = true
    },
    submitProjectDelForm() {
      // console.log(this.projectInfo)
      // this.delProjectDialog = false
      this.$notify({
        title: '删除成功',
        message: '即将跳转上一级页面',
        type: 'success'
      })
      this.delLoading = true
      setTimeout(() => {
        this.delLoading = false
        this.$message.error('连接超时！')
      }, 2000)
    },
    handleHistoryClose() {
      this.historyDrawer = false
    }
  },
  mounted() {
    this.drawerHeight = window.innerHeight - 150
    window.onresize = () => {
      return (() => {
        this.drawerHeight = window.innerHeight - 150
      })()
    }
  }
  // watch: {
  //   '$route': 'getParams'
  // }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.demo-drawer__timeline{
  padding-top: 5px;
  flex: 1;
  overflow: auto;
  overflow-x: hidden;
}
</style>
