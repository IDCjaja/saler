<template>
  <div class="housing">
    <tabbar :title="title" />
    <van-search v-model="building" label="楼栋号" @blur="onSearch" placeholder="请输入楼栋号" />
    <header class="house_header" v-show="show">
      <div class="house_buttom" @click="search(item.room_building)" v-for="item in list" :key="item.id">
        <p>{{ item.room_building }} 栋</p>
        <p>5 个单元</p>
        <p>{{ item.count }} 个房间</p>
        <p>已售：0 间</p>
        <p>未售：{{ item.count }} 间</p>
      </div>
    </header>

    <div class="main">
      <div class="main_item">
        <van-collapse v-model="activeNames" v-for="item in house" :key="item.id">
          <div v-if="item.room_status == '认购'">
            <van-cell center :title="item.room_number" :value="item.room_status" :class="item.class" />
          </div>
          <div v-else-if="item.room_status == '签约'">
            <van-cell center :title="item.room_number" :value="item.room_status" :class="item.class" />
          </div>
          <div v-else-if="item.room_status == '退房'">
            <van-cell center :title="item.room_number" :value="item.room_status" :class="item.class" />
          </div>
          <div v-else>
            <van-collapse-item title="房号" :value="item.room_number" :name="item.id" :class="item.class">
              <p class="main_item_van">
                <span>建筑面积：</span>
                <span>{{ item.covered_area }}</span>
              </p>
              <p class="main_item_van">
                <span>套内面积：</span>
                <span>{{ item.inside_area }}</span>
              </p>
              <p class="main_item_van">
                <span>挂牌单价：</span>
                <span>{{ item.univalence }}</span>
              </p>
              <p class="main_item_van">
                <span>挂牌总价：</span>
                <span>{{ item.total }}</span>
              </p>
            </van-collapse-item>
          </div>
        </van-collapse>
      </div>
    </div>

    <home-nav></home-nav>
  </div>
</template>

<script>
import Tabbar from '@/components/pages/tabbar'
import HomeNav from '@/components/pages/nav'
import api from '@/api/api'
import total from '@/api/total'

export default {
  data() {
    return {
      title: '房源展示',
      formID: '11',
      list: [],
      building: '',
      house: [],
      show: true,
      houseSubscribe: [],
      houseSigning: [],
      houseChange: [],
      activeNames: [],
    }
  },
  components: {
    Tabbar,
    HomeNav,
  },
  mounted() {
    let sql = `select room_building, count (room_building)  from fdc_form_1_16 group by room_building order by room_building ASC`
    api.getSqlJsonAPI(sql).then((res) => {
      this.list = res.data
    })
  },
  methods: {
    onSearch() {
      this.show = false
      let sql = `select * from fdc_form_1_16 WHERE room_building ='${this.building}' ORDER BY room_number ASC;`
      api.getSqlJsonAPI(sql).then((res) => {
        if (res.data.length === 0) {
          this.show = true
        }
        this.house = total.houseStatus(res.data)
      })
    },
    search(building) {
      this.show = false
      let sql = `select * from fdc_form_1_16 WHERE room_building ='${building}' ORDER BY room_number ASC;`
      api.getSqlJsonAPI(sql).then((res) => {
        this.house = total.houseStatus(res.data)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.house_header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;

  .house_buttom {
    margin-top: 10px;
    background: #00a862;
    border: none;
    border-radius: 7px;
    width: 47%;
    color: #fff;
    margin: 5px;
    padding: 15px 0px;
    font-size: 16px;
    box-shadow: 4px 4px 12px #00a86278;
  }
}

.main {
  margin-top: 20px;
  display: flex;
  padding: 0px 30px 50px;
  justify-content: space-between;
  flex-wrap: wrap;

  .main_item {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  /deep/ .van-collapse {
    width: 50%;
  }

  .van-cell__title,
  .van-cell__value {
    text-align: left;
  }

  .main_item_van {
    display: flex;
    justify-content: space-between;
  }

  .main_item_status {
    padding: 10px 5px;
    margin-top: 20px;
    background: #7b7f80;
    border-radius: 10px;
    color: #fff;
    box-shadow: 4px 4px 17px #8a8a8a;
    font-size: 15px;

    p {
      text-align: left;
      padding: 2px 6px;
    }
  }
}

.buy {
  background: yellow;
  color: #000;
  .van-cell__value {
    text-align: right;
    color: #000;
  }
}

.change {
  background: #7b7f80;
  color: #fff;
  .van-cell__value {
    text-align: right;
    color: #fff;
  }
}
.signing {
  background: red;
  color: #fff;
  .van-cell__value {
    text-align: right;
    color: #fff;
  }
}
</style>
