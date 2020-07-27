<template>
  <div>
    <customer-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
      <aside class="table_aside">
        <div :key="field.identity_key" v-for="field in formData">
          <div class="input_text" v-if="field.identity_key === 'return_remark'">
            <van-field
              :id="field.identity_key"
              :label="field.title"
              autocomplete="off"
              placeholder="请输入"
              required
              type="text"
              v-model="field.value"
            />
          </div>
          <p  v-else-if="field.identity_key === 'return_type'">
            <van-field :label="field['title']" required>
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
          <p v-else-if="field.identity_key === 'revisit_date'">
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
              required
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
      <div @click.once="newTable">保存</div>
    </footer>
  </div>
</template>

<script>
import CustomerTabbar from '../pages/tabbar'
import api from '@/api/api'
export default {
  data () {
    return {
      title: '回访详情',
      isLoading: true,
      fields: [],
      orderFieldList: ['return_type', 'return_remark'],
      formData: [],
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      response_id: '',
      customer_phone: '',
      phone: '',
      id: '',
      newTime: '',
      ebtries: []
    }
  },
  components: {
    CustomerTabbar
  },
  mounted () {
    this.response_id = this.$route.query.response_id
    this.customer_phone = this.$route.query.customer_phone
    // 读取cookie
    this.id = this.$cookies.get('CURRENT-USER-ID')
    this.phone = this.$cookies.get('CURRENT-USER-PHONE')
    // 新增数据
    api.getSalerReturnVisitrRecordsNewAPI().then(res => {
      if (res.status === 200) {
        this.isLoading = false
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
                this.formData.push({ field_id: field.id, identity_key: field.identity_key, type: field.type, title: field.title, value: this.newTime })
                break
              }
              default: {
                this.formData.push({ field_id: field.id, identity_key: field.identity_key, type: field.type, title: field.title, value: '' })
              }
            }
          }
        })
      }
    }).then(() => {
      api.getSalerReturnVisitrRecordsAPI(this.response_id).then(res => {
        if (res.data.mapped_values.customer_name) {
          this.customer_name = res.data.mapped_values.customer_name.value[0]
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
      // 默认写入的值
      payload.user_id = this.$cookies.get('CURRENT-USER-ID')
      let salerField = this.fields.find(element => element.identity_key === 'saler')
      payload.response.entries_attributes.push({ field_id: salerField.id, value: this.$cookies.get('CURRENT-NAME') })
      let salerPhoneField = this.fields.find(element => element.identity_key === 'saler_phone')
      payload.response.entries_attributes.push({ field_id: salerPhoneField.id, value: this.$cookies.get('CURRENT-USER-PHONE') })
      let customerName = this.fields.find(element => element.identity_key === 'customer_name')
      payload.response.entries_attributes.push({ field_id: customerName.id, value: this.customer_name })
      let customerPhone = this.fields.find(element => element.identity_key === 'customer_phone')
      payload.response.entries_attributes.push({ field_id: customerPhone.id, value: this.customer_phone })

      api.postSalerReturnVisitrRecordsAPI(payload).then(res => {
        if (res.status === 201) {
          this.$toast('新建成功✨')
          setTimeout(() => {
            // 延迟跳转
            this.$router.push({ name: 'revisit', query: { response_id: this.response_id, customer_phone: this.customer_phone } })
          }, 2500)
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
</style>
