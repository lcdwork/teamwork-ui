<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目" prop="roleName">
        <el-select
          v-model="queryParams.projectId"
          placeholder="项目名称"
          clearable
          filterable
          size="small"
          style="width: 240px">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :value="item.projectName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户" prop="roleKey">
        <el-select
          v-model="queryParams.userId"
          placeholder="用户名称"
          clearable
          filterable
          size="small"
          style="width: 240px">
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :value="item.nickName">
            <el-avatar :size="30" v-if="item.avatar === null || item.avatar === ''" style="margin-bottom: -10px;font-size: 11px">{{ item.nickName }}</el-avatar>
            <el-avatar :size="30" v-else style="margin-bottom: -10px;" :src="url + item.avatar"/>
            <span style="float: right;padding-right: 10px;">{{ item.nickName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

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
  import { ganttTree,listProject } from "@/api/project";
  import { listUser } from "@/api/system/user"

  export default {
    name: "Role",
    computed: {
      ...mapGetters([
        'loginUserId',
        'loginUserDept'
      ]),
    },
    components: {
      wlGantt
    },
    data() {
      return {
        url: process.env.VUE_APP_BASE_API,
        // 是否显示甘特图
        visible: true,
        // 甘特图加载中
        loading: false,
        // 任务列表
        projectList: [],
        // 人员列表
        userList: [],
        // 时间
        dateRange: [],
        // 遮罩层
        loading: true,
        // 甘特图数据
        treeData: [],
        ganttInfo: {
          startDate: "",
          endDate: ""
        },
        // 查询参数
        queryParams: {
          userId: undefined,
          projectId: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          roleName: [
            { required: true, message: "角色名称不能为空", trigger: "blur" }
          ],
          roleKey: [
            { required: true, message: "权限字符不能为空", trigger: "blur" }
          ],
          roleSort: [
            { required: true, message: "角色顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      this.getListProject({createUserId: this.loginUserId})
      this.getListUser({deptId: this.loginUserDept})
    },
    methods: {
      getTreeData(val) {
        ganttTree(val).then(response => {
          this.treeData = response.data
        })
      },
      getListProject(val) {
        listProject(val).then(response => {
          console.log(response)
          this.projectList = response.rows
        })
      },
      getListUser(val) {
        listUser(val).then(response => {
          console.log(response)
          this.userList = response.rows
        })
      },
      /** 搜索按钮操作 */
      handleQuery() {
        var val = this.queryParams;
        val.startDate = "";
        val.endDate = "";
        if (null != this.dateRange && '' != this.dateRange) {
          val.startDate = this.dateRange[0];
          val.endDate = this.dateRange[1];
        }
        this.visible = true
        this.queryParams.pageNum = 1;
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      }
    }
  };
</script>
