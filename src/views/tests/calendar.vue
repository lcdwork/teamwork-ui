<template>
  <div>
    <el-calendar v-model="value" id="calendar">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <!--自定义内容-->
        <div>
          <div class="calendar-day">{{ data.day.split('-').slice(2).join('-') }}</div>
          <div v-for="item in calendarData">
            <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
              <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                <el-tooltip class="item" effect="dark" :content="item.things" placement="right">
                  <div class="is-selected">{{item.things}}</div>
                </el-tooltip>
              </div>
              <div v-else></div>
            </div>
            <div v-else></div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      calendarData: [
        {
          months: ['09', '11'],
          days: ['15'],
          things: '看电影'
        },
        {
          months: ['10', '11'],
          days: ['02'],
          things: '去公园野炊'
        },
        {
          months: ['11'],
          days: ['02'],
          things: '看星星'
        },
        {
          months: ['11'],
          days: ['02'],
          things: '看月亮'
        }
      ],
      value: new Date()
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(1)')
      prevBtn.addEventListener('click', () => {
        console.log(111)
      })
      let todayBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(2)')
      todayBtn.addEventListener('click', () => {
        console.log(222)
      })
      // 点击下一个月
      let nextBtn = document.querySelector('.el-calendar__button-group .el-button-group>button:nth-child(3)')
      nextBtn.addEventListener('click', () => {
        console.log(333)
      })
    })
  }
}
</script>

<style scoped>
.calendar-day{
  text-align: center;
  color: #202535;
  line-height: 30px;
  font-size: 12px;
}
.is-selected{
  color: #F8A535;
  font-size: 10px;
  margin-top: 5px;
}
#calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
  content: '当月';
}
</style>
