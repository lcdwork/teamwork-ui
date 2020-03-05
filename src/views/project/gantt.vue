<template>
  <div class="app-container">
    <el-page-header @back="goBack" :content="ganttInfo.projectName">
    </el-page-header>
<!--    <div style="float: right;">-->
<!--      <el-dropdown @command="sortCommand">-->
<!--        <span class="el-dropdown-link">{{ sortDropdown.dictLabel }}<i class="el-icon-arrow-down el-icon&#45;&#45;right"/></span>-->
<!--        <el-dropdown-menu align="center">-->
<!--          <el-dropdown-item v-for="item in ganttSort" :key="item.dictKey" :command="item"> {{ item.dictLabel }}</el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
<!--    </div>-->
    <br><br>
    <wlGantt
      :data="treeData"
      :use-real-time="false"
      :use-index-column="false"
      default-expand-all
      :start-date="ganttInfo.startDate"
      :end-date="ganttInfo.endDate">
    </wlGantt>
  </div>
</template>

<script>
import wlGantt from "@/views/public/projectGantt";
import { ganttTree } from "@/api/project";
let mainLoading
export default {
  name: 'Gantt',
  components: {
    wlGantt
  },
  data() {
    return {
      data: [
        {
          id: "1",
          pid: "0",
          name: "主节点",
          startDate: "2019-09-07",
          realStartDate: "2019-09-10",
          endDate: "2019-10-31",
          realEndDate: "2019-10-19",
          children: [
            {
              id: "1-1",
              pid: "1",
              name: "节点1",
              startDate: "2019-09-10",
              endDate: "2019-09-13",
            },
            {
              id: "1-2",
              pid: "1",
              name: "节点2",
              startDate: "2019-09-17",
              endDate: "2019-09-22"
            },
            {
              id: "1-3",
              name: "节点3",
              pid: "1",
              startDate: "2019-09-25",
              endDate: "2019-09-30"
            },
            {
              id: "1-4",
              pid: "1",
              name: "节点4",
              startDate: "2019-10-03",
              endDate: "2019-10-07"
            },
            {
              pid: "1",
              id: "1-5",
              name: "节点5",
              startDate: "2019-10-11",
              endDate: "2019-10-19"
            }
          ]
        }
      ],
      treeData: [],
      ganttInfo: {
        startDate: "",
        endDate: "",
      },
      // sortDropdown: {},
      // ganttSort: [],
    }
  },
  created() {
    // this.getDicts("user_task_status").then(response => {
    //   this.ganttSort = response.data;
    //   this.sortDropdown = this.ganttSort.find(v => v.isDefault === 'Y')
    // });
    this.getParams()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'project_info', params: this.ganttInfo})
    },
    getParams() {
      var routerParams = this.$route.params
      if (routerParams.projectId === null || routerParams.projectId === undefined) {
        this.$message.error('未获取到项目ID，返回上级页面！')
        this.$router.push({ name: 'project_info', params: this.ganttInfo})
        // this.$router.go(-1)
        return
      }
      this.ganttInfo = routerParams
      this.startLoading()
      this.getTreeData(this.ganttInfo)
      this.endLoading()
    },
    getTreeData(val) {
      ganttTree(val).then(response => {
        console.log(response.data)
        this.treeData = response.data
      })
    },
    // sortCommand(command) {
    //   this.sortDropdown = command
    // },
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
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  /*color: #409EFF;*/
}
</style>
