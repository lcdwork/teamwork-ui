<template>
  <el-dialog title="消息列表" :visible.sync="dialogVisible" top="5vh" width="70%">
    <el-container>
      <el-aside width="45%">

      </el-aside>
      <div style="background-color:#E6E3E3; width:1px;"></div>
      <el-main>
        <div style="height: 350px; margin: -10px 0px 0px -40px">
          <el-timeline>
            <el-timeline-item v-for="activity in activities" :type="activity.type"  placement="bottom">
              <el-card :body-style="{padding: '0px'}" shadow="hover">
                <div style="margin-left: 10px">
                  <h4>{{activity.content}}</h4>
                  <p>{{activity.name}} 提交于 {{activity.timestamp}}</p>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-main>
    </el-container>
<!--    <div slot="footer" class="dialog-footer">-->
<!--      <el-button @click="handleCancel">取 消</el-button>-->
<!--      <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--    </div>-->
  </el-dialog>
</template>

<script>
export default {
  props: {
  },
  name: "messageDialog",
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
