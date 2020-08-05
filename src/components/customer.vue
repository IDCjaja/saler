<template>
  <div>
    <customer-tabbar :title="title" />
    <router-link class="customer-phone" to="/real_estates/saler/arrive_visitors">
      <img alt src="@/assets/img/Card-Visit.png" />
      <span>新建客户</span>
    </router-link>
    <router-link class="customer-visit" to="/real_estates/saler/reserve">
      <img alt src="@/assets/img/Card-phone.png" />
      <span>预约客户</span>
    </router-link>
    <router-link class="customer-visit" to="/real_estates/saler/reserve/reserved">
      <img alt src="@/assets/img/Card-Visit.png" />
      <span>预约客户查看</span>
    </router-link>
  </div>
</template>

<script>
import CustomerTabbar from "./pages/tabbar";

export default {
  data() {
    return {
      title: "新客户",
    };
  },
  components: {
    CustomerTabbar,
  },
};
</script>

<style  scoped>
.customer-phone,
.customer-visit {
  width: 80%;
  margin: 0px auto;
  height: 100px;
  display: block;
  position: relative;
}

.customer-phone {
  margin-top: 72px;
}
.customer-visit {
  margin-top: 20px;
}

.customer-phone img,
.customer-visit img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.customer-phone span,
.customer-visit span {
  position: absolute;
  left: 23px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 1;
  top: 50%;
  transform: translate(0%, -50%);
}
</style>
