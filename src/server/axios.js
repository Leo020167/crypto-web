import md5 from 'js-md5';
import * as params from './params';
import store from '@/store';
import axios from 'axios';
import each from './each';
// 封装了fetch请求
import func from './func';

export const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const marketUrl = import.meta.env.VITE_API_MARKET_URL;
export const marketUrl2 = import.meta.env.VITE_API_MARKET_URL;
export const uploadFileUrl = import.meta.env.VITE_API_UPLOAD_URL;
export const newUrl1 = import.meta.env.VITE_API_BASE_URL;

// 登录、注册、退出s
export const security = {
  getDetail1: () => {
    let url = 'https://api.bjchjscl.com/trade/article/detail.do';
    return func.axiosPost(url, {});
  },
  getNewCountryCode: () => {
    let url = baseUrl + '/area/list.do';
    return func.axiosPost(url, {});
  },
  // 国家区号, 手机，验证码，x,key, 密码(MD5加密后转大写)，确认密码(MD5加密后转大写),inviteCode(邀请码：用户UID，这个参数主要从web注册时附带)
  register: (
    countryCode,
    phone,
    smsCode,
    locationx,
    dragImgKey,
    userPass,
    configUserPass,
    inviteCode,
    email,
    types
  ) => {
    let url = baseUrl + '/security/register.do';
    return func.axiosPost(url, {
      type: types, // 1 手机号，2邮箱
      email: email, // 邮箱
      countryCode: countryCode,
      phone: phone,
      userPass: md5(userPass).toUpperCase(),
      configUserPass: md5(configUserPass).toUpperCase(),
      smsCode: smsCode,
      locationx: locationx,
      dragImgKey: dragImgKey,
      inviteCode: inviteCode,
      sex: 1,
    });
  },
  // 获取手机验证码
  getSms: (phone, countryCode, locationx, dragImgKey, type) => {
    let url = baseUrl + '/sms/get.do';
    return func.axiosPost(url, {
      phone: phone, // 旧版本手机号
      sendAddr: phone, //新手机号或者邮箱
      type: type, // type == 1 手机  type == 2 邮箱
      countryCode: countryCode,
      locationx: locationx,
      dragImgKey: dragImgKey,
    });
  },
  // 登录
  login: (phone, userPass, smsCode, locationx, dragImgKey, types, email) => {
    let url = baseUrl + '/security/login.do';
    return func.axiosPost(url, {
      type: types, // 1--手机号，  2 -- 邮箱
      phone: phone,
      userPass: md5(userPass).toUpperCase(),
      smsCode: smsCode,
      locationx: locationx,
      dragImgKey: dragImgKey,
      email: email,
    });
  },
  // 获取我是否有新消息
  getNewmsg() {
    let url = baseUrl + '/home/my.do';
    return func.axiosPost(url, {});
  },
  // 退出
  loginOut: () => {
    let url = baseUrl + '/security/loginOut.do';
    return func.axiosPost(url, {});
  },
  // 忘记密码
  forgetPass: (
    countryCode,
    phone,
    smsCode,
    userPass,
    dragImgKey,
    locationx
  ) => {
    let url = baseUrl + '/security/forgetPass.do';
    return func.axiosPost(url, {
      countryCode: countryCode,
      phone: phone,
      userPass: md5(userPass).toUpperCase(),
      smsCode: smsCode,
      locationx: locationx,
      dragImgKey: dragImgKey,
    });
  },
  // 更新登录密码
  updateUserPass: (oldUserPass, newUserPass, configUserPass) => {
    let url = baseUrl + '/user/security/updateUserPass.do';
    return func.axiosPost(url, {
      oldUserPass: md5(oldUserPass).toUpperCase(),
      newUserPass: md5(newUserPass).toUpperCase(),
      configUserPass: md5(configUserPass).toUpperCase(),
    });
  },
  // 身份验证
  IdVerifyEmail: (email, code, dragImgKey, locationx) => {
    let url = baseUrl + '/user/security/checkEmailCode.do';
    return func.axiosPost(url, {
      email: email,
      code: code,
      dragImgKey: dragImgKey,
      locationx: locationx,
    });
  },
  // 身份验证
  IdVerify: (phone, smsCode, dragImgKey, locationx) => {
    let url = baseUrl + '/user/security/checkIdentity.do';
    return func.axiosPost(url, {
      phone: phone,
      smsCode: smsCode,
      dragImgKey: dragImgKey,
      locationx: locationx,
    });
  },
  // 更换交易密码
  updatePayPassword: (
    payPass,
    configPayPass,
    oldPhone,
    oldSmsCode,
    dragImgKey,
    locationx
  ) => {
    let url = baseUrl + '/user/security/setPayPass.do';
    return func.axiosPost(url, {
      payPass: md5(payPass).toUpperCase(),
      configPayPass: md5(configPayPass).toUpperCase(),
      oldPhone: oldPhone,
      oldSmsCode: oldSmsCode,
      dragImgKey: dragImgKey,
      locationx: locationx,
    });
  },
  // 更换新手机
  updateNewPhone: (
    countryCode,
    newPhone,
    newSmsCode,
    dragImgKey,
    locationx,
    oldPhone,
    oldSmsCode
  ) => {
    let url = baseUrl + '/user/security/changePhoneTwo.do';
    return func.axiosPost(url, {
      newCountryCode: countryCode,
      newPhone: newPhone,
      newSmsCode: newSmsCode,
      dragImgKey: dragImgKey,
      locationx: locationx,
      oldPhone: oldPhone,
      oldSmsCode: oldSmsCode,
    });
  },
  // 获取实名验证信息
  getRealNameData: () => {
    let url = baseUrl + '/identity/get.do';
    return func.axiosPost(url, {});
  },
  // 实名验证,先上传图片
  submitRealname: (name, certNo, frontImgUrl, backImgUrl, birth) => {
    let url = baseUrl + '/identity/submit.do';
    return func.axiosPost(url, {
      name: name,
      certNo: certNo,
      frontImgUrl: frontImgUrl,
      backImgUrl: backImgUrl,
      birth: birth,
    });
  },
  // 更新个人信息(名称、性别，描述，头像)
  updateUserInfo: (userName, sex, birthday, describes, headUrl) => {
    let url = baseUrl + '/user/updateUserInfo.do';
    return func.axiosPost(url, { userName, sex, birthday, describes, headUrl });
  },
  // 获取风险率
  getDangerRateInfo: () => {
    let url = baseUrl + '/config/all.do';
    return func.axiosPost(url, {
      version: 0,
      bundleId: '',
      noticeTime: 0,
    });
  },
  // 获取个人的信息
  getMymessage: (pageNo) => {
    let url = baseUrl + '/message/find.do';
    return func.axiosPost(url, { pageNo: pageNo });
  },
};

