<template>
  <div>
    <van-popup v-model="signingObject.show" closeable round :style="{ height: '80%', width: '60%' }">
      <h2 class="popup_main">签约单</h2>
      <div class="popup_table">
        <div class="popup_table_item" :key="field.title" v-for="field in signingData">
          <van-field
            :label="field.title"
            autocomplete="off"
            placeholder="请输入"
            type="text"
            readonly
            v-model="field.value"
          />
        </div>
        <footer>
          <div class="table_status">
            <router-link
              :to="{
                name: 'checkout',
                query: { roomID: this.roomData.room_number },
              }"
            >
              <span>退房</span>
            </router-link>
            <router-link
              :to="{
                name: 'changeRoom',
                query: { roomID: this.roomData.room_number },
              }"
            >
              <span>换房</span>
            </router-link>
            <router-link
              :to="{
                name: 'rename',
                query: { roomID: this.roomData.room_number },
              }"
            >
              <span>更名</span>
            </router-link>
          </div>
        </footer>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: ['signingObject', 'roomData', 'signingData'],
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.popup_main {
  margin: 20px auto;
}
.popup_table {
  margin: 20px auto 0px;
}

.popup_table_item {
  width: 70%;
  margin: 0 auto;
}

.table_status {
  margin: 30px 0px 10px;
  display: flex;
  justify-content: space-evenly;

  span {
    width: 10vw;
    border-radius: 4px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    font-weight: 600;
    background: #00a862;
    color: #fff;
    cursor: pointer;
  }

  span:active {
    background-color: #048b53;
  }
}
</style>
