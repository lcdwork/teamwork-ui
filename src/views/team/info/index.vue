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
          <el-dropdown-item command="status"> 项目进度</el-dropdown-item>
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
      :dialogForm="taskInfo"
      :dialogVisible.sync="delTaskDialog"
      @handleCancel="delTaskDialog = false"
      @handleClose="handleDelTaskClose"
      @submitForm="submitDelTaskForm"/>
    <el-dialog title="删除项目" :visible.sync="delProDialog" width="30%" :before-close="handleNewTaskClose">
      <span>确认删除项目？此操作不可逆！</span>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="delLoading" @click="delProDialog = false">取 消</el-button>
        <el-button type="danger" @click="submitProjectDelForm" :loading="delLoading">{{ delLoading ? '提交中 ...' : '删 除' }}</el-button>
      </span>
    </el-dialog>
<!--    编辑项目-->
    <edit-pro-dialog
      :loading="editLoading"
      :dialogForm="projectInfo"
      :dialogVisible.sync="editProDialog"
      @handleCancel="editProDialog = false"
      @handleClose="handleEditProjectClose"
      @submitForm="submitEditProjectForm"/>
    <el-drawer :withHeader="false" :visible.sync="historyDrawer" direction="rtl" :before-close="handleHistoryClose" custom-class="demo-drawer">
      <div class="demo-drawer__content">
        <div class="demo-drawer__header">
          <span style="outline: none;" role="heading" tabindex="0">操作历史</span>
        </div>
        <el-timeline class="demo-drawer__timeline" :style="{'height': drawerHeight + 'px'}">
          <el-timeline-item v-for="activity in activities" :type="activity.type" placement="bottom">
            <el-card :body-style="{padding: '0px'}" shadow="hover">
              <div style="margin-left: 10px">
                <h4>{{activity.content}}</h4>
                <p>{{activity.nickName}} 提交于 {{activity.operateTime}}</p>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="demo-drawer__footer">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="activitiesSearch.pageNum"
            :limit.sync="activitiesSearch.pageSize"
            @pagination="getProjectLogList"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import editProDialog from '@/views/public/editProDialog'
import delTaskDialog from '@/views/public/delTaskDialog'
import newTaskDialog from '@/views/public/newTaskDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import sortTask from '@/views/public/sortTask'
import taskCardList from '@/views/public/taskCardList'
import { updateProject, delProject, getProjectLog } from "@/api/project";
import { addTask, delTask, listTask, updateTask } from "@/api/task"
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
    editProDialog
  },
  data() {
    return {
      total: 0,
      sortList:{
        status: null,
        orderByColumn: undefined,
        projectId: null
      },
      taskInfo: {},
      delLoading: false,
      addTaskLoading: false,
      editTaskLoading: false,
      delTaskLoading: false,
      editLoading: false,
      currentPage: 10,
      drawerHeight: null,
      historyDrawer: false,
      editProDialog: false,
      delTaskDialog: false,
      delProDialog: false,
      projectInfo: {},
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
      activities: [],
      activitiesSearch: {
        pageNum: 1,
        pageSize: 10,
        projectId: null
      }
    }
  },
  created() {
    this.getDicts("task_sort_status").then(response => {
      this.taskSort1 = response.data;
      this.getParams()
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
    this.getProjectList()
  },
  methods: {
    showTask(item) {
      this.taskInfo = item
      this.editTaskDialog = true
    },
    delTaskFun(item) {
      this.taskInfo = item
      this.delTaskDialog = true
    },
    goBack() {
      this.$router.push('/team/list')
    },
    getParams() {
      var routerParams = this.$route.params
      if (routerParams.projectId === null || routerParams.projectId === undefined) {
        this.$message.error('未获取到项目ID，请重新选择项目！')
        this.$router.push('/team/list')
        return
      }
      this.projectInfo = routerParams
      this.sortList.projectId = this.projectInfo.projectId
      var status = this.taskSort1.find(v => v.isDefault === 'Y').dictKey
      if (status === 0) {
        status = null
      }
      this.sortList.status = status
      this.startLoading()
      this.getTaskList(this.sortList)
      this.endLoading()
      this.activitiesSearch.projectId = this.projectInfo.projectId
      this.getProjectLogList()
    },
    getTaskList(val) {
      listTask(val).then(response => {
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
    getProjectLogList() {
      getProjectLog(this.activitiesSearch).then(response => {
        this.activities = response.rows
        this.total = response.total;
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
      if(val !== null) {
        this.addTaskLoading = true
        addTask(val).then(response => {
          this.addTaskLoading = true
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.getTaskList(this.sortList)
            this.newTaskDialog = false
          } else {
            this.addTaskLoading = false
            this.msgError(response.msg);
          }
        }).catch(
          this.addTaskLoading = false
        )
      }
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
      if(val !== null) {
        this.editTaskLoading = true
        updateTask(val).then(response => {
          this.editTaskLoading = true
          if (response.code === 200) {
            this.msgSuccess("编辑成功");
            this.getTaskList(this.sortList)
            this.editTaskDialog = false
          } else {
            this.editTaskLoading = false
            this.msgError(response.msg);
          }
        }).catch(
          this.editTaskLoading = false
        )
      }
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
      this.delTaskLoading = true
      delTask(val).then(response => {
        this.delTaskLoading = false
        if (response.code === 200) {
          this.msgSuccess("删除成功");
          this.getTaskList(this.sortList)
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
          this.editProDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditProjectForm(val) {
      console.log(val)
      if(val !== null) {
        this.editLoading = true
        updateProject(val).then(response => {
          this.editLoading = false
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.editProDialog = false
          } else {
            this.msgError(response.msg);
          }
        }).catch(
          this.editLoading = false
        )
      }
    },
    sort1Command(val) {
      if (val.dictKey === 0) {
        val.dictKey = null
      }
      this.sortList.status = val.dictKey
      this.getTaskList(this.sortList)
    },
    sort2Command(val) {
      this.sortList.orderByColumn = val.dictValue
      this.getTaskList(this.sortList)
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
          this.delProDialog = true
          break
        case 'edit':
          this.editProDialog = true
          break
        case  'status':
          this.$router.push({ name: 'gantt', params: this.projectInfo})
          break
        case 'history':
          this.historyWindow()
          break
      }
    },
    submitProjectDelForm() {
      this.delLoading = true
      delProject(this.projectInfo).then(response => {
        this.delLoading = false
        if (response.code === 200) {
          // this.$notify({
          //   title: '删除成功',
          //   message: '项目已被删除',
          //   type: 'success'
          // })
          this.msgSuccess("删除成功");
          this.$router.push('/team/list')
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
.demo-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 12px;
  padding: 10px 10px 0;
}
.demo-drawer__content{
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}
/*.demo-drawer__timeline{*/
/*  padding-top: 5px;*/
/*  flex: 1;*/
/*  overflow: auto;*/
/*  overflow-x: hidden;*/
/*}*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: lightgray;
}
.demo-drawer__footer{
  display: flex;
}
/deep/ .pagination-container .el-pagination{
  position: relative;
}
</style>
