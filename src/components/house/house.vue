<template>
  <div class="housing">
    <tabbar :title="title" />
    <header class="house_header">
      <van-field v-model="building" label="楼栋" placeholder="请输入楼栋" />
      <button class="house_buttom" @click="search()">查看房源</button>
    </header>
    <div class="main">
      <div class="main_item" v-for="item in house" :key="item.id" @click="signing(item)">
        <div class="main_item_status" :class="item.class">
          <p>房屋编号：{{ item.room_number }}</p>
          <p>建筑面积：{{ item.covered_area }}</p>
          <p>套内面积：{{ item.inside_area }}</p>
          <p>挂牌单价：{{ item.univalence }}</p>
          <p>挂牌总价：{{ item.total }}</p>
        </div>
      </div>
    </div>
    <van-popup v-model="show" closeable round :style="{ height: '80%', width: '60%' }">
      <header class="popup">
        <van-search
          v-model="phone"
          show-action
          label="客户信息"
          maxlength="11"
          placeholder="请输入完整手机号"
          @search="onSearch"
          v-show="!this.buyData"
          @clear="onClear"
          clearable
        >
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
        <div class="user_data" v-show="this.userShow">
          <!-- 有客户信息展示 -->
          <div class="content" v-if="this.userDataShow">
            <div class="content_href">
              <div class="information-left">
                <div class="information-left-head">
                  <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
                </div>
                <div class="information-left-matter">
                  <p>客户姓名：{{ userData.name }}</p>
                  <p>客户手机号：{{ userData.phone }}</p>
                </div>
              </div>
            </div>
            <div class="content_footer">
              <span @click="buyer()">关联为买受人</span>
              <span @click="owner()">关联为共同拥有人</span>
            </div>
          </div>
          <!-- 新建客户组件 -->
          <div class="content" v-else>
            <p>未找到客户</p>
            <div class="popup_table_item" :key="field.identity_key" v-for="field in userFormData">
              <div class="input_text" v-if="field.identity_key === 'name'">
                <van-field
                  :label="field.title"
                  autocomplete="off"
                  placeholder="请输入"
                  v-model="field.value"
                  type="text"
                />
              </div>
              <div class="input_text" v-else-if="field.identity_key === 'phone'">
                <van-field
                  :label="field.title"
                  autocomplete="off"
                  placeholder="请输入"
                  v-model="phone"
                  type="number"
                  maxlength="11"
                />
              </div>
              <div class="input_text" v-else-if="field.identity_key === 'saler'">
                <van-field :label="field.title">
                  <template #input>
                    <select :id="field.identity_key" class="table_aside_select" v-model="field.value">
                      <option
                        :key="option.id"
                        :value="option.name"
                        class="table_aside_option"
                        v-for="option in field.options"
                        >{{ option.name }}</option
                      >
                    </select>
                  </template>
                </van-field>
              </div>
            </div>

            <footer class="message_footer">
              <div @click="newUsers(userFormData)">新建客户</div>
            </footer>
          </div>
        </div>
      </header>

      <h2 class="popup_main">认购单</h2>
      <div class="popup_table">
        <div class="popup_table_item" :key="field.identity_key" v-for="field in formData">
          <!-- text -->
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <van-field
              :id="field.identity_key"
              :label="field.title"
              autocomplete="off"
              placeholder="请输入"
              type="text"
              v-model="field.value"
            />
          </div>
          <div class="input_text" v-if="field.type === 'Field::TextArea'">
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
                @confirm="onConfirmDate"
                title="选择年月日"
                type="date"
                v-model="currentDate"
              />
            </van-popup>
          </p>
        </div>

        <footer>
          <div class="table_status" v-if="this.buyData">
            <router-link
              :to="{
                name: 'signing',
                query: { roomID: this.buyData.room_number },
              }"
            >
              <span>签约</span>
            </router-link>
            <span>退房</span>
            <span>换房</span>
            <span>更名</span>
          </div>
          <div class="table_footer" @click="newTable(formData)" v-else>确认认购</div>
        </footer>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Tabbar from '@/components/pages/tabbar'
import api from '@/api/api'
import total from '@/api/total'

