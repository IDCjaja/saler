<template>
  <div class="guest">
    <header class="guest_header">判客岗</header>
    <article class="guest_search">
      <van-search
        @search="onSearch"
        autofocus
        maxlength="4"
        placeholder="请输入手机号后四位"
        show-action
        type="number"
        v-model="number"
        x
      >
        <template #action>
          <div @click="onSearch()" class="guest_search_title">搜索</div>
        </template>
      </van-search>
    </article>

    <aside class="table_aside" v-show="false">
      <div :key="field.identity_key" v-for="field in formData">
        <!-- text -->
        <div class="input_text" v-if="field.identity_key === 'customer_phone'">
          <van-field
            :id="field.identity_key"
            :label="field.title"
            autocomplete="off"
            placeholder="请输入"
            type="text"
            v-model="field.value"
          />
        </div>
        <div class="input_text" v-if="field.identity_key === 'is_new'">
          <van-field
            :id="field.identity_key"
            :label="field.title"
            autocomplete="off"
            placeholder="请输入"
            type="text"
            v-model="field.value"
          />
        </div>
      </div>
    </aside>
    <aside class="table_aside" v-show="false">
      <div :key="field.identity_key" v-for="field in statusData">
        <!-- text -->
        <div class="input_text" v-if="field.identity_key === 'arrive_visit'">
          <van-field
            :id="field.identity_key"
            :label="field.title"
            autocomplete="off"
            placeholder="请输入"
            type="text"
            v-model="field.value"
          />
        </div>
      </div>
    </aside>

    <div class="guest_main">
      <section class="guest_main_hint" v-show="showResult">
        <div class="guest_main_hint_success success_bg" v-show="show">
          <van-icon @click="cross()" class="guest_main_x" name="cross"></van-icon>
          <h1>
            <van-icon class="guest_main_hint_icon success_icon" name="success" />
          </h1>
          <h2>客户已存在</h2>
          <div class="guest_main_hint_message">
            <p>客户姓名：{{ name }}</p>
            <p>置业顾问：{{ user_name }}</p>
            <p>首次到访时间：{{ created_at }}</p>
            <p>最近到访时间：{{ planed_visit_time }}</p>
          </div>
        </div>
        <div class="guest_main_hint_fail fail_bg" v-show="!show">
          <van-icon @click="cross()" class="guest_main_x" name="cross"></van-icon>
          <h1>
            <van-icon class="guest_main_hint_icon fail_icon" name="fail" />
          </h1>
          <h2>客户为新客户</h2>
        </div>
      </section>

      <section class="guest_main_hint" v-show="showResultOrder">
        <div class="guest_main_hint_success_order success_bg" v-show="showOrder">
          <van-icon @click="orderCross()" class="guest_main_x" name="cross"></van-icon>

          <h1>
            <van-icon class="guest_main_hint_icon success_icon" name="success" />
          </h1>
          <h2>客户已预约</h2>
          <div class="guest_main_hint_message">
            <p>客户姓名：{{ customer_name }}</p>
            <p>客户电话：{{ encryption }}</p>
            <p>渠道来源：{{ customer_source }}</p>
            <p>预约人：{{ order_name }}</p>

            <p class="guest_main_hint_button">
              <button :class="[this.visitStatus === '已到访' ? 'visited' : '']" @click.once="ToggleState">
                {{ this.visitStatus === '已到访' ? '已到访' : '确认到访' }}
              </button>
            </p>
          </div>
        </div>
        <div class="guest_main_hint_fail_order fail_bg" v-show="!showOrder">
          <van-icon @click="orderCross()" class="guest_main_x" name="cross"></van-icon>

          <h1>
            <van-icon class="guest_main_hint_icon fail_icon" name="fail" />
          </h1>
          <h2>客户未预约</h2>
        </div>
      </section>
    </div>
    <router-link
      :to="{
        name: 'sendOrders',
        query: { phone: this.phone },
      }"
      class="guest_footer_a"
      >派单</router-link
    >
    <footer class="guest_footer">
      <p class="content-header">
        <span>置业顾问</span>
        <span>接待次数</span>
        <span>状态</span>
      </p>

      <p :key="item.id" class="content-header-content" v-for="item in visitList">
        <span>{{ item.name }}</span>
        <span>{{ item.count }}</span>
        <span>
          <van-switch
            disabled
            @change="change(item)"
            active-color="#00a862"
            inactive-color="#fff"
            size="20"
            v-model="item.checked"
          />
        </span>
      </p>
    </footer>
  </div>
