<template>
  <div class="app-container">
    <span class="my-title-font">项目管理 · {{projectList.length}}</span>
    <div style="float: right;">
      <sort-task :sort1List="taskSort1" :sort2List="taskSort2" @sort1Command="sort1Command" @sort2Command="sort2Command"></sort-task>
      <el-button type="primary" size="small" style="margin-right: 20px" @click="newProDialog = true">新建</el-button>
    </div>
    <br><br>
    <new-pro-dialog
      :loading="addLoading"
      :dialogVisible.sync="newProDialog"
      @handleCancel="newProDialog = false"
      @handleClose="handleClose"
      @submitForm="submitForm"/>
    <el-col v-for="item in projectList" :key="item.id" style="width: 300px;margin-top: 20px">
      <el-card class="box-card" style="margin-left: 20px; height: 180px">
        <div slot="header" class="clearfix">
          <span>{{ item.projectName }}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="projectInfo(item)">项目信息</el-button>
        </div>
        <div class="text item">{{ item.remark }}</div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import sortTask from '@/views/public/sortTask'
import newProDialog from '@/views/public/newProDialog'
import { addProject, listProject } from "@/api/project";
let mainLoading
export default {
  name: 'index',
  components: {
    sortTask,
    newProDialog
  },
  data() {
    return {
      sortList:{
        status: null,
        orderByColumn: undefined
      },
      addLoading: false,
      newProDialog: false,
      projectList: [],
      taskSort1: [],
      taskSort2: []
    }
  },
  created() {
    this.getDicts("project_sort_status").then(response => {
      this.taskSort1 = response.data;
    });
    this.getDicts("project_sort_time").then(response => {
      this.taskSort2 = response.data;
    });
    this.startLoading()
    this.getList(null)
    this.endLoading()
  },
  methods: {
    getList(val) {
      listProject(val).then(response => {
        this.projectList = response.rows
      }).catch(
        this.endLoading()
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
      this.sortList.orderByColumn = val.dictValue
      this.getList(this.sortList)
    },
    submitForm(val) {
      if(val !== null) {
        this.addLoading = true
        addProject(val).then(response => {
          this.addLoading = false
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.getList(this.sortList)
            this.newProDialog = false
          } else {
            this.msgError(response.msg);
          }
        }).catch(
          this.addLoading = false
        )
      }
    },
    projectInfo(item) {
      // this.$router.push({ path: '/manage/projectInfo', params: { projectId: item.id }});
      this.$router.push({ name: 'project_info', params: item})
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newProDialog = false
          done()
        })
        .catch(_ => {})
    },
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
