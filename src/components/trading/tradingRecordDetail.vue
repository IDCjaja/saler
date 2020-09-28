<template>
  <div>
    <customer-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
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
          </div>
        </aside>
        <footer class="footer" @click="modifyData()">
          确认修改
        </footer>
      </div>
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
      title: '成交信息修改',
      isLoading: false,
      fromID: 22,
      formData: [],
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      middleField: '',
      entries: []
    }
  },
  components: {
    CustomerTabbar
  },
  mounted() {
    let responseId = this.$route.query.response_id
    api.getFormAPI(this.fromID).then((res) => {
      this.formData = total.ListData(res.data.fields)
    })
    // 渲染已填写值
    api.getResFormAPI(responseId).then((res) => {
      this.isLoading = false
      this.entries = res.data.entries
      // 双重遍历赋值！
      this.formData.forEach((ele) => {
        this.entries.forEach((res) => {
          if (ele.field_id === res.field_id) {
            switch (ele.type) {
              case 'Field::RadioButton':
                ele.option_id = res.option_id
                ele.id = res.id
                break
              default:
                ele.id = res.id
                ele.value = res.value
                break
            }
          }
        })
      })
    })
  },
  methods: {
    // 时间选择器赋值
    showTime(field) {
      this.middleField = field.identity_key
      this.showPicker = true
    },
    onConfirmDate(currentDate) {
      this.dataTime = total.formatDate(currentDate)
      this.formData.forEach((el) => {
        if (this.middleField === el.identity_key) {
          el.value = this.dataTime
        }
      })
      this.showPicker = false
    },
    modifyData() {
      let responseId = this.$route.query.response_id
      const userID = localStorage.getItem('user_id')
      const payload = this.payloadBuildTable(this.formData, userID)
      console.log(payload)
      api.putFormsAmendAPI(this.fromID, responseId, payload).then((res) => {
        if (res.status === 200) {
          this.$toast('更新成功 ✨')
        } else {
          this.$toast('网络波动，刷新再试一次～')
        }
      })
    },
    payloadBuildTable(formData, userID) {
      console.log(formData)
      let payload = { response: { entries_attributes: [] }, user_id: userID }
      let entries = payload.response.entries_attributes
      formData.forEach((element) => {
        console.log(element)
        switch (element.type) {
          case 'Field::RadioButton': {
            if (element.option_id) {
              if (element.id) {
                entries.push({
                  id: element.id,
                  value: element.value,
                  option_id: element.option_id
                })
              } else {
                entries.push({
                  field_id: element.field_id,
                  value: element.value,
                  option_id: element.option_id
                })
              }
            }
            break
          }

          // 文本+时间类型
          default: {
            if (element.value) {
              if (element.id) {
                entries.push({
                  id: element.id,
                  field_id: element.field_id,
                  value: element.value
                })
              } else {
                entries.push({
                  field_id: element.field_id,
                  value: element.value
                })
              }
            }
          }
        }
      })
      return payload
    }
  }
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
