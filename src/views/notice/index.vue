<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="消息标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="公告类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictKey"
            :value="dict.dictKey"
            :label="dict.dictLabel"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="readStatus">
        <el-select v-model="queryParams.readStatus" placeholder="消息状态" clearable size="small">
          <el-option
            v-for="dict in readStatusOptions"
            :key="dict.dictKey"
            :value="dict.dictKey"
            :label="dict.dictLabel"
          />
        </el-select>
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
          v-hasPermi="['notice:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['notice:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['notice:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="noticeId" width="100" />
      <el-table-column
        label="消息标题"
        align="center"
        prop="noticeTitle"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="消息类型"
        align="center"
        prop="noticeType"
        :formatter="typeFormat"
        width="100"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="readStatus"
        :formatter="readStatusFormat"
        width="100"
      />
      <el-table-column label="创建者" align="center" prop="createBy" width="100" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['notice:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['notice:remove']"
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

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%">
      <el-container>
        <el-aside width="16%" style="background: #fff;">
          <div class="head-container">
            <el-input
              v-model="projectName"
              placeholder="请输入部门名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"/>
          </div>
          <div class="head-container">
            <el-tree
              :data="projectOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              default-expand-all
              @node-click="handleNodeClick"/>
          </div>
        </el-aside>
        <div style="background-color:#E6E3E3; width:1px;"></div>
        <el-container>
          <el-aside width="40%" style="background: #fff;">
            <div style="height: 360px; margin: -10px -20px 0px -20px;">
              <el-table ref="multipleTable" v-loading="loading" :data="userList" @selection-change="handleUserSelectionChange" v-model="form.userList">
                <el-table-column v-if="editDisable == false" type="selection" width="40" align="center" />
                <el-table-column label="用户编号" align="center" prop="userId" />
                <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
                <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
              </el-table>
            </div>
          </el-aside>
          <div style="background-color:#E6E3E3; width:1px;"></div>
          <el-main>
            <div style="height: 360px; margin: -10px -20px 0px -15px;">
              <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="公告标题" prop="noticeTitle">
                  <el-input :disabled="editDisable" v-model="form.noticeTitle" placeholder="请输入消息标题" />
                </el-form-item>
<!--                <el-form-item label="状态">-->
<!--                  <el-radio-group :disabled="editDisable" v-model="form.readStatus">-->
<!--                    <el-radio-->
<!--                      v-for="dict in statusOptions"-->
<!--                      :key="dict.dictKey"-->
<!--                      :value="dict.dictKey"-->
<!--                      :label="dict.dictKey"-->
<!--                    >{{dict.dictLabel}}</el-radio>-->
<!--                  </el-radio-group>-->
<!--                </el-form-item>-->
                <el-form-item label="内容">
<!--                  <Editor v-model="form.noticeContent" />-->
                  <el-input :disabled="editDisable" v-model="form.noticeContent" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="通知内容" />
                </el-form-item>
              </el-form>
            </div>
          </el-main>
        </el-container>
      </el-container>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listNotice, getNotice, delNotice, delNoticeBatch, addNotice, updateNotice, exportNotice, updateRead } from "@/api/notice";
import { listUserByProject, listUserByTask, listUserByNotice } from "@/api/system/user";
import Editor from '@/components/Editor';
import { treeselect } from "@/api/project";