</template>

<script>
/* eslint-disable */

import api from '@/api/api'
import total from '@/api/total'

export default {
  data() {
    return {
      visitList: [],
      number: '',
      name: '',
      phone: '',
      user_name: '',
      created_at: '',
      planed_visit_time: '',
      customer_name: '',
      customer_phone: '',
      order_name: '',
      visitStatus: '',
      customer_source: '',
      responseId: '',
      showResult: false,
      showResultOrder: false,
      showOrder: false,
      show: true,
      formData: [],
      statusData: [],
      orderFieldList: ['customer_phone', 'is_new'],
      statusFieldList: ['arrive_visit'],
      tableID: 19,
      tableVisitID: 15,
      Data: '',
    }
  },
  created() {
    document.title = '判客岗'
  },
  computed: {
    encryption() {
      let phone = this.customer_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      this.customer_phone = phone
      return this.customer_phone
    },
  },
  mounted() {
    let sql = `select * from fdc_form_1_14 WHERE authority ~ '置业顾问';`
    api.getSqlJsonAPI(sql).then((res) => {
      res.data.forEach((el) => {
        el.state === '空闲' ? (el.checked = false) : (el.checked = true)
        el.count === null ? (el.count = 0) : ''
      })
      this.visitList = res.data
    })
    this.Data = total.formatDateTime()
    api.getFormAPI(this.tableID).then((res) => {
      this.fields = res.data.fields
      // 表单数据处理
      this.formData = total.tableListData(this.fields, this.orderFieldList)
    })
    api.getFormAPI(this.tableVisitID).then((res) => {
      this.fields = res.data.fields
      // 表单数据处理
      this.statusData = total.tableListData(this.fields, this.statusFieldList)
    })
  },
  methods: {
    change(item) {
      if (item.checked) {
        item.count++
      }
    },
    // 切换状态
    ToggleState() {
      if (this.visitStatus !== '已到访') {
        let payload = { response: { entries_attributes: [] } }
        this.statusData.forEach((element) => {
          switch (element.identity_key) {
            case 'arrive_visit': {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                value: '已到访',
              })
              break
            }
          }
        })
        // 自动填充值user_id
        payload.user_id = localStorage.getItem('user_id')
        api.putFormsAmendAPI(this.tableVisitID, this.responseId, payload).then((res) => {
          if (res.status === 200) {
            // 修改状态
            this.visitStatus = '已到访'
          }
        })
      }
    },
    // 清除提示
    cross() {
      this.showResult = false
    },
    orderCross() {
      this.showResultOrder = false
    },
    onSearch() {
      // 用户是否存在
      if (this.number.length === 4) {
        let sql = `select * from fdc_form_1_13 where phone ~ '${this.number}$'`
        api.getSqlJsonAPI(sql).then((res) => {
          res.status === 200 ? (this.showResult = true) : (this.showResult = false)
          if (!res.data[0]) {
            this.show = false
          } else {
            this.show = true
            this.user_name = res.data[0].saler
            this.phone = res.data[0].phone
            this.name = res.data[0].name
            this.created_at = res.data[0].created_at.slice(0, 10)
          }
          this.newTable()
        })
        // 用户是否预约
        let sqlVisit = `select * from fdc_form_1_15 where phone ~ '${this.number}$' and to_char(estimated_time,'YYYY-MM-DD')='${this.Data}'`
        api.getSqlJsonAPI(sqlVisit).then((res) => {
          this.planed_visit_time = '未到访'
          this.showResultOrder = true
          if (res.data[0]) {
            this.showOrder = true
            let data = res.data[0]
            this.phone = data.phone
            this.order_name = data.user_name
            this.customer_name = data.name
            this.customer_phone = data.phone
            this.customer_source = data.source
            this.visitStatus = data.arrive_visit
            this.responseId = data.response_id
            this.planed_visit_time = data.estimated_time.slice(0, 10)
          } else {
            this.showOrder = false
          }
        })
      } else {
        this.$toast('手机号位数错误')
        this.showResult = false
        this.showResultOrder = false
      }
    },
    // 传值
    newTable() {
      let payload = { response: { entries_attributes: [] } }
      this.formData.forEach((element) => {
        switch (element.identity_key) {
          case 'customer_phone': {
            if (this.number) {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                value: this.number,
              })
            }
            break
          }
          case 'is_new': {
            this.show
              ? payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  value: '老客户',
                })
              : payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  value: '新客户',
                })
            break
          }
          default: {
            if (element.value !== '' && element) {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                value: element.value,
              })
            }
          }
        }
      })

      // 自动填充值user_id
      payload.user_id = localStorage.getItem('user_id')
      api.postFormAPI(this.tableID, payload).then((res) => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.guest {
  width: 90%;
  margin: 0 auto;

  .guest_header {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #222;
    height: 3.125rem;
    line-height: 3.125rem;
  }

  .van-search .van-cell {
    height: 50px;
    line-height: 40px;
    border: 1px solid #dbd9d942;
    border-radius: 6px;
    box-shadow: 2px 4px 12px #cecece78;
  }

  /deep/ .van-field__left-icon {
    margin: 0px 0.5rem;
    .van-icon-search::before {
      font-size: 20px;
    }
  }

  .van-search__content {
    padding: 0rem;
  }

  .van-field__control {
    color: #222;
    font-size: 16px;
    font-weight: 500;
  }

  .guest_search_title {
    color: #00a862;
    font-size: 16px;
    font-weight: 500;
  }

  .guest_main {
    height: 100%;
    .guest_main_img {
      width: 11.5625rem;
      height: 10.28125rem;
      margin: 0 auto;
      margin-top: 50%;
      transform: translateY(-50%);
    }
  }
  .success_bg {
    position: relative;
    background: #e9f5ef;
    .success_icon {
      background: #00a862;
    }
  }
  .fail_bg {
    position: relative;
    background: #f9f1f1;
    .fail_icon {
      background: #f74a53;
    }
  }
  .guest_main_x {
    position: absolute;
    right: 13px;
    top: 13px;
    color: #b2b2b2;
    font-size: 22px;
    line-height: 22px;
  }

  .guest_main_hint_icon {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    margin: 25px auto 11px;
  }

  .guest_main_hint_message {
    padding-top: 10px;
    width: 80%;
    border-top: 1px solid #d4d4d4;
    p {
      text-align: left;
      color: #787878;
      font-size: 12px;
      line-height: 20px;
    }
    .guest_main_hint_button {
      text-align: center;
      margin: 20px auto 30px;
    }
    button {
      width: 96px;
      background: #00a862;
      color: #fff;
      border-radius: 4px;
      font-size: 16px;
      border: none;
      line-height: 30px;
      font-weight: 600;
    }
    .visited {
      background: #b2b2b2;
    }
  }

  .guest_main_hint {
    margin: 15px auto;

    .guest_main_hint_success_order {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      border-radius: 6px;

      h2 {
        width: 90%;
        font-size: 14px;
        color: #00a862;
        margin-bottom: 15px;
      }
    }

    .guest_main_hint_fail_order {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90%;
      height: 6rem;
      margin: 0px auto;
      padding-bottom: 10px;
      border-radius: 6px;

      h2 {
        width: 90%;
        font-size: 14px;
        color: #f74a53;
        margin-bottom: 15px;
      }
    }

    .guest_main_hint_fail {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      border-radius: 6px;

      h2 {
        width: 90%;
        font-size: 14px;
        color: #f74a53;
        margin-bottom: 15px;
      }
    }

    .guest_main_hint_success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 90%;
      margin: 0px auto;
      padding-bottom: 10px;
      border-radius: 6px;

      h2 {
        width: 90%;
        font-size: 14px;
        color: #00a862;
      }
    }
  }
}

.guest_footer_a {
  color: #fff;
  font-size: 16px;
  padding: 5px;
  border-radius: 3px;
  width: 98%;
  font-weight: 700;
  margin: 15px auto 0px;
  display: block;
  background: #00a862;
}

.guest_footer {
  margin: 20px auto;
}
.content-header {
  height: 25px;
  line-height: 25px;
  color: #00a862;
  font-size: 0.625rem;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  background: rgba(0, 168, 98, 0.08);
}
.content-header-content {
  height: 30px;
  line-height: 30px;
  display: flex;
  color: #787878;
  justify-content: space-between;
}
.content-header span,
.content-header-content span {
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
