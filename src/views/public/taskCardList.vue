<template>
  <div class="my-mouse-link">
    <el-card :body-style="{padding: '10px'}" v-for="item in taskList" :key="item.taskId" shadow="hover" @click.native="showTask(item)" class="my-card-hover">
      <el-tag effect="light" size="mini" :style="{'color': taskStatusList.find(v => v.dictKey === item.status).cssClass}">
        {{taskStatusList.find(v => v.dictKey === item.status).dictLabel}}
      </el-tag>
      <span class="text item" style="margin-left: 10px">{{ item.taskName }}</span>
      <div style="float: right;">
        <span class="span-card-list">截止时间：{{ item.stopTime }}</span>
      </div>
      <div style="margin-top: 5px; margin-left: 50px">
        <span class="span-card-list"><i class="el-icon-s-claim" style="color: #20a0ff"></i>任务</span>
        <el-tag effect="plain" size="mini" style="margin-left: 20px" :type="taskTagList.find(v => v.dictKey === item.taskTag).listClass">
                  {{taskTagList.find(v => v.dictKey === item.taskTag).dictLabel}}
        </el-tag>
        <span class="span-card-list"><i class="el-icon-s-unfold"></i>{{ item.projectName }}</span>
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
      taskTagList: [],
      taskStatusList: [],
    }
  },
  created() {
    this.getDicts("task_status").then(response => {
      this.taskStatusList = response.data;
    })
    this.getDicts("task_tag").then(response => {
      this.taskTagList = response.data;
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
.my-card-hover:hover {
  background: #f7f7f7;
}
.span-card-list {
  color: #8c8c8c;
  font-size: 13px;
  margin-left: 20px;
}
</style>
