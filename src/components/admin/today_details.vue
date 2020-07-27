<template>
  <div class="today">
    <header class="today_header">今日详情</header>
    <nav class="today_nav">
      <div class="today_body">
        <router-link class="today_body_left" to="/real_estate/saler/admin/today_details">今日详情</router-link>
        <router-link class="today_body_right" to="/real_estate/saler/admin/custom_time">自定义时间</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    document.title = "今日详情";
  },
};
</script>

<style lang="scss" scoped>
.today {
  margin: 0 auto;

  .today_header {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #222;
    height: 3.125rem;
    line-height: 3.125rem;
  }
  .today_nav {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .today_body {
    display: flex;
    justify-content: space-around;
    line-height: 47px;
  }

  .today_body_left,
  .today_body_right {
    font-size: 14px;
    color: #aaa;
    font-weight: 600;
  }

  .router-link-active {
    border-bottom: 3px solid #00a862;
    color: #00a862;
  }
}
</style>
