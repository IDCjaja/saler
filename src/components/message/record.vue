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
              type="textarea"
              autosize
              required
              v-model="field.value"
            />
          </div>
          <p v-else-if="field.identity_key === 'return_type'">
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
        </div>

        <div class="footer"></div>
      </aside>
    </div>
    <footer class="table_footer">
      <div @click.once="newTable(formData)">保存</div>
    </footer>
  </div>
</template>

<script>
import CustomerTabbar from "../pages/tabbar";
import api from "@/api/api";
import total from "@/api/total";

export default {
  data() {
    return {
      title: "回访详情",
      isLoading: true,
      fields: [],
      orderFieldList: ["return_type", "return_remark"],
      formData: [],
      showPicker: false,
      response_id: "",
      customer_phone: "",
      customer_name: "",
      phone: "",
      id: "",
      ebtries: [],
      formID: 18,
      list: "",
    };
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    this.response_id = this.$route.query.response_id;
    this.customer_phone = this.$route.query.customer_phone;
    // 读取cookie
    this.id = localStorage.getItem("user_id");
    this.phone = localStorage.getItem("user_phone");
    // 新增数据
    api.getFormAPI(this.formID).then((res) => {
      if (res.status === 200) {
        this.isLoading = false;
        this.fields = res.data.fields;
        // 表单数据处理
        this.formData = total.tableListData(this.fields, this.orderFieldList);
      }
    });

    let sql = `select * from fdc_form_1_13 WHERE response_id ='${this.response_id}'`;
    api.getSqlJsonAPI(sql).then((res) => {
      this.list = res.data[0];
      this.customer_name = this.list.name;
    });
  },
  methods: {
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

    // 发送数据
    newTable(formData) {
      let payload = { response: { entries_attributes: [] } };
      formData.forEach((element) => {
        switch (element.type) {
          case "Field::RadioButton": {
            if (element.option_id !== "") {
              payload.response.entries_attributes.push({
                field_id: element.field_id,
                option_id: element.option_id,
              });
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

      // 默认写入的值
      payload.user_id = localStorage.getItem("user_id");
      let salerField = this.fields.find(
        (element) => element.identity_key === "saler"
      );
      payload.response.entries_attributes.push({
        field_id: salerField.id,
        value: localStorage.getItem("user_name"),
      });
      let salerPhoneField = this.fields.find(
        (element) => element.identity_key === "saler_phone"
      );
      payload.response.entries_attributes.push({
        field_id: salerPhoneField.id,
        value: localStorage.getItem("user_phone"),
      });
      let customerName = this.fields.find(
        (element) => element.identity_key === "customer_name"
      );
      payload.response.entries_attributes.push({
        field_id: customerName.id,
        value: this.customer_name,
      });
      let customerPhone = this.fields.find(
        (element) => element.identity_key === "customer_phone"
      );
      payload.response.entries_attributes.push({
        field_id: customerPhone.id,
        value: this.customer_phone,
      });

      api.postFormAPI(this.formID, payload).then((res) => {
        if (res.status === 201) {
          this.$toast("新建成功✨");
          setTimeout(() => {
            // 延迟跳转
            this.$router.push({
              name: "revisit",
              query: {
                response_id: this.response_id,
                customer_phone: this.customer_phone,
              },
            });
          }, 2500);
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
