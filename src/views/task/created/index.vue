<template>
  <div class="app-container">
    <span class="my-title-font">我创建的 · {{ taskNum }}</span>
    <div style="float: right;">
      <sort-task :sort1List="taskSort1" :sort2List="taskSort2" @sort1Command="sort1Command" @sort2Command="sort2Command"></sort-task>
      <el-button type="primary" size="small"  @click="newTaskWindow">新建</el-button>
    </div>
    <br><br>
    <task-card-list :taskList="taskList" @showTask="showTask"></task-card-list>
<!--    新建任务-->
    <new-task-dialog
      :loading="addTaskLoading"
      :projectList="pojectList"
      :dialogVisible.sync="newTaskDialog"
      @handleCancel="newTaskDialog = false"
      @handleClose="handleClose"
      @submitForm="submitForm"/>
<!--    编辑任务-->
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
import { listProjectByUser } from "@/api/project";
import {mapGetters} from "vuex";
let mainLoading
export default {
  name: 'index',
  computed: {
    ...mapGetters([
      'loginUserId'
    ]),
  },
  components: {
    newTaskDialog,
    editTaskDialog,
    sortTask,
    taskCardList
  },
  data() {
    return {
      sortList:{
        createUserId: null,
        status: null,
        orderByColumn: undefined
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
      taskSort2: [],
      ProjectListParams:{
        userId: null
      },
    }
  },
  created() {
    this.getDicts("task_sort_status").then(response => {
      this.taskSort1 = response.data;
      var status = this.taskSort1.find(v => v.isDefault === 'Y').dictKey
      if (status === 0) {
        status = null
      }
      this.sortList.status = status
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
    this.sortList.createUserId = this.loginUserId
    this.startLoading()
    this.getList(this.sortList)
    this.endLoading()
  },
  methods: {
    getList(val) {
      listTask(val).then(response => {
        this.taskList = response.rows
        this.taskNum = response.total
      }).catch(
        this.endLoading()
      )
    },
    getProjectList() {
      this.ProjectListParams.userId = this.loginUserId
      listProjectByUser(this.ProjectListParams).then(response => {
        this.pojectList = response.rows
      })
    },
    newTaskWindow() {
      this.newTaskDialog = true
    },
    showTask(item) {
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
      if(val !== null) {
        this.addTaskLoading = true
        addTask(val).then(response => {
          this.addTaskLoading = false
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.getList(this.sortList)
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
    handleEditClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.editTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditForm(val) {
      if(val !== null) {
        this.editTaskLoading = true
        updateTask(val).then(response => {
          this.editTaskLoading = false
          if (response.code === 200) {
            this.msgSuccess("编辑成功");
            this.getList(this.sortList)
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
    sort1Command(val) {
      if (val.dictKey === 0) {
        val.dictKey = null
      }
      this.sortList.status = val.dictKey
      this.getList(this.sortList)
    },
    sort2Command(val) {
      this.sortList.orderByColumn = val.dictValue
      this.getList(this.sortList)
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