export default {
  data() {
    return {
      title: '房源展示',
      newTime: '',
      building: '9',
      list: [],
      house: [],
      show: false,
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      phone: '',
      roomData: '',
      userData: '',
      formData: '',
      buyData: '',
      userShow: false,
      userDataShow: false,
      orderFieldList: [
        'room_number',
        'inside_area',
        'covered_area',
        'univalence',
        'total',
        'buyer_name',
        'buyer_phone',
        'buyer_card',
        'saler',
        'address',
        'owner',
        'discount',
        'trading_price',
        'trading_total',
        'stages',
        'stages_money',
        'bank',
        'mortgage_money',
        'signing_time',
      ],
      userFieldList: ['saler', 'saler_phone', 'name', 'phone'],
      formID: 17,
      userFormID: 13,
      adminFormID: 14,
      userFields: '',
      userFormData: '',
      dataID: '',
      statusID: '',
    }
  },
  components: {
    Tabbar,
  },
  mounted() {
    // 渲染房源销控表
    api.getFormAPI(this.formID).then((res) => {
      this.fields = res.data.fields
      // 表单数据处理
      this.formData = total.tableListData(this.fields, this.orderFieldList)
    })
    api.getFormAPI(this.userFormID).then((res) => {
      this.userFields = res.data.fields
      // 表单数据处理
      this.userFormData = total.tableListData(this.userFields, this.userFieldList)
      // 置业顾问单选
      let sql = `select * from fdc_form_1_14`
      api.getSqlJsonAPI(sql).then((res) => {
        this.userFormData.forEach((el) => {
          if (el.identity_key === 'saler') {
            el.options = res.data
          }
        })
      })
    })
  },
  methods: {
    // 清除搜索记录
    onClear() {
      this.phone = ''
    },
    buyer() {
      this.formData.forEach((res) => {
        switch (res.identity_key) {
          case 'buyer_name':
            res.value = this.userData.name
            break
          case 'buyer_phone':
            res.value = this.userData.phone
            break
          case 'saler':
            res.value = this.userData.saler
            break
          default:
            break
        }
      })
      this.userShow = false
    },
    owner() {
      this.formData.forEach((res) => {
        switch (res.identity_key) {
          case 'owner':
            res.value = `姓名：${this.userData.name}，手机号：${this.userData.phone}`
            break
          case 'saler':
            res.value = this.userData.saler
            break
          default:
            break
        }
      })
      this.userShow = false
    },
    onSearch() {
      let sql = `select * from fdc_form_1_13 WHERE phone ='${this.phone}'`
      api.getSqlJsonAPI(sql).then((res) => {
        this.userShow = true
        if (res.data[0]) {
          this.userData = res.data[0]
          this.userDataShow = true
        } else {
          this.userDataShow = false
        }
      })
    },
    search() {
      let sql = `select * from fdc_form_1_16 WHERE room_building ='${this.building}' ORDER BY room_number ASC;`
      api.getSqlJsonAPI(sql).then((res) => {
        this.house = total.houseStatus(res.data)
      })
    },
    // 选择房源
    signing(el) {
      this.roomData = el
      let sql = `select * from fdc_form_1_17 WHERE room_number ='${el.room_number}' ORDER BY room_number ASC;`
      api.getSqlJsonAPI(sql).then((res) => {
        this.buyData = res.data[0]
        // 签约状态自动填入
        this.formData.forEach((res) => {
          switch (res.identity_key) {
            case 'buyer_name':
              res.value = this.buyData ? this.buyData.buyer_name : ''
              break
            case 'buyer_phone':
              res.value = this.buyData ? this.buyData.buyer_phone : ''
              break
            case 'saler':
              res.value = this.buyData ? this.buyData.saler : ''
              break
            case 'buyer_card':
              res.value = this.buyData ? this.buyData.buyer_card : ''
              break
            case 'address':
              res.value = this.buyData ? this.buyData.address : ''
              break
            case 'owner':
              res.value = this.buyData ? this.buyData.owner : ''
              break
            case 'discount':
              res.value = this.buyData ? this.buyData.discount : ''
              break
            case 'trading_price':
              res.value = this.buyData ? this.buyData.trading_price : ''
              break
            case 'trading_total':
              res.value = this.buyData ? this.buyData.trading_total : ''
              break
            case 'stages':
              res.value = this.buyData ? this.buyData.stages : ''
              break
            case 'stages_money':
              res.value = this.buyData ? this.buyData.stages_money : ''
              break
            case 'bank':
              res.value = this.buyData ? this.buyData.bank : ''
              break
            case 'mortgage_money':
              res.value = this.buyData ? this.buyData.mortgage_money : ''
              break
            case 'signing_time':
              this.newTime = this.buyData ? this.buyData.signing_time : ''
              break
            default:
              break
          }
        })
      })
      this.dataID = el.response_id
      this.show = true
      // 房源状态自动写入
      this.formData.forEach((res) => {
        switch (res.identity_key) {
          case 'room_number':
            res.value = this.roomData.room_number
            break
          case 'covered_area':
            res.value = this.roomData.covered_area
            break
          case 'inside_area':
            res.value = this.roomData.inside_area
            break
          case 'room_price':
            res.value = this.roomData.room_price
            break
          case 'univalence':
            res.value = this.roomData.univalence
            break
          case 'room_status':
            if (this.roomData.room_status) {
              res.value = this.roomData.room_status
            } else {
              res.value = '空闲'
            }
            break
          case 'total':
            res.value = this.roomData.total
            break
          default:
            break
        }
      })
    },
    // 时间选择器赋值
    onConfirmDate(currentDate) {
      this.dataTime = this.formatDate(currentDate)
      this.newTime = this.dataTime
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
    newUsers(data) {
      let payload = { response: { entries_attributes: [] } }
      data.forEach((element) => {
        // 置业顾问手机号赋值
        if (element.identity_key === 'saler') {
          element.options.forEach((el) => {
            if (element.value === el.name) {
              this.newPhone = el.phone
            }
          })
        }
        switch (element.identity_key) {
          case 'saler_phone': {
            payload.response.entries_attributes.push({
              field_id: element.field_id,
              value: this.newPhone,
            })
            break
          }
          case 'phone': {
            payload.response.entries_attributes.push({
              field_id: element.field_id,
              value: this.phone,
            })
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
      // 自动填充值
      payload.user_id = localStorage.getItem('user_id')

      api.postFormAPI(this.userFormID, payload).then((res) => {
        if (res.status === 201) {
          this.$toast('新建成功 ✨')
          this.userDataShow = true
          this.onSearch()
        } else {
          this.$toast('新建失败 >_<')
        }
      })
    },
    newTable(formData) {
      let payload = { response: { entries_attributes: [] } }
      formData.forEach((element) => {
        switch (element.type) {
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
      // 自动填充值
      payload.user_id = localStorage.getItem('user_id')

      api.postFormAPI(this.formID, payload).then((res) => {
        if (res.status === 201) {
          this.$toast('认购成功 ✨')
          this.show = false
        } else {
          this.$toast('认购失败 >_<')
        }
      })

      // 修改房源状态为认购
      api.getResFormAPI(this.dataID).then((res) => {
        res.data.entries.forEach((el) => {
          if (el.field_id === 465) {
            this.statusID = el.id
          }
        })
        let data = {
          response: {
            entries_attributes: [{ id: this.statusID, option_id: 787, field_id: 465 }],
          },
          user_id: localStorage.getItem('user_id'),
        }
        api.putFormsAmendAPI(this.formID, this.dataID, data).then((res) => {})
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.housing {
  width: 80%;
  margin: 0 auto;
}
.house_header {
  padding: 20px;
  width: 50%;
  margin: 0 auto;

  .house_buttom {
    margin-top: 10px;
    background: #00a862;
    border: none;
    border-radius: 20px;
    height: 40px;
    margin-top: 40px;
    width: 70%;
    color: #fff;
    font-size: 16px;
  }
}

.main {
  margin-top: 20px;
  display: flex;
  padding: 0px 30px;
  justify-content: space-between;
  flex-wrap: wrap;

  .main_item {
    width: 17%;
  }

  .main_item_status {
    padding: 10px 5px;
    margin-top: 20px;
    background: #fff;
    border-radius: 6px;
    color: black;
    border: 1px solid #ddd;
    font-size: 15px;

    p {
      text-align: left;
      padding: 2px 10px 0px 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .buy {
    background: yellow;
  }
  .signing {
    color: #fff;
    background: #da4444;
  }

  .change {
    background: #a7a7a7;
    color: #fff;
  }
}
.popup {
  padding: 40px;
  width: 70%;
  margin: 0 auto;
}
.content {
  width: 82%;
  margin: 0 auto;
  padding: 20px 10px;
  border: 1px solid #9e9e9e47;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  .content_href {
    width: 85%;
    display: flex;
  }

  .content_footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;

    span {
      border: 1px solid #eee;
      padding: 5px;
      font-size: 15px;
      border-radius: 4px;
    }

    span:active {
      background-color: #f2f3f5;
    }
  }
}

.popup_table {
  margin: 20px auto 0px;
}

.popup_table_item {
  width: 70%;
  margin: 0 auto;
}

.information-left {
  display: flex;
  justify-content: space-around;
  align-content: center;

  .information-left-img {
    width: 46px;
    margin: 10px auto;
  }

  .information-left-matter {
    margin-left: 10px;
    text-align: left;
    line-height: 27px;

    h2 {
      font-size: 15px;
      font-weight: 600;
      color: #222;
      margin-bottom: 5px;
    }
    p {
      font-size: 14px;
      margin-top: 5px;
    }
  }
}

.table_footer {
  margin-top: 30px;
  bottom: 0px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  font-weight: 600;
  background: #00a862;
  color: #fff;
}

.table_status {
  margin: 30px 0px 10px;
  display: flex;
  justify-content: space-evenly;

  span {
    width: 10vw;
    border-radius: 4px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 600;
    background: #00a862;
    color: #fff;
    cursor: pointer;
  }

  span:active {
    background-color: #048b53;
  }
}

.message_footer {
  width: 40%;
  height: 37px;
  line-height: 37px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 7px;
  margin: 30px auto 0px;
  background: #00a862;
  color: #fff;
}

.table_aside_select {
  width: 67%;
  text-align: center;
  height: 30px;
}
</style>
