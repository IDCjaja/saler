<template>
  <div class="app">
    <customer-tabbar :title="title" />
    <div class="content">
      <aside class="signing">
        <div :key="field.identity_key" v-for="field in formData">
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <p>
              <!-- 文本 -->
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
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
        </div>
      </aside>

      <footer @click="newTable(formData)" class="footer">
        发起退房流程
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
      title: '退房单',
      flowID: 13,
      fields: [],
      formData: [],
      userID: '',
      signData: '',
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      middleField: '',
    }
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    this.userID = localStorage.getItem('user_id')
    api.getflowAPI(this.flowID).then((res) => {
      this.formData = total.flowListData(res.data.fields)

      const roomID = this.$route.query.roomID
      let sql = `select * from fdc_form_1_17 WHERE room_number ='${roomID}' ORDER BY room_number ASC;`
      api.getSqlJsonAPI(sql).then((res) => {
        this.signData = res.data[0]
        this.signData.created_at = this.signData.created_at.slice(0, 10)
        // 签约状态自动填入
        this.formData.forEach((res) => {
          switch (res.identity_key) {
            case 'buyer_name':
              res.value = this.signData ? this.signData.buyer_name : ''
              break
            case 'room_number':
              res.value = this.signData ? this.signData.room_number : ''
              break
            case 'subscription_time':
              res.value = this.signData ? this.signData.created_at : ''
              break
            case 'transaction_price':
              res.value = this.signData ? this.signData.univalence : ''
              break
            case 'trading_total':
              res.value = this.signData ? this.signData.total : ''
              break
            case 'inside_area':
              res.value = this.signData ? this.signData.inside_area : ''
              break
            case 'covered_area':
              res.value = this.signData ? this.signData.covered_area : ''
              break
            case 'payment_method':
              res.value = this.signData ? this.signData.payment : ''
              break

            default:
              break
          }
        })
      })
    })
  },
  methods: {
    showTime(field) {
      this.middleField = field.identity_key
      this.showPicker = true
    },
    // 时间选择器赋值
    onConfirmDate(currentDate) {
      this.dataTime = this.formatDate(currentDate)
      this.formData.forEach((el) => {
        if (this.middleField === el.identity_key) {
          el.value = this.dataTime
        }
      })
      this.showPicker = false
    },
    // 时间格式处理
    formatDate: function(date) {
      return date.getFullYear() + '-' + this.setDate(date.getMonth() + 1) + '-' + this.setDate(date.getDate())
    },
    setDate(date) {
      return date < 10 ? '0' + date : date
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
          payload_url: 'http://shandenabian.skylarkly.com/magnate/hourse/status/exit',
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
          // 文本
          default: {
            if (element.value) {
              entries.push({
                field_id: element.field_id,
                value: element.value,
              })
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
            payload_url: 'http://shandenabian.skylarkly.com/magnate/hourse/status/exit',
            subscribed_events: ['JourneyStatusEvent'],
          },
        }
        api.postflowAPI(this.flowID, payload).then((res) => {
          if (res.status === 200) {
            this.$toast('发起成功 ✨')
            this.$router.push({
              name: 'house',
            })
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
  min-width: 370px;
  margin: 1.25rem auto;
}
.signing {
  border-radius: 4px;
  padding: 0.8rem 1.2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);

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
      width: 300px;
    }
  }
  /deep/ .input_text {
    .van-field__control {
      border-bottom: 1px solid #e4e4e4;
    }
  }
}
.footer {
  margin-top: 1.25rem;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  color: #fff;
  background-color: #00a862;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
