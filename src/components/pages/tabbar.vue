<template>
  <div>
    <header class="tabnar-header">
      <i @click="back" class="icon-Index-Icon-Down"></i>
      {{title}}
    </header>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {

    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  }

}
</script>

<style scoped>
.tabnar-header {
  text-align: center;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #222;
  height: 50px;
  line-height: 50px;
}
.icon-Index-Icon-Down {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
