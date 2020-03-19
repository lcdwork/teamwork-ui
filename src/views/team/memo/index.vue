<template>
  <el-tabs type="card">
    <el-tab-pane label="备忘录日历">
      <memo-calendar></memo-calendar>
    </el-tab-pane>
    <el-tab-pane label="备忘录管理">
      <memo-table></memo-table>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import memoCalendar from "./memoCalendar";
import memoTable from "./memoTable";
  export default {
    name: "index",
    components: {
      memoTable,
      memoCalendar
    }
  }
</script>

<style scoped>

</style>
