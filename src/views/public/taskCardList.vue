<template>
  <div class="my-mouse-link">
    <el-card :body-style="{padding: '10px'}" v-for="item in taskList" :key="item.taskId" shadow="hover" @click.native="showTask(item)" class="my-card-hover">
      <el-tag effect="light" size="mini" >
<!--        :style="{'color': taskStatusList.find(v => v.dictVaule === item.taskStatusList).cssClass}"-->
<!--        {{taskStatusList.find(v => v.dictVaule === item.taskStatusList).dictLable}}-->
      </el-tag>
      <span class="text item" style="margin-left: 10px">{{ item.taskName }}</span>
      <div style="float: right;">
        <span class="span-card-list">截至时间：{{ item.stopTime }}</span>
      </div>
      <div style="margin-top: 5px; margin-left: 50px">
        <span class="span-card-list"><i class="el-icon-s-claim" style="color: #20a0ff"></i>任务</span>
        <el-tag effect="plain" size="mini" style="margin-left: 20px" type="danger">
          <!--        :type="taskStatusList.find(v => v.dictVaule === item.taskStatusList).listClass"-->
          <!--        {{taskTag.find(v => v.dictVaule === item.taskTag).dictLable}}-->
        </el-tag>
        <span class="span-card-list"><i class="el-icon-s-unfold"></i>项目</span>
        <slot :data="item"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "taskCardList",
  props: {
    taskList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      taskTag: [],
      taskStatusList: [],
    }
  },
  created() {
    this.getDicts("task_status").then(response => {
      this.taskStatusList = response.data;
    })
    this.getDicts("task_tag").then(response => {
      this.taskTag = response.data;
    })
  },
  methods: {
    showTask(item) {
      this.$emit('showTask',item)
    }
  }
}
</script>

<style scoped>
.my-mouse-link {
  cursor: pointer;
}
.span-card-list {
  color: #8c8c8c;
  font-size: 13px;
  margin-left: 20px;
}
</style>
