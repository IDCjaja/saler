<template>
  <div class="detail_content">
    <Table border stripe height="900" :columns="columns" :data="data" :loading="loading"></Table>
    <Page
      :total="page.total"
      :page-size="page.pageSize"
      @on-change="currentChange"
      @on-page-size-change="pageSizeChange"
      show-sizer
      show-total
      class-name="page"
    />
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
          width: "120",
          resizable: true,
          filters: [
            {
              label: "何佳玲",
              value: 1,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              console.log(row);
              console.log(value);
              return row.saler === "何佳玲";
            } else if (value === 2) {
              return row.age < 25;
            }
          },
        },
        {
          title: "置业顾问电话",
          key: "saler_phone",
          width: "130",
          resizable: true,
        },
        {
          title: "客户姓名",
          key: "name",
          width: "100",
          resizable: true,
        },
        {
          title: "客户电话",
          key: "phone",
          width: "130",
          resizable: true,
        },
        {
          title: "性别",
          key: "gender",
          width: "100",
          resizable: true,
        },
        {
          title: "客户描摹",
          key: "depict",
          width: "200",
          resizable: true,
        },
        {
          title: "信息来源",
          key: "source",
          width: "100",
          resizable: true,
        },
        {
          title: "年龄",
          key: "age",
          width: "100",
          resizable: true,
        },
        {
          title: "来访渠道",
          key: "pathway",
          width: "100",
          resizable: true,
        },
        {
          title: "客户意向",
          key: "intention",
          width: "100",
          resizable: true,
        },
        {
          title: "是否排卡",
          key: "send_card",
          width: "100",
          resizable: true,
        },
        {
          title: "置业目的",
          key: "motivation",
          width: "100",
          resizable: true,
        },
        {
          title: "意向价格",
          key: "price",
          width: "150",
          resizable: true,
        },
        {
          title: "付款方式",
          key: "payment",
          width: "100",
          resizable: true,
        },
        {
          title: "有无购房资格",
          key: "entitlement",
          width: "150",
          resizable: true,
        },
        {
          title: "购房资格备注",
          key: "reason",
          width: "150",
          resizable: true,
        },
        {
          title: "客户主要抗性",
          key: "resistance",
          width: "150",
          resizable: true,
        },
        {
          title: "喜好户型",
          key: "house_type",
          width: "150",
          resizable: true,
        },
        {
          title: "居住区域",
          key: "living_area",
          width: "120",
          resizable: true,
        },
        {
          title: "工作区域",
          key: "working_area",
          width: "180",
          resizable: true,
        },
        {
          title: "预计来访时间",
          key: "estimated_time",
          width: "150",
          resizable: true,
        },
        {
          title: "填写时间",
          key: "created_at",
          width: "150",
          resizable: true,
        },
      ],
      data: [],
      page: {
        pageSize: 18,
        total: 0,
        current: 0,
      },
      loading: true,
    };
  },
  mounted() {
    this.getPageData();
    let sqlCount = `SELECT COUNT(*) FROM fdc_form_1_13;`;
    api.getSqlJsonAPI(sqlCount).then((res) => {
      this.page.total = res.data[0].count;
    });
  },
  methods: {
    getPageData() {
      this.loading = true;
      let sql = `select * from fdc_form_1_13  ORDER BY created_at DESC limit ${this.page.pageSize} OFFSET ${this.page.current}`;
      api.getSqlJsonAPI(sql).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10);
          if (element.estimated_time) {
            element.estimated_time = element.estimated_time.slice(0, 10);
          }
        });
        this.data = res.data;
        this.loading = false;
      });
    },
    currentChange(current) {
      this.page.current = this.page.pageSize * (current - 1);
      this.getPageData();
    },
    pageSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.getPageData();
    },
  },
};
</script>
<style lang="scss" >
.detail_content {
  margin: 0px auto;

  .ivu-table td,
  .ivu-table th {
    text-align: center;
  }
  .ivu-table th {
    color: #000;
    font-weight: 600;
  }
  .ivu-table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .ivu-table-row {
    height: 48px;
  }

  .page {
    margin-top: 20px;
  }
}
</style>
