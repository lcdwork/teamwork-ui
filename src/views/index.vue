<template>
  <div class="dashboard-container">
    <span class="my-title-font">欢迎登陆项目管理系统</span>
    <br><br>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-project">
            <svg-icon icon-class="table" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              进行中
            </div>
            <span class="card-panel-num">{{ongoingProjectList.length}}</span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              项目总数
            </div>
            <span class="card-panel-num">{{projectList.length}}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-task">
            <svg-icon icon-class="tab" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              进行中
            </div>
            <span class="card-panel-num">{{ongoingTaskList.length}}</span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              任务总数
            </div>
            <span class="card-panel-num">{{taskList.length}}</span>
          </div>
        </div>
      </el-col>
<!--      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <div class="card-panel" @click="handleSetLineChartData('shoppings')">-->
<!--          <div class="card-panel-icon-wrapper icon-email">-->
<!--            <svg-icon icon-class="email" class-name="card-panel-icon" />-->
<!--          </div>-->
<!--          <div class="card-panel-description">-->
<!--            <div class="card-panel-text">-->
<!--              未读通知-->
<!--            </div>-->
<!--            <count-to :start-val="0" :end-val="26" :duration="3600" class="card-panel-num" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-col>-->
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              未读消息
            </div>
            <span class="card-panel-num">{{unreadNoticeList.length}}</span>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              所有消息
            </div>
            <span class="card-panel-num">{{noticeList.length}}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <span class="my-title-font">正在进行的任务</span>
    <br><br>
<!--    正在进行的任务-->
    <div class="my-mouse-link">
      <el-card v-for="item in taskList" :key="item.taskId" shadow="hover" @click.native="showTask(item)" class="my-card-hover">
        <span class="text item">{{ item.taskName }}</span>
        <div style="float: right;">
          <span style="padding: 3px 10px;font-size: 13px; color: #97a8be">截止时间：{{ item.stopTime }}</span>
<!--          <el-button style="padding: 3px 0" type="text" @click="showTask(item)">查看任务</el-button>-->
        </div>
      </el-card>
    </div>
<!--    查看任务-->
    <view-task-dialog
      :dialogForm="taskInfo"
      :loading="viewTaskLoading"
      :dialogVisible.sync="viewTaskDialog"
      @handleCancel="viewTaskDialog = false"
      @commitTask="commitTask"
      @handleClose="handleViewTaskClose"
      @submitForm="submitViewTaskForm"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'
import viewTaskDialog from '@/views/public/viewTaskDialog'
import { listProjectByUser } from "@/api/project";
import { listTaskByUser, updateUserTaskStatus, updateTask } from "@/api/task"
import { listNotice } from "@/api/notice";
export default {
  name: 'Dashboard',
  components: {
    CountTo,
    viewTaskDialog
  },
  computed: {
    ...mapGetters([
      'loginUserId'
    ]),
  },
  data() {
    return {
      ongoingProjectList: [],
      projectList: [],
      projectParams: {
        status: null,
        userId: null
      },
      ongoingTaskList: [],
      taskList: [],
      taskParams:{
        status: null,
        orderByColumn: undefined,
        taskUserStatus: 2,
        taskUserId: null
      },
      noticeList: [],
      unreadNoticeList: [],
      noticeParams: {
        userId: null,
        readStatus: null
      },
      taskInfo: {},
      viewTaskLoading: false,
      viewTaskDialog: false,
    }
  },
  created() {
    this.getProjectList()
    this.getOngoingProjectList()
    this.getTaskList()
    this.getOngoingTaskList()
    this.getNoticeList()
    this.getUnreadNoticeList()
    // this.sortList.taskUserId = this.loginUserId
    // this.getTaskList(this.sortList)
  },
  methods: {
    paramsReset() {
      this.projectParams = {
        status: null,
        userId: null
      };
      this.taskParams = {
        status: null,
        orderByColumn: undefined,
        taskUserStatus: 2,
        taskUserId: null
      };
      this.noticeParams = {
        userId: null,
        readStatus: null
      };
    },
    getProjectList() {
      this.paramsReset()
      this.projectParams.userId = this.loginUserId
      listProjectByUser(this.projectParams).then(response => {
        this.projectList = response.rows
      }).catch(
      )
    },
    getOngoingProjectList() {
      this.paramsReset()
      this.projectParams.status = 1
      this.projectParams.userId = this.loginUserId
      listProjectByUser(this.projectParams).then(response => {
        this.ongoingProjectList = response.rows
      }).catch(
      )
    },
    getTaskList() {
      this.paramsReset()
      this.taskParams.taskUserId = this.loginUserId
      listTaskByUser(this.taskParams).then(response => {
        this.taskList = response.rows
      })
    },
    getOngoingTaskList() {
      this.paramsReset()
      this.taskParams.status = 1
      this.taskParams.taskUserId = this.loginUserId
      listTaskByUser(this.taskParams).then(response => {
        this.ongoingTaskList = response.rows
      })
    },
    getNoticeList() {
      this.paramsReset()
      this.noticeParams.userId = this.loginUserId
      listNotice(this.noticeParams).then(response => {
        this.noticeList = response.rows;
      });
    },
    getUnreadNoticeList() {
      this.paramsReset()
      this.noticeParams.userId = this.loginUserId
      this.noticeParams.readStatus = 0
      listNotice(this.noticeParams).then(response => {
        this.unreadNoticeList = response.rows;
      });
    },
    showTask(item) {
      this.taskInfo = item
      this.viewTaskDialog = true
    },
    handleSetLineChartData(type) {
      console.log(type)
    },
    handleViewTaskClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.viewTaskDialog = false
          done()
        })
        .catch(_ => {})
    },
    commitTask(item) {
      var info = {
        userId: this.loginUserId,
        taskId: item.taskId,
        taskName: item.taskName,
        projectId: item.projectId,
        projectName: item.projectName,
        status: 3
      }
      this.viewTaskLoading = true
      updateUserTaskStatus(info).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.getList(this.sortList)
          this.viewTaskDialog = false
        } else {
          this.viewTaskLoading = false
          this.msgError(response.msg);
        }
      }).catch(
        this.viewTaskLoading = false
      )
    },
    submitViewTaskForm(val) {
      if(val !== null) {
        this.viewTaskLoading = true
        updateTask(val).then(response => {
          this.viewTaskLoading = true
          if (response.code === 200) {
            this.msgSuccess("编辑成功");
            this.viewTaskDialog = false
          } else {
            this.viewTaskLoading = false
            this.msgError(response.msg);
          }
        }).catch(
          this.viewTaskLoading = false
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.my-card-hover:hover {
  background: #f7f7f7;
}
.my-mouse-link {
  cursor: pointer;
}
.my-title-font {
  margin-left: 20px;
  font-size: 20px;
  font-weight: bold;
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-project {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-task {
        background: #E6A23C;
      }

      .icon-email {
        background: #34bfa3
      }
    }

    .icon-project {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-task {
      color: #E6A23C;
    }

    .icon-email {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
