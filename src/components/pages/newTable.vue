<template>
  <div>
    <header class="table_header">
      <img alt class="img" src="@/assets/img/Avator-Man.png" />
    </header>
    <aside class="table_aside">
      <van-field label="客户姓名" placeholder="例如：张三" type="text" v-model="customer_name" />
      <van-field label="客户性别" name="gender">
        <template #input>
          <van-radio-group direction="horizontal" v-model="customer_gender">
            <van-radio checked-color="#00A862" name="0">女</van-radio>
            <van-radio checked-color="#00A862" name="1">男</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field label="手机号码" placeholder="例如：19229298787" type="number" v-model="customer_phone" />
      <van-field label="备注" placeholder="请输入：" type="text" v-model="remark" />
      <van-field label="知晓途径" name="channel">
        <template #input>
          <van-radio-group direction="horizontal" v-model="channel">
            <van-radio checked-color="#00A862" name="传单">传单</van-radio>
            <van-radio checked-color="#00A862" name="朋友介绍">朋友介绍</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field label="询问重点" placeholder="例如：价格，周边环境" type="text" v-model="focus" />
      <van-field label="置业动机" placeholder="例如：养老" type="text" v-model="motivation"></van-field>
      <van-field label="预计来访时间" placeholder="例如：2020.01.01" v-model="planed_visit_time"></van-field>
      <van-field label="需求楼层" name="demand_floor" placeholder="例如：01" type="number" />
      <van-field label="出行方式" name="travel_mode">
        <template #input>
          <van-radio-group direction="horizontal" v-model="travel_mode">
            <van-radio checked-color="#00A862" name="开车">开车</van-radio>
            <van-radio checked-color="#00A862" name="公交">公交</van-radio>
            <van-radio checked-color="#00A862" name="步行">步行</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field label="来电区域" name="call_area">
        <template #input>
          <van-radio-group direction="horizontal" v-model="call_area">
            <van-radio checked-color="#00A862" name="武侯区">武侯区</van-radio>
            <van-radio checked-color="#00A862" name="青羊区">青羊区</van-radio>
            <van-radio checked-color="#00A862" name="高新区">高新区</van-radio>
            <van-radio checked-color="#00A862" name="郫都区">郫都区</van-radio>
            <van-radio checked-color="#00A862" name="青白江区">青白江区</van-radio>
            <van-radio checked-color="#00A862" name="金牛区">金牛区</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </aside>
    <footer class="table_footer">
      <router-link to="/real_estate/saler/customer">新建客户</router-link>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      customer_name: '',
      customer_gender: '1',
      customer_phone: '',
      remark: '',
      motivation: '',
      channel: '传单',
      travel_mode: '步行',
      call_area: '高新区',
      demand_floor: '',
      focus: '',
      planed_visit_time: ''

    }
  }

}
</script>

<style lang="sass" scoped>
.table_header
  width: 4.0625rem
  margin: .8125rem auto 1.0625rem

.table_header .img
  width: 100%

.table_aside
  width: 84%
  margin: 0 auto

/deep/
  .van-field
    flex-direction: column

  .van-field__label
    text-align: left
    padding: 0px
    color: #222222
    font-size: 17px
    width: 190px

  .van-field__body
    margin-top: 15px
    font-size: 15px

  .van-field__control
    font-size: 15px

  .van-picker__cancel
    color: #787878
    font-size: 15px
    font-weight: 600

  .van-picker__confirm
    color: #00a862
    font-size: 15px
    font-weight: 600

.table_footer
  margin-top: 30px
  position: fixed
  bottom: 0px
  width: 100%
  height: 50px
  line-height: 50px
  font-size: 15px
  font-weight: 600
  background: #00A862
  color: #fff

  a
    color: #fff

</style>
