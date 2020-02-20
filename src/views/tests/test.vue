<template>
  <div class="app-container">
    <el-button @click="getList">测试</el-button>
  </div>
</template>

<script>
import { listProject } from "@/api/project";


export default {
  name: "Test",
  data() {
    return {
      //
    }
  },
  methods: {
    getList() {
      listProject().then(response => {
        console.log(response)
      })
    }
  }
}
</script>
