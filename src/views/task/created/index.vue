<template>
  <div class="app-container">
    <span class="my-title-font">我创建的·{{ taskNum }}</span>
    <div style="float: right;">
      <sort-task :sort1List="taskSort1" :sort2List="taskSort2" @sort1Command="sort1Command" @sort2Command="sort2Command"></sort-task>
      <el-button type="primary" size="small"  @click="newTaskWindow">新建</el-button>
    </div>
    <br><br>
    <task-card-list :taskList="taskList" @showTask="showTask"></task-card-list>
    <new-task-dialog
      :loading="addTaskLoading"
      :projectList="pojectList"
      :dialogVisible.sync="newTaskDialog"
      @handleCancel="newTaskDialog = false"
      @handleClose="handleClose"
      @submitForm="submitForm"/>
    <edit-task-dialog
      :dialogVisible.sync="editTaskDialog"
      @handleCancel="editTaskDialog = false"
      @handleClose="handleEditClose"
      @submitForm="submitEditForm"/>
  </div>
</template>

<script>
import newTaskDialog from '@/views/public/newTaskDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import sortTask from '@/views/public/sortTask'
import taskCardList from '@/views/public/taskCardList'
import { addTask, listTask } from "@/api/task"
import { listProject } from "@/api/project";
let mainLoading
export default {
  name: 'index',
  components: {
    newTaskDialog,
    editTaskDialog,
    sortTask,
    taskCardList
  },
  data() {
    return {
      taskNum: 0,
      addTaskLoading: false,
      newTaskDialog: false,
      editTaskDialog: false,
      taskData: {
        projectId: null,
        taskName: null,
        users: [],
        taskDate: null,
        remark: null
      },
      taskDialog: false,
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
      pojectList: [],
      taskSort1: [],
      taskSort2: []
    }
  },
  created() {
    this.getList()
    this.getDicts("task_sort_status").then(response => {
      this.taskSort1 = response.data;
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
  },
  methods: {
    getList() {
      listTask().then(response => {
        console.log(response)
      })
    },
    getProjectList() {
      listProject().then(response => {
        this.pojectList = response.rows
        console.log(response)
      })
    },
    newTaskWindow() {
      this.newTaskDialog = true
      this.getProjectList()
      this.getUserList()
    },
    showTask(val) {
      console.log(this.editTaskDialog)
      // console.log(val)
      this.taskData = val
      this.editTaskDialog = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitForm(val) {
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
    handleEditClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditForm(val) {
      console.log(val)
    },
    sort1Command(val) {
      console.log(val)
    },
    sort2Command(val) {
      console.log(val)
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
    }
  },
  mounted() {
    this.startLoading()
    this.endLoading()
  }
}
</script>

<style scoped>
.my-title-font {
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>
