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
              <h2>{{ list.buyer_name }}</h2>
              <p>
                <span v-if="list.room_number">{{ list.room_number }}</span>
                <span v-else>未填写</span>
              </p>
            </div>
          </div>

          <a :href="'tel:' + list.buyer_phone" class="information-right">
            <i class="icon-Info-Icon-Phone"></i>
          </a>
        </div>
      </div>
      <div class="buy_message_content">
        <div class="buy_message_content_body" v-for="item in preview_data" :key="item.id">
          <div class="buy_message_content_body_left">
            <span>{{ item.title }}</span>
          </div>
          <div class="buy_message_content_body_right">
            <span>{{ list[item.index] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuyMessageTabbar from '../pages/tabbar'
import api from '@/api/api'
import total from '@/api/total'
export default {
  data() {
    return {
      title: '客户信息',
      intention: '暂无意向',
      customer_name: ' ',
      customer_phone: '',
      isLoading: true,
      preview_data: [
        {
          title: '套内面积',
          index: 'inside_area',
        },
        {
          title: '建筑面积',
          index: 'covered_area',
        },
        {
          title: '套内单价',
          index: 'univalence',
        },
        {
          title: '套内总价',
          index: 'total',
        },

        {
          title: '付款方式',
          index: 'payment_method',
        },
        {
          title: '分期时间',
          index: 'loan_term',
        },
        {
          title: '分期金额',
          index: 'loan_amount',
        },
        {
          title: '按揭银行',
          index: 'bank',
        },
        {
          title: '份额',
          index: 'share',
        },
        {
          title: '买受人身份证号码',
          index: 'identification_number',
        },
        {
          title: '买受人户口（护照或单位）所在地',
          index: 'hukou_location',
        },
        {
          title: '国籍',
          index: 'nationality',
        },
        {
          title: '证件类型',
          index: 'document_type',
        },
        {
          title: '证件号码',
          index: 'identification_number',
        },
        {
          title: '出生日期',
          index: 'birthday',
        },
        {
          title: '性别',
          index: 'gender',
        },
        {
          title: '通讯地址',
          index: 'address',
        },
        {
          title: '邮政编码',
          index: 'postal_code',
        },
        {
          title: '共同拥有人',
          index: 'owner',
        },
        {
          title: '共同拥有人手机号',
          index: 'owner_phone',
        },
        {
          title: '共同拥有人份额',
          index: 'owner_share',
        },
        {
          title: '共同拥有人户口（护照或单位）所在地',
          index: 'owner_hukou_location',
        },
        {
          title: '共同拥有人国籍',
          index: 'owner_nationality',
        },
        {
          title: '共同拥有人证件类型',
          index: 'owner_document_type',
        },
        {
          title: '共同拥有人证件号码',
          index: 'owner_identification_number',
        },
        {
          title: '共同拥有人证件类型',
          index: 'owner_document_type',
        },
        {
          title: '优惠体系',
          index: 'discount',
        },
        {
          title: '额外优惠体系',
          index: 'additional_preferential_system',
        },
        {
          title: '首付款金额',
          index: 'down_payment_amount',
        },
        {
          title: '签约日期',
          index: 'actual_signing_date',
        },
      ],
      journey_id: '',
      list: {},
    }
  },
  components: {
    BuyMessageTabbar,
  },

  mounted() {
    this.journey_id = this.$route.query.journey_id
    this.customer_phone = this.$route.query.customer_phone

    // 详细信息
    let sql = `select * from fdc_flow_1_27 WHERE journey_id ='${this.journey_id}'`
    api.getSqlJsonAPI(sql).then((res) => {
      total.timeFormatting(res.data, 'actual_signing_date')
      total.timeFormatting(res.data, 'birthday')
      this.list = res.data[0]
      this.isLoading = false
    })
  },
}
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 100px;
}
.message-main {
  width: 94%;
  background: url('../../assets/img/info-bg.png');
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
    width: 140px;
    text-align: center;
    color: #929292;
    font-size: 14px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
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
    padding: 20px;

    h2 {
      font-size: 15px;
      font-weight: 600;
      color: #222;
      width: 120px;
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
</style>
