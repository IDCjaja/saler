<template>
  <div class="detail_content">
    <Table border stripe height="800" :columns="columns" :data="data"></Table>
  </div>
</template>
<script>
import api from "@/api/api";
export default {
  data() {
    return {
      columns: [
        {
          title: "置业顾问",
          key: "saler",
          fixed: "left",
          width: "100",
        },
        {
          title: "置业顾问电话",
          key: "saler_phone",
          width: "130",
        },
        {
          title: "客户姓名",
          key: "name",
          width: "100",
        },
        {
          title: "客户电话",
          key: "phone",
          width: "130",
        },
        {
          title: "性别",
          key: "gender",
          width: "100",
        },
        {
          title: "客户描摹",
          key: "depict",
          width: "200",
        },
        {
          title: "信息来源",
          key: "source",
          width: "100",
        },
        {
          title: "年龄",
          key: "age",
          width: "100",
        },
        {
          title: "来访渠道",
          key: "pathway",
          width: "100",
        },
        {
          title: "客户意向",
          key: "intention",
          width: "100",
        },
        {
          title: "是否排卡",
          key: "send_card",
          width: "100",
        },
        {
          title: "置业目的",
          key: "motivation",
          width: "100",
        },
        {
          title: "意向价格",
          key: "price",
          width: "150",
        },
        {
          title: "付款方式",
          key: "payment",
          width: "100",
        },
        {
          title: "有无购房资格",
          key: "entitlement",
          width: "150",
        },
        {
          title: "购房资格备注",
          key: "reason",
          width: "150",
        },
        {
          title: "客户主要抗性",
          key: "resistance",
          width: "150",
        },
        {
          title: "喜好户型",
          key: "house_type",
          width: "150",
        },
        {
          title: "居住区域",
          key: "living_area",
          width: "120",
        },
        {
          title: "工作区域",
          key: "working_area",
          width: "180",
        },
        {
          title: "预计来访时间",
          key: "estimated_time",
          width: "150",
        },
        {
          title: "填写时间",
          key: "created_at",
          width: "150",
        },
      ],
      data: [],
    };
  },
  mounted() {
    let sql = `select * from fdc_form_1_13  ORDER BY created_at DESC limit 20 OFFSET 0`;
    api.getSqlJsonAPI(sql).then((res) => {
      console.log(res);
      res.data.forEach((element) => {
        element.created_at = element.created_at.slice(0, 10);
        if (element.estimated_time) {
          element.estimated_time = element.estimated_time.slice(0, 10);
        }
      });
      this.data = res.data;
    });
  },
};
</script>
<style lang="scss" >
.detail_content {
  margin: 50px auto;

  .ivu-table td,
  .ivu-table th {
    text-align: center;
  }
  .ivu-table th {
    color: #000;
    font-weight: 600;
    background-color: #e3e3e6;
  }
  .ivu-table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
