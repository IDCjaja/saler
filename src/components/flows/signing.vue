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
          <div class="input_text" v-else-if="field.type === 'Field::TextArea'">
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
          <!-- 明细字段 -->
          <div class="detail" v-else-if="field.type === 'Field::Detail'">
            <p class="detail-title">{{ field.title }}</p>
            <div class="detail-item" :key="fields.id" v-for="(fields, index) in field.parent">
              <span>第{{ index + 1 }}期</span>
              <div :key="field.id" v-for="field in fields">
                <!-- 文本 -->
                <van-field
                  :label="field.title"
                  autocomplete="off"
                  placeholder="请输入"
                  type="text"
                  v-model="field.value"
                />
              </div>
            </div>

            <span class="detail-add" @click="addDetail(field)">添加{{ field.button_name }}</span>
          </div>
        </div>
      </aside>

      <footer @click="newTable(formData)" class="footer">
        发起签约流程
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
      title: '签约单',
      flowID: 27,
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
        // 签约状态自动填入
        this.formData.forEach((res) => {
          switch (res.identity_key) {
            case 'payment':
              if (this.signData) {
                switch (this.signData.payment) {
                  case '一次性':
                    res.option_id = '912'
                    break
                  case '分期':
                    res.option_id = '913'
                    break
                  case '贷款':
                    res.option_id = '914'
                    break

                  default:
                    break
                }
              }
              break
            default:
              res.value = this.signData ? this.signData[res.identity_key] : ''
              break
          }
        })
      })
    })
  },
  methods: {
    addDetail(el) {
      let child = JSON.parse(JSON.stringify(el.children))
      child.forEach((element) => {
        element.group_id = new Date().getTime()
      })
      el.parent.push(child)
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
      const url = 'http://shandenabian.skylarkly.com/magnate/hourse/status/sign'
      let payload = total.payloadBuild(formData, this.userID, url)
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
            payload_url: 'http://shandenabian.skylarkly.com/magnate/hourse/status/sign',
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
// 明细
.detail {
  margin: 20px;

  .detail-title {
    text-align: left;
    padding: 4px 0px;
    color: #222222;
    font-size: 17px;
  }

  .detail-item {
    background-color: #f6f6f6;
    margin-bottom: 4px;
    border-radius: 2px;

    span {
      padding: 5px;
      font-size: 16px;
      display: block;
    }
  }

  .detail-add {
    border: 2px solid #00a862;
    border-radius: 6px;
    padding: 4px 10px;
    margin-top: 20px;
    display: flex;
    width: 100px;
    justify-content: center;
  }
  .detail-add:hover {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  }

  /deep/ .van-field__control {
    border-bottom: 1px solid #e4e4e4;
  }

  .van-cell {
    background-color: #f6f6f6;
  }
}
</style>
