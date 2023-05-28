import { globalAccountApi } from '@/server/axios.js';
const account = {
  state: {
    fxAccount: { entrustList: [], openList: [] }, //外汇账户
    stockAccount: { entrustList: [], openList: [] }, //股指期权账户
    userFollow: { isOpen: '0', dvUid: '' }, //用户跟单数据
    digitalAccount: { assets: '0.00000', entrustList: [], openList: [] }, //数字货币账户
    spotAccount: { entrustList: [], openList: [] }, //币币账户
    tolAssetsCny: '≈€0.00', //总资产（人民币）
    followDigitalAccount: { entrustList: [], openList: [] }, //跟单账户的数字货币tab
    followStockAccount: { entrustList: [], openList: [] }, //跟单账户的股指期权tab
    followTabIndex: 0,
    followTabAccount: { entrustList: [], openList: [] },
    digitalAndStockIndex: 1, //默认数字货币的信息
    digitalAndStock: { assets: '0.00000', entrustList: [], openList: [] },
    balanceAccount: { holdAmount: '0.0000' }, //余额账户
    tolAssets: '0.00000000', //总资产（USDT）
  },
  mutations: {
    // 修改全局的资产账户
    changeGlobalAccountInfo(state, newAccountInfos) {
      state.spotAccount = newAccountInfos.spotAccount;
      state.fxAccount = newAccountInfos.fxAccount;
      state.stockAccount = newAccountInfos.stockAccount;
      state.userFollow = newAccountInfos.userFollow;
      state.digitalAccount = newAccountInfos.digitalAccount;
      state.tolAssetsCny = newAccountInfos.tolAssetsCny;
      state.followDigitalAccount = newAccountInfos.followDigitalAccount;
      state.followStockAccount = newAccountInfos.followStockAccount;
      state.balanceAccount = newAccountInfos.balanceAccount;
      state.tolAssets = newAccountInfos.tolAssets;
      state.followTabAccount =
        state.followTabIndex === 0
          ? newAccountInfos.followDigitalAccount
          : newAccountInfos.followStockAccount;
      state.digitalAndStock =
        state.digitalAndStockIndex === 4
          ? newAccountInfos.digitalAccount
          : newAccountInfos.stockAccount;
    },
    removeAccountData(state) {
      state.fxAccount = { entrustList: [], openList: [] };
      state.stockAccount = { entrustList: [], openList: [] }; //股指期权账户
      state.userFollow = { isOpen: '0', dvUid: '' }; //用户跟单数据
      state.digitalAccount = {
        assets: '0.00000',
        entrustList: [],
        openList: [],
      };
      state.tolAssetsCny = '≈€0.00';
      state.followDigitalAccount = { entrustList: [], openList: [] };
      state.followStockAccount = { entrustList: [], openList: [] };
      state.balanceAccount = {};
      state.tolAssets = '0.00000000';
    },
    changeStateIndex(state, index) {
      state.followTabIndex = index;
      state.followTabAccount =
        index == 0 ? state.followDigitalAccount : state.followStockAccount;
    },
    changeAccountData(state, index) {
      state.digitalAndStockIndex = index;
      state.digitalAndStock =
        index == 4 ? state.digitalAccount : state.stockAccount;
    },
  },
  actions: {
    // 全局请求
    getGlobalAccountData(context) {
      globalAccountApi().then((res) => {
        if (res.code === '200') {
          context.commit('changeGlobalAccountInfo', res.data);
        } else {
          context.commit('changeAccountData');
        }
      });
    },
    changeFollowTab(context, index) {
      context.commit('changeStateIndex', index);
    },
    changeAssetTab(context, index) {
      context.commit('changeAccountData', index);
    },
  },
  getters: {
    getSpotAccount(state) {
      return state.spotAccount;
    },
    getDigitalAccountInfos(state) {
      //获取数字货币账户信息
      return state.digitalAccount;
    },
    getStockAccountInfos(state) {
      //获取股指期权账户信息
      return state.stockAccount;
    },
    getDigitalAndStockInfo(state) {
      return state.digitalAndStock;
    },
    getFollowAccountInfos(state) {
      //获取跟单账户信息，包括：用户跟单信息，跟单数字货币，跟单股指期权
      return state.followTabAccount;
    },
    getFollowUserInfo(state) {
      //获取跟单用户的基本信息
      return state.userFollow;
    },
    getBalanceInfos(state) {
      //获取余额账户
      return state.balanceAccount;
    },
    // 总资产
    getTotalAsset(state) {
      return {
        totalAssets: state.tolAssets,
        tolAssetsCny: state.tolAssetsCny,
      };
    },
  },
};
export default account;
