import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes
});

router.beforeEach((to, from, next) => {
  let name = to.name;
  let tags = localStorage.getItem("user_phone");
  let path = sessionStorage.getItem("callback");
  if (!path) {
    if (!tags) {
      sessionStorage.setItem("callback", name);
      router.push({ name: "login" });
    }
  }
  next();
});

export default router;