// 图片验证接口
export const imgVerify = {
  outDragImg: () => {
    let url = uploadFileUrl + '/security/outDragImg.do';
    return func.axiosPost(url, {});
  },
  checkDragImg: (locationx, dragImgKey) => {
    let url = baseUrl + '/security/checkDragImg.do';
    return func.axiosPost(url, {
      locationx: locationx,
      dragImgKey: dragImgKey,
    });
  },
};

// 上传图片 上传头像：dir=userImage
export const uploadImage = ({
  dir: dir,
  type: type,
  imageFiles: imageFiles,
}) => {
  let url = uploadFileUrl + '/upload/file.do';
  let array = params.signParametersToURL({
    dir: dir,
    type: type,
  });
  each(array, function (key, value) {
    imageFiles.append(key, value);
  });
  return axios
    .post(url, imageFiles, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((resData) => {
      resData = resData.data;
      if (resData.code == 40009) {
        store.dispatch('removeCurrentUserInfo');
      }
      return resData;
    });
};

// 个人资产接口
// accountType === digital(数字货币账户)，stock(股指期货账户)，followdigital(跟单数字货币账户)，followstock(跟单股指期货账户)，balance(余额账户)
export const assetsApi = {
  getNewBiList: (symbol) => {
    let url = baseUrl + '/pro/order/config.do';
    return func.axiosPost(url, { symbol: symbol });
  },
  getDataListSub: () => {
    let url = newUrl1 + '/subscribe/getList.do';
    return func.axiosPost(url, {});
  },
  getDataListSubInfo: (id) => {
    let url = newUrl1 + '/subscribe/getDetail.do';
    return func.axiosPost(url, { id: id });
  },
  getDataListSubInfoApply: (subscribeId, count, userId) => {
    let url = newUrl1 + '/subscribe/apply.do';
    return func.axiosPost(url, {
      subscribeId: subscribeId,
      count: count,
      userId: userId,
    });
  },
  // 上传
  localSubmit: (userId, amount, address, image, inOut, chainType) => {
    let url = baseUrl + '/depositeWithdraw/localSubmit.do';
    return func.axiosPost(url, {
      userId: userId,
      amount: amount,
      address: address,
      image: image,
      inOut: inOut,
      chainType: chainType,
    });
  },
  // 获取链类型
  getInfoDeposite: () => {
    let url = baseUrl + '/depositeWithdraw/getInfo.do';
    return func.axiosPost(url, {});
  },
  // 跟单接口  11.12
  getTypes: (dvUid, type) => {
    let url = baseUrl + '/follow/getTypes.do';
    return func.axiosPost(url, {
      dvUid: dvUid,
      type: type,
    });
  },
  getApplyForFollow: (dvUid, typeId, multiNum) => {
    let url = baseUrl + '/follow/applyForFollow.do';
    return func.axiosPost(url, {
      dvUid: dvUid,
      typeId: typeId,
      multiNum: multiNum,
    });
  },
  // 获取转账的选择类型
  getAssetTypeData: () => {
    let url = baseUrl + '/account/listAccountType.do';
    return func.axiosPost(url, {});
  },
  // 获取账户可用资产数量
  getSymbolMaxAmount: (fromAccountType, symbol) => {
    let url = baseUrl + '/account/getSymbolMaxAmount.do';
    return func.axiosPost(url, {
      fromAccountType,
      symbol,
    });
  },
  getAssetNumber: (accountType) => {
    let url = baseUrl + '/account/outHoldAmount.do';
    return func.axiosPost(url, {
      accountType: accountType,
    });
  },
  // 某个资产tab的转账记录 inOut: 1：转入 -1：转出
  getAccountTransList: (inOut, accountType) => {
    let url = baseUrl + '/account/outHoldAmount.do';
    return func.axiosPost(url, {
      inOut: inOut,
      accountType: accountType,
    });
  },
  // 点击充币、提币操作前的相关信息(链类型)
  getDWPropsInfo: (inOut) => {
    let url = baseUrl + '/depositeWithdraw/coinList.do';
    return func.axiosPost(url, {
      inOut: inOut,
    });
  },
  // 获取充币、提币操作的相关信息
  getCWoprationInfo: (inOut, chainType) => {
    let url = baseUrl + '/depositeWithdraw/getCoinInfo.do';
    return func.axiosPost(url, {
      symbol: 'USDT',
      inOut: inOut,
      chainType: chainType,
    });
  },
  // 获取充币记录、提币记录
  getCWRecord: (inOut, pageNo) => {
    let url = baseUrl + '/depositeWithdraw/list.do';
    return func.axiosPost(url, {
      inOut: inOut,
      pageNo: pageNo,
    });
  },
  // 获取充币记录、提币记录
  getCWRecord2: (inOut, pageNo, type) => {
    let url = baseUrl + '/depositeWithdraw/list.do';
    return func.axiosPost(url, {
      inOut: inOut,
      pageNo: pageNo,
      type: type,
    });
  },
  // 获取充币记录、提币记录
  getRecordList: (pageNo) => {
    let url = baseUrl + '/account/recordList.do';
    return func.axiosPost(url, {
      accountType: 'token',
      pageNo: pageNo,
    });
  },
  // 获取社区记录
  getInviteList: (pageNo) => {
    let url = baseUrl + '/invite/home.do';
    return func.axiosPost(url, {
      pageNo: pageNo,
    });
  },
  // 购买邀请码
  getInviteBuy: (count) => {
    let url = baseUrl + '/invite/buy.do';
    return func.axiosPost(url, {
      // userId: userId,
      count: count,
    });
  },
  // 获取历史记录(在行情页 symbol填交易对，如：BTC/USDT。其他的首次选空，symbol为币种);
  getCorrespondRecords: (
    symbol,
    accountType,
    pageNo,
    buySell,
    orderState,
    type,
    isDone
  ) => {
    let url = baseUrl + '/pro/order/queryList.do';
    return func.axiosPost(url, {
      symbol: symbol,
      accountType: accountType,
      pageNo: pageNo,
      buySell: buySell,
      orderState: orderState,
      isDone: isDone ? isDone : '-1', // isDone＝1 当前委托，isDone＝0 当前开仓，isDone＝-1 历史记录
      type: type ? type : '0',
    });
  },
  getCorrespondRecordsWithPageSize: (
    symbol,
    accountType,
    pageNo,
    buySell,
    orderState,
    type,
    isDone,
    pageSize
  ) => {
    let url = baseUrl + '/pro/order/queryList.do';
    return func.axiosPost(url, {
      symbol: symbol,
      accountType: accountType,
      pageNo: pageNo,
      buySell: buySell,
      orderState: orderState,
      isDone: isDone ? isDone : '-1', // isDone＝1 当前委托，isDone＝0 当前开仓，isDone＝-1 历史记录
      type: type ? type : '0',
      pageSize,
    });
  },
  // 获取划转记录
  getTransferRecords: (fromAccountType, toAccountType, pageNo) => {
    let url = baseUrl + '/account/queryTransferList.do';
    return func.axiosPost(url, {
      fromAccountType: fromAccountType,
      toAccountType: toAccountType,
      pageNo: pageNo,
    });
  },
  // 操作类
  // 划转
  transferAssets: (amount, fromAccountType, toAccountType, payPass, symbol) => {
    let url = baseUrl + '/account/transfer.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      amount: amount,
      fromAccountType: fromAccountType,
      toAccountType: toAccountType,
      payPass: payPsw,
      symbol,
    });
  },
  getTransferSymbols: (params) => {
    let url = baseUrl + '/account/getTransferSymbols.do';

    return func.axiosPost(url, params);
  },
  // 提币申请
  submitWithdraw: (amount, chainType, address, payPass) => {
    let url = baseUrl + '/depositeWithdraw/submit.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      symbol: 'USDT',
      amount: amount,
      chainType: chainType,
      address: address,
      payPass: payPsw,
    });
  },
  // 撤销提币申请 dwId: 记录ID
  cancelWithdraw: (dwId) => {
    let url = baseUrl + '/depositeWithdraw/submit.do';
    return func.axiosPost(url, {
      dwId: dwId,
    });
  },
  // 平仓
  closePosition: (orderId, closeHand, payPass) => {
    let url = baseUrl + '/pro/order/close.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      orderId: orderId,
      closeHand: closeHand,
      payPass: payPsw,
    });
  },
  // 开仓前，获取最大手数、保证金
  openCheckOut: (symbol, price, buySell, hand, multiNum, orderType, type) => {
    let url = baseUrl + '/pro/order/checkOut.do';
    return func.axiosPost(url, {
      symbol: symbol,
      price: price,
      buySell: buySell,
      hand: hand,
      multiNum: multiNum, //杠杆倍数
      orderType: orderType, //limit：限价，market：市价
      type: type ? type : 1,
    });
  },
  // 开仓
  openPosition: (
    symbol,
    price,
    buySell,
    hand,
    initHandList,
    orderType,
    payPass,
    multiNum,
    type
  ) => {
    let url = baseUrl + '/pro/order/open.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      symbol: symbol, //交易对：BTC/USDT
      price: price,
      buySell: buySell, //buy：看涨，sell：看跌
      hand: hand, //手数，输入整型
      initHandList: initHandList, //杠杆倍数
      orderType: orderType, //limit：限价，market：市价
      payPass: payPsw,
      multiNum: multiNum,
      type: type ? type : '0',
    });
  },
  // 止盈
  stopWinConfig: (orderId, stopWinPrice, payPass) => {
    let url = baseUrl + '/pro/order/updateWinPrice.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      orderId: orderId,
      stopWinPrice: stopWinPrice, //0不设置
      payPass: payPsw,
    });
  },
  // 止损
  stopLossConfig: (orderId, stopLossPrice, payPass) => {
    let url = baseUrl + '/pro/order/updateLossPrice.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      orderId: orderId,
      stopLossPrice: stopLossPrice, //0不设置
      payPass: payPsw,
    });
  },
  // 撤单
  cancleOrder: (orderId, payPass) => {
    let url = baseUrl + '/pro/order/cancel.do';
    let payPsw = payPass ? md5(payPass).toUpperCase() : payPass;
    return func.axiosPost(url, {
      orderId: orderId,
      payPass: payPsw,
    });
  },
  cancelOrder2: (orderId) => {
    let url = baseUrl + '/pro/order/cancel.do';

    return func.axiosPost(url, {
      orderId: orderId,
      type: 2,
    });
  },
  // 设置跟单倍数
  setFollowTimes: (multiple) => {
    let url = baseUrl + '/follow/updateMultiple.do';
    return func.axiosPost(url, {
      multiple: multiple,
    });
  },
  // 设置开启跟单
  openFollow: (isOpen) => {
    //0关闭，1开通
    let url = baseUrl + '/follow/updateForOpen.do';
    return func.axiosPost(url, {
      isOpen: isOpen,
    });
  },
  // 解绑
  unBind: (dvUid) => {
    let url = baseUrl + '/follow/unBind.do';
    return func.axiosPost(url, {
      dvUid: dvUid,
    });
  },
};

