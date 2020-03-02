<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <el-autocomplete
      popper-class="my-autocomplete"
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入任务名称"
      clearable
      @select="handleSelect">
      <template slot-scope="{ item }">
        <span class="name">{{ item.taskName }}</span><br>
        <span class="addr">{{ item.remark }}</span>
      </template>
    </el-autocomplete>

    <div class="right-menu">

      <!--      <el-tooltip  effect="dark" content="通知" placement="bottom">-->
      <a @click.sync="notifyDrawer = true" class="navbar-icon">
        <el-badge style="position: initial;" :value="notifyNum" :max="99">
          <i class="el-icon-bell"></i>
        </el-badge>
      </a>
      <!--      </el-tooltip>-->
      <!--      <el-tooltip class="item" effect="dark"  content="日历" placement="bottom">-->
      <a @click="calDrawerWindow" class="navbar-icon"><i class="el-icon-date"></i></a>
      <!--      </el-tooltip>-->
      <el-divider class="navbar-center" direction="vertical"></el-divider>

      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!--        <el-tooltip content="布局大小" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <a target="_blank" href="https://element.eleme.cn/#/zh-CN/component/installation">
            <el-dropdown-item>开发文档</el-dropdown-item>
          </a>
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!--          <el-dropdown-item>-->
          <!--            <span @click="setting = true">布局设置</span>-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item divided style="color: #F56C6C">
            <span @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <view-task-dialog
      :dialogForm="taskInfo"
      :loading="viewTaskLoading"
      :dialogVisible.sync="viewTaskDialog"
      @commitTask="commitTask"
      @handleCancel="viewTaskDialog = false"
      @handleClose="handleEditClose"
      @submitForm="submitEditForm"/>
    <el-drawer :withHeader="false" :visible.sync="calDrawer" size="50%" direction="rtl">
      <div class="demo-drawer__header">
        <span style="outline: none;" role="heading" tabindex="0">任务日历</span>
      </div>
      <el-calendar v-model="calendarDate" id="calendar">
        <template slot="dateCell" slot-scope="{date, data}">
          <div>
            <div>{{ data.day.split('-').slice(2).join('-') }}</div><br>
            <div v-for="item in calendarData">
              <div v-if="(item.date).indexOf(data.day)!=-1">
                <el-dropdown trigger="click" @command="taskCommand">
                  <span class="task-dropdown">{{item.taskNum}}个任务进行中</span>
                  <el-dropdown-menu align="center">
                    <el-dropdown-item v-for="task in item.taskList" :key="task.id" :command="task.id"> {{ task.taskName }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </el-drawer>
    <notify-drawer drawerTitle="通知" :drawerVisible="notifyDrawer" @handleClose="handleNotifyClose">
      <div class="demo-drawer__menuBar">
        <el-dropdown trigger="click" class="notify-dropdown" @command="notifyTypeCommand">
          <span class="el-dropdown-link"><i class="el-icon-bell"></i> {{notifyDropdown}}<i class="el-icon-arrow-down el-icon--right"/></span>
          <el-dropdown-menu align="center">
            <el-dropdown-item command="notread"> 查看未读通知</el-dropdown-item>
            <el-dropdown-item command="read"> 查看已读通知</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" class="notify-dropdown" style="float: right" @command="notifyHandleCommand">
          <span class="el-dropdown-link"><i class="el-icon-more"></i></span>
          <el-dropdown-menu align="center">
            <el-dropdown-item command="read">所有通知标记已读</el-dropdown-item>
            <el-dropdown-item command="del"> 删除所有已读通知</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="demo-drawer__timeline" :style="{'height': notifyHeight + 'px'}">
        <el-card class="notify-card" :body-style="{padding: '5px'}" v-for="item in notifyList" :key="item.id" shadow="hover">
          <span class="notify-title"><i class="el-icon-warning-outline"></i>{{ item.notifyType }}</span><br>
          <div class="notify-content">
            <span class="notify-content-info">{{ item.notifyContent }}</span>
            <span class="notify-content-status">未读</span>
          </div>
          <span class="notify-datetime">{{ item.notifyTime}}</span>
        </el-card>
      </div>
    </notify-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import notifyDrawer from '@/views/public/notifyDrawer'
import { listTaskByUser, updateTask, updateUserTaskStatus } from "@/api/task"
import viewTaskDialog from '@/views/public/viewTaskDialog'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    notifyDrawer,
    viewTaskDialog
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'loginUserId'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  data() {
    return {
      taskInfo: {},
      viewTaskLoading: false,
      viewTaskDialog: false,
      // 搜索框
      restaurants: [],
      state: '',
      timeout: null,
      calDrawer: false,
      notifyDrawer: false,
      notifyHeight: null,
      notifyNum: null,
      notifyDropdown: '查看全部通知',
      notifyList: [
        {
          id: 1,
          notifyType: '系统消息',
          notifyContent: '消息内容',
          notifyStatus: '未读',
          notifyTime: '2019/12/31 10:10'
        },
        {
          id: 2,
          notifyType: '系统消息',
          notifyContent: '消息内容',
          notifyStatus: '未读',
          notifyTime: '2019/12/31 10:10'
        },
        {
          id: 3,
          notifyType: '系统消息',
          notifyContent: '消息内容',
          notifyStatus: '未读',
          notifyTime: '2019/12/31 10:10'
        }
      ],
      calendarDate: new Date(),
      calendarData: [
        {
          date: '2020-02-13',
          taskNum: 3,
          taskList: [
            {
              id: 1,
              taskName: '任务测试1'
            },
            {
              id: 2,
              taskName: '任务名称长度测试121212123'
            },
            {
              id: 3,
              taskName: '测试3'
            }
          ]
        },
        {
          date: '2020-02-12',
          taskNum: 2,
          taskList: []
        },
        {
          date: '2020-02-11',
          taskNum: 5,
          taskList: []
        },
        {
          date: '2020-02-10',
          taskNum: 6,
          taskList: []
        }
      ]
    }
  },
  methods: {
    calDrawerWindow() {
      this.calDrawer = true
      this.$nextTick(() => {
        // 点击前一个月
        let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
        prevBtn.addEventListener('click', () => {
          console.log(this.calendarDate)
        })
        let todayBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)')
        todayBtn.addEventListener('click', () => {
          console.log(this.calendarDate)
        })
        // 点击下一个月
        let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)')
        nextBtn.addEventListener('click', () => {
          console.log(this.calendarDate)
        })
      })
    },
    // 搜索框方法
    querySearchAsync(queryString, cb) {
      var param = {
        taskName: queryString,
        taskUserId: this.loginUserId,
        taskUserStatus: 0
      }
      if(queryString !== undefined && queryString !== '') {
        listTaskByUser(param).then(response => {
          cb(response.rows)
        })
      }
    },
    // 搜索框方法
    handleSelect(item) {
      this.taskInfo = item
      this.viewTaskDialog = true
    },
    handleNotifyClose() {
      this.notifyDrawer = false
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleEditClose(done) {
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
    submitEditForm(val) {
      this.viewTaskLoading = true
      updateTask(val).then(response => {
        this.viewTaskLoading = false
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
    },
    intervalFun() {
      this.notifyNum = this.notifyNum + 1
      // this.$notify.info({
      //   title: '通知',
      //   message: '您有一条新的通知',
      //   onClick: function() {
      //     console.log('click')
      //   }
      // })
    },
    notifyTypeCommand(val) {
      switch (val) {
        case 'notread':
          // this.newTaskFun()
          break
        case 'read':
          // this.delProjectDialog = true
          break
      }
    },
    notifyHandleCommand(val) {
      switch (val) {
        case 'read':
          // this.newTaskFun()
          break
        case 'del':
          // this.delProjectDialog = true
          break
      }
    },
    taskCommand(val) {
      console.log(val)
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    }
  },
  mounted() {
    this.intervalFun()
    setInterval(() => {
      setTimeout(() => {
        this.intervalFun()
      }, 0)
    }, 5000)
    this.notifyHeight = window.innerHeight - 150
    window.onresize = () => {
      return (() => {
        this.notifyHeight = window.innerHeight - 150
      })()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .my-autocomplete {
    li {
      line-height: normal;
      padding: 7px;

      /*.name {*/
      /*  text-overflow: ellipsis;*/
      /*  overflow: hidden;*/
      /*}*/
      .addr {
        font-size: 12px;
        color: #b4b4b4;
      }

      .highlighted .addr {
        color: #ddd;
      }
    }
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .navbar-center {
      position: relative;
      top: -15px;
    }
    .navbar-icon {
      height: 60px;
      width: 60px;
      position: relative;
      top: -12px;
      margin-right: 10px;
    }
    .navbar-icon i {
      padding: 5px;
      font-size: 20px;
      color: #8c8c8c;
    }
    .navbar-icon i:hover {
      background: #e8f5fd;
      color: #0171c2;
      border-radius: 4px;
      transition: background-color 0.3s ease,border 0.3s ease,color 0.3s ease;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.demo-drawer__timeline{
  padding-top: 5px;
  flex: 1;
  overflow: auto;
  overflow-x: hidden;
  cursor: pointer;

  .notify-title {
    padding-left: 10px;
    font-size: 13px;
    color: #8c8c8c;
  }
  .notify-content {
    padding: 5px 0 0 10px;
    font-size: 13px;
    .notify-content-info {
      color: #5a5e66;
    }
    .notify-content-status {
      color: #F56C6C;
      float: right;
    }
  }
  .notify-datetime {
    padding-left: 10px;
    color: #8c8c8c;
    font-size: 13px;
  }
  .notify-card:hover {
    background: #f7f7f7;
  }
}
.demo-drawer__menuBar{
  padding: 0 10px 10px 10px;
  .notify-dropdown {
    cursor: pointer;
    &:hover {
      color: #409EFF;
      transition: color 0.3s ease;
    }
  }
}
.demo-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 22px;
  padding: 20px 20px 0;
}
.task-dropdown {
  color: #1989FA;
}
/deep/ .el-autocomplete {
  position: absolute;
  display: inline-block;
  left: 40%;
  top: 6px;
  width: 300px;
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 300px;
    .el-input__inner{
      -webkit-appearance: none;
      background-color: #FFF;
      background-image: none;
      border-radius: 20px;
      border: 1px solid #DCDFE6;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 38px;
      line-height: 38px;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
  }
}
</style>
