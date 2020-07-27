<template>
  <div>
    <customer-tabbar :title="title" />
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <div v-show="!isLoading">
      <header class="table_header">
        <img alt class="img" src="@/assets/img/Avator-Man.png" />
      </header>
      <aside class="table_aside">
        <div :key="field.identity_key" v-for="field in formData">
          <!-- <div v-if="field.type === 'Field::CheckBox'">
            <van-field name="checkboxGroup" :label="field.title">
              <template #input>
                <van-checkbox-group v-model="field.option_id">
                  <div :key="option.id" v-for="option in field.options">
                    <van-checkbox :name="option.id" checked-color="#00A862">{{option.value}}</van-checkbox>
                  </div>
                  <div v-if="field.other_option">
                    <p class="other">
                      <span>其他：</span>
                      <van-field
                        autocomplete="off"
                        placeholder="请输入"
                        autosize
                        v-model="field.value"
                      />
                    </p>
                  </div>
                </van-checkbox-group>
              </template>
            </van-field>
          </div>-->
          <!-- text -->
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
          <div class="input_text" v-if="field.type === 'Field::TextField'">
            <p v-if="field.identity_key == 'customer_name'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
            <p v-else-if="field.identity_key == 'customer_phone'">
              <van-field
                :id="field.identity_key"
                :label="field.title"
                autocomplete="off"
                disabled
                placeholder="请输入"
                type="text"
                v-model="field.value"
              />
            </p>
            <p v-else-if="field.identity_key == 'reason'" />
            <p v-else-if="field.identity_key == 'lottery_results'" />

            <p v-else>
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
          <!-- button -->
          <div v-else-if="field['type'] === 'Field::RadioButton'">
            <div v-if="field.identity_key === 'entitlement'" />
            <div v-else-if="field.identity_key === 'lottery'" />

            <div v-else>
              <van-field :label="field['title']">
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
            </div>
          </div>
          <!-- DataTime -->
          <p v-else-if="field['type'] === 'Field::DateTime'">
            <van-field
              :id="field['identity_key']"
              :label="field['title']"
              :value="newTime"
              @click="showPicker = true"
              autocomplete="off"
              clickable
              name="datetimePicker"
              placeholder="点击选择时间"
              readonly="readonly"
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

        <!-- button_text -->
        <div class="button_text">
          <div :key="field.identity_key" v-for="field in formData">
            <div v-if="field.identity_key === 'entitlement'">
              <van-field :label="field.title">
                <template #input>
                  <van-radio-group
                    :id="field.identity_key"
                    direction="horizontal"
                    v-model="field.option_id"
                  >
                    <div :key="option.id" v-for="option in field.options">
                      <van-radio
                        :name="option.id"
                        @click="buy(option)"
                        checked-color="#00A862"
                      >{{ option.value }}</van-radio>
                    </div>
                  </van-radio-group>
                </template>
              </van-field>
            </div>
            <div class="input_text" v-if="field.identity_key === 'reason'" v-show="reason">
              <van-field
                :id="field.identity_key"
                autocomplete="off"
                class="reason"
                placeholder="备注："
                type="text"
                v-model="field.value"
              />
            </div>
            <div v-if="field.identity_key === 'lottery'">
              <van-field :label="field.title">
                <template #input>
                  <van-radio-group
                    :id="field.identity_key"
                    direction="horizontal"
                    v-model="field.option_id"
                  >
                    <div :key="option.id" v-for="option in field.options">
                      <van-radio
                        :name="option.id"
                        @click="lottery(option)"
                        checked-color="#00A862"
                      >{{ option.value }}</van-radio>
                    </div>
                  </van-radio-group>
                </template>
              </van-field>
            </div>
            <div
              class="input_text"
              v-if="field.identity_key === 'lottery_results'"
              v-show="lottery_results"
            >
              <van-field
                :id="field.identity_key"
                autocomplete="off"
                class="reason"
                placeholder="请输入摇号号码："
                type="text"
                v-model="field.value"
              />
            </div>
          </div>
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
import CustomerTabbar from "../pages/tabbar";
import api from "@/api/api";
// import total from "@/api/total";

