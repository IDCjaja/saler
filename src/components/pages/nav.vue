<template>
  <div>
    <van-tabbar fixed route>
      <van-tabbar-item class="icon-Index-Icon-Before-Subscription" to="/real_estate/saler/buy">认购前</van-tabbar-item>
      <van-tabbar-item class="icon-Index-Icon-Subscription" to="/real_estate/saler/subscribe">已认购</van-tabbar-item>
      <van-tabbar-item class="icon-Index-Icon-Subscribed" to="/real_estate/saler/sign">已签约</van-tabbar-item>
      <van-tabbar-item class="icon-Index-Icon-Owner" to="/real_estate/saler/housing">房源销控</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style>
.van-tabbar {
  height: 50px;
}

.van-tabbar-item__icon {
  margin-bottom: 6px;
}

.van-tabbar-item--active,
.van-tabbar-item--active::before {
  color: #00a862;
}

.van-tabbar-item {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
