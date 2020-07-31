 <template>
  <div>
    <p class="p" v-show="show">授权成功,请等待页面跳转...</p>
  </div>
</template>

<script>
import api from "@/api/api";
export default {
  data() {
    return {
      show: "",
      code: "",
      token: "",
    };
  },
  mounted() {
    this.code = this.$route.query.code;
    this.path = sessionStorage.getItem("return");

    this.$axios({
      method: "get",
      url: "/magnate/oauth",
    }).then((res) => {
      this.$axios({
        method: "POST",
        url: "/oauth/token",
        headers: { "Content-Type": "application/json" },
        params: {
          // client_id: res.data.client_id,
          client_id:
            "e84c788580a5bdc0353b680f6c4d6ef4b10894b220f544d3dd97f27366a02b8c",
          // client_secret: res.data.client_secret,
          client_secret:
            "4920df80ee57d9c160bd8c017a014cccf539625434d775fc81410c891768ef9a",
          code: this.code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:8080/real_estate/saler/code",
          // redirect_uri: 'http://shandenabian.skylarkly.com/real_estate/saler/code'
        },
      }).then((res) => {
        let token = res.data.access_token;
        api.getUserAPI(token).then((res) => {
          this.show = true;
          this.$cookies.set("CURRENT-USER-ID", res.data.id);
          this.$cookies.set("CURRENT-USER-PHONE", res.data.phone);
          this.$cookies.set("CURRENT-NAME", res.data.name);
          localStorage.setItem("user_id", res.data.id);
          localStorage.setItem("user_phone", res.data.phone);
          localStorage.setItem("user_name", res.data.name);

          let tag = res.data.tags;
          let tags = [];
          tag.forEach((element) => {
            tags.push(element.name);
          });
          this.$cookies.set("CURRENT-USER-TAGS", tags);
          this.$router.push({ name: this.path });
        });
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.p {
  margin: 20px;
}
</style>
