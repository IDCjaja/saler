<template>
  <div>
    <customer-tabbar :title="title" />
    <nav class="call_new_nav">
      <div class="call_new_nav_body">
        <router-link class="call_new_nav_body_left" to="/real_estate/saler/caller/new">新建客户</router-link>
        <router-link class="call_new_nav_body_right" to="/real_estate/saler/caller/view">查看客户</router-link>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import CustomerTabbar from '../pages/tabbar'

export default {
  data () {
    return {
      title: '来电客户'
    }
  },
  components: {
    CustomerTabbar
  }
}
</script>

<style lang="scss" scoped>
.call_new_nav {
  width: 100%;
  height: 50px;
  line-height: 50px;
}

.call_new_nav_body {
  display: flex;
  justify-content: space-around;
  line-height: 47px;
}

.call_new_nav_body_left,
.call_new_nav_body_right {
  font-size: 14px;
  color: #aaa;
  font-weight: 600;
}

.router-link-active {
  border-bottom: 3px solid #00a862;
  color: #00a862;
}
</style>
