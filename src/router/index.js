import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from '@/store';

NProgress.configure({
  showSpinner: false,
});

const originalPush = VueRouter.prototype.replace;
VueRouter.prototype.replace = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

const router = new VueRouter({
  linkActiveClass: 'activeNav',
  routes: [
    {
      path: '/',
      name: 'home', // 首页
      component: () => import('@/views/Home.vue'),
      redirect: '/Login',
      children: [
        {
          path: '',
          component: () => import('@/views/home-new.vue'),
        },
        {
          path: '/f',
          name: 'f',
          component: () => import('@/views/assets/f.vue'),
          meta: {
            title: '账户',
            enTitle: 'Follow Influencer',
            twTitle: '账户',
            requireAuth: false,
          },
        },
        {
          path: '/g',
          name: 'g',
          component: () => import('@/views/assets/g.vue'),
          meta: {
            title: '账户',
            enTitle: 'Follow Influencer',
            twTitle: '账户',
            requireAuth: false,
          },
        },
        {
          path: '/h',
          name: 'h',
          component: () => import('@/views/assets/h.vue'),
          meta: {
            title: '全球指數帳戶',
            enTitle: 'Follow Influencer',
            twTitle: '全球指數帳戶',
            requireAuth: false,
          },
        },
        {
          path: '/j',
          name: 'j',
          component: () => import('@/views/assets/j.vue'),
          meta: {
            title: '账户',
            enTitle: 'Follow Influencer',
            twTitle: '账户',
            requireAuth: false,
          },
        },
        {
          path: '/k',
          name: 'k',
          component: () => import('@/views/assets/k.vue'),
          meta: {
            title: '合約帳戶',
            enTitle: 'Follow Influencer',
            twTitle: '合約帳戶',
            requireAuth: false,
          },
        },
        {
          path: '/l',
          name: 'l',
          component: () => import('@/views/assets/l.vue'),
          meta: {
            title: '幣幣帳戶',
            enTitle: 'Follow Influencer',
            twTitle: '幣幣帳戶',
            requireAuth: false,
          },
        },
        {
          path: '/peopleList',
          name: 'homepage',
          component: () => import('@/views/peopleList/Index.vue'),
          meta: {
            title: '跟单',
            enTitle: 'Follow Influencer',
            twTitle: '跟單',
            requireAuth: false,
          },
        },
        {
          path: '/Login', // 登录
          name: 'login',
          component: () => import('@/views/Login/Index.vue'),
          meta: {
            requireAuth: false,
            title: '登录',
          },
        },
        {
          path: '/LoginEamil', // 登录
          name: 'loginEamil',
          component: () => import('@/views/eamilLogin/login.vue'),
          meta: {
            requireAuth: false,
            title: '邮箱登录',
          },
        },
        {
          path: '/RegisterEamil', // 注册
          name: 'registerEamil',
          component: () => import('@/views/eamilLogin/register.vue'),
          meta: {
            requireAuth: false,
            title: '邮箱注册',
          },
        },
        {
          path: '/register', // 注册
          name: 'register',
          component: () => import('@/views/register/Index.vue'),
          meta: {
            requireAuth: false,
            title: '注册',
          },
        },
        {
          path: '/forgetPassword',
          name: 'forgetPassword',
          component: () => import('@/views/forgetPassword/Index.vue'),
          meta: {
            requireAuth: false,
            title: '忘记密码?',
          },
        },
        {
          path: '/trading', // 数字货币交易
          name: 'trading',
          component: () => import('@/views/trading/Index.vue'),
          meta: {
            title: '交易',
            requireAuth: false,
          },
        },
        {
          path: '/focusBrand', //关注
          name: 'focusBrand',
          component: () => import('@/views/focusBrand/Index.vue'),
          meta: {
            title: '订阅',
            requireAuth: false,
          },
        },
        {
          path: '/personalHome', //个人页
          name: 'personalHome',
          component: () => import('@/views/personalHome/Index.vue'),
          meta: {
            title: '个人主页',
            requireAuth: false,
          },
        },
        {
          path: '/userBinding', //个人页
          name: 'userBinding',
          component: () => import('@/views/userBinding/index.vue'),
          meta: {
            title: '申请绑定',
            requireAuth: true,
          },
        },
        {
          path: '/assets/balance', // 余额账户
          name: 'balanceAssets',
          component: () => import('@/views/assets/balanceIndex.vue'),
          meta: {
            title: '余额账户(充币&提币)',
            requireAuth: true,
          },
        },
        {
          path: '/user/message', // 消息
          name: 'message',
          component: () => import('@/views/user/userMsg.vue'),
          meta: {
            title: '系统通知',
            requireAuth: true,
          },
        },
        {
          path: '/assets/digital', // 数字货币账户
          name: 'digitalAssets',
          component: () => import('@/views/assets/digitalTradingIndex.vue'),
          meta: {
            title: '数字货币账户',
            requireAuth: true,
          },
        },
        {
          path: '/assets/futures', // 股指期货账户
          name: 'futuresTradingAssets',
          component: () => import('@/views/assets/futuresTradingIndex.vue'),
          meta: {
            title: '股指期货账户',
            requireAuth: true,
          },
        },
        {
          path: '/assets/follows', // 跟单账户
          name: 'followsAssets',
          component: () => import('@/views/assets/followIndex.vue'),
          meta: {
            title: '跟单账户',
            requireAuth: true,
          },
        },
        {
          path: '/newTradeIndex',
          name: 'newTradeIndex',
          component: () => import('@/views/trading/newTrade/index.vue'),
          meta: {
            title: '新币申请',
            enTitle: 'NewApplication',
            twTitle: '新幣申請',
            requireAuth: true,
          },
        },
        {
          path: '/newTradeIndexInfo',
          name: 'newTradeIndexInfo',
          component: () => import('@/views/trading/newTrade/info.vue'),
          meta: {
            title: '新币申请',
            enTitle: 'NewApplication1',
            twTitle: '新幣申請',
            requireAuth: false,
          },
        },
        {
          path: '/pledge',
          name: 'pledge',
          component: () => import('@/views/pledge/index.vue'),
          meta: {
            title: '質押生息',
            enTitle: '質押生息',
            twTitle: '質押生息',
            requireAuth: false,
          },
        },
        {
          path: '/pledge-history',
          name: 'pledge-history',
          component: () => import('@/views/pledge/pledge-history.vue'),
          meta: {
            title: '質押記錄',
            requireAuth: false,
          },
        },
        {
          path: '/bringUp',
          name: 'bringUp',
          component: () =>
            import('@/views/assets/balanceCompontent/bringUp.vue'),
          meta: {
            title: '提币',
            enTitle: 'bring up',
            twTitle: '提幣',
            requireAuth: false,
          },
        },
        {
          path: '/topUps',
          name: 'topUps',
          component: () => import('@/views/assets/balanceCompontent/topUp.vue'),
          meta: {
            title: '充币',
            enTitle: 'top up',
            twTitle: '充幣',
            requireAuth: false,
          },
        },
        {
          path: '/user/authentication', // 实名认证
          name: 'authentication',
          component: () => import('@/views/user/realNameAuthentication.vue'),
          meta: {
            title: '实名认证',
            requireAuth: true,
          },
        },
        {
          path: '/user/myCommunity', // 我的社区
          name: 'myCommunity',
          component: () => import('@/views/user/myCommunity.vue'),
          meta: {
            title: '我的社区',
            requireAuth: true,
          },
          // myCommunity
        },
        {
          path: '/user/safePassword', // 交易密码
          name: 'safePassword',
          component: () => import('@/views/user/setSafePassword.vue'),
          meta: {
            title: '更改交易密码',
            requireAuth: true,
          },
        },
        {
          path: '/user/changePhone', // 更换登录手机号
          name: 'changePhone',
          component: () => import('@/views/user/changePhone.vue'),
          meta: {
            title: '更换登录手机号',
            requireAuth: true,
          },
        },
        {
          path: '/user/changeLoginPassword', // 修改登录密码
          name: 'changeLoginPassword',
          component: () => import('@/views/user/changeLoginPwd.vue'),
          meta: {
            title: '更改登录密码',
            requireAuth: true,
          },
        },
        {
          path: '/user/changeUserData',
          name: 'changeUserData',
          component: () => import('@/views/user/userDataEdit.vue'),
          meta: {
            title: '修改个人信息',
            requireAuth: true,
          },
        },
        {
          path: '/address',
          name: 'address',
          component: () => import('@/views/address/address-list.vue'),
          meta: {
            title: '地址管理',
            requireAuth: false,
          },
        },
        // 法币交易相关
        {
          path: '/legalPurchase', // 法币购买
          name: 'legalPurchase',
          component: () => import('@/views/legalPurchase/Index.vue'),
          redirect: '/legalPurchase/freeTrade',
          meta: {
            title: '',
            requireAuth: false,
          },
          children: [
            // 自选交易
            {
              path: '/legalPurchase/freeTrade',
              redirect: '/legalPurchase/freeTrade/buy',
              name: 'freeTrade',
              component: () =>
                import('@/views/legalPurchase/components/freeTrade/Index.vue'),
              meta: {
                title: '',
                requireAuth: false,
              },
              children: [
                {
                  // 购买
                  path: '/legalPurchase/freeTrade/buy',
                  name: 'freeBuy',
                  component: () =>
                    import(
                      '@/views/legalPurchase/components/freeTrade/components/Buy.vue'
                    ),
                  meta: {
                    title: '',
                    requireAuth: true,
                  },
                },
                {
                  // 出售
                  path: '/legalPurchase/freeTrade/sell',
                  name: 'freeSell',
                  component: () =>
                    import(
                      '@/views/legalPurchase/components/freeTrade/components/Sell.vue'
                    ),
                  meta: {
                    title: '',
                    requireAuth: true,
                  },
                },
              ],
            },
            // 一键买卖
            {
              path: '/legalPurchase/easyTrade',
              name: 'easyTrade',
              component: () =>
                import('@/views/legalPurchase/components/easyTrade/Index.vue'),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 购买订单详情
            {
              path: '/legalPurchase/orderDetail/buy',
              name: 'buy',
              component: () =>
                import(
                  '@/views/legalPurchase/components/orderDetail/BuyOrderDetail.vue'
                ),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 出售订单详情
            {
              path: '/legalPurchase/orderDetail/sell',
              name: 'sell',
              component: () =>
                import(
                  '@/views/legalPurchase/components/orderDetail/SellOrderDetail.vue'
                ),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 等待放行
            {
              path: '/legalPurchase/orderDetail/WaitingPayCoin',
              name: 'WaitingPayCoin',
              component: () =>
                import(
                  '@/views/legalPurchase/components/orderDetail/WaitingPayCoin.vue'
                ),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 申诉
            {
              path: '/legalPurchase/complaint',
              name: 'complaint',
              component: () =>
                import('@/views/legalPurchase/components/complaint/Index.vue'),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 商家认证
            {
              path: '/legalPurchase/certificate',
              name: 'certificate',
              component: () =>
                import(
                  '@/views/legalPurchase/components/certificate/Index.vue'
                ),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 我的广告
            {
              path: '/legalPurchase/myAdv',
              name: 'myAdv',
              component: () =>
                import('@/views/legalPurchase/components/myAdv/Index.vue'),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 收款方式
            {
              path: '/legalPurchase/gatherWay',
              name: 'gatherWay',
              component: () =>
                import('@/views/legalPurchase/components/gather/Index.vue'),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
            // 添加收款方式
            {
              path: '/legalPurchase/gatherWay/add',
              name: 'addGatherWay',
              component: () =>
                import(
                  '@/views/legalPurchase/components/gather/components/AddGatherWay.vue'
                ),
              meta: {
                title: '',
                requireAuth: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/404', // 404页面
      component: () => import('@/views/404.vue'),
      meta: {
        title: '页面不存在',
        requireAuth: false,
      },
    },
    {
      path: '*',
      redirect: '/404',
    },
  ],
});

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  // nprogress start
  NProgress.start();
  if (to.matched.some((res) => res.meta.requireAuth)) {
    // 判断是否需要登录权限
    if (store.getters.getCurrentUserInfos.token) {
      // 判断是否登录
      next();
    } else {
      // 没登录则跳转到登录界面
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
