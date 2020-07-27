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
                <span>{{planed_visit_time}}</span>
              </p>
            </div>
          </div>

          <a :href="'tel:'+ customer_phone" class="information-right">
            <i class="icon-Info-Icon-Phone"></i>
          </a>
        </div>
      </div>
      <aside class="table_aside">
        <div :key="field.identity_key" v-for="field in formData">
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <p v-if="field.identity_key == 'customer_name'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
            <p v-else-if="field.identity_key == 'customer_phone'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                disabled
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
          </div>

          <p v-else-if="field['type'] === 'Field::RadioButton'">
            <van-field :label="field['title']">
              <template #input>
                <van-radio-group
                  :id="field['identity_key']"
                  direction="horizontal"
                  v-model="field['option_id']"
                >
                  <div :key="option.id" v-for="option in field.options">
                    <van-radio :name="option.id" checked-color="#00A862">{{ option.value }}</van-radio>
                  </div>
                </van-radio-group>
              </template>
            </van-field>
          </p>
          <p v-else-if="field['type'] === 'Field::DateTime'">
            <van-field
              :id="field['identity_key']"
              :label="field['title']"
              :value="newTime"
              @click="showPicker = true"
              autocomplete="off"
              clickable
              name="datetimePicker"
              placeholder="点击选择时间"
              readonly
            />
            <van-popup position="bottom" round v-model="showPicker">
              <van-datetime-picker
                :max-date="maxDate"
                :min-date="minDate"
                @cancel="showPicker = false"
                @confirm="onConfirm"
                title="选择年月日"
                type="date"
                v-model="currentDate"
              />
            </van-popup>
          </p>
        </div>

        <div class="footer"></div>
      </aside>
    </div>

    <footer class="table_footer">
      <div @click="newTable">保存</div>
    </footer>
  </div>
</template>

