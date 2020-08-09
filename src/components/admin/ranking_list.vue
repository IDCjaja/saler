<template>
  <div class="ranking_list">
    <header class="ranking_list_header">置业顾问排行</header>
    <div class="ranking_list_main">
      <van-dropdown-menu active-color="#00a862">
        <van-dropdown-item :options="types" @change="change" v-model="type" />
        <van-dropdown-item disabled title="不限组织" />
        <van-dropdown-item :value="date" @open="open" title="时间段筛选" />
      </van-dropdown-menu>
      <van-calendar
        :max-date="maxDate"
        :min-date="minDate"
        :show-confirm="false"
        @confirm="onConfirm"
        color="#00a862"
        type="range"
        v-model="show"
      />
      <p class="ranking_list_title">已选：{{ type }}｜{{ date }}</p>

      <p class="ranking_list_content_header">
        <span>置业顾问</span>
        <span>客户数量(人)</span>
        <span>排名</span>
      </p>
      <p :key="item.id" class="ranking_list_content_body" v-for="item in list" v-show="showData">
        <span>{{ item.saler }}</span>
        <span>{{ item.count_name }}</span>
        <span>{{ item.top }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import total from "@/api/total";
export default {
  data() {
    return {
      type: "新建客户",
      source: "到访客户",
      date: "2020/5/15 - 2021/5/15",
      show: false,
      startDate: "2020-05-15",
      endDate: "2021-05-15",
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2100, 0, 31),
      types: [
        { text: "新建客户", value: "新建客户" },
        { text: "来电客户", value: "来电客户" },
        { text: "预约客户", value: "预约客户" },
        { text: "认购客户", value: "认购客户" },
        { text: "签约客户", value: "签约客户" },
      ],
      list: [],
      showData: true,
    };
  },
  created() {
    document.title = "置业顾问排行";
  },
  mounted() {
    // 数据初始化
    let sql = `select saler, count(name) as count_name from fdc_form_1_13 where source ='${this.source}' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
    api.getSqlJsonAPI(sql).then((res) => {
      let list = res.data;
      this.list = total.rank(list);
    });
  },
  methods: {
    request(sql) {
      api.getSqlJsonAPI(sql).then((res) => {
        let list = res.data;
        this.list = total.rank(list);
      });
    },
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
      this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      // 时间change
      let sql;
      switch (this.source) {
        case "到访客户":
          sql = `select saler, count(name) as count_name from fdc_form_1_13 where source ='${this.source}' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          this.showData = true;
          break;
        case "来电客户":
          sql = `select saler, count(name) as count_name from fdc_form_1_13 where source ='${this.source}' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          this.showData = true;
          break;
        case "预约客户":
          sql = `select saler, count(name) as count_name from fdc_form_1_15 where to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          this.showData = true;
          break;
        // case "认购客户":
        //   this.showData = true;
        //   break;
        // case "签约客户":
        //   this.showData = true;
        //   break;

        default:
          this.showData = false;
          this.$toast("暂无数据 x_x");
          break;
      }
      this.request(sql);
    },
    open() {
      this.show = true;
      this.overlay = false;
    },
    change() {
      let sql;
      switch (this.type) {
        case "新建客户":
          this.showData = true;
          this.source = "到访客户";
          sql = `select saler, count(name) as count_name from fdc_form_1_13 where source ='${this.source}' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          break;
        case "来电客户":
          this.showData = true;
          this.source = "来电客户";
          sql = `select saler, count(name) as count_name from fdc_form_1_13 where source ='${this.source}' and to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          break;
        case "预约客户":
          this.showData = true;
          this.source = "预约客户";
          sql = `select saler, count(name) as count_name from fdc_form_1_15 where to_char(created_at,'YYYY-MM-DD')>='${this.startDate}' and to_char(created_at,'YYYY-MM-DD')<='${this.endDate}' group by saler order by count_name desc`;
          break;
        // case "认购客户":
        //   this.showData = true;
        //   this.source = "认购客户";
        //   break;
        // case "签约客户":
        //   this.showData = true;
        //   this.source = "签约客户";
        //   break;

        default:
          this.showData = false;
          this.$toast("暂无数据 x_x");
          break;
      }
      // 类型change
      this.request(sql);
    },
  },
};
</script>
<style lang="scss" scoped>
.ranking_list {
  margin: 0 auto;

  .ranking_list_header {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #222;
    height: 3.125rem;
    line-height: 3.125rem;
  }
  .ranking_list_title {
    color: #90d0b1;
    font-size: 11px;
    padding: 10px 15px;
    text-align: left;
  }

  .ranking_list_content_header {
    height: 35px;
    line-height: 35px;
    color: #00a862;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    background: rgba(0, 168, 98, 0.08);
  }
  .ranking_list_content_body {
    height: 45px;
    line-height: 45px;
    color: #787878;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
  }
  span {
    width: 33%;
  }
}
</style>
