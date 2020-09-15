<template>
  <div class="app">
    <customer-tabbar :title="title" />

    <div class="content">
      <img class="img" src="@/assets/img/paper.jpeg" />
      <aside class="signing">
        <div :key="field.identity_key" v-for="field in formData">
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <!-- 付款方式 -->
            <p v-if="field.identity_key === 'paytype'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="待缓存"
                type="text"
                readonly
                v-model="paytype"
              />
            </p>
            <p v-else-if="field.identity_key === 'name'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
            <p v-else-if="field.identity_key === 'serial_number'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="待缓存"
                type="text"
                readonly
                v-model="field.value"
              />
            </p>
            <p v-else-if="field.identity_key === 'lowercase'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="待缓存"
                type="text"
                readonly
                v-model="lowercase"
              />
            </p>
            <p v-else-if="field.identity_key === 'capital'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="待缓存"
                type="text"
                readonly
                v-model="capital"
              />
            </p>

            <p v-else>
              <van-field
                @blur="blur(field)"
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入数字"
                type="number"
                v-model="field.value"
              />
            </p>
          </div>
          <!-- 多行文本 -->
          <div v-else-if="field.type === 'Field::TextArea'">
            <van-field
              :id="field.identity_key"
              :label="field.title"
              autocomplete="off"
              placeholder="请输入"
              type="textarea"
              autosize
              v-model="field.value"
            />
          </div>
          <!-- butoon -->
          <div v-else-if="field.type === 'Field::RadioButton'">
            <van-field :label="field.title">
              <template #input>
                <select :id="field.identity_key" class="table_aside_select" v-model="field.option_id">
                  <option
                    :key="option.id"
                    :value="option.id"
                    class="table_aside_option"
                    v-for="option in field.options"
                    >{{ option.value }}</option
                  >
                </select>
              </template>
            </van-field>
          </div>
          <div class="input_text" v-else-if="field.type === 'Field::Calculation'">
            <!-- 文本 -->
            <van-field
              :id="field.identity_key"
              :label="field.title"
              autocomplete="off"
              placeholder="请输入"
              type="text"
              v-model="field.value"
            />
          </div>

          <!-- 时间 -->
          <p v-else-if="field.type === 'Field::DateTime'">
            <van-field
              :id="field.identity_key"
              :label="field.title"
              :value="field.value"
              @click="showTime(field)"
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
                @confirm="onConfirmDate(currentDate, field)"
                title="请选择年月日"
                type="date"
                v-model="currentDate"
              />
            </van-popup>
          </p>

          <!-- 级联 -->
          <div class="input_text cascade" v-else-if="field.type === 'Field::CascadedSelect'">
            <p v-if="field.identity_key == 'new_room_number'">
              <van-field
                placeholder="点击选择房号"
                :id="field.identity_key"
                :label="field.title"
                :value="cascadeWorkingValue"
                @click="showPickerCascadeWorking = true"
                clickable
                readonly
              />
              <van-popup position="bottom" round v-model="showPickerCascadeWorking">
                <van-picker
                  :columns="field.columnsCe"
                  @cancel="showPickerCascadeWorking = false"
                  @confirm="onWorkingConfirm"
                  show-toolbar
                />
              </van-popup>
            </p>
          </div>
        </div>
      </aside>

      <footer @click="newTable(formData)" class="footer">
        发起票据打印
      </footer>
    </div>
  </div>
</template>

<script>
import CustomerTabbar from '../pages/tabbar'
import api from '@/api/api'
import total from '@/api/total'

