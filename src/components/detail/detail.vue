<template>
  <div class="detail_content">
    <header class="header">
      <!-- 筛选条件： -->
      <div class="header-select">
        <select class="select" v-model="search.type">
          <option :key="option.key" :value="option.key" class="option" v-for="option in columns">{{
            option.title
          }}</option>
        </select>
        <van-search
          class="search"
          shape="round"
          v-model="search.value"
          placeholder="请输入搜索关键词"
          @blur="onSearch"
        />
      </div>
      <img class="export" @click="exportData" src="@/assets/img/table_btn_download.png" />
    </header>
    <div class="table">
      <Table
        ref="table"
        border
        stripe
        height="680"
        @on-row-click="rowClick"
        :columns="columns"
        :data="data"
        :loading="loading"
      ></Table>
      <!-- 分页器 -->
      <Page
        :total="page.total"
        :page-size="page.pageSize"
        @on-change="currentChange"
        prev-text="上一页"
        next-text="下一页"
        show-total
        class-name="page"
      />
    </div>

    <!-- 弹框 -->
    <van-popup v-model="show" round closeable close-icon="close" :style="{ height: '80%', width: '90%' }">
      <header class="popup-header">客户详情</header>
      <div class="popup">
        <div v-for="item in showArr" :key="item.id">
          <p v-if="item.identity_key === 'depict'">
            <van-field readonly type="textarea" autosize :label="item.title" :value="showObj[item.identity_key]" />
          </p>
          <p v-else-if="item.identity_key === 'working_area'">
            <van-field readonly type="textarea" autosize :label="item.title" :value="showObj[item.identity_key]" />
          </p>
          <p v-else-if="item.identity_key === 'phone'" v-show="showPhone">
            <van-field readonly autosize :label="item.title" :value="showObj[item.identity_key]" />
          </p>
          <p v-else>
            <van-field readonly :label="item.title" :value="showObj[item.identity_key]" />
          </p>
        </div>
        <div v-for="item in visitObj" :key="item.id">
          <div v-for="visit in showVisitArr" :key="visit.id">
            <p v-if="visit.identity_key === 'return_remark'">
              <van-field readonly type="textarea" autosize :label="visit.title" :value="item[visit.identity_key]" />
            </p>
            <p v-else>
              <van-field readonly autosize :label="visit.title" :value="item[visit.identity_key]" />
            </p>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import api from '@/api/api'
import total from '@/api/total'

