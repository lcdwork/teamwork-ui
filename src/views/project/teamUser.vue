<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="用户编号" align="center" prop="userId" />
          <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" prop="dept.deptName" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="details(scope.row)"
                v-hasPermi="['system:user:edit']"
              >详情</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加人员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-tree
              :data="deptOptions"
              :props="defaultProps"
              accordion
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </el-col>
          <el-col :span="12">
            <el-table v-loading="loading" :data="selectUserList" @selection-change="handleUserSelectionChange" v-model="form.selectUserList">
              <el-table-column type="selection" width="40" align="center" />
              <el-table-column label="用户编号" align="center" prop="userId" />
              <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
              <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { teamUserList, listUserByUserId, listUser, addTeamUser, delTeamUser } from "@/api/system/user";
  import { treeselect } from "@/api/system/dept";
  import {mapGetters} from "vuex";
    export default {
      name: "teamUser",
      computed: {
        ...mapGetters([
          'loginUserId',
          'loginUserDept'
        ]),
      },
      data() {
        return {
          // 遮罩层
          loading: true,
          // 总条数
          total: 0,
          ids: [],
          open: false,
          queryParams: {
            userId: null,
            userName: null,
            phonenumber: null,
            pageNum: null,
            pageSize: null
          },
          // 日期范围
          dateRange: [],
          // 非多个禁用
          multiple: true,
          userList: null,
          selectUserList: null,
          form: {
            selectUserList: null
          },
          deptOptions: null,
          defaultProps: {
            children: "children",
            label: "label"
          },
          selectUserParams: {
            userId: null,
            deptId: null
          },
          treeselectParams: {
            userDeptId: null
          },
          queryTreeParams: {

          }
        }
      },
      created() {
        this.getList();
      },
      methods: {
        getList() {
          this.loading = true;
          this.queryParams.userId = this.loginUserId
          teamUserList(this.queryParams).then(response => {
              this.userList = response.rows;
              this.total = response.total;
              this.loading = false;
            }
          );
        },
        /** 搜索按钮操作 */
        handleQuery() {
          this.queryParams.page = 1;
          this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.dateRange = [];
          this.resetForm("queryForm");
          this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
          this.ids = selection.map(item => item.userId);
          // this.single = selection.length != 1;
          this.multiple = !selection.length;
        },
        /** 添加人员操作 */
        handleAdd() {
          this.reset();
          this.open = true
          this.title = "添加人员";
          this.getTreeselect();
          this.getSelectUserList();

        },
        /** 删除人员操作 */
        handleDelete(row) {
          if (row.userId != null) {
            this.ids = []
            this.ids.push(row.userId)
          }
          delTeamUser(this.ids).then(res => {
            this.getList()
          })
        },
        details(item) {
          var data = item
          this.$router.push({ name: 'user_gantt', params: data})
        },

        // 筛选节点
        filterNode(value, data) {
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
          if (data.id != null) {
            this.queryTreeParams.deptId = data.id;
            listUser(this.queryTreeParams).then(res => {
              this.selectUserList = res.rows
            })
          }
        },
        submitForm() {
          addTeamUser(this.form).then(res => {
            this.open = false;
            this.getList();
          })

        },
        // 多选框选中数据
        handleUserSelectionChange(selection) {
          this.form.userIds = selection.map(item => item.userId);
        },
        // 取消按钮
        cancel() {
          this.open = false;
          this.reset();
        },
        // 表单重置
        reset() {
          this.form = {
            selectUserList: undefined
          };
          this.resetForm("form");
        },
        getSelectUserList() {
          this.selectUserParams.userId = this.loginUserId
          this.selectUserParams.deptId = this.loginUserDept
          listUserByUserId(this.selectUserParams).then(response => {
              this.selectUserList = response.rows;
              this.loading = false;
            }
          );
        },
        getTreeselect() {
          this.treeselectParams.userDeptId = this.loginUserDept
          treeselect(this.treeselectParams).then(response => {
              this.deptOptions = response.data;
            }
          );
        }
      }
    }
</script>

<style scoped>

</style>