// 获取首页数据
export const homePageApi = {
  // 大V列表
  brandList: () => {
    let url = baseUrl + '/home/cropyme.do';
    return func.axiosPost(url, {});
  },
  // 大V的个人中心
  brandHome: (targetUid) => {
    let url = baseUrl + '/personal/home.do';
    return func.axiosPost(url, {
      targetUid: targetUid,
    });
  },
  // 大V的走势图
  brandTradChart: (targetUid, timeType, type) => {
    let url = baseUrl + '/personal/trendChart.do';
    return func.axiosPost(url, {
      targetUid: targetUid,
      timeType: timeType, //month，month3，month6，year
      type: type, //1个人业绩，2跟单人气，3交易次数
    });
  },
  // 订阅付费
  focusBrand: (attentionUid, num) => {
    let url = baseUrl + '/attention/add.do';
    return func.axiosPost(url, {
      attentionUid: attentionUid,
      num: num,
    });
  },
  // 取消关注
  cancalFocusBrand: (attentionUid) => {
    let url = baseUrl + '/attention/cancel.do';
    return func.axiosPost(url, {
      attentionUid: attentionUid,
    });
  },
  // 申请绑定
  applyFollow: (dvUid) => {
    let url = baseUrl + '/follow/applyForFollow.do';
    return func.axiosPost(url, {
      dvUid: dvUid,
    });
  },
  // 申请解绑
  cancelFollow: (dvUid) => {
    let url = baseUrl + '/follow/unBind.do';
    return func.axiosPost(url, {
      dvUid: dvUid,
    });
  },
  //我的关注
  myFocusList: () => {
    // bundleId version uniqkeyid 没有传
    let url = baseUrl + '/home/cropyme.do';
    return func.axiosPost(url, {});
  },
};

