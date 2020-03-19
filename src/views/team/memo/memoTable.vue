<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="标题" prop="memoTitle">
        <el-input
          v-model="queryParams.memoTitle"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="getMemoList"
        />
      </el-form-item>
      <el-form-item label="内容" prop="memoContent">
        <el-input
          v-model="queryParams.memoContent"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="getMemoList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getMemoList">搜索</el-button>
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="multiple"
          @click="handleConvert"
        >转成待办任务</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="memoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="memoId" width="100" />
      <el-table-column
        label="标题"
        align="center"
        prop="memoTitle"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="内容" align="center" prop="memoContent" :show-overflow-tooltip="true" />
      <el-table-column label="创建者" align="center" prop="createBy" width="100" />
      <el-table-column label="备忘录时间" align="center" prop="createTime" width="100">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.memoTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="780px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题" prop="memoTitle">
              <el-input v-model="form.memoTitle" placeholder="请输入标题" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="memoContent">
              <!--                <Editor v-model="form.memoContent" />-->
              <el-input v-model="form.memoContent" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="convertTitle" :visible.sync="openConvert" width="780px">
      <el-form ref="convertForm" :model="convertForm" :rules="convertRules" label-width="80px">
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="convertForm.projectId" placeholder="所属项目" @change="proUsers" clearable size="small">
            <el-option
              v-for="item in projectList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="taskTime">
          <el-date-picker
            v-model="taskTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="设置开始时间"
            end-placeholder="设置结束时间"
            align="left" />
        </el-form-item>
        <el-form-item label="任务人员">
          <el-popover v-for="item in convertForm.userList" :key="item.userId" placement="bottom-start" :title="item.nickName" width="200" trigger="hover">
            <span>联系方式：{{ item.phonenumber }}</span>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="small" @click="removeUser(item)">移除</el-button>
            </div>
            <el-avatar v-if="item.avatar === null || item.avatar === ''" slot="reference" style="margin: 0 5px -15px 0;font-size: 12px">{{ item.nickName }}</el-avatar>
            <el-avatar v-else slot="reference" style="margin: 0 5px -15px 0" :src="url + item.avatar" />
          </el-popover>
          <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
            <el-card v-for="item in userList" :key="item.userId" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
              <el-avatar v-if="item.avatar === null || item.avatar === ''" style="margin-bottom: -5px;font-size: 12px">{{ item.nickName }}</el-avatar>
              <el-avatar v-else style="margin-bottom: -5px;" :src="url + item.avatar"/>
              <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.nickName }}</span>
            </el-card>
            <el-button slot="reference" icon="el-icon-plus" circle @click="userPopover = true"/>
          </el-popover>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="convertSubmitForm">确 定</el-button>
        <el-button @click="convertCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMemo, addMemo, updateMemo, delMemo } from "@/api/memo";
import { listUserByProject } from "@/api/system/user";
import { listProjectByUser } from "@/api/project";
import { convertMemo } from "@/api/task";
import {mapGetters} from "vuex";
  export default {
    name: "memoTable",
    computed: {
      ...mapGetters([
        'loginUserId'
      ]),
    },
    data() {
      return {
        url: process.env.VUE_APP_BASE_API,
        calendarDate: new Date(),
        loading: false,
        queryParams: {
          memoTitle: null,
          memoContent: null,
          createUserId: null
        },
        // 非多选禁用
        multiple: true,
        memoList: [],
        open: false,
        title: null,
        form: {
          memoId: undefined,
          memoTitle: null,
          memoContent: null,
          status: null
        },
        // 表单校验
        rules: {
          memoTitle: [
            { required: true, message: "标题不能为空", trigger: "blur" }
          ],
          memoContent: [
            { required: true, message: "内容不能为空", trigger: "blur" }
          ]
        },
        calendarDate: new Date(),
        selectDate: [],
        selectDom:[],
        convertTitle: null,
        openConvert: false,
        userList: [],
        convertForm: {
          projectId: null,
          userList: []
        },
        convertRules: {
          projectId: [
            { required: true, message: "请选择所属项目", trigger: ["blur", 'change'] }
          ],
        },
        convertMemoList: [],
        ProjectListParams:{
          userId: null
        },
        getProjectUser: {
          projectId: null,
        },
        projectList: [],
        taskTime: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        userPopover: false,
      }
    },
    created() {
      this.getMemoList()
    },
    methods: {
      // 查询
      getMemoList() {
        this.queryParams.createUserId = this.loginUserId
        getMemo(this.queryParams).then(res => {
          this.memoList = res.rows
        })
      },
      // 重置
      resetQuery() {
        this.queryParams = {
          memoTitle: null,
          memoContent: null
        }

      },
      // 新增
      handleAdd() {
        this.reset()
        this.open = true
      },
      // 详情
      handleUpdate(row) {
        this.open = true
        this.form = row
        this.title = "备忘录详情"
      },
      // 删除
      handleDelete(row) {
        var memoIds = {}
        if (row.memoId != null) {
          this.ids = []
          this.ids.push(row.memoId)
        }
        memoIds = this.ids
        this.$confirm('是否确认删除公告编号为"' + memoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMemo(memoIds);
        }).then(() => {
          this.getMemoList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.memoId)
        this.multiple = !selection.length
        this.convertMemoList = selection.map(item =>item)
        console.log(this.convertMemoList)
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.memoId != undefined) {
              updateMemo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getMemoList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addMemo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getMemoList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          memoId: null,
          memoTitle: null,
          memoContent: null,
          status: null
        };
        this.resetForm("form");
      },
      handleConvert() {
        this.openConvert = true
        this.getProjectList()
      },
      getProjectList() {
        this.ProjectListParams.userId = this.loginUserId
        listProjectByUser(this.ProjectListParams).then(response => {
          this.projectList = response.rows
        })
      },
      proUsers() {
        this.getProjectUser.projectId = this.convertForm.projectId
        listUserByProject(this.getProjectUser).then(response => {
          var list = response.rows
          if (this.convertForm.userList === undefined || this.convertForm.userList === null) {
            this.convertForm.userList.forEach((item) => {
              list = list.filter(t => t.userId != item.userId)
            })
          }
          this.userList = list
        })
      },
      convertSubmitForm() {
        this.$refs["convertForm"].validate(valid => {
          if(valid) {
            var val = this.convertForm;
            val.startTime = "";
            val.stopTime = "";
            val.convertMemoList = this.convertMemoList
            if (null != this.taskTime && '' != this.taskTime) {
              val.startTime = this.taskTime[0];
              val.stopTime = this.taskTime[1];
              console.log(val)
            }
            convertMemo(val).then(res => {
              console.log(res)
              this.openConvert = false
              this.getMemoList()
            })
          }
        })
      },
      convertCancel() {
        this.openConvert = false
      },
      removeUser(item) {
        this.convertForm.userList = this.convertForm.userList.filter(t => t.userId != item.userId)
        this.userList.push(item)
      },
      chooseUser(item) {
        this.userPopover = false
        if(this.convertForm.userList.filter(t => t.userId == item.userId).length > 0) {
          this.$notify({
            title: '添加失败',
            message: '不允许重复添加同一人员',
            type: 'danger'
          })
        } else {
          this.convertForm.userList.push(item)
          this.userList = this.userList.filter(t => t.userId != item.userId)
        }
      },
    }
  }
</script>

<style scoped>

</style>
