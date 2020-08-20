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
      userID: '',
    }
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    this.userID = localStorage.getItem('user_id')
    api.getflowAPI(this.flowID).then((res) => {
      this.formData = total.flowListData(res.data.fields)
    })

    const roomID = this.$route.query.roomID
    let sql = `select * from fdc_form_1_17 WHERE room_number ='${roomID}' ORDER BY room_number ASC;`
    api.getSqlJsonAPI(sql).then((res) => {
      console.log(res)
    })
  },
  methods: {
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
            if (element.option_id !== '') {
              entries.push({
                field_id: element.field_id,
                option_id: element.option_id,
              })
            }
            break
          }
          case 'Field::DateTime': {
            if (element.option_id !== '') {
              if (this.newTime) {
                entries.push({
                  field_id: element.field_id,
                  value: this.newTime,
                })
              }
            }
            break
          }
          // 文本
          default: {
            if (element.value !== '') {
              entries.push({
                field_id: element.field_id,
                value: element.value,
              })
            }
          }
        }
      })
      api.postflowAPI(this.flowID, payload).then((res) => {
        this.$toast('新建成功 ✨')
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
        }
        api.postflowAPI(this.flowID, payload).then((res) => {})
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
