<template>
  <div>
    <header class="custom_time_header">
      <div class="custom_time_time">
        <div @click="show = true" class="custom_time_input">{{ date }}</div>
        <van-calendar
          :max-date="maxDate"
          :min-date="minDate"
          :show-confirm="false"
          @confirm="onConfirm"
          color="#00A862"
          type="range"
          v-model="show"
        />
      </div>
    </header>
    <div class="custom_time_main">
      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-Foot" name="1" title="到访人数">
          <p class="custom_content_body">
            <span>成交人数</span>
            <span>10 人</span>
          </p>
          <p class="custom_content_body">
            <span>成交率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-Warning" name="2" title="来电人数">
          <p class="custom_content_body">
            <span>到访人数</span>
            <span>10 人</span>
          </p>
          <p class="custom_content_body">
            <span>电转访率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="10 人" icon=" icon-Index-Icon-File" name="3" title="预约人数">
          <p class="custom_content_body">
            <span>预约已到访数</span>
            <span>10 人</span>
          </p>
          <p class="custom_content_body">
            <span>预约到访率</span>
            <span>100%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item value="0 户" icon=" icon-Index-Icon-info" name="4" title="银行放款户数">
          <p class="custom_content_body">
            <span>未放款户数</span>
            <span>0 户</span>
          </p>
          <p class="custom_content_body">
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
      date: "选择时间段",
      startDate: "",
      endDate: "",
      show: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2100, 0, 31),
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
  mounted() {},
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      let params = { start_date: this.startDate, end_date: this.endDate };
      api.getAdminCustomDatelineAPI(params).then((res) => {
        let data = res.data;
        this.newArrive = data.search_day_arrive_visitor_count;
        this.totalArrive = data.arrive_visitor_count;
        this.newCaller = data.search_day_caller_count;
        this.totalCaller = data.caller_count;
      });

      this.date = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom_time_header {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  display: flex;
  justify-content: center;
}

/deep/ .van-cell__value {
  text-align: center;
  color: black;
}
.van-collapse-item__content {
  padding: 5px;
}

.custom_content_body {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
}

span {
  width: 33%;
}
span {
  width: 33%;
}
</style>
