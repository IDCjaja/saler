<template>
  <div>
    <customer-tabbar :title="title" />
    <p class="reserved-header">
      <span>客户姓名</span>
      <span>电话号码</span>
      <span>预计到访时间</span>
      <span>来源渠道</span>
    </p>
    <p :key="item.id" class="reserved-header-content" v-for="item in list">
      <span>{{ item.name }}</span>
      <span>{{ item.phone }}</span>
      <span>{{ item.time }}</span>
      <span>{{ item.source }}</span>
    </p>
  </div>
</template>

<script>
import CustomerTabbar from '../pages/tabbar'
import api from '@/api/api'

export default {
  data() {
    return {
      title: '预约客户查看',
      list: [],
      sql: 'select * from fdc_form_1_15 ORDER BY estimated_time DESC',
    }
  },
  components: {
    CustomerTabbar,
  },
  mounted() {
    api.getSqlJsonAPI(this.sql).then((res) => {
      this.isLoading = false
      this.list = res.data
      this.list.forEach((el) => {
        el.time = el.estimated_time.slice(0, 10)
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.reserved-header {
  margin-top: 50px;
  height: 40px;
  line-height: 40px;
  color: #00a862;
  font-size: 15px;
  font-weight: 600;
  border-radius: 3px;
  display: flex;
  overflow: hidden;
  justify-content: space-between;
  background: rgba(0, 168, 98, 0.08);
}
.reserved-header-content {
  overflow: hidden;
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  display: flex;
  color: #787878;
  justify-content: space-between;
}
.reserved-header span,
.reserved-header-content span {
  width: 25vw;
}
</style>