export default {
  name: "Notice",
  computed: {
    ...mapGetters([
      'loginUserId'
    ]),
  },
  components: {
    Editor
  },
  data() {
    return {
      editDisable: true,
      projectName: null,
      treeselectParams: {
       userId: null
      },
      updateReadParams: {
        userId: null,
        noticeId: null,
        readStatus: null
      },
      editPermit: false,
      showType: false,
      deleteIds: {
        noticeIds: null
      },
      projectOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      queryTreeParams: {
        projectId: null,
        taskId: null,
        noticeId: null,
      },
      // 用户表格数据
      userList: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 消息类型数据字典
      typeOptions: [],
      // 消息状态数据字典
      readStatusOptions:[],
      // 查询参数
      queryParams: {
        userId: this.loginUserId,
        pageNum: 1,
        pageSize: 10,
        noticeTitle: undefined,
        createBy: undefined,
        readStatus: null
      },
      delParams: {
        noticeIds: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        // noticeType: [
        //   { required: true, message: "公告类型不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("user_notice_status").then(response => {
      this.readStatusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  watch: {
    // 根据名称筛选部门树
    projectName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 清除多选
    toggleSelection() {
      if (this.userList) {
        this.userList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    /** 查询项目任务下拉树结构 */
    getTreeselect() {
      this.treeselectParams.userId = this.loginUserId
      treeselect(this.treeselectParams).then(response => {
        this.projectOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.projectId != null) {
        this.queryTreeParams.projectId = data.id;
        this.getUserListByProject()
      }
      if (data.taskId != null) {
        this.queryTreeParams.taskId = data.id;
        this.getUserListByTask()
      }
    },
    /** 查询项目下用户列表 */
    getUserListByProject() {
      this.loading = true;
      listUserByProject(this.queryTreeParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询任务下用户列表 */
    getUserListByTask() {
      this.loading = true;
      listUserByTask(this.queryTreeParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询消息通告已发送人员列表 */
    getUserListByNotice() {
      this.loading = true;
      listUserByNotice(this.queryTreeParams).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 多选框选中数据
    handleUserSelectionChange(selection) {
      this.form.userList = selection.map(item => item.userId);
      // this.ids = selection.map(item => item.userId);
      // this.single = selection.length != 1;
      // this.multiple = !selection.length;
    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 消息类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabelByKey(this.typeOptions, row.noticeType);
    },
    // 公告状态字典翻译
    readStatusFormat(row, column) {
      return this.selectDictLabelByKey(this.readStatusOptions, row.readStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        status: 0
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.editDisable = false
      this.toggleSelection()
      this.reset();
      this.open = true;
      this.getTreeselect();
      this.showType = true;
      this.editPermit = true;
      this.title = "新建消息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editDisable = true
      this.editPermit = false
      if (row.createByUserId == this.loginUserId) {
        this.editPermit = true
      }
      if (row.noticeType === 2) {
        this.showType = true;
        this.getTreeselect();
      }
      this.queryTreeParams.noticeId = row.noticeId
      this.form = row;
      this.open = true;
      this.getUserListByNotice();
      this.title = "消息详情";
      if (row.readStatus === 0) {
        this.updateReadParams.userId = this.loginUserId
        this.updateReadParams.noticeId = row.noticeId
        this.updateReadParams.readStatus = 1
        updateRead(this.updateReadParams).then(res => {
          // console.log(res)
        })
      }
      // this.reset();
      // const noticeId = row.noticeId || this.ids
      // this.queryTreeParams.noticeId = noticeId
      // getNotice(noticeId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.getTreeselect();
      //   this.getUserListByNotice();
      // });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.editPermit === false) {
        this.open = false;
        this.getList();
        return
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId === undefined) {
            addNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            // updateNotice(this.form).then(response => {
            //   if (response.code === 200) {
            //     this.msgSuccess("修改成功");
            //     this.open = false;
            //     this.getList();
            //   } else {
            //     this.msgError(response.msg);
            //   }
            // });
          }
        }
      });
    },
    /** 批量删除按钮操作 */
    handleDeleteBatch() {
      var noticeIds = {}
      noticeIds = this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delNoticeBatch(noticeIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var noticeIds = {}
      if (row.noticeId != null) {
        this.ids = []
        this.ids.push(row.noticeId)
      }
      noticeIds = this.ids
      this.delParams.noticeIds = noticeIds
      var data = this.delParams
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNotice(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  },
  mounted() {
    this.queryParams.userId = this.loginUserId
  }
};
</script>

<style scoped>
/deep/ .el-tree-node__content {
  display: flex;
  align-items: center;
  height: 35px;
  cursor: pointer;
}
</style>
