<template>
  <div>
    <van-popup v-model="show" closeable round :style="{ height: '80%', width: '60%' }">
      <h2 class="popup_main">签约单</h2>
      <div class="popup_table">
        <div class="popup_table_item" :key="field.identity_key" v-for="field in formData">
          <!-- text -->
          <van-field
            :id="field.identity_key"
            :label="field.title"
            autocomplete="off"
            placeholder="请输入"
            type="text"
            v-model="field.value"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
    }
  },
}
</script>

<style lang="scss" scoped>
.popup_table {
  margin: 20px auto 0px;
}

.popup_table_item {
  width: 70%;
  margin: 0 auto;
}
</style>
