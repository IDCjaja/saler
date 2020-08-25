<template>
  <div class="app">
    <customer-tabbar :title="title" />

    <div class="content">
      <img class="img" src="@/assets/img/guest.png" />
      <aside class="signing">
        <div :key="field.identity_key" v-for="field in formData">
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <p>
              <!-- 文本 -->
              <van-field
                required
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
          </div>
        </div>
      </aside>
      <van-popup v-model="show" closeable class="popup" round :style="{ height: '60%', width: '80%' }">
        <h3>下一节点</h3>
        <van-field label="下一节点：" placeholder="置业顾问" readonly />
        <van-field
          readonly
          clickable
          name="picker"
          :value="value"
          label="选择处理者："
          placeholder="点击选择处理人"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
        </van-popup>

        <div @click="spendFlow(formData)" class="bottom">
          确认
        </div>
      </van-popup>

      <footer @click="newTable(formData)" class="footer">
        发起派单流程
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
      value: '',
      columns: [],
      showPicker: false,
      title: '派单',
      flowID: 25,
      fields: [],
      formData: [],
      userID: '',
      show: false,
      userData: {},
      dataArr: [],
      reviewerID: '',
      nextVertexID: '',
    }
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    //   空闲状态的置业顾问
    let sql = `select * from fdc_form_1_14 WHERE authority ~ '置业顾问' and status = '空闲' ;`
    api.getSqlJsonAPI(sql).then((res) => {
      res.data.forEach((el) => {
        this.columns.push(el.name)
      })
    })
    api.getOrganizationsAPI(4).then((res) => {
      this.dataArr = res.data
      api.getOrganizationsAPI(8).then((res) => {
        this.dataArr = [...res.data, ...this.dataArr]
      })
    })
    this.userID = localStorage.getItem('user_id')
    api.getflowAPI(this.flowID).then((res) => {
      this.formData = total.flowListData(res.data.fields)

      const phone = this.$route.query.phone
      let sql = `select * from fdc_form_1_13 WHERE phone ='${phone}';`
      api.getSqlJsonAPI(sql).then((res) => {
        this.userData = res.data[0]
        // 缓存值自动填入
        this.formData.forEach((res) => {
          switch (res.identity_key) {
            case 'name':
              res.value = this.userData ? this.userData.name : ''
              break
            case 'phone':
              res.value = this.userData ? this.userData.phone : ''
              break

            default:
              break
          }
        })
      })
    })
  },
  methods: {
    onConfirm(value) {
      this.dataArr.forEach((el) => {
        if (el.name === value) {
          this.reviewerID = el.id
        }
      })
      this.value = value
      this.showPicker = false
    },
    spendFlow(formData) {
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
        if (res.status === 200) {
          // 下一节点走起
          this.nextVertexID = res.data.next_vertices[0].id
          let payload = {
            assignment: {
              response_attributes: {
                entries_attributes: [],
              },
              operation: 'propose',
              next_vertex_id: this.nextVertexID,
              next_reviewer_ids: [this.reviewerID],
            },
            user_id: this.userID,
          }
          api.postflowAPI(this.flowID, payload).then((res) => {
            this.show = false
            if (res.status === 200) {
              this.$toast('发起成功 ✨')
              this.$router.push({
                name: 'guest',
              })
            }
          })
        }
      })
    },

    newTable(formData) {
      this.show = true
      this.value = this.userData.saler
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
