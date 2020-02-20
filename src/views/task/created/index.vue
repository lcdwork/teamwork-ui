<template>
  <div class="app-container">
    <span class="my-title-font">我创建的·{{ taskNum }}</span>
    <div style="float: right;">
      <sort-task @statusCommand="statusCommand" @sortCommand="sortCommand"></sort-task>
      <el-button type="primary" size="small"  @click="newTaskDialog = true">新建</el-button>
    </div>
    <br><br>
    <task-card-list :taskList="taskList" @showTask="showTask"></task-card-list>
    <new-task-dialog :projectList="allPojectList" :dialogVisible.sync="newTaskDialog" @handleCancel="newTaskDialog = false" @handleClose="handleClose" @submitForm="submitForm"></new-task-dialog>
    <edit-task-dialog :dialogVisible.sync="editTaskDialog" @handleCancel="editTaskDialog = false" @handleClose="handleEditClose" @submitForm="submitEditForm"></edit-task-dialog>
  </div>
</template>

<script>
import newTaskDialog from '@/views/public/newTaskDialog'
import editTaskDialog from '@/views/public/editTaskDialog'
import sortTask from '@/views/public/sortTask'
import taskCardList from '@/views/public/taskCardList'
import { addTask, listTask } from "@/api/task";
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
      newTaskDialog: false,
      editTaskDialog: false,
      taskData: {
        projectId: null,
        taskName: null,
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
  methods: {
    getList() {
      listTask().then(response => {
        console.log(response)
      })
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
      addTask(val).then(response => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          // this.open = false;
        } else {
          this.msgError(response.msg);
        }
      });
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
    statusCommand(val) {
      console.log(val)
    },
    sortCommand(val) {
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
