<template>
  <div>
    <header>
      <p class="today_header">
        <span @click="getTime(0, nowDate)">
          <i class="before"></i>
          <em>前一天</em>
        </span>
        <span class="today_time">{{ nowDate }}</span>
        <span @click="getTime(1, nowDate)">
          <em>后一天</em>
          <i class="after"></i>
        </span>
      </p>
    </header>
    <div class="today_main">
      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-Foot" name="1" title="到访人数">
          <p class="today_content_body">
            <span>成交人数</span>
            <span>10 人</span>
          </p>
          <p class="today_content_body">
            <span>成交率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-Warning" name="2" title="来电人数">
          <p class="today_content_body">
            <span>到访人数</span>
            <span>10 人</span>
          </p>
          <p class="today_content_body">
            <span>电转访率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-File" name="3" title="预约人数">
          <p class="today_content_body">
            <span>预约已到访数</span>
            <span>10 人</span>
          </p>
          <p class="today_content_body">
            <span>预约到访率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="0 户" icon=" icon-Index-Icon-info" name="4" title="银行放款户数">
          <p class="today_content_body">
            <span>未放款户数</span>
            <span>0 户</span>
          </p>
          <p class="today_content_body">
            <span>放款率</span>
            <span>0 %</span>
          </p>
        </van-collapse-item>
      </van-collapse>
      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="0 个" icon=" icon-Index-Icon-Statistics" name="5" title="更名数量"></van-collapse-item>
      </van-collapse>
      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="0 个" icon=" icon-Index-Icon-Statistics" name="6" title="退房数量"></van-collapse-item>
      </van-collapse>
      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="0 个" icon=" icon-Index-Icon-Statistics" name="7" title="换房数量"></van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      nowDate: "xxxx-xx-xx",
      newArrive: 0,
      totalArrive: 1,
      newCaller: 0,
      totalCaller: 1,
      activeName: "",
    };
  },
  computed: {
    percentageArrive() {
      return Math.round((this.newArrive / this.totalArrive) * 100) + "%";
    },
    percentageCaller() {
      return Math.round((this.newCaller / this.totalCaller) * 100) + "%";
    },
  },
  mounted() {
    // 获取今天时间
    let date = new Date();
    this.dateFormat(date);
    // 请求结果
    let params = { search_day: this.nowDate };
    api.getAdminOneDayAPI(params).then((res) => {
      let data = res.data;
      this.newArrive = data.search_date_arrive_visitor_count;
      this.totalArrive = data.arrive_visitor_count;
      this.newCaller = data.search_date_caller_count;
      this.totalCaller = data.caller_count;
    });
  },
  methods: {
    getTime(type, date) {
      let time = new Date(date); // new Date() 识别 2019/01/02
      if (type === 0) {
        time = +time - 1000 * 60 * 60 * 24;
      } else if (type === 1) {
        time = +time + 1000 * 60 * 60 * 24; //  +time转换毫秒格式
      }
      time = new Date(time);
      return this.dateFormat(time); // 将日期格式
    },
    dateFormat(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      if (m <= 9) {
        m = "0" + m;
      }
      if (d <= 9) {
        d = "0" + d;
      }
      this.nowDate = y + "-" + m + "-" + d;
      let params = { search_day: this.nowDate };
      api.getAdminOneDayAPI(params).then((res) => {
        let data = res.data;
        this.arrive_visitor_count = data.arrive_visitor_count;
        this.caller_count = data.caller_count;
        this.search_date_arrive_visitor_count =
          data.search_date_arrive_visitor_count;
        this.search_date_caller_count = data.search_date_caller_count;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.today_header {
  height: 40px;
  line-height: 40px;
  color: #787878;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
}

/deep/ .van-cell__value {
  text-align: center;
  color: black;
}
.van-collapse-item__content {
  padding: 5px;
}

.today_content_body {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
}

span {
  width: 33%;
}
//  三角
.before {
  transform: rotate(30deg);
}
.before:after {
  border-top: 5px solid #555555;
  border-bottom: 5px solid transparent;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: "";
  position: relative;
  display: inline-block;
  transform: rotate(90deg);
  width: 0;
}

.after:after {
  border-top: 5px solid #555555;
  border-bottom: 5px solid transparent;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: "";
  display: inline-block;
  transform: rotate(-90deg);
  position: relative;
  width: 0;
}
.today_time {
  color: #00a862;
  font-size: 14px;
  font-weight: 500;
}
</style>
