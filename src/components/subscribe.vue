<template>
  <div>
    <buy-tabbar :title="title" />
    <van-search @blur="search" placeholder="输入姓名/手机号" v-model="namePhone" />

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
              name: 'subscribe_message',
              query: { response_id: item.response_id },
            }"
            class="content_href"
          >
            <div class="information-left">
              <div class="information-left-head">
                <img class="information-left-img" src="@/assets/img/Avator-Man.png" />
              </div>
              <div class="information-left-matter">
                <h2>{{ item.buyer_name }}</h2>
                <p>房间号：{{ item.room_number }}</p>
                <p>通讯地址：{{ item.address }}</p>
                <p>录入时间：{{ creatData(item.created_at) }}</p>
              </div>
            </div>
          </router-link>
          <a :href="'tel:' + item.buyer_phone" class="information-right">
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
export default {
  data() {
    return {
      title: '已认购客户',
      id: '',
      name: '',
      phone: '',
      namePhone: '',
      immediate_check: false,
      isLoading: true,
      list: [],
      items_per_page: 20,
      page: 0,
      loading: false,
      finished: false,
    }
  },

  components: {
    HomeHeader,
    HomeNav,
    BuyTabbar,
  },
  mounted() {
    // 读取cookie
    this.id = localStorage.getItem('user_id')
    this.name = localStorage.getItem('user_name')
    this.phone = localStorage.getItem('user_phone')
    // 拉取搜索列表
    let sql = `select * from fdc_form_1_17 WHERE saler ='${this.name}'  ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
    api.getSqlJsonAPI(sql).then((res) => {
      this.isLoading = false
      this.list = res.data
      this.finished = true
    })
  },
  methods: {
    creatData(res) {
      if (res) {
        let firstDataTime = res.slice(0, 10)
        let lastDataTime = res.slice(11, 16)
        return firstDataTime + '  ' + lastDataTime
      }
    },
    search() {
      let sql = `select * from fdc_form_1_17 WHERE saler ='${this.name}' AND (buyer_name  ~ '${this.namePhone}' or buyer_phone ~ '${this.namePhone}') ORDER BY created_at DESC`
      api.getSqlJsonAPI(sql).then((res) => {
        this.isLoading = false
        this.list = res.data
        this.finished = true
      })
    },

    // 分页加载
    onLoad() {
      this.page += this.items_per_page
      this.loading = true
      let sql = `select * from fdc_form_1_17 WHERE saler ='${this.name}' ORDER BY created_at DESC LIMIT '${this.items_per_page}' OFFSET '${this.page}'`
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
