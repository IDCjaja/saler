<template>
  <div>
    <buy-tabbar :title="title" />
    <van-search @blur="search" placeholder="输入姓名/手机号" v-model="namePhone" />
    <van-dropdown-menu active-color="#00a862">
      <van-dropdown-item :options="search_time" v-model="created_at" />
      <van-dropdown-item :options="search_intention" v-model="intention" />
    </van-dropdown-menu>
    <van-loading class="loading" size="27px" type="spinner" v-show="isLoading">加载中...</van-loading>
    <van-list
      :finished="finished"
      :immediate-check="immediate_check"
      @load="onLoad"
      finished-text="没有更多了"
      offset="1"
      v-model="loading"
    >
      <div :key="item.id" class="buy-link" v-for="item in list">
        <div class="content" v-show="!isLoading">
          <router-link
            :to="{
              name: 'buy_message',
              query: {
                customer_phone: item.phone,
                response_id: item.response_id,
              },
            }"
            class="content_href"
          >
            <div class="information-left">
              <div class="information-left-head">
                <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
              </div>
              <div class="information-left-matter">
                <h2>{{ item.name }}</h2>
                <p>客户描摹：{{ item.depict }}</p>
                <p>客户来源：{{ item.source }}</p>
                <p>录入时间：{{ creatData(item.created_at) }}</p>
              </div>
            </div>
          </router-link>
          <a :href="'tel:' + item.phone" class="information-right">
            <i class="icon-Info-Icon-Phone"></i>
          </a>
        </div>
      </div>
    </van-list>
    <footer class="footer"></footer>
    <home-nav></home-nav>
  </div>
</template>

<script>
import HomeHeader from './pages/header'
import HomeNav from './pages/nav'
import BuyTabbar from './pages/tabbar'
import api from '@/api/api'
import total from '@/api/total'
export default {
  data() {
    return {
      title: '认购前客户',
      id: '',
      phone: '',
      namePhone: '',
      immediate_check: false,
      isLoading: true,
      created_at: '时间',
      intention: '意向',
      search_time: [
        { text: '时间', value: '时间' },
        { text: '一周内', value: 'within_week' },
        { text: '一个月内', value: 'within_month' },
        { text: '一个月以上', value: 'away_month' },
      ],
      search_intention: [
        { text: '意向', value: '意向' },
        { text: 'A很有意向', value: 'A很有意向' },
        { text: 'B较有意向', value: 'B较有意向' },
        { text: 'C可跟踪', value: 'C可跟踪' },
        { text: 'D无意向', value: 'D无意向' },
      ],
      list: [],
      items_per_page: 20,
      page: 0,
      loading: false,
      finished: false,
    }
  },
  watch: {
    // tab 切换
    created_at: function(newQuestion, oldQuestion) {
      this.finished = false
      // 根据时间筛选数据
      let date = new Date()
      switch (newQuestion) {
        case 'within_week': {
          date.setDate(date.getDate() - 7)
          date = total.formatDate(date)
          this.timeSearch(date, newQuestion)
          break
        }
        case 'within_month': {
          date.setMonth(date.getMonth() - 1)
          date = total.formatDate(date)
          this.timeSearch(date, newQuestion)
          break
        }
        case 'away_month': {
          date.setMonth(date.getMonth() - 1)
          date = total.formatDate(date)
          this.timeSearch(date, newQuestion)
          break
        }
        default: {
          this.listData()
        }
      }
    },
    intention: function(newQuestion, oldQuestion) {
      this.finished = false
      this.page = 0
      if (newQuestion === '意向') {
        this.listData()
      } else {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' AND intention like '${this.intention}'  ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
        api.getSqlJsonAPI(sql).then((res) => {
          this.list = res.data
        })
      }
    },
  },
  components: {
    HomeHeader,
    HomeNav,
    BuyTabbar,
  },
  mounted() {
    // 读取cookie
    this.id = localStorage.getItem('user_id')
    this.phone = localStorage.getItem('user_phone')
    // 拉取当前置业顾问客户列表
    this.listData()
  },
  methods: {
    listData() {
      let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
      api.getSqlJsonAPI(sql).then((res) => {
        this.isLoading = false
        this.list = res.data
      })
    },
    creatData(res) {
      let firstDataTime = res.slice(0, 10)
      let lastDataTime = res.slice(11, 16)
      return firstDataTime + '  ' + lastDataTime
    },
    search() {
      // 搜索人名或者手机号，查询全部数据
      if (this.namePhone) {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' AND (name  ~ '${this.namePhone}' or phone ~ '${this.namePhone}') ORDER BY created_at DESC`
        api.getSqlJsonAPI(sql).then((res) => {
          this.isLoading = false
          this.list = res.data
          this.finished = true
        })
      } else {
        this.finished = false
        this.listData()
      }
    },

    // 分页加载
    onLoad() {
      this.page += this.items_per_page
      this.loading = true
      // 根据意向筛选数据
      if (this.intention !== '意向') {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' AND intention like '${this.intention}'  ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
        api.getSqlJsonAPI(sql).then((res) => {
          this.finished = true
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
      } else {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
        api.getSqlJsonAPI(sql).then((res) => {
          let oldList = this.list
          let newList = res.data
          this.list = [...oldList, ...newList]
          this.loading = false
          // 加载状态结束
          // 数据全部加载完成
          if (!res.data.length) {
            this.loading = false
            this.finished = true
          }
        })
      }
    },
    timeSearch(date, type) {
      if (type !== 'away_month') {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' and to_char(created_at,'YYYY-MM-DD')>='${date}' ORDER BY  created_at DESC`
        api.getSqlJsonAPI(sql).then((res) => {
          this.isLoading = false
          this.finished = true
          this.list = res.data
        })
      } else {
        let sql = `select * from fdc_form_1_13 WHERE saler_phone ='${this.phone}' and to_char(created_at,'YYYY-MM-DD')<='${date}' ORDER BY created_at DESC`
        api.getSqlJsonAPI(sql).then((res) => {
          this.isLoading = false
          this.finished = true
          this.list = res.data
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  height: 50px;
}

.loading {
  margin-top: 50px;
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
</style>
