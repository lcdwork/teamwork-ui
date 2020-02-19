<template>
  <span>
    <el-dropdown @command="chooseTaskStatus">
      <span class="my-mouse-link">{{ taskStatus.value }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in taskStatusList" :key="item.id" :command="{id:item.id,value:item.value}"> {{ item.value }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="chooseTaskSort">
      <span class="my-mouse-link">{{ taskSort.value }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in taskSortList" :key="item.id" :command="{id:item.id,value:item.value}"> {{ item.value }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
// import '@/styles/overwrite-element-ui.scss'
export default {
  name: "sortTask",
  props: {
    taskStatusList: {
      type: Array,
      default () {
        return [
          {
            id: 1,
            value: '未完成'
          },
          {
            id: 2,
            value: '所有任务'
          },
          {
            id: 3,
            value: '已完成'
          }
        ]
      }
    },
    taskSortList: {
      type: Array,
      default () {
        return [
          {
            id: 1,
            value: '按任务优先级'
          },
          {
            id: 2,
            value: '按截止时间'
          },
          {
            id: 3,
            value: '按开始时间'
          }
        ]
      }
    }
  },
  data() {
    return {
      taskStatus: {
        id: 1,
        value: '未完成'
      },
      taskSort: {
        id: 1,
        value: '按截至时间'
      }
    }
  },
  methods: {
    chooseTaskStatus(command) {
      this.$emit('statusCommand',command)
      this.taskStatus = command
    },
    chooseTaskSort(command) {
      this.$emit('sortCommand',command)
      this.taskSort = command
    }
  }
}
</script>

<style scoped>
/deep/ .my-mouse-link {
  cursor: pointer;
}
</style>