export default {
  data() {
    return {
      show: false,
      showArr: [],
      showObj: {},
      visitObj: [],
      showVisitArr: [],
      columns: [],
      data: [],
      page: {
        pageSize: 13,
        total: 0,
        current: 0
      },
      loading: true,
      search: {
        value: '',
        type: 'saler'
      },
      tableID: 13,
      visitID: 18,
      showPhone: true
    }
  },
  mounted() {
    const permission = localStorage.getItem('user_permission')
    if (permission.indexOf('销售总监') === -1 && permission.indexOf('权证')) {
      this.showPhone = false
      api.getFormAPI(this.tableID).then((res) => {
        // 创建表头
        this.columns = total.createdTableHeadersDetail(res.data.fields, '')
      })
    } else {
      api.getFormAPI(this.tableID).then((res) => {
        // 创建表头
        this.columns = total.createdTableHeadersDetail(res.data.fields, 'admin')
      })
    }

    this.getPageData()
    let sqlCount = `SELECT COUNT(*) FROM fdc_form_1_13;`
    api.getSqlJsonAPI(sqlCount).then((res) => {
      this.page.total = res.data[0].count
    })
    api.getFormAPI(this.tableID).then((res) => {
      this.showArr = res.data.fields
      api.getFormAPI(this.visitID).then((res) => {
        this.showVisitArr = res.data.fields.slice(4)
        this.showVisitArr.unshift({
          identity_key: 'created_at',
          title: '回访时间'
        })
      })
    })
  },
  methods: {
    getPageData() {
      this.loading = true
      let sql = `select * from fdc_form_1_13  ORDER BY created_at DESC limit ${this.page.pageSize} OFFSET ${this.page.current}`
      api.getSqlJsonAPI(sql).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10)
          if (element.estimated_time) {
            element.estimated_time = element.estimated_time.slice(0, 10)
          }
        })
        this.data = res.data
        this.loading = false
      })
    },
    currentChange(current) {
      this.page.current = this.page.pageSize * (current - 1)
      this.onSearch()
    },
    onSearch() {
      this.loading = true
      let sql = `select * from fdc_form_1_13  where ${this.search.type} ~ '${this.search.value}' ORDER BY created_at  DESC limit ${this.page.pageSize} OFFSET ${this.page.current}`
      api.getSqlJsonAPI(sql).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10)
          if (element.estimated_time) {
            element.estimated_time = element.estimated_time.slice(0, 10)
          }
        })
        this.data = res.data
        this.loading = false
      })

      let sqlCount = `SELECT COUNT(*) FROM fdc_form_1_13 where ${this.search.type} ~ '${this.search.value}'; `
      api.getSqlJsonAPI(sqlCount).then((res) => {
        this.page.total = res.data[0].count
      })
    },
    rowClick(row, column, data, event) {
      this.show = true
      this.showObj = row
      let phone = row.phone
      let sqlPhone = `SELECT * FROM fdc_form_1_18 where customer_phone = '${phone}';`
      api.getSqlJsonAPI(sqlPhone).then((res) => {
        let data = res.data
        for (let i = 0; i < data.length; i++) {
          data[i].created_at = data[i].created_at.slice(0, 10)
        }
        this.visitObj = data
      })
    },
    exportData() {
      let sqlCount = `SELECT * FROM fdc_form_1_13; `
      api.getSqlJsonAPI(sqlCount).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10)
          if (element.estimated_time) {
            element.estimated_time = element.estimated_time.slice(0, 10)
          }
        })
        this.$refs.table.data = res.data
        this.$refs.table.exportCsv({
          filename: '客户明细',
          quoted: true
        })
        this.onSearch()
      })
    }
  }
}
</script>
<style lang="scss">
.detail_content {
  margin: 0px auto;

  .header {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    width: 90vw;
    margin: 0 auto;

    .header-select {
      display: flex;
      border-radius: 20px;
      margin: 15px 0px;

      .select {
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background: #f6f7f9;
        display: inline-block;
        width: 110px;
        padding-left: 24px;
        border: none;
        outline: none;
        height: 40px;
      }
      .search {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        height: 40px;
        background: #f6f7f9;
        width: 180px;
        padding: 0px;
      }
    }
    .export {
      background: #1989fa;
      height: 40px;
      width: 40px;
      margin: 15px;
      border-radius: 20px;
    }
  }
  .ivu-table-header thead tr th,
  .ivu-table-fixed-header thead tr th {
    padding: 4px;
  }

  .ivu-table td,
  .ivu-table th {
    text-align: center;
    border-bottom: none;
  }
  .ivu-table th {
    color: #fff;
    background: #6788e7;
    font-weight: 600;
  }
  .ivu-table-cell {
    height: 46px;
    line-height: 46px;
  }
  .ivu-table-row {
    height: 46px;
  }
  .table {
    position: relative;
    .page {
      position: absolute;
      bottom: -150px;
      width: 100%;
      right: 50%;
      transform: translateX(50%);
    }
    .ivu-page-total {
      font-size: 14px;
      position: absolute;
      bottom: 80px;
      right: 50%;
      transform: translateX(50%);
    }
  }
  .popup {
    margin: 30px auto;
    width: 77%;
    position: relative;
    .van-cell {
      border-bottom: 1px solid #ebedf0;
    }
  }
  .van-field__label {
    width: 7rem;
  }
  .ivu-page-item:hover {
    border: 1px solid #dcdee2;
    a {
      color: black;
    }
  }
  .ivu-page-custom-text {
    width: 88px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    padding: 5px 2px;
  }
  .ivu-page-item-active {
    background: #6788e7;
  }
  .ivu-page-item-active a,
  .ivu-page-item-active:hover a {
    color: #fff;
  }
  .ivu-page-next:hover a,
  .ivu-page-prev:hover a {
    color: #6788e7;
  }
  .popup-header {
    line-height: 52px;
    font-size: 16px;
    font-weight: 600;
    height: 52px;
    border-bottom: 1px solid #ebedf0;
  }
}
</style>
