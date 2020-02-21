<template>
  <span>
    <el-dropdown @command="sort1Command">
      <span class="my-mouse-link">{{ sort1Dropdown.dictLabel }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in sort1List" :key="item.dictValue" :command="{dictValue:item.dictValue, dictLabel:item.dictLabel}"> {{ item.dictLabel }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown @command="sort2Command">
      <span class="my-mouse-link">{{ sort2Dropdown.dictLabel }}<i class="el-icon-arrow-down el-icon--right"/></span>
      <el-dropdown-menu align="center">
        <el-dropdown-item v-for="item in sort2List" :key="item.dictValue" :command="{dictValue:item.dictValue, dictLabel:item.dictLabel}"> {{ item.dictLabel }}</el-dropdown-item>
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
    sort2List: {
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
