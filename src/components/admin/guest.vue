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
            <p>客户姓名：{{name}}</p>
            <p>置业顾问：{{user_name}}</p>
            <p>首次到访时间：{{created_at}}</p>
            <p>最近到访时间：{{planed_visit_time}}</p>
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
            <p>客户姓名：{{customer_name}}</p>
            <p>客户电话：{{encryption}}</p>
            <p>渠道来源：{{customer_source}}</p>
            <p>预约人：{{order_name}}</p>

            <p class="guest_main_hint_button">
              <button
                :class="[this.visitStatus==='已到访'?'visited':'']"
                @click.once="ToggleState"
              >{{this.visitStatus==='已到访'?'已到访':'确认到访'}}</button>
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
      <!-- <section v-show="!showResult && !showResultOrder">
        <img alt class="guest_main_img" src="@/assets/img/Judgement-Img.png" />
      </section>-->
    </div>
    <a
      class="guest_footer_a"
      href="http://shandenabian.skylarkly.com/namespaces/1/yet_another_workflow/flows/5/journeys/new"
    >派单</a>
    <footer class="guest_footer">
      <p class="content-header">
        <span>置业顾问</span>
        <span>接待次数</span>
        <span>状态</span>
      </p>

      <p :key="item.id" class="content-header-content" v-for="item in visit">
        <span>{{item.name}}</span>
        <span>{{item.phone}}</span>
        <span>
          <van-switch
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
import api from '@/api/api'
import total from '@/api/total'

export default {
  data () {
    return {
      visit: [
        {

          name: '任海涛',
          phone: 0,
          checked: false
        },
        {
          name: '贺亚菲',
          phone: 0,
          checked: false
        },
        {
          name: '李罡皓',
          phone: 0,
          checked: false
        },
        {
          name: '雷洛',
          phone: 0,
          checked: false
        },
        {
          name: '鲜原',
          phone: 0,
          checked: false
        },
        {
          name: '徐爱玲',
          phone: 0,
          checked: false
        },
        {
          name: '刘鑫',
          phone: 0,
          checked: false
        }
      ],
      number: '',
      name: '',
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
      statusFieldList: ['arrive_visit']
    }
  },
  created () {
    document.title = '判客岗'
  },
  computed: {
    encryption () {
      let phone = this.customer_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.customer_phone = phone
      return this.customer_phone
    }
  },
  mounted () {
    // 是否有权限
    this.phone = this.$cookies.get('CURRENT-USER-PHONE')
    if (!this.phone) {
      sessionStorage.setItem('return', this.$route.name)
      this.$router.push({ name: 'login' })
    } else {
      api.getAdminQueryCustomerNewAPI().then(res => {
        this.fields = res.data.fields
        // 表单数据处理
        this.formData = total.tableListData(this.fields, this.orderFieldList)
      })
      api.getAdminAppointmentVisitsNewAPI().then(res => {
        this.fields = res.data.fields
        // 表单数据处理
        this.statusData = total.tableListData(this.fields, this.statusFieldList)
      })
    }
  },
  methods: {
    change (res) {
      if (res.checked) {
        res.phone++
      }
    },
    // 切换状态
    ToggleState () {
      if (this.visitStatus !== '已到访') {
        let payload = { response: { entries_attributes: [] } }
        this.statusData.forEach(element => {
          switch (element.identity_key) {
            case 'arrive_visit': {
              payload.response.entries_attributes.push({ field_id: element.field_id, value: '已到访' })
              break
            }
          }
        })
        // 自动填充值user_id
        payload.user_id = this.$cookies.get('CURRENT-USER-ID')
        api.putAdminAppointmentVisitsIdAPI(this.responseId, payload).then(res => {
          if (res.status === 200) {
            // 修改状态
            this.visitStatus = '已到访'
          }
        })
      }
    },
    // 清除提示
    cross () {
      this.showResult = false
    },
    orderCross () {
      this.showResultOrder = false
    },
    onSearch () {
      // 用户是否存在
      if (this.number.length === 4) {
        api.getAdminPhoneRepeatAPI(this.number).then(res => {
          res.status === 200
            ? this.showResult = true
            : this.showResult = false
          if (!res.data.customer) {
            this.show = false
          } else {
            this.show = true
            this.user_name = res.data.customer.user_name
            this.name = res.data.customer.customer_name
            this.created_at = res.data.customer.created_at.slice(0, 10)
          }
          this.newTable()
        })
        // 预约查询
        api.getAdminAppointmentVisitsAPI(this.number).then(res => {
          this.planed_visit_time = '未到访'
          this.showResultOrder = true
          if (res.data.appointment_visit) {
            this.showOrder = true
            let data = res.data.appointment_visit
            this.order_name = data.user_name
            this.customer_name = data.customer_name
            this.customer_phone = data.customer_phone
            this.customer_source = data.customer_source
            this.visitStatus = data.arrive_visit
            this.responseId = data.response_id
            this.planed_visit_time = data.planed_visit_time.slice(0, 10)
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
    newTable () {
      let payload = { response: { entries_attributes: [] } }
      this.formData.forEach(element => {
        switch (element.identity_key) {
          case 'customer_phone': {
            if (this.number) {
              payload.response.entries_attributes.push({ field_id: element.field_id, value: this.number })
            }
            break
          }
          case 'is_new': {
            this.show
              ? payload.response.entries_attributes.push({ field_id: element.field_id, value: '老客户' })
              : payload.response.entries_attributes.push({ field_id: element.field_id, value: '新客户' })
            break
          }
          default: {
            if (element.value !== '' && element) {
              payload.response.entries_attributes.push({ field_id: element.field_id, value: element.value })
            }
          }
        }
      })

      // 自动填充值user_id
      payload.user_id = this.$cookies.get('CURRENT-USER-ID')
      api.postAdminQueryCustomerAPI(payload).then(res => {
      })
    }
  }
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
    border: 1px solid #cbcbcb;
    border-radius: 6px;
    box-shadow: 0px 1px 7px 1px rgb(206, 206, 206);
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
  padding: 2px;
  border-radius: 3px;
  width: 98%;
  margin: 15px auto 0px;
  display: block;
  background: #2bcc7d;
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
