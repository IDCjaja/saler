<template>
  <div class="housing">
    <tabbar :title="title" />
    <header class="house_header">
      <van-field v-model="building" label="楼栋号" placeholder="请输入楼栋号" />
      <button class="house_buttom" @click="search()">查看房源</button>
    </header>

    <div class="main">
      <div class="main_item">
        <van-collapse v-model="activeNames" v-for="item in house" :key="item.id">
          <van-collapse-item
            title="房源编号"
            :value="item.room_number"
            :name="item.id"
            :class="item.class"
          >
            <p class="main_item_van">
              <span>建筑面积：</span>
              <span>{{item.covered_area}}</span>
            </p>
            <p class="main_item_van">
              <span>套内面积：</span>
              <span>{{item.inside_area}}</span>
            </p>
            <p class="main_item_van">
              <span>挂牌单价：</span>
              <span>{{item.univalence}}</span>
            </p>
            <p class="main_item_van">
              <span>挂牌总价：</span>
              <span>{{item.total}}</span>
            </p>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <home-nav></home-nav>
  </div>
</template>

<script>
import Tabbar from "@/components/pages/tabbar";
import HomeNav from "@/components/pages/nav";
import api from "@/api/api";

export default {
  data() {
    return {
      title: "房源展示",
      building: 9,
      formID: "11",
      list: [],
      house: [],
      houseSubscribe: [],
      houseSigning: [],
      houseChange: [],
      activeNames: [],
    };
  },
  components: {
    Tabbar,
    HomeNav,
  },
  mounted() {},
  methods: {
    search() {
      let sql = `select * from fdc_form_1_668 WHERE room_building ='${this.building}' ORDER BY room_number ASC;`;
      api.getSqlJsonAPI(sql).then((res) => {
        this.house = res.data;
        this.house.forEach((el) => {
          switch (el.room_status) {
            case "签约": {
              el.class = "signing";
              break;
            }
            case "认购": {
              el.class = "buy";
              break;
            }
            case "退房": {
              el.class = "change";
              break;
            }
            case "空闲": {
              break;
            }
            default: {
            }
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.house_header {
  padding: 20px;

  .house_buttom {
    margin-top: 10px;
    background: #00a862;
    border: none;
    border-radius: 20px;
    height: 30px;
    width: 80%;
    color: #fff;
    font-size: 16px;
  }
}

.main {
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
    padding: 0px 4px;
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

.buy /deep/ .van-cell--clickable {
  background: yellow;
}

.change /deep/ .van-cell--clickable {
  background: #7b7f80;
}
.signing /deep/ .van-cell--clickable {
  background: red;
}
</style>
