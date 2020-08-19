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
    }
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    api.getflowAPI(this.flowID).then((res) => {
      console.log(res)
      this.formData = total.flowListData(res.data.fields)
    })
  },
  methods: {
    // 构建传输值的json格式
    newTable(formData) {
      let payload = { response: { entries_attributes: [] } }
      formData.forEach((element) => {
        switch (element.type) {
          case 'Field::RadioButton': {
            if (element.option_id !== '') {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                option_id: element.option_id,
              })
            }
            break
          }
          case 'Field::CheckBox': {
            if (element.option_id !== '') {
              for (let i = 0; i < element.option_id.length; i++) {
                payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  option_id: element.option_id[i],
                })
              }
            }
            if (element.value) {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                option_id: 0,
                value: element.value,
              })
            }
            break
          }
          case 'Field::DateTime': {
            if (element.option_id !== '') {
              if (this.newTime) {
                payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  value: this.newTime,
                })
              }
            }
            break
          }
          case 'Field::CascadedSelect': {
            if (element.option_id !== ' ') {
              if (this.cascadeWorkingValue) {
                payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  choice_id: element.choice_id,
                  value: element.value,
                })
              }
            }
            break
          }
          default: {
            if (element.value !== '') {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                value: element.value,
              })
            }
          }
        }
      })

      api.postflowAPI(this.flowID, payload).then((res) => {
        if (res.status === 201) {
          this.$toast('新建成功 ✨')
          this.$router.push({
            name: 'buy',
            query: { response_id: res.data.id },
          })
        } else {
          this.$toast('新建失败 >_<')
        }
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
