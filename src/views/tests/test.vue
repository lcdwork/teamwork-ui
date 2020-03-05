<template>
  <div class="app-container">
    <el-button @click="getList">测试</el-button>
  </div>
</template>

<script>
import { ganttTree } from "@/api/project";

export default {
  name: "Test",
  data() {
    return {
      //
    }
  },
  methods: {
    getList() {
      ganttTree().then(response => {
        console.log(response)
      })
    }
  }
}
</script>
