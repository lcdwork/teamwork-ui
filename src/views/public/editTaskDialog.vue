<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="5vh" :before-close="handleClose" width="70%">
    <el-container>
      <el-aside width="55%" style="background: #fff;">
        <el-form ref="form" :model="dialogForm" label-width="80px">
          <el-form-item label="所属项目">
            <span><i class="el-icon-s-order" />{{ dialogForm.projectName }}<i class="el-icon-arrow-down el-icon&#45;&#45;right" /></span>
          </el-form-item>
          <el-form-item label="任务标题" style="margin-right: 40px">
            <el-input v-model="dialogForm.taskName" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="任务标题" />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-dropdown trigger="click" @command="statusCommand">
              <span :style="{'color': statusDropdown.color}" class="status-dropdown">{{statusDropdown.title}}</span>
              <el-dropdown-menu align="center">
                <el-dropdown-item  style="color: #606266" command="ready">待领取</el-dropdown-item>
                <el-dropdown-item  style="color: #409EFF" command="working">开发中</el-dropdown-item>
                <el-dropdown-item  style="color: #67C23A" command="finish">已完成</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="任务时间">
            <el-date-picker v-model="taskTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="设置开始时间" end-placeholder="设置结束时间" align="left" />
          </el-form-item>
          <el-form-item label="任务标签">
            <el-popover v-model="tagBtnPopover" placement="bottom" trigger="click">
              <el-button v-for="item in tagBtnList" :key="item.id" size="small" :type="item.type" plain @click.native="chooseTag(item)">{{item.name}}</el-button>
              <el-button size="small" slot="reference" :type="tagBtn.type" plain>{{tagBtn.name}}</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="任务人员">
            <el-tooltip v-for="item in userIfo" :key="item.id" effect="my-style" :content="item.name" placement="top">
              <el-popover placement="bottom-start" :title="item.name" width="200" trigger="click">
                <span>联系方式：{{ item.phone }}</span>
                <div style="text-align: right; margin: 0">
                  <el-button type="danger" @click="removeUser(item)">移除</el-button>
                </div>
<!--                <el-avatar slot="reference" style="margin: 0 5px -15px 0">{{item.name}}</el-avatar>-->
                <el-avatar slot="reference" style="margin: 0 5px -15px 0" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              </el-popover>
            </el-tooltip>
            <el-popover v-model="userPopover" placement="bottom" width="200" trigger="manual">
              <el-card v-for="item in userIfo" :key="item.id" :body-style="{padding: '3px'}" shadow="hover" class="box-card" @click.native="chooseUser(item)">
                <el-avatar style="margin-bottom: -5px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <span style="float: right; padding: 10px 10px;font-size: 15px; color: #97a8be">{{ item.name }}</span>
              </el-card>
              <el-button slot="reference" icon="el-icon-plus" circle />
            </el-popover>
          </el-form-item>
          <el-form-item label="任务描述" style="margin-right: 40px">
            <el-input v-model="dialogForm.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="需求和描述" />
          </el-form-item>
        </el-form>
      </el-aside>
      <div style="background-color:#E6E3E3; width:1px;"></div>
      <el-main>
        <div style="height: 350px; margin: -10px 0px 0px -40px">
          <el-timeline>
            <el-timeline-item v-for="activity in activities" :type="activity.type" :key="index" placement="bottom">
              <el-card :body-style="{padding: '0px'}" shadow="hover">
                <div style="margin-left: 10px">
                  <h4>{{activity.content}}</h4>
                  <p>{{activity.name}} 提交于 {{activity.timestamp}}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      projectList: {
        type: Array,
        default () {
          return []
        }
      },
      activities: {
        type: Array,
        default () {
          return [
            {
              content: '活动按期开始',
              name: '张三',
              type: 'success',
              timestamp: '2018-04-15'
            }, {
              content: '通过审核',
              name: '张三',
              timestamp: '2018-04-13'
            }, {
              content: '创建成功',
              name: '张三',
              timestamp: '2018-04-11'
            },
            {
              content: '活动按期开始',
              name: '张三',
              type: 'success',
              timestamp: '2018-04-15'
            }, {
              content: '通过审核',
              name: '张三',
              timestamp: '2018-04-13'
            }, {
              content: '创建成功',
              name: '张三',
              timestamp: '2018-04-11'
            }
          ]
        }
      },
      dialogVisible: {
        type: Boolean,
      },
      tagBtn: {
        type: Object,
        default () {
          return {
            id: 2,
            type: 'primary',
            name: '普通任务'
          }
        }
      },
      dialogTitle: {
        type: String,
        default () {
          return '编辑任务'
        }
      },
      statusDropdown: {
        type: Object,
        default () {
          return {
            title: '待领取',
            color: '#606266'
          }
        }
      },
      dialogForm: {
        type: Object,
        default () {
          return {
            projectName: '选择项目',
            projectId: null,
            taskName: null,
            remark: null,
            taskStatus: null
          }
        }
      },
      taskTime: {
        type: Array
      }
    },
    name: "taskDialog",
    data() {
      return {
        tagBtnPopover: false,
        tagBtnList: [
          {
            id: 1,
            type: 'success',
            name: '优化任务'
          },
          {
            id: 2,
            type: 'primary',
            name: '普通任务'
          },
          {
            id: 3,
            type: 'warning',
            name: '优先任务'
          },
          {
            id: 4,
            type: 'danger',
            name: '紧急任务'
          }
        ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    methods: {
      chooseTag(item) {
        this.tagBtnPopover = false
        this.tagBtn = item
      },
      submitForm(val) {
        this.$emit('submitForm',this.dialogForm)
      },
      chooseProject(command) {
        console.log(command)
        this.dialogForm.projectName = command.label
        this.dialogForm.projectId = command.value
      },
      chooseUser(item) {
        this.userPopover = false
        console.log(item)
      },
      handleCancel(){
        this.$emit('handleCancel')
      },
      handleClose(done) {
        this.$emit("handleClose")
      },
      submitForm() {
        var val = this.dialogForm;
        val.startTime = "";
        val.stopTime = "";
        if (null != this.taskTime && '' != this.taskTime) {
          val.startTime = this.taskTime[0];
          val.stopTime = this.taskTime[1];
        }
        this.$emit('submitForm', val)
      },
      statusCommand(val) {
        switch (val) {
          case 'ready':
            this.statusDropdown = {
              title: '待领取',
              color: '#606266'
            }
            break
          case 'working':
            this.statusDropdown = {
              title: '开发中',
              color: '#409EFF'
            }
            break
          case 'finish':
            this.statusDropdown = {
              title: '已完成',
              color: '#67C23A'
            }
            break
        }
      }
    }
  }
</script>

<style scoped>
.el-icon-arrow-down {
  font-size: 12px;
}
.status-dropdown {
  cursor: pointer;
  background: rgba(0, 0, 0, .025);
  border-radius: 5px;
  padding: 8px;
}
.status-dropdown:hover {
  color: #409EFF;
  transition: color 0.3s ease;
}
.status-dropdown:focus {
  outline: none;
}
</style>
