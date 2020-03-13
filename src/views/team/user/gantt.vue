<template>
  <div class="app-container">
    <el-page-header @back="goBack">
    </el-page-header>
    <br>
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="任务名称">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          style="width: 240px"/>
      </el-form-item>
      <el-form-item label="任务时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item label="任务标签" prop="status">
        <el-select v-model="queryParams.taskTag" placeholder="任务标签" clearable size="small">
          <el-option
            v-for="dict in tagOptions"
            :key="dict.dictKey"
            :value="dict.dictKey"
            :label="dict.dictLabel"/>
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="任务状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictKey"
            :value="dict.dictKey"
            :label="dict.dictLabel"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <wlGantt
      v-show="visible"
      :loading="loading"
      :data="ganttInfo.list"
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
import { ganttTree } from "@/api/task";

export default {
  name: "Role",
  components: {
    wlGantt
  },
  data() {
    return {
      defaultUserId: null,
      statusOptions: [],
      tagOptions: [],
      dateRange: [],
      statusOptions: [],
      tagOptions: [],
      queryParams: {
        taskName: undefined,
        taskTag: undefined,
        taskUserId: undefined,
        status: undefined
      },
      // 是否显示甘特图
      visible: true,
      // 甘特图加载中
      loading: false,
      // 时间
      dateRange: [],
      // 甘特图数据
      ganttInfo: {
        startDate: "",
        endDate: ""
      },
    };
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    this.queryParams.taskUserId = userId
    this.defaultUserId = userId
    this.getDicts("task_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("task_tag").then(response => {
      this.tagOptions = response.data;
    });
    this.getTreeData()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getTreeData() {
      ganttTree(this.queryParams).then(response => {
        this.ganttInfo = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      var val = this.queryParams;
      val.startTime = "";
      val.stopTime = "";
      if (null != this.dateRange && '' != this.dateRange) {
        val.startTime = this.dateRange[0];
        val.stopTime = this.dateRange[1];
      }
      this.queryParams = val
      this.getTreeData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.userId = this.defaultUserId
      this.handleQuery();
    }
  }
};
</script>
