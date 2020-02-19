<template>
  <div>
    <div v-for="item in taskList" :key="item.id">
      <span>{{item.taskName}}</span>
      <span>{{tagBtnList[item.id].type}}</span>
      <el-button @click="testFunction(item)" :type="tagBtnList.find(val => val.id === item.id).type" style="margin-left: 16px;">
        {{tagBtnList.find(v => v.id === item.id).name}}
      </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'vfor-find',
    data() {
      return {
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
        taskList: [
          {
            id: 1,
            taskName: '新增任务模块待完成',
            taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
          },
          {
            id: 2,
            taskName: '任务管理系统对接后台',
            taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
          },
          {
            id: 3,
            taskName: '前端路由配置',
            taskTime: '2019/12/31 10:10 - 2020/2/10 18:00'
          }
        ],
      };
    },
    methods: {
      testFunction(val) {
        console.log(this.tagBtnList.find(v => v.id === val.id).type)
        this.tagBtnList
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>

<style scoped>

</style>
