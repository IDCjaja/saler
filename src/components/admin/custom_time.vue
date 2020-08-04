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
        <van-collapse-item
          :value="newArrive +' 人'"
          icon=" icon-Index-Icon-Foot"
          name="1"
          title="到访人数"
        >
          <p class="today_content_body">
            <span>成交人数</span>
            <span>0 人</span>
          </p>
          <p class="today_content_body">
            <span>成交率</span>
            <span>0%</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item
          :value="newCaller+' 人'"
          icon=" icon-Index-Icon-Warning"
          name="2"
          title="总来电人数"
        >
          <p class="today_content_body">
            <span>到访人数</span>
            <span>{{newArrive}} 人</span>
          </p>
          <p class="today_content_body">
            <span>电转访率</span>
            <span>{{callVisits}}</span>
          </p>
        </van-collapse-item>
      </van-collapse>

      <van-collapse accordion v-model="activeName">
        <van-collapse-item
          :value="reserve +' 人'"
          icon=" icon-Index-Icon-File"
          name="3"
          title="预约人数"
        >
          <p class="today_content_body">
            <span>预约已到访</span>
            <span>{{newArrive}} 人</span>
          </p>
          <p class="today_content_body">
            <span>预约到访率</span>
            <span>{{reserved}}</span>
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
      date: "选择时间段",
      startDate: "",
      activeName: "",
      endDate: "",
      show: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2100, 0, 31),
      newArrive: 0,
      newCaller: 0,
      reserve: 0,
      callVisit: 0,
    };
  },
  computed: {
    reserved: function () {
      return Math.round((this.newArrive / this.reserve) * 100) + "%";
    },
    callVisits: function () {
      return (
        Math.round((this.callVisit / (this.newCaller + this.callVisit)) * 100) +
        "%"
      );
    },
  },
  mounted() {},
  methods: {
    formatDate(date) {
      let month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      return `${date.getFullYear()}-${month}-${day}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.date = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;

      let sql = `select * from fdc_form_1_15 WHERE arrive_visit='已到访' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' `;
      api.getSqlJsonAPI(sql).then((res) => {
        this.newArrive = res.data.length;
      });
      let sqlCall = `select * from fdc_form_1_13 WHERE source LIKE '来电客户' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' `;
      api.getSqlJsonAPI(sqlCall).then((res) => {
        this.newCaller = res.data.length;
      });
      let sqlCallVisit = `select * from fdc_form_1_13 WHERE source LIKE '电转访客户' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' `;
      api.getSqlJsonAPI(sqlCallVisit).then((res) => {
        this.callVisit = res.data.length;
      });
      let reserve = `select * from fdc_form_1_15 WHERE to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' `;
      api.getSqlJsonAPI(reserve).then((res) => {
        this.reserve = res.data.length;
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

.custom_time_input {
  line-height: 35px;
  font-size: 15px;
}

span {
  width: 33%;
}
span {
  width: 33%;
}
</style>