export default {
  data() {
    return {
      title: "客户基础信息",
      isLoading: true,
      fields: [],
      orderFieldList: [
        "customer_name",
        "customer_phone",
        "customer_gender",
        "remark",
        "source",
        "age",
        "entitlement",
        "reason",
        "birthday",
        "email",
        "intention",
        "channel",
        "motivation",
        "focus",
        "preferred_apartment",
        "price_range",
        "working_area",
        "living_area",
        "living_area2",
        "payment_method",
        "lottery",
        "lottery_results",
        "unicon_test",
        "customer_resistance",
      ],
      formData: [],
      showPicker: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2220, 10, 1),
      currentDate: new Date(),
      response_id: "",
      customer_phone: "",
      phone: "",
      id: "",
      newTime: "",
      ebtries: [],
      reason: true,
      lottery_results: true,
    };
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    this.response_id = this.$route.query.response_id;
    this.customer_phone = this.$route.query.customer_phone;
    // 读取cookie
    this.id = this.$cookies.get("CURRENT-USER-ID");
    this.phone = this.$cookies.get("CURRENT-USER-PHONE");
    // 拉取表项
    api
      .getSaleraArriveVisitorsNewAPI()
      .then((res) => {
        this.fields = res.data.fields;
        // this.formData = total.tableListData(this.fields, this.orderFieldList);

        this.orderFieldList.forEach((element) => {
          let field = this.fields.find(
            (field) => field.identity_key === element
          );
          if (field) {
            switch (field.type) {
              case "Field::RadioButton": {
                this.formData.push({
                  field_id: field.id,
                  identity_key: field.identity_key,
                  type: field.type,
                  title: field.title,
                  option_id: "",
                  options: field.options,
                });
                break;
              }
              case "Field::CheckBox": {
                this.formData.push({
                  field_id: field.id,
                  identity_key: field.identity_key,
                  type: field.type,
                  title: field.title,
                  option_id: field.option_id,
                  options: field.options,
                  other_option: field.other_option,
                });
                break;
              }
              case "Field::DateTime": {
                this.formData.push({
                  field_id: field.id,
                  identity_key: field.identity_key,
                  type: field.type,
                  title: field.title,
                  value: "",
                });
                break;
              }

              default: {
                this.formData.push({
                  field_id: field.id,
                  identity_key: field.identity_key,
                  type: field.type,
                  title: field.title,
                  value: "",
                });
              }
            }
          }
        });
      })
      .then(() => {
        // 渲染表项
        api
          .getSalerArriveVisitorsResponseIdAPI(this.response_id)
          .then((res) => {
            this.entries = res.data.entries;
            this.isLoading = false;

            Object.keys(res.data.mapped_values).forEach((element) => {
              console.log(element);
              if (res.data.mapped_values[element]["text_value"]) {
                let field = this.formData.find(
                  (field) => field.identity_key === element
                );
                if (field) {
                  switch (field.type) {
                    case "Field::RadioButton": {
                      let optionValue =
                        res.data.mapped_values[element]["text_value"][0];
                      let options = this.fields.find(
                        (field) => field.identity_key === element
                      ).options;
                      field.option_id = options.find(
                        (option) => option.value === optionValue
                      ).id;
                      break;
                    }
                    // case "Field::CheckBox": {
                    //   let optionValue =
                    //     res.data.mapped_values[element]["text_value"];
                    //   let option_id = this.fields.find(
                    //     (field) => field.identity_key === element
                    //   ).id;
                    //   field.option_id = optionValue;
                    //   break;
                    // }
                    case "Field::DateTime": {
                      field.value =
                        res.data.mapped_values[element]["text_value"][0];
                      this.newTime = field.value;
                      break;
                    }
                    default: {
                      field.value =
                        res.data.mapped_values[element]["text_value"][0];
                    }
                  }
                }
              }
            });
          });
      });
  },
  methods: {
    // 是否显示购房资格备注
    buy(option) {
      option.value === "无" ? (this.reason = true) : (this.reason = false);
    },
    // 是否显示摇号结果
    lottery(option) {
      option.value
        ? (this.lottery_results = true)
        : (this.lottery_results = false);
    },
    // 时间选择器 赋值
    onConfirm(currentDate) {
      this.dataTime = this.formatDate(currentDate);
      this.newTime = this.dataTime;
      this.showPicker = false;
    },
    formatDate: function (d) {
      return (
        d.getFullYear() +
        "-" +
        this.p(d.getMonth() + 1) +
        "-" +
        this.p(d.getDate())
      );
    },
    p(s) {
      return s < 10 ? "0" + s : s;
    },

    // 发送表单数据
    newTable() {
      let payload = { response: { entries_attributes: [] } };
      this.formData.forEach((field) => {
        let entry = this.entries.find(
          (entry) => entry.field_id === field.field_id
        );
        switch (field.type) {
          case "Field::RadioButton": {
            if (field.option_id) {
              if (entry && entry.option_id !== field.option_id) {
                payload.response.entries_attributes.push({
                  id: entry.id,
                  option_id: field.option_id,
                });
              } else if (entry) {
              } else {
                payload.response.entries_attributes.push({
                  field_id: field.field_id,
                  option_id: field.option_id,
                });
              }
            }
            break;
          }
          case "Field::DateTime": {
            if (this.newTime) {
              if (entry && entry.value !== this.newTime) {
                payload.response.entries_attributes.push({
                  id: entry.id,
                  value: this.newTime,
                });
              } else if (entry) {
              } else {
                payload.response.entries_attributes.push({
                  field_id: field.field_id,
                  value: this.newTime,
                });
              }
            }
            break;
          }
          default: {
            if (field.value) {
              if (entry && entry.value !== field.value) {
                payload.response.entries_attributes.push({
                  id: entry.id,
                  value: field.value,
                });
              } else if (entry) {
              } else {
                payload.response.entries_attributes.push({
                  field_id: field.field_id,
                  value: field.value,
                });
              }
            }
          }
        }
      });

      payload.user_id = this.$cookies.get("CURRENT-USER-ID");
      api.putSalerArriveVisitorsAPI(this.response_id, payload).then((res) => {
        if (res.status === 200) {
          this.$toast("更新成功 ✨");
          this.$router.push({
            name: "message",
            query: {
              customer_phone: this.customer_phone,
              response_id: res.data.id,
            },
          });
        } else {
          this.$toast("更新失败 >_<");
        }
      });
    },
  },
};
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
  width: 87%;
  margin: 0 auto;
  overflow: hidden;
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
.reason {
  margin-top: -45px;
  margin-left: 4.375rem;
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

.van-radio-group--horizontal {
  flex-direction: column;
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
.van-checkbox {
  margin-top: 8px;
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

.other {
  display: flex;

  span {
    width: 100px;
    margin: 10px 0px 0px 28px;
  }
}
</style>
