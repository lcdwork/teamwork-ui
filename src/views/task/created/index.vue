<template>
  <div class="app-container">
    <span class="my-title-font">我创建的 · {{ taskNum }}</span>
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
      :dialogForm="taskInfo"
      :loading="editTaskLoading"
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
import { addTask, listTask, updateTask } from "@/api/task"
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
      sortList:{
        status: null
      },
      taskInfo: {},
      taskNum: 0,
      addTaskLoading: false,
      editTaskLoading: false,
      newTaskDialog: false,
      editTaskDialog: false,
      taskDialog: false,
      taskList: [],
      pojectList: [],
      taskSort1: [],
      taskSort2: []
    }
  },
  created() {
    this.startLoading()
    this.getList(null)
    this.endLoading()
    this.getDicts("task_sort_status").then(response => {
      this.taskSort1 = response.data;
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
  },
  methods: {
    getList(val) {
      listTask(val).then(response => {
        console.log(response)
        this.taskList = response.rows
        this.taskNum = response.total
      }).catch(
        this.endLoading()
      )
    },
    getProjectList() {
      listProject().then(response => {
        this.pojectList = response.rows
      })
    },
    newTaskWindow() {
      this.newTaskDialog = true
    },
    showTask(item) {
      var date = [item.startTime, item.stopTime]
      delete item.startDate, item.endDate
      item.dialogDate = date
      this.taskInfo = item
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
      this.editTaskLoading = true
      updateTask(val).then(response => {
        this.editTaskLoading = true
        if (response.code === 200) {
          this.msgSuccess("编辑成功");
          this.editTaskDialog = false
        } else {
          this.editTaskLoading = false
          this.msgError(response.msg);
        }
      }).catch(
        this.editTaskLoading = false
      )
    },
    sort1Command(val) {
      if (val.dictKey === 0) {
        val.dictKey = null
      }
      this.sortList.status = val.dictKey
      this.getList(this.sortList)
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
