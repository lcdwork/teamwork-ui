<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <span class="my-title-font">所有项目 · {{ pojectList.length }}</span><br><br>
        <div class="head-container">
          <el-input
            v-model="proName"
            placeholder="请输入项目名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"/>
        </div>
        <div class="head-container">
          <el-tree
            :data="pojectList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"/>
        </div>
      </el-col>
      <el-col :span="19" :xs="24">
        <span class="my-title-font">任务列表 · {{ taskList.length }}</span>
        <div style="float: right;">
          <sort-task :sort1List="taskSort1" :sort2List="taskSort2" @sort1Command="sort1Command" @sort2Command="sort2Command"></sort-task>
        </div>
        <br><br>
        <task-card-list :showUserTaskStatus="true" :taskList="taskList" @showTask="showTask"></task-card-list>
      </el-col>
    </el-row>
    <!--    查看任务-->
    <view-task-dialog
      :dialogForm="taskInfo"
      :loading="viewTaskLoading"
      :dialogVisible.sync="viewTaskDialog"
      @handleCancel="viewTaskDialog = false"
      @commitTask="commitTask"
      @handleClose="handleEditClose"
      @submitForm="submitEditForm"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import viewTaskDialog from '@/views/public/viewTaskDialog'
import sortTask from '@/views/public/sortTask'
import taskCardList from '@/views/public/taskCardList'
import { listTaskByUser, updateUserTaskStatus, updateTask } from "@/api/task"
import { listProject } from "@/api/project";
let mainLoading
export default {
  name: 'index',
  computed: {
    ...mapGetters([
      'loginUserId'
    ]),
  },
  components: {
    viewTaskDialog,
    sortTask,
    taskCardList
  },
  data() {
    return {
      sortList:{
        orderByColumn: undefined,
        projectId: null,
        taskUserStatus: null,
        taskUserId: null
      },
      taskInfo: {},
      viewTaskDialog: false,
      viewTaskLoading: false,
      taskList: [],
      pojectList: [],
      taskSort1: [],
      taskSort2: [],
      proName: null,
      defaultProps: {
        children: "children",
        label: "projectName"
      },
    }
  },
  created() {
    this.getProjectList()
    this.sortList.taskUserId = this.loginUserId
    this.getDicts("user_task_status").then(response => {
      this.taskSort1 = response.data;
      this.sortList.taskUserStatus = this.taskSort1.find(v => v.isDefault === 'Y').dictKey
      this.getList(this.sortList)
    });
    this.getDicts("task_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
  },
  watch: {
    proName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.projectName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(item) {
      this.sortList.projectId = item.projectId
      this.getList(this.sortList)
    },
    getList(val) {
      listTaskByUser(val).then(response => {
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
    commitTask(item) {
      var info = {
        userId: this.loginUserId,
        taskId: item.taskId,
        taskName: item.taskName,
        projectId: item.projectId,
        projectName: item.projectName,
        status: 3
      }
      this.viewTaskLoading = true
      updateUserTaskStatus(info).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.getList(this.sortList)
          this.viewTaskDialog = false
        } else {
          this.viewTaskLoading = false
          this.msgError(response.msg);
        }
      }).catch(
        this.viewTaskLoading = false
      )
    },
    showTask(item) {
      this.taskInfo = item
      this.viewTaskDialog = true
    },
    handleEditClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.viewTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    submitEditForm(val) {
      if(val !== null) {
        this.viewTaskLoading = true
        updateTask(val).then(response => {
          this.viewTaskLoading = false
          if (response.code === 200) {
            this.msgSuccess("编辑成功");
            this.getList(this.sortList)
            this.viewTaskDialog = false
          } else {
            this.viewTaskLoading = false
            this.msgError(response.msg);
          }
        }).catch(
          this.viewTaskLoading = false
        )
      }
    },
    sort1Command(val) {
      this.sortList.taskUserStatus = val.dictKey
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
  font-size: 20px;
  font-weight: bold;
}
/deep/ .el-tree-node__content {
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
}
</style>