// 获取全局的账户数据
export const globalAccountApi = () => {
  let url = baseUrl + '/home/account.do';
  return func.axiosPost(url, {});
};

// 自选行情、数字货币行情、股指期 货行情
export const findMyCoin = (postData) => {
  return func.axiosPost(marketUrl + '/quote/marketData.do', postData);
};
// 自选行情、数字货币行情、股指期货行情
export const findMyCoin1 = (postData) => {
  return func.axiosPost(marketUrlDance + '/quote/marketData.do', postData);
};
export const findMyCoin2 = (postData) => {
  return func.axiosPost(marketUrl2 + '/quote/marketData.do', postData);
};

// 获取我的自选股
export const getOptionalCoin = () => {
  return func.axiosPost(baseUrl + '/optional/coin/find.do', {});
};
// 添加自选股
export const addOptionalCoin = (symbol) => {
  return func.axiosPost(baseUrl + '/optional/coin/add.do', { symbol: symbol });
};
// 刪除自選
export const cancelOptionalCoin = (symbol) => {
  return func.axiosPost(baseUrl + '/optional/coin/del.do', { symbol: symbol });
};

// 搜索币种
export const seachCoin = (symbol) => {
  return func.axiosPost(baseUrl + '/search/coin.do', { symbol: symbol });
};

