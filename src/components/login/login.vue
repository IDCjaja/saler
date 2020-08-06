<template>
  <div>
    <p>登录中...</p>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      client_id:
        "7b5453ca4e172f6a31bf290376a0c483651d4775a8af1bd840bc9b83aad7af09",
      code: "http://localhost:8080/real_estates/saler/code",
      // code: "http://shandenabian.skylarkly.com/real_estates/saler/code",
    };
  },
  mounted() {
    api.getMagnateOauthAPI().then((res) => {
      let clientId = this.client_id;
      if (clientId) {
        window.location.href = `http://shandenabian.skylarkly.com/oauth/authorize?client_id=${clientId}&redirect_uri=${this.code}&response_type=code`;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 20px;
}
</style>
