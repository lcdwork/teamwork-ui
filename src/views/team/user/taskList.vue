<template>
  <div class="app-container">
    <el-page-header @back="goBack"/><br>
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

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <el-table-column label="所属项目" align="center" prop="projectName" />
      <el-table-column label="任务标签" align="center" prop="taskTag">
        <template slot-scope="scope">
          <el-tag
            effect="plain"
            size="mini"
            :type="scope.row.taskTag === undefined ? '' : tagOptions.find(v => v.dictKey === scope.row.taskTag).listClass">
            {{tagOptions.find(v => v.dictKey === scope.row.taskTag).dictLabel}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="开始时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.stopTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>
  </div>
</template>

<script>
import { listTaskByUser } from "@/api/task";

export default {
  name: "taskList",
  data() {
    return {
      dateRange: [],
      loading: true,
      total: 0,
      dataList: [],
      open: false,
      statusOptions: [],
      tagOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskName: undefined,
        taskTag: undefined,
        userId: undefined,
        status: undefined
      }
    }
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    this.queryParams.userId = userId
    this.getDicts("task_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("task_tag").then(response => {
      this.tagOptions = response.data;
    });
    this.getList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getList() {
      this.loading = true;
      listTaskByUser(this.queryParams).then(response => {
        this.dataList = response.rows
        this.total = response.total;
        this.loading = false;
      }).catch(
        this.loading = false
      )
    },
    statusFormat(row, column) {
      return this.statusOptions.find(v => v.dictKey === row.status).dictLabel
      // return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      var val = this.queryParams;
      val.startTime = "";
      val.stopTime = "";
      if (null != this.dateRange && '' != this.dateRange) {
        val.startTime = this.dateRange[0];
        val.stopTime = this.dateRange[1];
      }
      this.queryParams = val
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    }
  }
};
</script>
