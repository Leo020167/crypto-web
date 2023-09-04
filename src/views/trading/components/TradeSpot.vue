<template>
  <div class="trade-spot-container">
    <div class="trade-header">
      <ul class="header-nav">
        <li
          @click="handleChangeNav(2)"
          :class="activeNav === 2 ? 'activeNav' : ''"
        >
          {{ $t('trade.transaction.title1') }}
        </li>
        <li
          @click="handleChangeNav(1)"
          :class="activeNav === 1 ? 'activeNav' : ''"
        >
          {{ $t('trade.transaction.title2') }}
        </li>
      </ul>
    </div>
    <div class="trade-content">
      <!-- 限价 -->
      <div class="trade-form" v-if="activeNav === 1">
        <!-- v-if="compots !='local'" -->
        <el-form class="el-form-up" v-model="lookUpForm" label-width="70px">
          <div class="form-item">
            <el-form-item
              prop="price"
              :label="$t('trade.transaction.buy_price_label')"
            >
              <el-input
                size="medium"
                type="number"
                @input="checkOutOpenpro('buy')"
                :placeholder="$t('trade.transaction.buy_price_ph')"
                v-model="lookUpForm.price"
              >
                <template slot="suffix">USDT</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="cny-tip">
            <p class="cny-right">≈{{ lookUpForm.cny }}{{ transUnit }}</p>
          </div>
          <!-- <div class="form-item">
            <el-form-item prop="amount"
                          :label="$t('trade.transaction.buy_amount_label')">
              <ul class="choose">
                <li v-for="(item, index) in amountList"
                    @click="handleClickAmount('limit', 'buy', item)"
                    :key="index"
                    :class="item == limitBuyAmount ? 'choose-item act' : 'choose-item'">{{item}}</li>
              </ul>
            </el-form-item>
          </div> -->
          <div class="form-item">
            <el-form-item prop="amount" label="">
              <el-input
                size="medium"
                type="number"
                @input="checkOutOpen('buy')"
                autocomplete="off"
                :placeholder="$t('trade.transaction.enterQuantity')"
                v-model.number="lookUpForm.amount"
              >
                <template slot="suffix">{{ coinType }}</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item :label="$t('trade.transaction.ggbs_label')">
              <el-select v-model="leverageBuy" size="medium" @change="changeleverageBuyLimit" :placeholder="$t('trade.transaction.ggbs_ph')">
                <el-option
                  v-for="item in leverageList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div> -->
          <div style="margin-top: 30px">
            <p class="buy-tip">
              <span class="buy-open"
                >{{ $t('trade.transaction.canJoin') }}: {{ buyLimit.maxHand
                }}{{ coinType }}</span
              >
              <span class="buy-margin">{{ buyLimit.needMoney }}USDT</span>
            </p>
            <el-button
              class="buy-btn"
              type="danger"
              size="small"
              style="background: #14af64; border: none"
              @click="openPositionBuy('limit')"
              >{{
                currentUserInfos.token
                  ? $t('trade.transaction.buy1')
                  : $t('trade.transaction.login')
              }}</el-button
            >
          </div>
        </el-form>
        <el-form class="el-form-down" v-model="lookDownForm" label-width="70px">
          <div class="form-item">
            <el-form-item
              prop="price"
              :label="$t('trade.transaction.sell_price_label')"
            >
              <el-input
                size="medium"
                type="number"
                @input="checkOutOpenpro('sell')"
                :placeholder="$t('trade.transaction.sell_price_ph')"
                v-model="lookDownForm.price"
              >
                <template slot="suffix">USDT</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="cny-tip">
            <p class="cny-right">≈{{ lookDownForm.cny }}{{ transUnit }}</p>
          </div>
          <!-- <div class="form-item">
            <el-form-item prop="amount"
                          :label="$t('trade.transaction.sell_amount_label')">
              <ul class="choose">
                <li v-for="(item, index) in amountList"
                    @click="handleClickAmount('limit', 'sell', item)"
                    :key="index"
                    :class="item == limitSellAmount ? 'choose-item act' : 'choose-item'">{{item}}</li>
              </ul>
            </el-form-item>
          </div> -->
          <div class="form-item">
            <el-form-item prop="amount" label="">
              <el-input
                size="medium"
                type="number"
                :placeholder="$t('trade.transaction.enterQuantity')"
                @input="checkOutOpen('sell')"
                v-model.number="lookDownForm.amount"
              >
                <template slot="suffix">{{ coinType }}</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item :label="$t('trade.transaction.ggbs_label')">
              <el-select v-model="leverageSell" size="medium" @change="changeleverageSellLimit" :placeholder="$t('trade.transaction.ggbs_ph')">
                <el-option
                  v-for="item in leverageList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div> -->
          <div style="margin-top: 30px">
            <p class="sell-tip">
              <span class="sell-open"
                >{{ $t('trade.transaction.canJoinRight') }}:
                {{ sellLimit.availableAmount }}{{ coinType }}</span
              >
              <span class="sell-margin">{{ sellLimit.usdtAmount }}USDT</span>
            </p>
            <el-button
              class="buy-btn"
              style="background: #c4183c; border: none"
              type="success"
              size="small"
              @click="openPositionSell('limit')"
              >{{
                currentUserInfos.token
                  ? $t('trade.transaction.sell1')
                  : $t('trade.transaction.login')
              }}</el-button
            >
          </div>
        </el-form>
      </div>
      <!-- 市价 -->
      <div class="trade-form" v-else>
        <el-form
          class="el-form-up"
          v-model="lookUpFormMarket"
          label-width="70px"
        >
          <div class="form-item">
            <el-form-item
              prop="price"
              :label="$t('trade.transaction.buy_price_label')"
            >
              <el-input
                size="medium"
                :disabled="true"
                :placeholder="lookUpFormMarket.price"
              >
                <template slot="suffix">USDT</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item prop="amount"
                          :label="$t('trade.transaction.buy_amount_label')">
              <ul class="choose">
                <li v-for="(item, index) in amountList"
                    @click="handleClickAmount('market', 'buy', item)"
                    :key="index"
                    :class="item == marketBuyAmount ? 'choose-item act' : 'choose-item'">{{item}}23</li>
              </ul>
            </el-form-item>
          </div> -->
          <div class="form-item">
            <el-form-item prop="amount" label="">
              <el-input
                size="medium"
                type="number"
                @input="checkOutOpen('buy')"
                autocomplete="off"
                :placeholder="$t('trade.transaction.enterQuantity')"
                v-model.number="lookUpFormMarket.amount"
              >
                <template slot="suffix">{{ coinType }}</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item :label="$t('trade.transaction.ggbs_label')">
              <el-select v-model="leverageBuy" size="medium" @change="changeleverageBuyLimit" :placeholder="$t('trade.transaction.ggbs_ph')">
                <el-option
                  v-for="item in leverageList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div> -->
          <div style="margin-top: 30px">
            <p class="buy-tip">
              <span class="buy-open"
                >{{ $t('trade.transaction.canJoin') }}: {{ buyMarket.maxHand
                }}{{ coinType }}</span
              >
              <span class="buy-margin">{{ buyMarket.needMoney }}USDT</span>
            </p>
            <el-button
              class="buy-btn"
              type="danger"
              size="small"
              style="background: #14af64; border: none"
              @click="openPositionBuy('market')"
              >{{
                currentUserInfos.token
                  ? $t('trade.transaction.buy1')
                  : $t('trade.transaction.login')
              }}</el-button
            >
          </div>
        </el-form>
        <!-- v-if="compots !='local'" -->
        <el-form
          class="el-form-down"
          v-model="lookDownFormMarket"
          label-width="70px"
        >
          <div class="form-item">
            <el-form-item
              prop="price"
              :label="$t('trade.transaction.sell_price_label')"
            >
              <el-input
                size="medium"
                :disabled="true"
                :placeholder="lookDownFormMarket.price"
              >
                <template slot="suffix">USDT</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item prop="amount"
                          :label="$t('trade.transaction.sell_amount_label')">
              <ul class="choose">
                <li v-for="(item, index) in amountList"
                    @click="handleClickAmount('market', 'sell', item)"
                    :key="index"
                    :class="item == marketSellAmount ? 'choose-item act' : 'choose-item'">{{item}}</li>
              </ul>
            </el-form-item>
          </div> -->
          <div class="form-item">
            <el-form-item prop="amount" label="">
              <el-input
                size="medium"
                type="number"
                :placeholder="$t('trade.transaction.enterQuantity')"
                @input="checkOutOpen('sell')"
                v-model.number="lookDownFormMarket.amount"
              >
                <template slot="suffix">{{ coinType }}</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="form-item">
            <el-form-item :label="$t('trade.transaction.ggbs_label')">
              <el-select v-model="leverageSell" size="medium" @change="changeleverageSellLimit" :placeholder="$t('trade.transaction.ggbs_ph')">
                <el-option
                  v-for="item in leverageList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div> -->
          <div style="margin-top: 30px">
            <p class="sell-tip">
              <span class="sell-open"
                >{{ $t('trade.transaction.canJoinRight') }}:
                {{ sellMarket.availableAmount }} {{ coinType }}</span
              >
              <span class="sell-margin">{{ sellMarket.usdtAmount }}USDT</span>
            </p>
            <el-button
              class="buy-btn"
              type="success"
              size="small"
              style="background: #c4183c; border: none"
              @click="openPositionSell('market')"
              >{{
                currentUserInfos.token
                  ? $t('trade.transaction.sell1')
                  : $t('trade.transaction.login')
              }}</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <pay-password-toast
      v-if="showPayPwd"
      :showError="showError"
      :errormsg="message"
      @hidePwd="hidePwd"
      @getPwd="getPwd"
    ></pay-password-toast>
  </div>
