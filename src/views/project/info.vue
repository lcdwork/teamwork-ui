<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="projectInfo.projectName">
    </el-page-header>
    <div style="float: right;">
      <sort-task :sort1List="taskSort1" :sort2List="taskSort2" @sort1Command="sort1Command" @sort2Command="sort2Command"></sort-task>
      <el-dropdown @command="projectCommand">
        <span class="el-dropdown-link">项目管理<i class="el-icon-arrow-down el-icon--right"/></span>
        <el-dropdown-menu align="center">
          <el-dropdown-item command="add"> 新建任务</el-dropdown-item>
          <el-dropdown-item command="edit"> 编辑项目</el-dropdown-item>
          <el-dropdown-item command="history"> 操作记录</el-dropdown-item>
          <el-dropdown-item style="color: #F56C6C" command="del" divided> 删除项目</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <br><br>
    <task-card-list :taskList="taskList" @showTask="showTask">
      <el-link type="danger" :underline="false" slot-scope="val" style="float: right; font-size: 13px" @click.stop="delTaskFun(val.data)">删除任务</el-link>
      <!--        <el-button slot="taskCardListSlot" slot-scope="iv-tem" style="float: right; font-size: 13px">{{item.taskName}}</el-button>-->
      <!--        <template scope="val">-->
      <!--          {{val.data.taskName}}-->
      <!--        </template>-->
    </task-card-list>
<!--    新增任务-->
    <new-task-dialog
      :loading="addTaskLoading"
      :projectList="pojectList"
      :dialogVisible.sync="newTaskDialog"
      @handleCancel="newTaskDialog = false"
      @handleClose="handleNewTaskClose"
      @submitForm="submitNewTaskForm"/>
<!--    编辑任务-->
    <edit-task-dialog
      :dialogForm="taskInfo"
      :loading="editTaskLoading"
      :dialogVisible.sync="editTaskDialog"
      @handleCancel="editTaskDialog = false"
      @handleClose="handleEditTaskClose"
      @submitForm="submitEditTaskForm"/>
<!--    删除任务-->
    <del-task-dialog
      :loading="delTaskLoading"
      :dialogVisible.sync="delTaskDialog"
      @handleCancel="delTaskDialog = false"
      @handleClose="handleDelTaskClose"
      @submitForm="submitDelTaskForm"/>
    <el-dialog title="删除项目" :visible.sync="delProjectDialog" width="30%" :before-close="handleNewTaskClose">
      <span>确认删除项目？此操作不可逆！</span>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="delLoading" @click="delProjectDialog = false">取 消</el-button>
        <el-button type="danger" @click="submitProjectDelForm" :loading="delLoading">{{ delLoading ? '提交中 ...' : '删 除' }}</el-button>
      </span>
    </el-dialog>
    <new-project-dialog
      :loading="editLoading"
      :dialogForm="editProjectInfo"
      dialogTitle="编辑项目"
      :dialogVisible.sync="editProjectDialog"
      @handleCancel="editProjectDialog = false"
      @handleClose="handleEditProjectClose"
      @submitForm="submitEditProjectForm"/>
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
import { updateProject, delProject } from "@/api/project";
import { addTask, delTask, listTask } from "@/api/task"
import { listProject } from "@/api/project";
let mainLoading
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
      taskInfo: {},
      delLoading: false,
      addTaskLoading: false,
      editTaskLoading: false,
      delTaskLoading: false,
      editLoading: false,
      currentPage: 10,
      drawerHeight: null,
      historyDrawer: false,
      editProjectDialog: false,
      delTaskDialog: false,
      delProjectDialog: false,
      projectInfo: {},
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
      taskSort1: [],
      taskSort2: [],
      taskList: [],
      pojectList: [],
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
    this.getTaskList()
    this.getProjectList()
    this.getDicts("task_sort_status").then(response => {
      this.taskSort1 = response.data;
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    showTask(val) {
      this.taskInfo = val
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
        this.$router.push('/project/list')
        return
      }
      this.projectInfo = routerParams
    },
    getTaskList() {
      this.startLoading()
      listTask().then(response => {
        this.endLoading()
        this.taskList = response.rows
      }).catch(
        this.endLoading()
      )
    },
    getProjectList() {
      listProject().then(response => {
        this.pojectList = response.rows
      })
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
    handleEditTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditTaskForm(val) {

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
      this.delTaskLoading = true
      delTask(val).then(response => {
        this.delTaskLoading = false
        if (response.code === 200) {
          this.msgSuccess("删除成功");
          this.getTaskList()
          this.delTaskDialog = false
        } else {
          this.msgError(response.msg);
        }
      }).catch(
        this.delTaskLoading = false
      )
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
      this.editLoading = true
      updateProject(val).then(response => {
        this.editLoading = false
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.editProjectDialog = false
        } else {
          this.msgError(response.msg);
        }
      }).catch(
        this.editLoading = false
      )
    },
    sort1Command(val) {
      console.log(val)
    },
    sort2Command(val) {
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
      var obj = this.projectInfo
      // this.$delete(obj,'projectName')
      var date = [obj.startDate, obj.endDate]
      delete obj.startDate, obj.endDate
      obj.dialogDate = date
      this.editProjectInfo = obj
      this.editProjectDialog = true
    },
    submitProjectDelForm() {
      this.delLoading = true
      delProject(this.projectInfo.projectId).then(response => {
        this.delLoading = false
        if (response.code === 200) {
          // this.$notify({
          //   title: '删除成功',
          //   message: '项目已被删除',
          //   type: 'success'
          // })
          this.msgSuccess("删除成功");
          this.$router.push('/project/list')
        } else {
          // this.$notify({
          //   title: '删除失败',
          //   message: response.msg,
          //   type: 'danger'
          // })
          this.msgError("删除失败");
        }
      }).catch(
        this.delLoading = false
      )
      // this.delLoading = true
      // setTimeout(() => {
      //   this.delLoading = false
      //   this.$message.error('连接超时！')
      // }, 2000)
    },
    handleHistoryClose() {
      this.historyDrawer = false
    },
    startLoading() {
      mainLoading = this.$loading({
        lock: true,
        // text: "Loading...",
        target: document.querySelector('.app-main')//设置加载动画区域
      });
    },
    endLoading() {
      mainLoading.close()
    },
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
