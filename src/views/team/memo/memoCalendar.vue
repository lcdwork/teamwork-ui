<template>
  <div>
    <el-calendar v-model="calendarDate" id="calendar">
      <!--        <template slot="dateCell" slot-scope="{date, data}">-->
      <!--          <div>-->
      <!--            <div>{{ data.day.split('-').slice(2).join('-') }}</div><br>-->
      <!--            <div v-for="item in calendarData">-->
      <!--              <div v-if="(item.time).indexOf(data.day)!=-1">-->
      <!--                <el-dropdown v-if="item.list.length > 0" trigger="click" @command="taskCommand">-->
      <!--                  <span class="task-dropdown">{{item.list.length}}个任务进行中</span>-->
      <!--                  <el-dropdown-menu align="center">-->
      <!--                    <el-dropdown-item v-for="task in item.list" :key="task.id" :command="task"> {{ task.taskName }}</el-dropdown-item>-->
      <!--                  </el-dropdown-menu>-->
      <!--                </el-dropdown>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </template>-->
    </el-calendar>
  </div>
</template>

<script>
    export default {
      name: "memoCalendar",
      data() {
        return {
          calendarDate: new Date(),
        }
      }
    }
</script>

<style scoped>

</style>
