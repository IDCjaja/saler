<template>
  <div>
    <buy-message-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
      <div class="message-main">
        <div class="content">
          <div class="information-left">
            <div class="information-left-head">
              <img class="information-left-img" src="@/assets/img/Avator-Woman.png" />
            </div>
            <div class="information-left-matter">
              <h2>{{customer_name}}</h2>
              <p>
                <span>{{intention}}</span>
              </p>
            </div>
          </div>
          <router-link
            :to="{ name:'message',query:{customer_phone:customer_phone,response_id:response_id}}"
            class="information-right information-right-modify"
          >
            <i class="icon-Info-Icon-Edit"></i>
          </router-link>
          <a :href="'tel:'+ customer_phone" class="information-right">
            <i class="icon-Info-Icon-Phone"></i>
          </a>
        </div>
      </div>
      <div class="buy_message_content">
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>客户描摹</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{remark}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>知晓途径</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{channel}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>置业目的</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{motivation}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>价格区间</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{price_range}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>付款方式</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{payment_method}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>有无购房资格</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{entitlement}}</span>
          </div>
        </div>
        <div class="buy_message_content_body" v-show="this.reason">
          <div class="buy_message_content_body_left">
            <span>购房资格备注</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{reason}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>生活区域</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{living_area2}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>工作区域</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{working_area}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>摇号批次</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{lottery}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>摇号结果</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{lottery_results}}</span>
          </div>
        </div>

        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>客户主要抗性</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{customer_resistance}}</span>
          </div>
        </div>

        <div class="buy_message_bottom"></div>
      </div>
    </div>
    <footer class="footer">
      <div class="buy_message_footer">
        <div @click="prompt" to="/#">认购</div>
      </div>
    </footer>
  </div>
</template>

<script>
import BuyMessageTabbar from "../pages/tabbar";
import api from "@/api/api";
export default {
  data() {
    return {
      title: "客户信息",
      intention: "暂无意向",
      customer_name: " ",
      customer_phone: "",
      isLoading: true,
      id: " ",
      phone: " ",
      response_id: "",
      channel: " ",
      motivation: " ",
      price_range: "",
      payment_method: "",
      entitlement: "",
      reason: "",
      living_area2: "",
      working_area: "",
      lottery: "",
      lottery_results: "",
      remark: "",
      customer_resistance: " ",
    };
  },
  components: {
    BuyMessageTabbar,
  },

  mounted() {
    this.response_id = this.$route.query.response_id;
    this.customer_phone = this.$route.query.customer_phone;
    // 读取cookie
    this.id = this.$cookies.get("CURRENT-USER-ID");
    this.phone = this.$cookies.get("CURRENT-USER-PHONE");

    // 来访
    api.putSalerArriveVisitorsAPI(this.response_id).then((res) => {
      console.log(res);
      this.isLoading = false;
      let mappedValues = res.data.mapped_values;
      if (mappedValues.customer_name) {
        this.customer_name = mappedValues.customer_name.text_value[0];
      }
      if (mappedValues.intention) {
        this.intention = mappedValues.intention.text_value[0];
      }
      if (mappedValues.channel) {
        this.channel = mappedValues.channel.text_value[0];
      }
      if (mappedValues.motivation) {
        this.motivation = mappedValues.motivation.text_value[0];
      }

      if (mappedValues.price_range) {
        this.price_range = mappedValues.price_range.text_value[0];
      }
      if (mappedValues.payment_method) {
        this.payment_method = mappedValues.payment_method.text_value[0];
      }
      if (mappedValues.entitlement) {
        this.entitlement = mappedValues.entitlement.text_value[0];
      }
      if (mappedValues.reason) {
        this.reason = mappedValues.reason.text_value[0];
      }
      if (mappedValues.living_area2) {
        this.living_area2 = mappedValues.living_area2.text_value[0];
      }
      if (mappedValues.working_area) {
        this.working_area = mappedValues.working_area.text_value[0];
      }
      if (mappedValues.lottery) {
        this.lottery = mappedValues.lottery.text_value[0];
      }
      if (mappedValues.lottery_results) {
        this.lottery_results = mappedValues.lottery_results.text_value[0];
      }
      if (mappedValues.remark) {
        this.remark = mappedValues.remark.text_value[0];
      }
      if (mappedValues.customer_resistance) {
        this.customer_resistance =
          mappedValues.customer_resistance.text_value[0];
      }
    });
  },
  methods: {
    prompt() {
      this.$toast("开发中 ✨");
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 100px;
}
.message-main {
  width: 94%;
  background: url("../../assets/img/info-bg.png");
  margin: 0 auto;
  height: 112px;
  background-size: cover;
  border-radius: 4px;
  display: flex;
}
.content {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
}

.buy_message_content_body {
  display: flex;
  justify-content: start;
  line-height: 40px;
  border-bottom: 1px solid #f0f2f4;

  .buy_message_content_body_left {
    width: 96px;
    text-align: center;
    color: #929292;
    font-size: 14px;
  }

  .buy_message_content_body_right {
    padding: 0px 10px;
    color: #222;
    font-size: 14px;
    text-align: left;
    width: 70%;
  }
}

.information-left {
  display: flex;
  justify-content: space-around;
  align-content: center;

  .information-left-img {
    width: 65px;
    margin: 10px auto;
    padding: 10px;
  }

  .information-left-matter {
    margin-left: -20px;
    text-align: left;
    padding: 32px;

    h2 {
      font-size: 15px;
      font-weight: 600;
      color: #222;
      width: 80px;
      margin-bottom: 5px;
    }
    p {
      font-size: 11px;
      color: #b2b2b2;
      margin-top: 5px;
      min-width: 100px;

      span {
        color: #fff;
        border-radius: 2px;
        background: #b2b2b2;
        padding: 2px 4px;
      }
    }
  }
}
.information-right {
  background: #b6d0c4;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 44px;
}

/deep/ .buy_message_content {
  width: 95%;
  margin: 0 auto;
  margin-top: 35px;

  .van-cell {
    line-height: 31px;
  }
  .van-field__label {
    text-align: left;
    color: #929292;
  }
  .van-field__body .van-field__control {
    color: #222;
  }
}

//底部
.buy_message_bottom {
  height: 50px;
}
.buy_message_footer {
  margin-top: 30px;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 600;
  background: #929292;
  color: #fff;
  div {
    width: 100%;
    display: block;
  }
}
.footer {
  position: fixed;
  width: 100%;
  bottom: 0px;
}
</style>
