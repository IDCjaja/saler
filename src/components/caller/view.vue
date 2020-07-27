<template>
  <div>
    <van-loading class="loading" size="27px" type="spinner" v-show="Loading">加载中...</van-loading>

    <van-list
      :finished="finished"
      :immediate-check="immediate_check"
      @load="onLoad"
      finished-text="没有更多了"
      offset="1"
      v-model="loading"
      v-show="!Loading"
    >
      <div :key="item.customer_phone" class="content" v-for="item in list">
        <div class="information-left">
          <div class="information-left-head">
            <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
          </div>
          <router-link
            :to="{ name:'caller_buy_message', query: {customer_phone:item.customer_phone,response_id:item.response_id }}"
            class="information-left-matter"
          >
            <h2>{{item.customer_name}}</h2>
            <p>电话：{{item.customer_phone}}</p>
            <p>来访时间：{{item.dataTime}}</p>
          </router-link>
        </div>
        <a :href="'tel:'+ item.customer_phone" class="information-right">
          <i class="icon-Info-Icon-Phone"></i>
        </a>
      </div>
    </van-list>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data () {
    return {
      id: '',
      phone: '',
      response_id: '',
      list: [],
      loading: false,
      finished: false,
      isLoading: true,
      loadNum: 1,
      immediate_check: false,
      Loading: true
    }
  },
  mounted () {
    this.response_id = this.$route.query.response_id
    this.customer_phone = this.$route.query.customer_phone
    // 读取cookie

    // 读取cookie
    this.id = this.$cookies.get('CURRENT-USER-ID')
    this.phone = this.$cookies.get('CURRENT-USER-PHONE')
    // 来电列表view
    api.getSaleraCallersAPI().then(res => {
      this.Loading = false
      this.list = res.data
      for (let i = 0; i < res.data.length; i++) {
        let dataTime = res.data[i].planed_visit_time
        if (dataTime) {
          dataTime = dataTime.substr(0, 10)
        }
        this.list[i].dataTime = dataTime
      }
    })
  },
  methods: {
    // 分页加载
    onLoad () {
      this.loading = true
      this.loadNum++
      let params = { 'page': this.loadNum, 'per_page': '10' }
      api.getSaleraCallersSearchAPI(params).then(res => {
        this.loading = false
        let oldList = this.list
        let newList = res.data
        this.list = [...oldList, ...newList]
        // 加载状态结束
        // 数据全部加载完成
        if (!res.data.length) {
          this.loading = false
          this.finished = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  margin-top: 100px;
}

.content {
  width: 88%;
  margin: 0 auto;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      font-size: 11px;
      color: #b2b2b2;
      margin-top: 5px;
    }
  }
}
.information-right {
  background: #e4f3ec;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 38px;
}
</style>