// 获取币种信息
export const getCoinInfo = (symbol) => {
  return func.axiosPost(baseUrl + '/coin/info.do', { symbol: symbol });
};

// K线数据
export const getKline = (postData) => {
  return func.axiosPost(marketUrl + '/quote/kline.do', postData);
};

/**
 * 获取盘口数据
 * @params {
 *  symbol, // 交易对
 *  depth, // 买卖挡深度，默认5挡
 *  klineType // K线类型，通过接口可以实时获取K线最新1根数据：min1,min15,hour1,hour4,day,week,month
 * }
 * */
export const getDish = (symbol, depth, klineType) => {
  let url = marketUrl + '/quote/real.do';
  return func.axiosPost(url, {
    symbol: symbol,
    depth: depth,
    klineType: klineType,
  });
};

// 进入交易页面获取配置信息
export const getConfigTrad = (symbol) => {
  let url = baseUrl + '/pro/order/config.do';
  return func.axiosPost(url, {
    symbol: symbol,
  });
};

// 法币交易
export const legalPurchaseApi = {
  ceshi: () => {
    let url = baseUrl + '/home/account.do';
    return func.axiosPost(url, {});
  },
  // 统计交易量总数
  querySum: (accountType) => {
    let url = baseUrl + '/pro/order/querySum.do';
    return func.axiosPost(url, {
      accountType: accountType,
    });
  },
  // 热搜榜
  resouBang: () => {
    let url = newUrl + '/quote/cloutData.do';
    return func.axiosPost(url, {});
  },
  // 市场
  marketAdv: (buySell, filterPayWay, filterCny, pageNo, type, currencyType) => {
    let url = baseUrl + '/otc/mainad/findAdList.do';
    return func.axiosPost(url, {
      buySell: buySell,
      filterPayWay: filterPayWay, //筛选支付方式：0全部，1支付宝，2微信，3银行卡
      filterCny: filterCny, //筛选金额
      pageNo: pageNo,
      type: type, //type=fast代表快捷区，type=optional或空代表自选区
      currencyType: currencyType, // 币种类型
    });
  },
  // 下单广告
  createOrder: (buySell, adId, amount, price, showReceiptType) => {
    let url = baseUrl + '/otc/mainad/createOrder.do';
    return func.axiosPost(url, {
      buySell,
      adId,
      amount,
      price,
      showReceiptType, //【快捷出售或购买】时不能为空
    });
  },
  // 下单成功后，跳转到详情页，获得详情
  getOrderData: (orderId) => {
    let url = baseUrl + '/otc/mainad/getOrderDetail.do';
    return func.axiosPost(url, { orderId });
  },
  // 购买方：取消订单
  deleteOrder: (orderId) => {
    let url = baseUrl + '/otc/mainad/cancelOrder.do';
    return func.axiosPost(url, { orderId });
  },
  // 购买方：我已向对方付款按钮
  payForOrder: (orderId) => {
    let url = baseUrl + '/otc/mainad/toMarkPayOrderSuccess.do';
    return func.axiosPost(url, { orderId });
  },
  // 售卖方： 我已收到付款
  getOrderPay: (orderId) => {
    let url = baseUrl + '/otc/mainad/toConfirmReceivedPay.do';
    return func.axiosPost(url, { orderId });
  },
  // 申诉理由列表
  appealReasonList: (orderId) => {
    let url = baseUrl + '/otc/mainad/getInitAppealList.do';
    return func.axiosPost(url, { orderId });
  },
  // 提交申诉
  enterAppeal: (orderId, reason, image1Url, image2Url, message) => {
    let url = baseUrl + '/otc/mainad/submitAppeal.do';
    return func.axiosPost(url, {
      orderId,
      reason,
      image1Url,
      image2Url,
      message,
    });
  },
  // 获得商家认证的基本信息
  getCertificateData: () => {
    let url = baseUrl + '/otc/certification/getCertificationInfo.do';
    return func.axiosPost(url, {});
  },
  // 申请为商家
  Applicant: () => {
    let url = baseUrl + '/otc/certification/authenticate.do';
    return func.axiosPost(url, {});
  },
  // 取消成为商家
  cancelApplicant: () => {
    let url = baseUrl + '/otc/certification/applyForCancellation.do';
    return func.axiosPost(url, {});
  },
  // 我的广告列表
  myAdvList: () => {
    let url = baseUrl + '/otc/myad/findMyAdList.do';
    return func.axiosPost(url, {});
  },
  // 发布广告
  publishAdv: (buySell, price, minCny, maxCny, amount, payWay, content) => {
    let url = baseUrl + '/otc/myad/addMyAd.do';
    return func.axiosPost(url, {
      buySell: buySell,
      price: price,
      minCny: minCny,
      maxCny: maxCny,
      amount: amount,
      payWay: payWay,
      content: content,
    });
  },
  // 更新广告
  upDateAdv: (
    adId,
    buySell,
    price,
    minCny,
    maxCny,
    amount,
    payWay,
    content
  ) => {
    let url = baseUrl + '/otc/myad/updateMyAd.do';
    return func.axiosPost(url, {
      adId: adId,
      buySell: buySell,
      price: price,
      minCny: minCny,
      maxCny: maxCny,
      amount: amount,
      payWay: payWay,
      content: content,
    });
  },
  // 广告上下架
  upDownAdv: (adId, online) => {
    let url = baseUrl + '/otc/myad/setOnline.do';
    return func.axiosPost(url, { adId: adId, online: online });
  },
  // 删除广告
  deleteAdv: (adId) => {
    let url = baseUrl + '/otc/myad/delMyAd.do';
    return func.axiosPost(url, { adId: adId });
  },
  // 获取我的收款方式
  getMyPayway: () => {
    let url = baseUrl + '/otc/payment/findMyPaymentList.do';
    return func.axiosPost(url, {});
  },
  // 获取收款方式数组
  getPaywayArr: () => {
    let url = baseUrl + '/otc/payment/findPaymentOptionList.do';
    return func.axiosPost(url, {});
  },
  // 添加收款方式(修改不行)
  addPayways: (
    receiptType,
    paymentId,
    receiptName,
    receiptNo,
    bankName,
    qrCodeUrl
  ) => {
    let url = baseUrl + '/otc/payment/savePayment.do';
    return func.axiosPost(url, {
      receiptType: receiptType, //收款方式，1：支付宝，2：微信，3：银行卡
      paymentId: paymentId, //添加收款方式为0，编辑时>0
      receiptName: receiptName,
      receiptNo: receiptNo,
      bankName: bankName,
      qrCodeUrl: qrCodeUrl,
    });
  },
  deletePayway: (paymentId) => {
    let url = baseUrl + '/otc/payment/delete.do';
    return func.axiosPost(url, { paymentId: paymentId });
  },
  // 我的订单历史记录
  otcOrderRecord: (buySell, state, pageNo) => {
    let url = baseUrl + '/otc/mainad/findOrderList.do';
    return func.axiosPost(url, { buySell, state, pageNo });
  },
  // 获取交易类型
  otcConfig: () => {
    let url = baseUrl + '/otc/mainad/config.do';
    return func.axiosPost(url, {});
  },
  // 获取我的聊天记录
  getChatRecord: (orderId) => {
    let url = baseUrl + '/chat/otc/findOtcChatList.do';
    return func.axiosPost(url, { orderId });
  },
  // 发送聊天
  sendChat: (orderId, type, say, fileUrl, imgWidth, imgHeight) => {
    let url = baseUrl + '/chat/otc/sendOtcChat.do';
    return func.axiosPost(url, {
      orderId,
      type,
      say,
      fileUrl,
      imgWidth,
      imgHeight,
    });
  },
};

