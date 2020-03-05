<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="projectInfo.projectName">
    </el-page-header>
    <br>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <span class="my-title-font">项目人员 · {{ userList.length }}</span><br><br>
        <div class="head-container">
          <el-input
            v-model="userName"
            placeholder="请输入人员名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"/>
        </div>
        <div class="head-container">
          <el-tree
            :data="userList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick">
            <span style="width: 100%;" @mouseenter="treeMouseEnter(data)" @mouseleave="treeMouseLeave(data)" slot-scope="{ node, data }">
              <el-avatar v-if="data.avatar === null || data.avatar === ''" class="user-tree-avatar" style="font-size: 12px">{{ data.nickName }}</el-avatar>
              <el-avatar v-else class="user-tree-avatar" :src="url + data.avatar"/>
              <span class="user-tree-name">{{ data.nickName }}</span>
<!--              <el-link v-show="data.visible" type="primary" class="user-tree-link" :underline="false" @click.stop="goUserGanttPage(data)" icon="el-icon-data-analysis">个人进度</el-link>-->
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="19" :xs="24">
        <span class="my-title-font">任务列表 · {{ taskList.length }}</span>
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
        </task-card-list>
      </el-col>
    </el-row>
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
      // 服务端URL
      url: process.env.VUE_APP_BASE_API,
      // 页面高度
      drawerHeight: null,
      // 人员树
      userName: null,
      // 人员列表
      userList: [],
      // 人员树设置
      defaultProps: {
        children: "children",
        label: "nickName"
      },
      // 操作记录总条数
      total: 0,
      // 任务列表查询条件
      sortList:{
        status: null,
        orderByColumn: undefined,
        projectId: null
      },
      // Loading
      delLoading: false,
      addTaskLoading: false,
      editTaskLoading: false,
      delTaskLoading: false,
      editLoading: false,
      // 组件显示控制
      historyDrawer: false,
      editProDialog: false,
      delTaskDialog: false,
      delProDialog: false,
      newTaskDialog: false,
      editTaskDialog: null,
      // 新建任务对象
      newTaskForm: {
        projectId: null,
        projectName: null,
        taskName: null,
        taskDate: null,
        remark: null
      },
      // 下拉
      taskSort1: [],
      taskSort2: [],
      // 任务信息
      taskInfo: {},
      // 项目信息
      projectInfo: {},
      // 任务列表
      taskList: [],
      // 项目列表
      pojectList: [],
      // 操作记录列表
      activities: [],
      // 操作记录查询条件
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
  watch: {
    userName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.nickName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(item) {
      console.log(item)
      // this.sortList.userId = item.userId
      // this.getList(this.sortList)
    },
    // 鼠标进入事件
    treeMouseEnter(data) {
      this.$set(data, 'visible', true)
    },
    // 鼠标离开事件
    treeMouseLeave(data) {
      this.$set(data, 'visible', false)
    },
    // 跳转人员甘特图
    goUserGanttPage(item) {
      var data = item
      data.projectId = this.projectInfo.projectId
      this.$router.push({ name: 'project_gantt', params: data})
    },
    // 编辑任务
    showTask(item) {
      this.taskInfo = item
      this.editTaskDialog = true
    },
    // 删除任务
    delTaskFun(item) {
      this.taskInfo = item
      this.delTaskDialog = true
    },
    // 返回项目列表
    goBack() {
      this.$router.push('/project/list')
    },
    //页面初始化
    getParams() {
      var routerParams = this.$route.params
      if (routerParams.projectId === null || routerParams.projectId === undefined) {
        this.$message.error('未获取到项目ID，请重新选择项目！')
        this.$router.push('/project/list')
        return
      }
      console.log(routerParams)
      this.projectInfo = routerParams
      this.userList = routerParams.userList
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
    // 获取任务列表
    getTaskList(val) {
      listTask(val).then(response => {
        this.taskList = response.rows
      }).catch(
        this.endLoading()
      )
    },
    // 获取项目列表
    getProjectList() {
      listProject().then(response => {
        this.pojectList = response.rows
      })
    },
    // 获取操作记录列表
    getProjectLogList() {
      getProjectLog(this.activitiesSearch).then(response => {
        this.activities = response.rows
        this.total = response.total;
      })
    },
    // 新建任务初始化
    newTaskFun() {
      this.newTaskForm.projectId = this.projectInfo.projectId
      this.newTaskForm.projectName = this.projectInfo.projectName
      this.newTaskDialog = true
    },
    // 新建任务关闭前
    handleNewTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    // 新建任务提交数据
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
    // 编辑任务关闭前
    handleEditTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    // 编辑任务提交
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
    // 删除任务关闭前
    handleDelTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.delTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    // 删除任务提交
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
    // 编辑项目关闭前
    handleEditProjectClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editProDialog = false
          done()
        })
        .catch(_ => {})
    },
    // 编辑项目提交
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
    // 下拉更改
    sort1Command(val) {
      if (val.dictKey === 0) {
        val.dictKey = null
      }
      this.sortList.status = val.dictKey
      this.getTaskList(this.sortList)
    },
    // 下拉更改
    sort2Command(val) {
      this.sortList.orderByColumn = val.dictValue
      this.getTaskList(this.sortList)
    },
    // 操作历史窗口
    historyWindow() {
      this.historyDrawer = true
    },
    // 下拉选择
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
          this.$router.push({ name: 'project_gantt', params: this.projectInfo})
          break
        case 'history':
          this.historyWindow()
          break
      }
    },
    // 项目删除提交
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
    // 操作历史窗口关闭
    handleHistoryClose() {
      this.historyDrawer = false
    },
    // 加载中
    startLoading() {
      mainLoading = this.$loading({
        lock: true,
        // text: "Loading...",
        target: document.querySelector('.app-main')//设置加载动画区域
      });
    },
    // 关闭加载状态
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
.my-title-font {
  font-size: 18px;
  font-weight: bold;
}
.user-tree-avatar {
  margin-bottom: -5px;
}
.user-tree-name {
  padding: 10px;
  top: -9px;
  font-size: 15px;
  color: #606266;
  position: relative;
}
.user-tree-link {
  float: right;
  font-size: 13px;
  padding: 12px;
}
/deep/ .pagination-container .el-pagination{
  position: relative;
}
/deep/ .el-tree-node__content {
  display: flex;
  align-items: center;
  height: 50px;
  cursor: pointer;
}
</style>
