export default [
  {
    path: '/real_estate/saler/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName:'detail' */ '@/components/detail/detail'),
  },
  {
    path: '/real_estate/saler/login',
    name: 'login',
    component: () => import(/* webpackChunkName:'login' */ '@/components/login/login'),
  },
  {
    path: '/real_estate/saler/code',
    name: 'code',
    component: () => import(/* webpackChunkName:'code' */ '@/components/login/code'),
  },
  {
    path: '/real_estate/saler/buy',
    name: 'buy',
    component: () => import(/* webpackChunkName:'buy' */ '@/components/buy'),
  },
  {
    path: '/real_estate/saler/buy_message',
    name: 'buy_message',
    component: () => import(/* webpackChunkName:'buy_message' */ '@/components/visit/buy_message'),
  },
  {
    path: '/real_estate/saler/call/caller_buy_message',
    name: 'caller_buy_message',
    component: () => import(/* webpackChunkName:'caller_buy_message' */ '@/components/caller/caller_buy_message'),
  },
  {
    path: '/real_estate/saler/subscribe',
    name: 'subscribe',
    component: () => import(/* webpackChunkName:'subscribe' */ '@/components/subscribe'),
  },
  {
    path: '/real_estate/saler/sign',
    name: 'sign',
    component: () => import(/* webpackChunkName:'sign' */ '@/components/sign'),
  },
  {
    path: '/real_estate/saler/housing',
    name: 'housing',
    component: () => import(/* webpackChunkName:'housing' */ '@/components/house/housing'),
  },
  {
    path: '/real_estate/saler/pcHousing',
    name: 'pcHousing',
    component: () => import(/* webpackChunkName:'pcHousing' */ '@/components/house/pcHousing'),
  },
  {
    path: '/real_estate/saler/house',
    name: 'house',
    component: () => import(/* webpackChunkName:'house' */ '@/components/house/house'),
  },

  // 流程
  {
    path: '/real_estate/saler/signing',
    name: 'signing',
    component: () => import(/* webpackChunkName:'signing' */ '@/components/flows/signing'),
  },
  {
    path: '/real_estate/saler/checkout',
    name: 'checkout',
    component: () => import(/* webpackChunkName:'checkout' */ '@/components/flows/checkout'),
  },
  {
    path: '/real_estate/saler/changeRoom',
    name: 'changeRoom',
    component: () => import(/* webpackChunkName:'changeRoom' */ '@/components/flows/changeRoom'),
  },
  {
    path: '/real_estate/saler/rename',
    name: 'rename',
    component: () => import(/* webpackChunkName:'rename' */ '@/components/flows/rename'),
  },
  {
    path: '/real_estate/saler/sendOrders',
    name: 'sendOrders',
    component: () => import(/* webpackChunkName:'sendOrders' */ '@/components/flows/sendOrders'),
  },
  {
    path: '/real_estate/saler/customer',
    name: 'customer',
    component: () => import(/* webpackChunkName:'customer' */ '@/components/customer'),
  },
  // 新建客户
  {
    path: '/real_estate/saler/arrive_visitors',
    name: 'arrive_visitors',
    component: () => import(/* webpackChunkName:'visit' */ '@/components/arrive_visitors'),
  },
  // 预约表
  {
    path: '/real_estate/saler/reserve',
    name: 'reserve',
    component: () => import(/* webpackChunkName:'visit' */ '@/components/reserve/reserve'),
  },
  {
    path: '/real_estate/saler/reserve/reserved',
    name: 'reserved',
    component: () => import(/* webpackChunkName:'reserved' */ '@/components/reserve/reserved'),
  },

  // 来电客户录入表
  {
    path: '/real_estate/saler/caller',
    name: 'caller',
    component: () => import(/* webpackChunkName:'call' */ '@/components/caller/caller'),
    children: [
      {
        path: 'new',
        name: 'new',
        component: () => import(/* webpackChunkName:'call' */ '@/components/caller/new'),
      },
      {
        path: 'view',
        name: 'call_view',
        component: () => import(/* webpackChunkName:'call' */ '@/components/caller/view'),
      },
    ],
  },
  // message
  {
    path: '/real_estate/saler/message',
    name: 'message',
    component: () => import(/* webpackChunkName:'message' */ '@/components/message/message'),
  },
  {
    path: '/real_estate/saler/message/init',
    name: 'init',
    component: () => import(/* webpackChunkName:'init' */ '@/components/message/init'),
  },
  {
    path: '/real_estate/saler/message/revisit',
    name: 'revisit',
    component: () => import(/* webpackChunkName:'revisit' */ '@/components/message/revisit'),
  },
  {
    path: '/real_estate/saler/message/revisit/record',
    name: 'record',
    component: () => import(/* webpackChunkName:'record' */ '@/components/message/record'),
  },
  // admin
  {
    path: '/real_estate/saler/admin/guest',
    name: 'guest',
    component: () => import(/* webpackChunkName:'guest' */ '@/components/admin/guest'),
  },
  {
    path: '/real_estate/saler/admin/today_details',
    component: () => import(/* webpackChunkName:'today_details' */ '@/components/admin/today_details'),
    children: [
      {
        path: '/',
        name: 'today',
        component: () => import(/* webpackChunkName:'today' */ '@/components/admin/today.vue'),
      },
      {
        path: '/real_estate/saler/admin/custom_time',
        name: 'custom_time',
        component: () => import(/* webpackChunkName:'custom_time' */ '@/components/admin/custom_time'),
      },
    ],
  },
  {
    path: '/real_estate/saler/admin/ranking_list',
    name: 'ranking_list',
    component: () => import(/* webpackChunkName:'ranking_list' */ '@/components/admin/ranking_list'),
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/components/buy'),
  },
]