export default {
  data() {
    return {
      userID: '',
      count: '',
      title: '票据打印',
      flowID: 60,
      formData: [],
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      cascadeValue: '',
      showPickerCascadeWorking: false,
      cascadeWorkingValue: '',
      paytype: '',
      pay: {
        cash: '',
        card: '',
        wechat: '',
        alipay: '',
        trans: '',
      },
      cash: 0,
      card: 0,
      wechat: 0,
      alipay: 0,
      trans: 0,
      lowercase: '',
      capital: '',
    }
  },

  components: {
    CustomerTabbar,
  },
  mounted() {
    this.userID = localStorage.getItem('user_id')
    api.getflowAPI(this.flowID).then((res) => {
      this.formData = total.flowListData(res.data.fields)

      // 查看流程数据数量
      let sql = `select count(*) from fdc_flow_1_60  ;`
      api.getSqlJsonAPI(sql).then((res) => {
        let count = res.data[0].count + 1
        this.count = total.filling(count)
        this.formData.forEach((el) => {
          switch (el.identity_key) {
            case 'serial_number': {
              el.value = this.count
            }
          }
        })
      })
    })
  },
  methods: {
    blur(el) {
      if (!el.value) {
        switch (el.identity_key) {
          case 'cash':
            this.cash = 0
            this.pay.cash = ``
            break
          case 'card':
            this.card = 0
            this.pay.card = ``
            break
          case 'wechat':
            this.wechat = 0
            this.pay.wechat = ``
            break
          case 'alipay':
            this.alipay = 0
            this.pay.alipay = ``
            break
          case 'trans':
            this.trans = 0
            this.pay.trans = ``
            break

          default:
            break
        }
      } else {
        // 缓存支付方式的值
        switch (el.identity_key) {
          case 'cash':
            this.cash = Number(el.value)
            let cash = total.format(el.value)
            this.pay.cash = `现金：${cash} `
            break
          case 'card':
            this.card = Number(el.value)
            let card = total.format(el.value)
            this.pay.card = `刷卡：${card} `
            break
          case 'wechat':
            this.wechat = Number(el.value)
            let wechat = total.format(el.value)
            this.pay.wechat = `微信：${wechat} `
            break
          case 'alipay':
            this.alipay = Number(el.value)
            let alipay = total.format(el.value)
            this.pay.alipay = `支付宝：${alipay} `
            break
          case 'trans':
            this.trans = Number(el.value)
            let trans = total.format(el.value)
            this.pay.trans = `转账：${trans}`
            break

          default:
            break
        }
      }

      this.paytype = `${this.pay.cash}${this.pay.card}${this.pay.wechat}${this.pay.alipay}${this.pay.trans}`
      let lowercase = this.cash + this.card + this.wechat + this.alipay + this.trans
      this.lowercase = total.format(lowercase)
      this.capital = total.number2text(lowercase)
    },
    // 级联
    onWorkingConfirm(cascadeValue, index) {
      this.formData.forEach((element) => {
        if (element.identity_key === 'new_room_number') {
          let cascade = element.columnsCe[index[0]].children[index[1]].children[index[2]]
          element.choice_id = cascade.id
          element.value = cascade.text
        }
      })

      let cascadeWorkingValue = cascadeValue.join('-')

      this.cascadeWorkingValue = cascadeWorkingValue
      this.showPickerCascadeWorking = false
    },
    showTime(field) {
      this.middleField = field.identity_key
      this.showPicker = true
    },
    // 时间选择器赋值
    onConfirmDate(currentDate) {
      this.dataTime = total.formatDate(currentDate)
      this.formData.forEach((el) => {
        if (this.middleField === el.identity_key) {
          el.value = this.dataTime
        }
      })
      this.showPicker = false
    },
    // 构建传输值的json格式
    newTable(formData) {
      let payload = {
        assignment: {
          response_attributes: {
            entries_attributes: [],
          },
          operation: 'route',
        },
        user_id: this.userID,
        webhook: {
          payload_url: '',
          subscribed_events: ['JourneyStatusEvent'],
        },
      }
      let entries = payload.assignment.response_attributes.entries_attributes
      formData.forEach((element) => {
        switch (element.type) {
          case 'Field::RadioButton': {
            if (element.option_id) {
              entries.push({
                field_id: element.field_id,
                option_id: element.option_id,
              })
            }
            break
          }
          case 'Field::DateTime': {
            if (element.value) {
              entries.push({
                field_id: element.field_id,
                value: element.value,
              })
            }
            break
          }
          // 级联
          case 'Field::CascadedSelect': {
            if (this.cascadeWorkingValue) {
              entries.push({
                field_id: element.field_id,
                choice_id: element.choice_id,
                value: element.value,
              })
            }
            break
          }
          // 文本
          default: {
            switch (element.identity_key) {
              // 付款方式+大小写传值
              case 'paytype':
                entries.push({
                  field_id: element.field_id,
                  value: this.paytype,
                })
                break
              case 'lowercase':
                entries.push({
                  field_id: element.field_id,
                  value: this.lowercase,
                })
                break
              case 'capital':
                entries.push({
                  field_id: element.field_id,
                  value: this.capital,
                })
                break
              case 'cash':
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: this.pay.cash,
                  })
                }
                break
              case 'card':
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: this.pay.card,
                  })
                }
                break
              case 'wechat':
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: this.pay.wechat,
                  })
                }
                break
              case 'alipay':
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: this.pay.alipay,
                  })
                }
                break
              case 'trans':
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: this.pay.trans,
                  })
                }
                break

              default:
                if (element.value) {
                  entries.push({
                    field_id: element.field_id,
                    value: element.value,
                  })
                  break
                }
            }
          }
        }
      })
      api.postflowAPI(this.flowID, payload).then((res) => {
        const id = res.data.next_vertices[0].id
        let payload = {
          assignment: {
            response_attributes: {
              entries_attributes: [],
            },
            operation: 'propose',
            next_vertex_id: id,
          },
          user_id: this.userID,
          webhook: {
            payload_url: '',
            subscribed_events: ['JourneyStatusEvent'],
          },
        }
        api.postflowAPI(this.flowID, payload).then((res) => {
          if (res.status === 200) {
            this.$toast('发起成功 ✨')
            this.$router.go(0)
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  width: 50vw;
  min-width: 23.125rem;
  margin: 1.25rem auto;
}
.img {
  width: 100%;
  margin-bottom: 2.5rem;
  height: 100%;
}
.signing {
  border-radius: 4px;
  padding: 0.8rem 1.2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.6);

  .table_aside_select {
    width: 60%;
  }
  /deep/ .van-field__label {
    width: 14.5rem;
  }
  /deep/ .van-field {
    flex-direction: column;
    .van-field__label {
      text-align: left;
      padding: 0px;
      color: #222222;
      font-size: 17px;
      width: 18.75rem;
    }
  }
  /deep/ .input_text {
    .van-field__control {
      border-bottom: 1px solid #e4e4e4;
    }
  }
}

.popup {
  padding: 10px;

  h3 {
    margin: 30px auto 40px;
  }
  .bottom {
    background-color: #00a862;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
    margin-top: 6.25rem;
    height: 2.5rem;
    border-radius: 8px;
    line-height: 2.5rem;
  }
}

.footer {
  margin-top: 1.25rem;
  border-radius: 8px;
  font-size: 16px;
  padding: 0.8rem 1.2rem;
  font-weight: 700;
  color: #fff;
  background-color: #00a862;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
