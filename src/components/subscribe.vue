<template>
  <div>
    <p>开发中...</p>

    <home-nav></home-nav>
  </div>
</template>

<script>
import HomeHeader from './pages/header'
import HomeNav from './pages/nav'

export default {
  data () {
    return {
      active: 0
    }
  },
  components: {
    HomeHeader,
    HomeNav
  }

}
</script>

<style scoped>
</style>
