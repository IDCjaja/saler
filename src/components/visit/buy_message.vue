<template>
  <div>
    <buy-message-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
      <div class="message-main">
        <div class="content">
          <div class="information-left">
            <div class="information-left-head">
              <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
            </div>
            <div class="information-left-matter">
              <h2>{{list.name}}</h2>
              <p>
                <span>{{list.intention}}</span>
              </p>
            </div>
          </div>
          <router-link
            :to="{ name:'message',query:{customer_phone:list.phone,response_id:response_id}}"
            class="information-right information-right-modify"
          >
            <i class="icon-Info-Icon-Edit"></i>
          </router-link>
          <a :href="'tel:'+ list.phone" class="information-right">
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
            <span>{{list.depict}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>知晓途径</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.pathway}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>置业目的</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.motivation}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>价格区间</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.price}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>付款方式</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.payment}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>有无购房资格</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.entitlement}}</span>
          </div>
        </div>
        <div class="buy_message_content_body" v-show="list.reason">
          <div class="buy_message_content_body_left">
            <span>购房资格备注</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.reason}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>生活区域</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.living_area}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>工作区域</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.working_area}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>摇号批次</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.lottery}}</span>
          </div>
        </div>
        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>摇号结果</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.lottery_results}}</span>
          </div>
        </div>

        <div class="buy_message_content_body">
          <div class="buy_message_content_body_left">
            <span>客户主要抗性</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{list.resistance}}</span>
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
      list: {},
      response_id: "",
    };
  },
  components: {
    BuyMessageTabbar,
  },

  mounted() {
    this.response_id = this.$route.query.response_id;
    this.customer_phone = this.$route.query.customer_phone;

    // 详细信息
    let sql = `select * from fdc_form_1_662 WHERE response_id ='${this.response_id}'`;
    api.getSqlJsonAPI(sql).then((res) => {
      this.list = res.data[0];
      this.isLoading = false;
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
