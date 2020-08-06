export default [
  {
    path: "/real_estates/saler/home",
    name: "home",
    component: () => import(/* webpackChunkName:'home' */ "@/components/home")
  },
  {
    path: "/real_estates/saler/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName:'login' */ "@/components/login/login")
  },
  {
    path: "/real_estates/saler/code",
    name: "code",
    component: () =>
      import(/* webpackChunkName:'code' */ "@/components/login/code")
  },
  {
    path: "/real_estates/saler/buy",
    name: "buy",
    component: () => import(/* webpackChunkName:'buy' */ "@/components/buy")
  },
  {
    path: "/real_estates/saler/buy_message",
    name: "buy_message",
    component: () =>
      import(
        /* webpackChunkName:'buy_message' */ "@/components/visit/buy_message"
      )
  },
  {
    path: "/real_estates/saler/call/caller_buy_message",
    name: "caller_buy_message",
    component: () =>
      import(
        /* webpackChunkName:'caller_buy_message' */ "@/components/caller/caller_buy_message"
      )
  },
  {
    path: "/real_estates/saler/subscribe",
    name: "subscribe",
    component: () =>
      import(/* webpackChunkName:'subscribe' */ "@/components/subscribe")
  },
  {
    path: "/real_estates/saler/sign",
    name: "sign",
    component: () => import(/* webpackChunkName:'sign' */ "@/components/sign")
  },
  {
    path: "/real_estates/saler/housing",
    name: "housing",
    component: () =>
      import(/* webpackChunkName:'housing' */ "@/components/house/housing")
  },
  {
    path: "/real_estates/saler/pcHousing",
    name: "pcHousing",
    component: () =>
      import(/* webpackChunkName:'pcHousing' */ "@/components/house/pcHousing")
  },
  {
    path: "/real_estates/saler/house",
    name: "house",
    component: () =>
      import(/* webpackChunkName:'house' */ "@/components/house/house")
  },
  {
    path: "/real_estates/saler/customer",
    name: "customer",
    component: () =>
      import(/* webpackChunkName:'customer' */ "@/components/customer")
  },
  // 新建客户
  {
    path: "/real_estates/saler/arrive_visitors",
    name: "arrive_visitors",
    component: () =>
      import(/* webpackChunkName:'visit' */ "@/components/arrive_visitors")
  },
  // 预约表
  {
    path: "/real_estates/saler/reserve",
    name: "reserve",
    component: () =>
      import(/* webpackChunkName:'visit' */ "@/components/reserve/reserve")
  },
  {
    path: "/real_estates/saler/reserve/reserved",
    name: "reserved",
    component: () =>
      import(/* webpackChunkName:'reserved' */ "@/components/reserve/reserved")
  },

  // 来电客户录入表
  {
    path: "/real_estates/saler/caller",
    name: "caller",
    component: () =>
      import(/* webpackChunkName:'call' */ "@/components/caller/caller"),
    children: [
      {
        path: "new",
        name: "new",
        component: () =>
          import(/* webpackChunkName:'call' */ "@/components/caller/new")
      },
      {
        path: "view",
        name: "call_view",
        component: () =>
          import(/* webpackChunkName:'call' */ "@/components/caller/view")
      }
    ]
  },
  // message
  {
    path: "/real_estates/saler/message",
    name: "message",
    component: () =>
      import(/* webpackChunkName:'message' */ "@/components/message/message")
  },
  {
    path: "/real_estates/saler/message/init",
    name: "init",
    component: () =>
      import(/* webpackChunkName:'init' */ "@/components/message/init")
  },
  {
    path: "/real_estates/saler/message/revisit",
    name: "revisit",
    component: () =>
      import(/* webpackChunkName:'revisit' */ "@/components/message/revisit")
  },
  {
    path: "/real_estates/saler/message/revisit/record",
    name: "record",
    component: () =>
      import(/* webpackChunkName:'record' */ "@/components/message/record")
  },
  // admin
  {
    path: "/real_estates/saler/admin/guest",
    name: "guest",
    component: () =>
      import(/* webpackChunkName:'guest' */ "@/components/admin/guest")
  },
  {
    path: "/real_estates/saler/admin/today_details",
    component: () =>
      import(
        /* webpackChunkName:'today_details' */ "@/components/admin/today_details"
      ),
    children: [
      {
        path: "/",
        name: "today",
        component: () =>
          import(/* webpackChunkName:'today' */ "@/components/admin/today.vue")
      },
      {
        path: "/real_estates/saler/admin/custom_time",
        name: "custom_time",
        component: () =>
          import(
            /* webpackChunkName:'custom_time' */ "@/components/admin/custom_time"
          )
      }
    ]
  },
  {
    path: "/real_estates/saler/admin/ranking_list",
    name: "ranking_list",
    component: () =>
      import(
        /* webpackChunkName:'ranking_list' */ "@/components/admin/ranking_list"
      )
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/components/home")
  }
];
