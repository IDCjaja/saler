export default [
  {
    path: "/real_estate/saler/home",
    name: "home",
    component: () => import(/* webpackChunkName:'home' */ "@/components/home")
  },
  {
    path: "/real_estate/saler/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName:'login' */ "@/components/login/login")
  },
  {
    path: "/real_estate/saler/code",
    name: "code",
    component: () =>
      import(/* webpackChunkName:'code' */ "@/components/login/code")
  },
  {
    path: "/real_estate/saler/buy",
    name: "buy",
    component: () => import(/* webpackChunkName:'buy' */ "@/components/buy")
  },
  {
    path: "/real_estate/saler/customer",
    name: "customer",
    component: () =>
      import(/* webpackChunkName:'customer' */ "@/components/customer")
  },
  {
    path: "/real_estate/saler/arrive_visitors",
    name: "arrive_visitors",
    component: () =>
      import(
        /* webpackChunkName:'arrive_visitors' */ "@/components/arrive_visitors"
      )
  },
  {
    path: "/real_estate/saler/reserve",
    name: "reserve",
    component: () =>
      import(/* webpackChunkName:'reserve' */ "@/components/reserve/reserve")
  },
  {
    path: "/real_estate/saler/reserve/reserved",
    name: "reserved",
    component: () =>
      import(/* webpackChunkName:'reserved' */ "@/components/reserve/reserved")
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/components/home")
  }
];
