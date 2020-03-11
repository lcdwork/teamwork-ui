<template>
  <div class="app-container">

    <el-page-header @back="goBack">
    </el-page-header>
    <br>
    <wlGantt
      v-show="visible"
      :loading="loading"
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
  import { mapGetters } from 'vuex'
  import wlGantt from "@/views/public/projectGantt"
  import { userGanttTree } from "@/api/project";

  export default {
    name: "Role",
    components: {
      wlGantt
    },
    data() {
      return {
        ganttTreeParams: {
          userId: null,
          deptId: null
        },
        url: process.env.VUE_APP_BASE_API,
        // 是否显示甘特图
        visible: true,
        // 甘特图加载中
        loading: false,
        // 时间
        dateRange: [],
        // 甘特图数据
        treeData: [],
        ganttInfo: {
          startDate: "",
          endDate: ""
        },
      };
    },
    created() {
      this.getParams()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      getParams() {
        const routerParams = this.$route.params
        if (routerParams.userId === null || routerParams.userId === undefined) {
          this.$message.error('未获取到人员ID，返回上级页面！')
          this.$router.go(-1)
          return
        }
        this.ganttTreeParams.userId = routerParams.userId
        this.ganttTreeParams.deptId = routerParams.deptId
        this.getTreeData()
      },
      getTreeData() {
        userGanttTree(this.ganttTreeParams).then(response => {
          this.ganttInfo = response.data
          this.treeData = response.data.list
        })
      },
    }
  };
</script>