</template>

<script>
import { assetsApi, getConfigTrad } from '@/server/axios.js';
import PayPasswordToast from '@/components/payPasswordToast.vue';
import { mapGetters } from 'vuex';
export default {
  props: {
    buyData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    sellData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    coinType: {
      type: String,
      default: '',
    },
    marketType: {
      type: String,
      default: 'digital',
    },
    compots: {
      type: String,
      default: 'local',
    },
  },
  watch: {
    compots: 'chnageCompots',
    buyData: 'changeBuyNum',
    sellData: 'changeSellNum',
    coinType: 'changeCoinType',
    marketType: 'changeMarkettype',
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
  },
  data() {
    return {
      activeNav: 2, // 1是限价交易，2是市价交易
      leverageBuy: '100x', // 当前杠杆倍数（买）
      leverageBuyVal: 100,
      leverageSell: '100x', //卖杠杆
      leverageSellVal: 100,
      leverageList: [], // 杠杆倍数列表
      amountList: ['10', '20', '50', '100'],
      limitBuyAmount: '0',
      limitSellAmount: '0',
      marketBuyAmount: '0',
      marketSellAmount: '0',
      usdtRate: 0, //汇率
      priceDecimals: '', //价格的小数位数
      // 买多表单---------------------------------限价
      lookUpForm: {
        price: '',
        amount: null,
        cny: 0,
      },
      // 买跌表单
      lookDownForm: {
        price: '',
        amount: null,
        cny: 0,
      },
      // 买多表单---------------------------------市价
      lookUpFormMarket: {
        price: this.$t('trade.transaction.buy_on_best_price'),
        amount: null,
        symbol: '',
      },
      // 买跌
      lookDownFormMarket: {
        price: this.$t('trade.transaction.sell_on_best_price'),
        amount: null,
        symbol: '',
      },
      buyLimit: {
        //限价买的可开最大手数、保证金
        maxHand: 0,
        openBail: '0 USDT',
      },
      sellLimit: {
        //限价卖的可开最大手数、保证金
        availableAmount: 0,
        usdtAmount: '0 USDT',
      },
      buyMarket: {
        //市场买的可开最大手数、保证金
        maxHand: 0,
        openBail: '0 USDT',
      },
      sellMarket: {
        //市场买的可开最大手数、保证金
        availableAmount: 0,
        usdtAmount: '0 USDT',
      },
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      message: this.$t('trade.transaction.message'),
      payPass: '1',
      currentBuySell: null,
      currentType: null,
      unit: 'USDT',
      transUnit: 'HKD',
    };
  },
  created() {
    this.getConfigData();
    console.log(this.compots);
    this.checkOutOpen('buy');
    this.checkOutOpen('sell');
  },
  methods: {
    chnageCompots() {
      console.log('wc变化了---', this.compots);
    },
    // 获取页面基本页面信息
    getConfigData() {
      console.log(this.coinType);
      getConfigTrad(this.coinType).then((res) => {
        if (res.code === '200') {
          let list = res.data.multiNumList;
          let datas = [];
          for (let i = 0; i < list.length; i++) {
            let label = list[i] + 'x';
            let value = list[i];
            let obj = { label: label, value: value };
            datas.push(obj);
          }
          this.leverageList = datas;
          this.leverageBuy = list[0] + 'x';
          this.leverageBuyVal = list[0];
          this.leverageSell = list[0] + 'x';
          this.leverageSellVal = list[0];
          this.usdtRate = Number(res.data.usdtRate); //汇率
          this.priceDecimals = res.data.priceDecimals;
        }
      });
    },
    handleChangeNav(index) {
      this.activeNav = index;
    },
    changeleverageBuyLimit(e) {
      //买：杠杆倍数的选择
      this.leverageBuyVal = e;
      this.checkOutOpen('buy');
    },
    changeleverageSellLimit(e) {
      //卖：杠杆倍数的选择
      this.leverageSellVal = e;
      this.checkOutOpen('sell');
    },
    // 手数选择
    handleClickAmount(type, buySell, number) {
      if (type === 'limit' && buySell === 'buy') {
        this.lookUpForm.amount = number;
        this.limitBuyAmount = number;
      } else if (type === 'limit' && buySell === 'sell') {
        this.lookDownForm.amount = number;
        this.limitSellAmount = number;
      } else if (type === 'market' && buySell === 'buy') {
        this.lookUpFormMarket.amount = number;
        this.marketBuyAmount = number;
      } else {
        this.lookDownFormMarket.amount = number;
        this.marketSellAmount = number;
      }
      this.checkOutOpenpro(buySell);
    },
    // 获取从盘口点击获得的数据                                              ====仅用于限价
    changeBuyNum() {
      this.lookUpForm.price = this.buyData.price;
      this.lookDownForm.price = this.buyData.price;
      this.checkOutOpenpro('all');
    },
    changeSellNum() {
      this.lookUpForm.price = this.sellData.price;
      this.lookDownForm.price = this.sellData.price;
      this.checkOutOpenpro('all');
    },
    // 类型转变（货币）
    changeCoinType() {
      console.log('变化了buyData======', this.buyData);
      console.log('变化了sellData======', this.sellData);
      console.log('变化了coinType======', this.coinType);
      console.log('变化了marketType======', this.marketType);
      this.getConfigData();
      this.checkOutOpen('buy');
      this.checkOutOpen('sell');
      // 清空
      this.lookUpForm = { price: '', amount: null, cny: 0 };
      this.lookDownForm = { price: '', amount: null, cny: 0 };
      this.lookUpFormMarket = {
        price: this.$t('trade.transaction.buy_on_best_price'),
        amount: null,
        symbol: '',
      };
      this.lookDownFormMarket = {
        price: this.$t('trade.transaction.sell_on_best_price'),
        amount: null,
        symbol: '',
      };
    },
    // 单位后缀改变
    changeMarkettype() {
      if (this.marketType === 'digital') {
        this.unit = 'USDT';
        this.transUnit = 'CNY';
      } else {
        this.unit = 'USDT';
        this.transUnit = 'CNY';
      }
    },
    // 价格输入，改变相应的cny，以及获得最大手数。保证金                                           ===限价专属
    checkOutOpenpro(buySell) {
      if (this.marketType === 'digital' || this.marketType === 'spot') {
        this.checkOutDigitalOpen(buySell);
      } else {
        this.checkOutStockOpen(buySell);
      }
    },
    checkOutDigitalOpen(buySell) {
      if (buySell === 'buy') {
        this.lookUpForm.price = this.justNum(this.lookUpForm.price);
        let cny = (Number(this.lookUpForm.price) * this.usdtRate).toFixed(2);
        this.lookUpForm.cny = cny;
        this.checkOutOpen(buySell);
      } else if (buySell === 'sell') {
        this.lookDownForm.price = this.justNum(this.lookDownForm.price);
        let cny = (Number(this.lookDownForm.price) * this.usdtRate).toFixed(2);
        this.lookDownForm.cny = cny;
        this.checkOutOpen(buySell);
      } else {
        // 右侧盘口点击，双取向
        this.lookUpForm.price = this.justNum(this.lookUpForm.price);
        let cny = (Number(this.lookUpForm.price) * this.usdtRate).toFixed(2);
        this.lookUpForm.cny = cny;
        this.lookDownForm.cny = cny;
        this.checkOutOpen('buy');
        this.checkOutOpen('sell');
      }
    },
    checkOutStockOpen(buySell) {
      if (buySell === 'buy') {
        this.lookUpForm.price = this.justNum(this.lookUpForm.price);
        let cny = (Number(this.lookUpForm.price) / this.usdtRate).toFixed(2);
        this.lookUpForm.cny = cny;
        this.checkOutOpen(buySell);
      } else if (buySell === 'sell') {
        this.lookDownForm.price = this.justNum(this.lookDownForm.price);
        let cny = (Number(this.lookDownForm.price) / this.usdtRate).toFixed(2);
        this.lookDownForm.cny = cny;
        this.checkOutOpen(buySell);
      } else {
        // 右侧盘口点击，双取向
        this.lookUpForm.price = this.justNum(this.lookUpForm.price);
        let cny = (Number(this.lookUpForm.price) / this.usdtRate).toFixed(2);
        this.lookUpForm.cny = cny;
        this.lookDownForm.cny = cny;
        this.checkOutOpen('buy');
        this.checkOutOpen('sell');
      }
    },
    // 调整小数
    justNum(value) {
      let dec = Number(this.priceDecimals);
      let val = value.replace(/^(\-)*(\d+)\.(\d{2}).*$/, '$1$2.$3'); //只能输入scale个小数
      return val;
    },
    // 获取输入数量、价格以及杠杆改变时的最大手数、开仓保证金
    // symbol, price, buySell, hand, multiNum, orderType
    checkOutOpen(buySell) {
      if (!this.currentUserInfos.token) {
        return;
      }
      let price = 0;
      let hand = 0;
      let leverageVal =
        buySell === 'buy' ? this.leverageBuyVal : this.leverageSellVal;
      let orderType = this.activeNav === 1 ? 'limit' : 'market';
      if (buySell === 'buy' && this.activeNav === 1) {
        //限价买
        price = this.lookUpForm.price ? Number(this.lookUpForm.price) : 0;
        hand = this.lookUpForm.amount ? Number(this.lookUpForm.amount) : 0;
        this.limitBuyAmount =
          hand == this.limitBuyAmount ? this.limitBuyAmount : 0;
      } else if (buySell === 'sell' && this.activeNav === 1) {
        //卖
        price = this.lookDownForm.price ? Number(this.lookDownForm.price) : 0;
        hand = this.lookDownForm.amount ? Number(this.lookDownForm.amount) : 0;
        this.limitSellAmount =
          hand == this.limitSellAmount ? this.limitSellAmount : 0;
      } else if (buySell === 'buy' && this.activeNav === 2) {
        //市价买
        hand = this.lookUpFormMarket.amount
          ? Number(this.lookUpFormMarket.amount)
          : 0;
        this.marketBuyAmount =
          hand == this.marketBuyAmount ? this.marketBuyAmount : 0;
      } else {
        hand = this.lookDownFormMarket.amount
          ? Number(this.lookDownFormMarket.amount)
          : 0;
        this.marketSellAmount =
          hand == this.marketSellAmount ? this.marketSellAmount : 0;
      }
      assetsApi
        .openCheckOut(
          this.coinType,
          price,
          buySell,
          hand,
          leverageVal,
          orderType,
          2
        )
        .then((res) => {
          if (res.code === '200') {
            if (buySell === 'buy' && this.activeNav === 1) {
              //限价买
              this.buyLimit = res.data;
            } else if (buySell === 'sell' && this.activeNav === 1) {
              //限价卖
              this.sellLimit = res.data;
            } else if (buySell === 'buy' && this.activeNav === 2) {
              this.buyMarket = res.data;
            } else {
              this.sellMarket = res.data;
            }
          }
        });
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      if (this.currentBuySell === 'buy') {
        this.openPositionBuy(this.currentType);
      } else {
        this.openPositionSell(this.currentType);
      }
    },
    // 开仓 (买) symbol, price, buySell, hand, multiNum, orderType
    openPositionBuy(type) {
      if (!this.currentUserInfos.token) {
        // 改成跳去下载
        let lang =
          this.$i18n.locale == 'zh_CN'
            ? 'cn'
            : this.$i18n.locale == 'zh_TW'
            ? 'tw'
            : 'en';
        window.location.href = `https://www.TF Globalrade.com/?lang=${lang}&download=1`;
        return;
      } else if (type === 'limit' && !this.lookUpForm.price) {
        this.$message.error(this.$t('trade.transaction.tips1'));
        return;
      } else if (type === 'limit' && !this.lookUpForm.amount) {
        this.$message.error(this.$t('trade.transaction.enterQuantity'));
        return;
      } else if (type === 'market' && !this.lookUpFormMarket.amount) {
        this.$message.error(this.$t('trade.transaction.enterQuantity'));
        return;
      }
      let price = type === 'limit' ? Number(this.lookUpForm.price) : 0;
      let hand =
        type === 'limit'
          ? Number(this.lookUpForm.amount)
          : Number(this.lookUpFormMarket.amount);
      assetsApi
        .openPosition(
          this.coinType,
          price,
          'buy',
          hand,
          this.leverageBuyVal,
          type,
          this.payPass,
          '1',
          '2'
        )
        .then((res) => {
          this.currentBuySell = 'buy';
          this.currentType = type;
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.showPayPwd = false;
            this.checkOutOpen('buy');
            this.checkOutOpen('sell');
            this.$emit('refreshCurrentRecords');
          } else if (res.code == '40030') {
            //提示支付密码没设置
            this.showPayPwd = true;
            this.showError = false;
          } else if (res.code == '40032') {
            //支付密码错误
            this.message = res.msg;
            this.showError = true;
          } else if (res.code == '40031') {
            //用户没设置过交易密码
            this.$confirm(
              this.$t('payDialog.message2'),
              this.$t('payDialog.tips'),
              {
                confirmButtonText: this.$t('payDialog.toSetPwd'),
                cancelButtonText: this.$t('payDialog.cancel_set'),
                type: 'warning',
              }
            )
              .then(() => {
                this.$router.push('/user/safePassword');
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('payDialog.cancel_set'),
                });
              });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 开仓（卖）
    openPositionSell(type) {
      if (!this.currentUserInfos.token) {
        // 改成跳去下载
        let lang =
          this.$i18n.locale == 'zh_CN'
            ? 'cn'
            : this.$i18n.locale == 'zh_TW'
            ? 'tw'
            : 'en';
        window.location.href = `https://www.TF Globalrade.com/?lang=${lang}&download=1`;
        return;
      } else if (type === 'limit' && !this.lookDownForm.price) {
        this.$message.error(this.$t('trade.transaction.tips3'));
        return;
      } else if (type === 'limit' && !this.lookDownForm.amount) {
        this.$message.error(this.$t('trade.transaction.enterQuantity'));
        return;
      } else if (type === 'market' && !this.lookDownFormMarket.amount) {
        this.$message.error(this.$t('trade.transaction.enterQuantity'));
        return;
      }
      let price = type === 'limit' ? Number(this.lookDownForm.price) : 0;
      let hand =
        type === 'limit'
          ? Number(this.lookDownForm.amount)
          : Number(this.lookDownFormMarket.amount);
      assetsApi
        .openPosition(
          this.coinType,
          price,
          'sell',
          hand,
          this.leverageBuyVal,
          type,
          this.payPass,
          '1',
          '2'
        )
        .then((res) => {
          this.currentBuySell = 'sell';
          this.currentType = type;
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.showPayPwd = false;
            this.checkOutOpen('buy');
            this.checkOutOpen('sell');
            this.$emit('refreshCurrentRecords');
          } else if (res.code == '40030') {
            //提示支付密码没设置
            this.showPayPwd = true;
            this.showError = false;
          } else if (res.code == '40032') {
            //支付密码错误
            this.message = res.msg;
            this.showError = true;
          } else if (res.code == '40031') {
            //用户没设置过交易密码
            this.$confirm(
              this.$t('payDialog.message2'),
              this.$t('payDialog.tips'),
              {
                confirmButtonText: this.$t('payDialog.toSetPwd'),
                cancelButtonText: this.$t('payDialog.cancel_set'),
                type: 'warning',
              }
            )
              .then(() => {
                this.$router.push('/user/safePassword');
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('payDialog.cancel_set'),
                });
              });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
  },
  components: {
    PayPasswordToast,
  },
};
</script>
