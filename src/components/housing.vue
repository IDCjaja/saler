<template>
  <div class="housing">
    <tabbar :title="title" />
    <header class="house_header">
      <van-field v-model="building" label="楼栋" placeholder="请输入楼栋" />
      <van-field v-model="unit" label="单元" placeholder="请输入单元" />
      <button class="house_buttom" @click="search()">查看房源</button>
    </header>

    <div class="main">
      <div class="main_item" v-for="item in house" :key="item.id" @click="aaa(item)">
        <div class="main_item_status" v-if="!item.mapped_values.status">
          <p>房屋编号：{{item.number}}</p>
          <p>建筑面积：{{item.mapped_values.covered_area.value[0]}}</p>
          <p>套内面积：{{item.mapped_values.inside_area.value[0]}}</p>
          <p>挂牌总价：{{item.mapped_values.total.value[0]}}</p>
          <p>挂牌单价：{{item.mapped_values.univalence.value[0]}}</p>
        </div>
        <div class="main_item_status" v-else-if="item.mapped_values.status.value[0] === '未签约'">
          <p>房屋编号：{{item.number}}</p>
          <p>建筑面积：{{item.mapped_values.covered_area.value[0]}}</p>
          <p>套内面积：{{item.mapped_values.inside_area.value[0]}}</p>
          <p>挂牌总价：{{item.mapped_values.total.value[0]}}</p>
          <p>挂牌单价：{{item.mapped_values.univalence.value[0]}}</p>
        </div>
        <div
          class="main_item_status signed"
          v-else-if="item.mapped_values.status.value[0] === '已签约'"
        >
          <p>房屋编号：{{item.number}}</p>
          <p>建筑面积：{{item.mapped_values.covered_area.value[0]}}</p>
          <p>套内面积：{{item.mapped_values.inside_area.value[0]}}</p>
          <p>挂牌总价：{{item.mapped_values.total.value[0]}}</p>
          <p>挂牌单价：{{item.mapped_values.univalence.value[0]}}</p>
        </div>
        <div
          class="main_item_status finish"
          v-else-if="item.mapped_values.status.value[0] === '已完成'"
        >
          <p>房屋编号：{{item.number}}</p>
          <p>建筑面积：{{item.mapped_values.covered_area.value[0]}}</p>
          <p>套内面积：{{item.mapped_values.inside_area.value[0]}}</p>
          <p>挂牌总价：{{item.mapped_values.total.value[0]}}</p>
          <p>挂牌单价：{{item.mapped_values.univalence.value[0]}}</p>
        </div>
      </div>
    </div>

    <home-nav></home-nav>
  </div>
</template>

<script>
import Tabbar from "./pages/tabbar";
import HomeNav from "./pages/nav";
import api from "@/api/api";

export default {
  data() {
    return {
      title: "房源展示",
      building: 9,
      unit: 5,
      floor: 0,
      room: 0,
      formID: "11",
      list: [],
      house: [],
    };
  },
  components: {
    Tabbar,
    HomeNav,
  },
  mounted() {
    api.getFormAPI(this.formID).then((res) => {
      this.list = res.data;
    });
  },
  methods: {
    search() {
      this.house = [];
      this.list.forEach((el) => {
        if (el.mapped_values.building.value[0] === this.building) {
          if (el.mapped_values.unit.value[0] === this.unit) {
            el.number = `${this.building}-${this.unit}-${el.mapped_values.floor.value[0]}-${el.mapped_values.room.value[0]}`;
            this.house.push(el);
          }
        }
      });
    },
    aaa(el) {
      console.log(el);
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
  padding: 0px 30px;
  justify-content: space-between;
  flex-wrap: wrap;

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
  .signed {
    background: #00a862;
    box-shadow: 4px 4px 17px #00a862;
  }
  .finish {
    background: #da4444;
    box-shadow: 4px 4px 17px #da4444;
  }
}
</style>
