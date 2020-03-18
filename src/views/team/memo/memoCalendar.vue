<template>
  <div>
    <el-calendar v-model="calendarDate" id="calendar">
      <template slot="dateCell" slot-scope="{date, data}">
<!--        <el-popover-->
<!--          placement="top"-->
<!--          title="书写备忘录"-->
<!--          width="240"-->
<!--          trigger="click">-->
<!--          <el-input v-model="memo.content" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="备忘录" />-->
<!--          <div style="text-align: right; margin: 5px 0 -5px;">-->
<!--            <el-button type="primary" size="mini" @click="submitContent">保存</el-button>-->
<!--          </div>-->
<!--          <div slot="reference" ref="day" @click="editContent(data.day)">-->
<!--            <span>{{ data.day.split('-').slice(2).join('-') }}</span><br>-->
<!--            <div class="cal-day-content" :style="{'width': dayWeight + 'px', 'height':dayHeight + 'px'}">-->
<!--              <div v-for="item in calendarData">-->
<!--                <div v-if="(item.time).indexOf(data.day)!=-1">-->
<!--                  <span>&emsp;&emsp;{{item.memoContent}}-->
<!--                  </span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-popover>-->
        <div ref="day" @click="editContent(data.day)">
          <span>{{ data.day.split('-').slice(2).join('-') }}</span><br>
          <div class="cal-day-content" :style="{'width': dayWeight + 'px', 'height':dayHeight + 'px'}">
            <div v-for="item in calendarData">
              <div v-if="(item.time).indexOf(data.day)!=-1">
                  <span>&emsp;&emsp;{{item.memoContent}}
                  </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <el-dialog title="编辑备忘录" :visible.sync="dialogVisible" :before-close="handleClose" width="30%">
      <el-input v-model="memo.memoContent" type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="备忘录" />
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "memoCalendar",
  computed: {
    ...mapGetters([
      'loginUserId'
    ])
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      calendarSearch: {
        userId: null,
        startDate: null,
        endDate: null
      },
      memo: {
        day: null,
        memoContent: null,
      },
      dayHeight: 40,
      dayWeight: 100,
      calendarDate: new Date(),
      calendarData: [
        {
          time: '2020-03-19',
          id: 111,
          memoContent: '这是一段测试文字，测试文字长度。这是一段测试文字，测试文字长度。这是一段测试文字，测试文字长度。这是一段测试文字，测试文字长度。这是一段测试文字，测试文字长度。'
        }
      ]
    }
  },
  created() {
    this.calendarSearch.userId = this.loginUserId
    this.$nextTick(() => {
      this.dayHeight = this.$refs.day.offsetHeight - 10
      this.dayWeight = this.$refs.day.offsetWidth
      // 点击前一个月
      let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
      prevBtn.addEventListener('click', () => {
        this.getListByTime(this.calendarDate)
      })
      let todayBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)')
      todayBtn.addEventListener('click', () => {
        this.getListByTime(this.calendarDate)
      })
      // 点击下一个月
      let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)')
      nextBtn.addEventListener('click', () => {
        this.getListByTime(this.calendarDate)
      })
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          done()
        })
        .catch(_ => {})
    },
    editContent(day) {
      if (day !== this.memo.time) {
        var data = this.calendarData.find(v => v.time === day)
        if(data !== undefined) {
          this.memo = data
        } else {
          this.memo = {
            id: null,
            content: null,
            time: day
          }
        }
      }
      this.dialogVisible = true
    },
    getListByTime(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      // var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var lastDay = new Date(year,date.getMonth()+1,0).getDate()
      this.calendarSearch.startDate = year+"-"+month+"-01"
      this.calendarSearch.endDate =  year+"-"+month+"-"+lastDay
      listByTime(this.calendarSearch).then(response => {
        this.calendarData = response.rows
      })
    },
    submitForm() {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.cal-day-content{
  margin-top: 2px;
  white-space: pre-wrap;
  font-size: 13px;
  display:inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