/**
 * 【我的广告】获取广告最高最低价格
 * @param {buy购买，sell出售} buySell
 * @returns
 */
export const getAdPrice = (buySell) => {
  return func.axiosPost(baseUrl + '/otc/myad/getAdPrice.do', { buySell });
};

export const listPledges = () => {
  return func.axiosPost(baseUrl + '/pledge/list.do', {});
};

// count, pledgeId
export const pledgeCommit = (data) => {
  return func.axiosPost(baseUrl + '/pledge/commit.do', data);
};

// status 0,1
export const pledgeHistory = (data) => {
  return func.axiosPost(baseUrl + '/pledge/recordList.do', data);
};

export const proOrderOpen = (data) => {
  return func.axiosPost(baseUrl + '/pro/order/open.do', data);
};

export const coinList = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/coinList.do', data);
};

export const getChargeConfigs = (data) => {
  return func.axiosPost(
    baseUrl + '/depositeWithdraw/getChargeConfigs.do',
    data
  );
};

export const chargeSubmit = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/chargeSubmit.do', data);
};

export const getWithdrawConfigs = (data) => {
  return func.axiosPost(
    baseUrl + '/depositeWithdraw/getWithdrawConfigs.do',
    data
  );
};

export const addressList = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/addressList.do', data);
};

export const addAddress = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/addAddress.do', data);
};

export const delAddress = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/delAddress.do', data);
};

export const withdrawSubmit = (data) => {
  return func.axiosPost(baseUrl + '/depositeWithdraw/withdrawSubmit.do', data);
};

export function getArticles(params) {
  return func.axiosPost(baseUrl + '/article/noticeListWeb.do', params);
}
export function getArticle(params) {
  return func.axiosPost(baseUrl + '/article/detail.do', params);
}
