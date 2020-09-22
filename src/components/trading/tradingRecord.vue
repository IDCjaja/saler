<template>
  <div class="detail_content">
    <header class="header">
      <!-- 筛选条件： -->
      <select class="select" v-model="search.type">
        <option :key="option.key" :value="option.key" class="option" v-for="option in columns">{{
          option.title
        }}</option>
      </select>
      <van-search class="search" shape="round" v-model="search.value" placeholder="请输入搜索关键词" @blur="onSearch" />
    </header>

    <Table
      ref="table"
      border
      stripe
      height="900"
      @on-row-click="rowClick"
      :columns="columns"
      :data="data"
      :loading="loading"
    ></Table>
    <Page
      :total="page.total"
      :page-size="page.pageSize"
      @on-change="currentChange"
      @on-page-size-change="pageSizeChange"
      show-sizer
      show-total
      class-name="page"
    />
    <div class="export" @click="exportData" type="info">导出数据</div>

    <!-- 弹框 -->
    <van-popup v-model="showDetails" round closeable close-icon="close" :style="{ height: '80%', width: '90%' }">
      <div class="popup">
        <div v-for="item in showArr" :key="item.id">
          <van-field readonly :label="item.title" :value="showObj[item.identity_key]" />
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
      showDetails: false,
      showArr: [],
      showObj: {},
      columns: [],
      data: [],
      page: {
        pageSize: 18,
        total: 0,
        current: 0,
      },
      loading: true,
      search: {
        value: '',
        type: 'room_number',
      },
      showPhone: true,
      tableID: '22',
    }
  },
  mounted() {
    api.getFormResponsesAPI(this.tableID).then((res) => {
      console.log(res)
    })
    api.getFormAPI(this.tableID).then((res) => {
      // 创建表头
      this.columns = total.createdTableHeaders(res.data.fields)
    })
    const permission = localStorage.getItem('user_permission')

    console.log(permission.includes('销售总监'))
    this.getPageData()
    let sqlCount = `SELECT COUNT(*) FROM fdc_form_1_22;`
    api.getSqlJsonAPI(sqlCount).then((res) => {
      this.page.total = res.data[0].count
      api.getFormAPI(this.tableID).then((res) => {
        this.showArr = res.data.fields
      })
    })
  },
  methods: {
    getPageData() {
      this.loading = true
      let sql = `select * from fdc_form_1_22  ORDER BY created_at DESC limit ${this.page.pageSize} OFFSET ${this.page.current}`
      api.getSqlJsonAPI(sql).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10)
          if (element.lending_date) {
            element.lending_date = element.lending_date.slice(0, 10)
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
    pageSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.onSearch()
    },
    onSearch() {
      this.loading = true
      let sql = `select * from fdc_form_1_22  where ${this.search.type} ~ '${this.search.value}' ORDER BY created_at  DESC limit ${this.page.pageSize} OFFSET ${this.page.current}`
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

      let sqlCount = `SELECT COUNT(*) FROM fdc_form_1_22 where ${this.search.type} ~ '${this.search.value}'; `
      api.getSqlJsonAPI(sqlCount).then((res) => {
        this.page.total = res.data[0].count
      })
    },
    rowClick(row, column, data, event) {
      this.showDetails = true
      this.showObj = row
    },
    // 导出table
    exportData() {
      let sqlCount = `SELECT * FROM fdc_form_1_22; `
      api.getSqlJsonAPI(sqlCount).then((res) => {
        res.data.forEach((element) => {
          element.created_at = element.created_at.slice(0, 10)
          if (element.estimated_time) {
            element.estimated_time = element.estimated_time.slice(0, 10)
          }
        })
        this.$refs.table.data = res.data
        this.$refs.table.exportCsv({
          filename: '成交台账',
          quoted: true,
        })
      })
    },
  },
}
</script>
<style lang="scss">
.detail_content {
  margin: 0px auto;
  .header {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    width: 90vw;
    margin: 0 auto;

    .select {
      width: 150px;
      display: inline-block;
      height: 28px;
      margin: 14px 0px;
    }
    .search {
      width: 200px;
    }
  }
  .ivu-table td,
  .ivu-table th {
    text-align: center;
  }
  .ivu-table th {
    color: #000;
    font-weight: 600;
  }
  .ivu-table-cell {
    height: 48px;
    line-height: 48px;
  }

  .ivu-table-row {
    height: 48px;
  }

  .ivu-table td,
  .ivu-table th {
    height: 48px;
  }

  .page {
    margin-top: 20px;
  }

  .popup {
    margin: 30px auto;
    width: 77%;
  }

  .van-field__label {
    width: 7rem;
  }
  .export {
    background: #1989fa;
    width: 100px;
    height: 37px;
    line-height: 37px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    margin: 10px auto;
    border-radius: 7px;
  }
}
</style>
