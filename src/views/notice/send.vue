<template>
  <div>
    <el-container class="app-container">
      <el-row :gutter="20">
        <el-col :span="4" :xs="24">
          <dept-tree ref="tree" :data="deptOptions" @nodeClick="treeNodeFun"></dept-tree>
        </el-col>
        <el-col :span="10" :xs="24">
          <span style="font-size: 18px;">选择接收人员</span>
          <el-divider></el-divider>
          <el-transfer
            filterable
            :props="{key: 'id',label: 'name'}"
            :titles="['部门人员', '通知人员']"
            filter-placeholder="请输入名称"
            v-model="notifyForm.users"
            :data="userList">
          </el-transfer>
        </el-col>
        <el-col :span="10" :xs="24">
          <span style="font-size: 18px;">编辑通知内容</span>
          <el-button type="primary" style="float: right" @click="sendNotify">发送通知</el-button>
          <el-divider></el-divider>
          <el-form ref="form" :model="notifyForm" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="公告标题" prop="noticeTitle">
                  <el-input v-model="notifyForm.noticeTitle" placeholder="请输入公告标题" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="公告类型" prop="noticeType">
                  <el-select v-model="notifyForm.noticeType" placeholder="请选择">
                    <el-option
                      v-for="dict in typeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态">
                  <el-radio-group v-model="notifyForm.status">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容">
                  <!--              <Editor v-model="form.noticeContent" />-->
                  <el-input v-model="notifyForm.noticeContent" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="通知内容" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import deptTree from '@/views/public/deptTree'
export default {
  name: 'Send',
  components: { deptTree },
  data() {
    return {
      // 部门名称
      deptName: null,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" }
        ]
      },
      notifyForm: {
        type: null,
        title: null,
        remark: null,
        users: []
      },
      deptOptions: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      userList: [
        {
          id: 1,
          name: '测试1'
        },
        {
          id: 2,
          name: '测试2'
        },
        {
          id: 3,
          name: '测试3'
        }
      ]
    }
  },
  methods: {
    sendNotify() {
      console.log(this.notifyForm)
    },
    treeNodeFun(data, node, event) {
      console.log(data)
      this.queryParams.deptId = data.id;
      this.getList();
    }
  },
  mounted() {
    //
  }
}
</script>

<style scoped>
/deep/ .el-transfer-panel{
  height: 500px;
}
</style>
