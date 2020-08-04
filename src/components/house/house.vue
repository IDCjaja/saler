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
          <p>房屋编号：{{item.room_number}}</p>
          <p>建筑面积：{{item.covered_area}}</p>
          <p>套内面积：{{item.inside_area}}</p>
          <p>挂牌单价：{{item.univalence}}</p>
          <p>挂牌总价：{{item.total}}</p>
        </div>
      </div>
    </div>
    <van-popup v-model="show" closeable round :style="{ height: '80%',width:'50%' }">
      <header class="popup">
        <van-search
          v-model="saler"
          show-action
          label="客户信息"
          placeholder="请输入完整手机号"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch">搜索</div>
          </template>
        </van-search>
        <div class="content" v-show="this.userDataShow">
          <div class="content_href">
            <div class="information-left">
              <div class="information-left-head">
                <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
              </div>
              <div class="information-left-matter">
                <h2>{{userData.name}}</h2>
                <p>客户姓名：{{userData.name}}</p>
                <p>客户描摹：{{userData.depict}}</p>
                <p>客户手机号：{{userData.phone}}</p>
              </div>
            </div>
          </div>
          <a :href="'tel:' + 0" class="information-right">
            <i class="icon-Info-Icon-Phone"></i>
          </a>
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

        <footer class="table_footer">
          <div @click="newTable(formData)">确认认购</div>
        </footer>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Tabbar from "@/components/pages/tabbar";
import api from "@/api/api";
import total from "@/api/total";

export default {
  data() {
    return {
      title: "房源展示",
      newTime: "",
      building: "9",
      list: [],
      house: [],
      show: false,
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      saler: "",
      roomData: "",
      userData: "",
      userDataShow: "",
      formData: "",
      orderFieldList: [
        "room_number",
        "inside_area",
        "covered_area",
        "univalence",
        "total",
        "buyer_name",
        "buyer_phone",
        "buyer_card",
        "saler",
        "address",
        "owner",
        "discount",
        "trading_price",
        "trading_total",
        "stages",
        "stages_money",
        "bank",
        "mortgage_money",
        "signing_time",
      ],
      formID: 17,
      dataID: "",
    };
  },
  components: {
    Tabbar,
  },
  mounted() {
    // 渲染房源销控表
    api.getFormAPI(this.formID).then((res) => {
      this.fields = res.data.fields;
      // 表单数据处理
      this.formData = total.tableListData(this.fields, this.orderFieldList);
    });
  },
  methods: {
    onSearch() {
      let sql = `select * from fdc_form_1_13 WHERE phone ='${this.saler}'`;
      api.getSqlJsonAPI(sql).then((res) => {
        this.userData = res.data[0];
        this.userDataShow = true;
      });
    },
    search() {
      let sql = `select * from fdc_form_1_16 WHERE room_building ='${this.building}' ORDER BY room_number ASC;`;
      api.getSqlJsonAPI(sql).then((res) => {
        this.house = res.data;
        this.house.forEach((el) => {
          switch (el.room_status) {
            case "签约": {
              el.class = "signing";
              break;
            }
            case "认购": {
              el.class = "buy";
              break;
            }
            case "退房": {
              el.class = "change";
              break;
            }
            case "空闲": {
              break;
            }
            default: {
            }
          }
        });
      });
    },
    // 选择房源
    signing(el) {
      this.roomData = el;
      console.log(el);
      this.dataID = el.response_id;
      this.show = true;
      this.formData.forEach((res) => {
        switch (res.identity_key) {
          case "room_number":
            res.value = this.roomData.room_number;
            break;
          case "covered_area":
            res.value = this.roomData.covered_area;
            break;
          case "inside_area":
            res.value = this.roomData.inside_area;
            break;
          case "room_price":
            res.value = this.roomData.room_price;
            break;
          case "univalence":
            res.value = this.roomData.univalence;
            break;
          case "room_status":
            if (this.roomData.room_status) {
              res.value = this.roomData.room_status;
            } else {
              res.value = "空闲";
            }

            break;
          case "total":
            res.value = this.roomData.total;
            break;

          default:
            break;
        }
      });
    },
    // 时间选择器赋值
    onConfirmDate(currentDate) {
      this.dataTime = this.formatDate(currentDate);
      this.newTime = this.dataTime;
      this.showPicker = false;
    },
    // 时间格式处理
    formatDate: function (date) {
      return (
        date.getFullYear() +
        "-" +
        this.setDate(date.getMonth() + 1) +
        "-" +
        this.setDate(date.getDate())
      );
    },
    setDate(date) {
      return date < 10 ? "0" + date : date;
    },
    // 构建传输值的json格式
    newTable(formData) {
      let payload = { response: { entries_attributes: [] } };
      formData.forEach((element) => {
        switch (element.type) {
          case "Field::DateTime": {
            if (element.option_id !== "") {
              if (this.newTime) {
                payload.response.entries_attributes.push({
                  field_id: element.field_id,
                  value: this.newTime,
                });
              }
            }
            break;
          }
          default: {
            if (element.value !== "") {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                value: element.value,
              });
            }
          }
        }
      });
      // 自动填充值
      payload.user_id = this.$cookies.get("CURRENT-USER-ID");

      api.postFormAPI(this.formID, payload).then((res) => {
        if (res.status === 201) {
          this.$toast("认购成功 ✨");
        } else {
          this.$toast("认购失败 >_<");
        }
      });

      let data = {
        response: {
          entries_attributes: [{ field_id: 388, value: "认购" }],
        },
        user_id: this.$cookies.get("CURRENT-USER-ID"),
      };
      api.putFormsAmendAPI(this.formID, this.dataID, data).then((res) => {
        if (res.status === 201) {
          console.log("状态修改成功");
        } else {
        }
      });
    },
  },
};
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
    border-radius: 8px;
    color: black;
    box-shadow: 2px 4px 12px #8a8a8a30;
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
    box-shadow: 2px 3px 12px yellow;
  }
  .signing {
    color: #fff;
    background: #da4444;
    box-shadow: 2px 3px 12px #da4444;
  }

  .change {
    background: #a7a7a7;
    color: #fff;
    box-shadow: 2px 3px 12px #a7a7a7;
  }
}
.popup {
  padding: 40px;
}
.content {
  width: 88%;
  margin: 0 auto;
  padding: 5px;
  border-bottom: 1px solid #9e9e9e1c;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .content_href {
    width: 85%;
    display: flex;
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

    h2 {
      font-size: 15px;
      font-weight: 600;
      color: #222;
      margin-bottom: 5px;
    }
    p {
      font-size: 13px;
      color: #b2b2b2;
      margin-top: 5px;
    }
  }
}
.information-right {
  background: #e4f3ec;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 38px;
  .icon-Info-Icon-Phone {
    width: 100%;
    height: 100%;
    display: block;
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
</style>
