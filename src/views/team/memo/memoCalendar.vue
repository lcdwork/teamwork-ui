<template>
  <div>
    <el-calendar v-model="calendarDate" id="calendar">
      <template slot="dateCell" slot-scope="{date, data}">
        <div ref="day" @click="editContent(data.day)">
          <span>{{ data.day.split('-').slice(2).join('-') }}</span><br>
          <div class="cal-day-content" :style="{'width': dayWeight + 'px', 'height':dayHeight + 'px'}">
            <div v-for="item in calendarData">
              <div v-if="(item.memoTime).indexOf(data.day)!=-1">
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
import { getMemo, addMemo, updateMemo} from "@/api/memo";
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
        memoTime: null,
        memoContent: null,
      },
      dayHeight: 40,
      dayWeight: 100,
      calendarDate: new Date(),
      calendarData: []
    }
  },
  created() {
    this.calendarSearch.userId = this.loginUserId
    this.getMemoListWithFormat(new Date())
    this.$nextTick(() => {
      this.dayHeight = this.$refs.day.offsetHeight - 10
      this.dayWeight = this.$refs.day.offsetWidth
      // 点击前一个月
      let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
      prevBtn.addEventListener('click', () => {
        this.getMemoListWithFormat(this.calendarDate)
      })
      let todayBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)')
      todayBtn.addEventListener('click', () => {
        this.getMemoListWithFormat(this.calendarDate)
      })
      // 点击下一个月
      let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)')
      nextBtn.addEventListener('click', () => {
        this.getMemoListWithFormat(this.calendarDate)
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
      var data = this.calendarData.find(v => v.memoTime === day)
      if(data !== undefined) {
        this.memo = data
      } else {
        this.memo = {
          memoId: null,
          memoContent: null,
          memoTime: day
        }
      }
      this.dialogVisible = true
    },
    getMemoListWithFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
      // var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
      var lastDay = new Date(year,date.getMonth()+1,0).getDate()
      this.calendarSearch.startDate = year+"-"+month+"-01"
      this.calendarSearch.endDate =  year+"-"+month+"-"+lastDay
      this.getMemoList()
    },
    getMemoList() {
      getMemo(this.calendarSearch).then(response => {
        console.log(response.rows)
        this.calendarData = response.rows
      })
    },
    submitForm: function() {
      console.log(this.memo)
      if (this.memo.memoId != undefined) {
        updateMemo(this.memo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.dialogVisible = false;
            this.getMemoList()
          } else {
            this.msgError(response.msg);
          }
        });
      } else {
        addMemo(this.memo).then(response => {
          if (response.code === 200) {
            this.msgSuccess("新增成功");
            this.dialogVisible = false;
            this.getMemoList()
          } else {
            this.msgError(response.msg);
          }
        });
      }
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