<script>
import BuyMessageTabbar from '../pages/tabbar'
import api from '@/api/api'
export default {
  data () {
    return {
      title: '来电客户',
      fields: [],
      orderFieldList: ['customer_name', 'customer_phone', 'customer_gender', 'channel', 'focus', 'motivation', 'planed_visit_time', 'demand_floor', 'travel_mode', 'call_area', 'remark', 'intention_area', 'intention_product'],
      formData: [],
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      response_id: '',
      customer_phone: '',
      phone: '',
      id: '',
      customer_name: 'xxx',
      planed_visit_time: '0000/00/00',
      newTime: '',
      entries: [],
      isLoading: true
    }
  },

  components: {
    BuyMessageTabbar
  },
  mounted () {
    this.response_id = this.$route.query.response_id
    this.customer_phone = this.$route.query.customer_phone
    // 读取cookie
    this.id = this.$cookies.get('CURRENT-USER-ID')
    this.phone = this.$cookies.get('CURRENT-USER-PHONE')
    api.getSaleraCallersNewAPI().then(res => {
      this.fields = res.data.fields
      this.orderFieldList.forEach(element => {
        let field = this.fields.find(field => field.identity_key === element)
        if (field) {
          switch (field.type) {
            case 'Field::RadioButton': {
              this.formData.push({ field_id: field.id, identity_key: field.identity_key, type: field.type, title: field.title, option_id: '', options: field.options })
              break
            }
            case 'Field::DateTime': {
              this.formData.push({ field_id: field.id, identity_key: field.identity_key, type: field.type, title: field.title, value: '' })
              break
            }
            default: {
              this.formData.push({ field_id: field.id, identity_key: field.identity_key, type: field.type, title: field.title, value: '' })
            }
          }
        }
      })
    }).then(() => {
      // 新增数据
      api.getSalerCallersResponseIdAPI(this.response_id).then(res => {
        // 头部信息
        this.isLoading = false
        if (res.data.mapped_values.customer_name) {
          this.customer_name = res.data.mapped_values.customer_name.text_value[0]
        }
        if (res.data.mapped_values.planed_visit_time) {
          this.planed_visit_time = res.data.mapped_values.planed_visit_time.text_value[0]
        }
        this.entries = res.data.entries

        Object.keys(res.data.mapped_values).forEach(element => {
          if (res.data.mapped_values[element]['text_value']) {
            let field = this.formData.find(field => field.identity_key === element)
            if (field) {
              switch (field.type) {
                case 'Field::RadioButton': {
                  let optionValue = res.data.mapped_values[element]['text_value'][0]
                  let options = this.fields.find(field => field.identity_key === element).options
                  field.option_id = options.find(option => option.value === optionValue).id
                  break
                }
                case 'Field::DateTime': {
                  field.value = res.data.mapped_values[element]['text_value'][0]
                  this.newTime = field.value
                  break
                }
                default: {
                  field.value = res.data.mapped_values[element]['text_value'][0]
                }
              }
            }
          }
        })
      })
    })
  },
  methods: {
    onConfirm (currentDate) {
      this.dataTime = this.formatDate(currentDate)
      this.newTime = this.dataTime
      this.showPicker = false
    },
    formatDate: function (d) {
      return d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
    },
    p (s) {
      return s < 10 ? '0' + s : s
    },

    // 发送数据
    newTable () {
      let payload = { response: { entries_attributes: [] } }

      this.formData.forEach(field => {
        let entry = this.entries.find(entry => entry.field_id === field.field_id)

        switch (field.type) {
          case 'Field::RadioButton': {
            if (field.option_id) {
              if (entry && entry.option_id !== field.option_id) {
                payload.response.entries_attributes.push({ id: entry.id, option_id: field.option_id })
              } else if (entry) {

              } else {
                payload.response.entries_attributes.push({ field_id: field.field_id, option_id: field.option_id })
              }
            }
            break
          }
          case 'Field::DateTime': {
            if (this.newTime) {
              if (entry && entry.value !== this.newTime) {
                payload.response.entries_attributes.push({ id: entry.id, value: this.newTime })
              } else if (entry) {

              } else {
                payload.response.entries_attributes.push({ field_id: field.field_id, value: this.newTime })
              }
            }
            break
          }
          default: {
            if (field.value) {
              if (entry && entry.value !== field.value) {
                payload.response.entries_attributes.push({ id: entry.id, value: field.value })
              } else if (entry) {

              } else {
                payload.response.entries_attributes.push({ field_id: field.field_id, value: field.value })
              }
            }
          }
        }
      })

      payload.user_id = this.$cookies.get('CURRENT-USER-ID')
      api.putSalerCallersResponseIdAPI(this.response_id, payload).then(res => {
        if (res.status === 200) {
          this.$toast('更新成功✨')
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 100px;
}

.table_header {
  width: 4.0625rem;
  margin: 0.8125rem auto 1.0625rem;
}

.table_header .img {
  width: 100%;
}

.table_aside {
  width: 84%;
  margin: 0 auto;
}

/deep/ .van-field {
  flex-direction: column;

  .van-field__label {
    text-align: left;
    padding: 0px;
    color: #222222;
    font-size: 17px;
    width: 190px;
  }
}
.input_text {
  /deep/ .van-field__control {
    border-bottom: 1px solid #e4e4e4;
  }
}

.van-field__body {
  margin-top: 15px;
  font-size: 15px;
}

.van-field__control {
  font-size: 15px;
}
.van-picker__cancel {
  color: #787878;
  font-size: 15px;
  font-weight: 600;
}
.van-radio--horizontal {
  margin: 4px;
}

.van-radio-group--horizontal {
  flex-direction: column;
}

.van-picker__confirm {
  color: #00a862;
  font-size: 15px;
  font-weight: 600;
}

.table_footer {
  margin-top: 30px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 600;
  background: #00a862;
  color: #fff;
}

a {
  color: #fff;
}

.footer {
  height: 50px;
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
  height: 51px;
  line-height: 51px;
  border-bottom: 1px solid #f0f2f4;

  .buy_message_content_body_left {
    width: 96px;
    text-align: center;
    color: #929292;
    font-size: 14px;
  }

  .buy_message_content_body_right {
    color: #222;
    font-size: 14px;
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

// card
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
  background: #00a862;
  color: #fff;
  div {
    width: 100%;
    display: block;
  }
}
</style>
