<template>
  <span>
    <el-dropdown @command="sort1Command">
      <span class="my-mouse-link">{{ sort1Dropdown.dictLabel }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in sort1List" :key="item.dictKey" :command="item"> {{ item.dictLabel }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="sort2Command">
      <span class="my-mouse-link">{{ sort2Dropdown.dictLabel }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in sort2List" :key="item.dictKey" :command="item"> {{ item.dictLabel }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
// import '@/styles/overwrite-element-ui.scss'
export default {
  name: "sortTask",
  props: {
    sort1List: {
      type: Array,
      default () {
        return []
      }
    },
    sort2List: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      sort1Dropdown: {},
      sort2Dropdown: {}
    }
  },
  watch: {
    sort1List() {
      this.sort1Dropdown = this.sort1List.find(v => v.isDefault === 'Y')
    },
    sort2List() {
      this.sort2Dropdown = this.sort2List.find(v => v.isDefault === 'Y')
    }
  },
  methods: {
    sort1Command(command) {
      this.$emit('sort1Command',command)
      this.sort1Dropdown = command
    },
    sort2Command(command) {
      this.$emit('sort2Command',command)
      this.sort2Dropdown = command
    }
  }
}
</script>

<style scoped>
/deep/ .my-mouse-link {
  cursor: pointer;
}
</style>
