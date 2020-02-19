<template>
  <div class="app-container">
    <span class="my-title-font">项目管理·{{projectList.length}}</span>
    <div style="float: right;">
      <sort-task @statusCommand="statusCommand" @sortCommand="sortCommand"></sort-task>
      <el-button type="primary" size="small" style="margin-right: 20px" @click="newProjectDialog = true">新建</el-button>
    </div>
    <br><br>
    <new-project-dialog :dialogVisible.sync="newProjectDialog" @handleCancel="newProjectDialog = false" @handleClose="handleClose" @submitForm="submitForm"></new-project-dialog>
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
import newProjectDialog from '@/views/public/newProjectDialog'
export default {
  name: 'ProjectManage',
  components: {
    sortTask,
    newProjectDialog
  },
  data() {
    return {
      newProjectDialog: false,
      projectList: [
        {
          id: 1,
          projectName: '测试项目1',
          remark: '此处是任务描述信息'
        },
        {
          id: 2,
          projectName: '测试项目2',
          remark: '此处是任务描述信息'
        },
        {
          id: 3,
          projectName: '测试项目3',
          remark: '此处是任务描述信息'
        }
      ],
    }
  },
  methods: {
    statusCommand(val) {
      console.log(val)
    },
    sortCommand(val) {
      console.log(val)
    },
    submitForm(val) {
      console.log(val)
    },
    projectInfo(item) {
      console.log(item)
      // this.$router.push({ path: '/manage/projectInfo', params: { projectId: item.id }});
      this.$router.push({ name: 'project_info', params: { projectId: item.id, projectName: item.projectName }})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.newProjectDialog = false
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
