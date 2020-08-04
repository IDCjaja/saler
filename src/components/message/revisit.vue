<template>
  <div>
    <customer-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
      <aside class="revisit_aside">
        <div class="revist_aside_visit">
          <div class="revist_aside_visit_left">
            <h2 class="revist_aside_visit_h2">回访记录</h2>
          </div>
          <div class="revist_aside_visit_right">
            <router-link
              :to="{ name:'record',query:{customer_phone:customer_phone,response_id:response_id}}"
              class="revist_aside_visit_right_h3"
            >新增</router-link>
          </div>
        </div>
        <div class="revist_aside_visit_body">
          <div class="revist_aside_visit-content">
            <p>
              <em>{{visit_count}}</em> 次
            </p>
            <p>现场回访</p>
          </div>
          <div class="revist_aside_visit-content">
            <p>
              <em>{{call_count}}</em>次
            </p>
            <p>电话回访</p>
          </div>
        </div>
        <h3 class="revist_aside_visit_h3">详情记录</h3>
        <p class="revist_aside_content-header">
          <span>回访方式</span>
          <span>时间</span>
          <span>回访内容</span>
        </p>
        <div :key="item.id" class="revist_aside_content-header-content" v-for="item in revisit">
          <span>{{item.return_type}}</span>
          <span>{{item.dataTime}}</span>
          <span>{{item.return_remark}}</span>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import CustomerTabbar from "../pages/tabbar";
import api from "@/api/api";
import total from "@/api/total";
export default {
  data() {
    return {
      title: "置业跟踪",
      isLoading: true,
      intention: "",
      revisit: [],
      id: "",
      phone: "",
      customer_phone: "",
      response_id: "",
      call_count: "0",
      visit_count: "0",
      list: "",
    };
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    this.response_id = this.$route.query.response_id;
    this.customer_phone = this.$route.query.customer_phone;
    // 读取cookie
    this.id = localStorage.getItem("user_id");
    this.phone = localStorage.getItem("user_phone");

    // 回访
    let sql = `select * from fdc_form_1_18 WHERE customer_phone ='${this.customer_phone}'`;
    api.getSqlJsonAPI(sql).then((res) => {
      this.isLoading = false;
      this.revisit = total.createData(res.data);
      // 回访次数
      let data = res.data;
      for (let i = 0; i < data.length; i++) {
        data[i].return_type === "电话回访"
          ? this.call_count++
          : this.visit_count++;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 100px;
}
/deep/ .revisit_aside {
  width: 82%;
  margin: 0 auto;

  .van-radio-group--horizontal {
    margin-top: 10px;
  }

  .van-field__label {
    text-align: left;
  }
  .van-cell {
    flex-direction: column;
    padding: 10px 0px;
  }
  .van-radio__label {
    margin: 4px;
  }
  .revist_aside_visit_header .van-field__label {
    font-size: 16px;
    font-weight: 500;
  }
}

.revist_aside_visit_right_h3 {
  color: #00a862;
  font-size: 14px;
}
//销售记录
.revist_aside_visit {
  display: flex;
  justify-content: space-between;
  padding: 30px 0px 10px;
}

.revist_aside_visit_body {
  height: 80px;
  display: flex;
  justify-content: space-around;
  border-radius: 4px;
  color: #787878;
  font-size: 11px;
  line-height: 80px;
  background: rgba(212, 212, 212, 0.2);
}

.revist_aside_visit-content {
  width: 33%;
  display: flex;
  flex-direction: column;
}

.revist_aside_visit-content p {
  height: 20px;
  line-height: 60px;
}

.revist_aside_visit-content p em {
  color: #00a862;
  font-size: 20px;
  font-weight: 600;
  margin: 5px;
}
.revist_aside_visit-content p i {
  font-size: 20px;
}
.revist_aside_visit_h3 {
  text-align: left;
  margin-top: 20px;
  color: #a4a4a4;
}

//详情记录
.revist_aside_content-header {
  line-height: 30px;
  color: #00a862;
  font-size: 0.625rem;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 168, 98, 0.08);
  margin-top: 10px;
}

.revist_aside_content-header-content {
  line-height: 30px;
  display: flex;
  color: #787878;
  justify-content: space-between;
}
.revist_aside_content-header span,
.revist_aside_content-header-content span {
  width: 40%;
}

.revist_aside_visit_h2 {
  font-size: 16px;
}
</style>
