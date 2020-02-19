<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="filterText"
        placeholder="请输入部门名称"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px"
      />
    </div>
    <el-tree
      :data="data"
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      ref="tree"
      default-expand-all>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'deptTree',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(data, node, event) {
      this.$emit('nodeClick', data, node, event)
    }
  }
}
</script>

<style scoped>
/deep/ .el-tree-node__content {
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
}
</style>
