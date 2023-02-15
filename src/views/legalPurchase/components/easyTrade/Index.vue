<template>
  <div class="easy-trade-container">
    <div class="easy-trade-header">
      <div
        :class="['left', activeTab == 'sell' ? 'active-tab' : '']"
        @click="changeTab('buy')"
      >
        <!-- 购买 -->
        {{ $t('otc.buy') }}
      </div>
      <div
        :class="['right', activeTab == 'buy' ? 'active-tab' : '']"
        @click="changeTab('sell')"
      >
        <!-- 出售 -->
        {{ $t('otc.sell') }}
      </div>
    </div>
    <!-- 购买 -->
    <div class="easy-trade-content" v-if="activeTab == 'buy'">
      <p class="trade-info">
        <span>
          <!-- 交易信息 -->
          {{ $t('otc.tradeInfo') }}
          <el-popover
            class="header-right-dropdown"
            placement="bottom"
            v-model="payWayVisible"
          >
            <div class="pay-way">
              <p
                v-for="(item, index) in paywaysList"
                :key="index"
                :class="index == payKey ? 'choose item' : 'item'"
                @click="selectPayway(index, item)"
              >
                {{ item }}
              </p>
            </div>
            <span
              :class="
                payType == $t('otc.payWay')
                  ? 'el-dropdown-link'
                  : 'el-dropdown-link changeColor'
              "
              slot="reference"
            >
              {{ payType }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
          </el-popover>
        </span>
        <span>{{ $t('otc.price') }}： {{ payType }} {{ baseData.price }}</span>
      </p>
      <div class="trade-amount">
        <p class="trade-buy">
          <!-- 购买 -->
          {{ $t('otc.buy') }}
        </p>
        <el-form :model="buyForm" class="trade-form">
          <el-form-item class="trade-content" prop="amount">
            <p class="left">
              <img
                src="../../../../assets/newIcons/fast1.png"
                alt=""
                class="trade-coin-icon"
              />
              <!-- 请输入购买数量 -->
              <el-input
                style="width: 220px"
                v-model="buyForm.amount"
                class="trade-coin"
                @input="handleCalBuyAmount"
                :placeholder="$t('otc.inputBuyAmount')"
              ></el-input>
            </p>
            <span class="trade-coin-font">USDT</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="trade-price">
        <p class="trade-buy">
          <!-- 实付款 -->
          {{ $t('otc.actuallyPay') }}
        </p>
        <el-form class="trade-form">
          <el-form-item class="trade-content">
            <p class="left">
              <!-- <img src="../../../../assets/newIcons/fast2.png"
                   alt=""
                   class="trade-coin-icon" /> -->
              <span class="trade-coin price">{{ buyForm.pay }}</span>
            </p>
            <span class="trade-coin-font">{{ payType }}</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="pay-way">
        <!-- 支付方式 -->
        {{ $t('otc.payWay') }}
      </p>
      <ul class="pay-way-container">
        <li
          v-for="(item, index) in payways"
          :key="index"
          :class="[
            'pay-way-item',
            item.receiptType == buyForm.showReceiptType ? 'active-pay' : '',
          ]"
          @click="changeBuyPay(item.receiptType)"
        >
          <p class="line1">
            <img :src="item.receiptLogo" alt="" class="bank-icon" />
            <span class="bank-name">{{ item.receiptTypeValue }}</span>
            <span class="recommend" v-show="item.receiptTypeValue == '银行卡'">
              <!-- 推荐 -->
              {{ $t('otc.recommendWay') }}
            </span>
          </p>
          <div class="line2">
            <span class="price" v-show="item.receiptTypeValue == '银行卡'">
              <!-- 价格最优 -->
              {{ $t('otc.theBestPrice') }}
            </span>
            <p
              class="select-item"
              v-show="item.receiptType == buyForm.showReceiptType"
            >
              <img
                src="../../../../assets/newIcons/true.png"
                class="true-logo"
              />
            </p>
          </div>
        </li>
      </ul>
      <div class="sumit-button" @click="buyOtc">
        <!-- 0手续费购买USDT -->
        {{ $t('otc.freeToBuyUSDT') }}
      </div>
    </div>
    <!-- 出售 -->
    <div class="easy-trade-content" v-if="activeTab == 'sell'">
      <p class="trade-info">
        <span>
          <!-- 交易信息 -->
          {{ $t('otc.tradeInfos') }}
          <el-popover
            class="header-right-dropdown"
            placement="bottom"
            v-model="payWayVisible"
          >
            <div class="pay-way">
              <p
                v-for="(item, index) in paywaysList"
                :key="index"
                :class="index == payKey ? 'choose item' : 'item'"
                @click="selectPayway(index, item)"
              >
                {{ item }}
              </p>
            </div>
            <span
              :class="
                payType == $t('otc.payWay')
                  ? 'el-dropdown-link'
                  : 'el-dropdown-link changeColor'
              "
              slot="reference"
            >
              {{ payType }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
          </el-popover>
        </span>
        <span>{{ $t('otc.price') }}：{{ payType }} {{ baseData.price }}</span>
      </p>
      <div class="trade-amount">
        <div class="trade-buy">
          <span class="left">
            <!-- 出售 -->
            {{ $t('otc.sell') }}
          </span>
          <p class="right">
            {{ $t('otc.leftMoney') }} {{ balanceInfosVuex.holdAmount }}USDT
            <span class="transfer-btn" @click="goTransfer"
              ><img
                src="../../../../assets/newIcons/transfer.png"
                class="transfer"
              />
              <!-- 划转 -->
              {{ $t('otc.transfer') }}
            </span>
          </p>
        </div>
        <el-form :model="sellForm" class="trade-form">
          <el-form-item class="trade-content" prop="amount">
            <p class="left1">
              <img
                src="../../../../assets/newIcons/zhifubao.png"
                alt=""
                class="trade-coin-icon"
              />
              <el-input
                style="width: 220px"
                v-model="sellForm.amount"
                class="trade-coin"
                @input="handleCalSellAmount"
                :placeholder="$t('otc.inputBuyAmount')"
              ></el-input>
            </p>
            <span class="trade-coin-font">{{ payType }}</span>
            <span class="all-in-btn"
              ><span class="in" style="cursor: pointer" @click="amountAll">{{
                $t('otc.total')
              }}</span></span
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="trade-price">
        <p class="trade-buy">{{ $t('otc.actuallyPay') }}</p>
        <el-form class="trade-form">
          <el-form-item class="trade-content">
            <p class="left">
              <img
                src="../../../../assets/newIcons/zhifubao.png"
                alt=""
                class="trade-coin-icon"
              />
              <span class="trade-coin price">{{ sellForm.pay }}</span>
            </p>
            <span class="trade-coin-font">{{ payType }}</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="pay-way">{{ $t('otc.paymentWays') }}</p>
      <ul class="pay-way-container">
        <li
          v-for="(item, index) in payways"
          :key="index"
          :class="[
            'pay-way-item',
            item.receiptType == sellForm.showReceiptType ? 'active-pay' : '',
          ]"
          @click="changeBuyPay(item.receiptType)"
        >
          <p class="line1">
            <img :src="item.receiptLogo" alt="" class="bank-icon" />
            <span class="bank-name">{{ item.receiptTypeValue }}</span>
            <span
              class="recommend"
              v-show="item.receiptTypeValue == '银行卡'"
              >{{ $t('otc.recommendWay') }}</span
            >
          </p>
          <div class="line2">
            <span class="price" v-show="item.receiptTypeValue == '银行卡'">{{
              $t('otc.theBestPrice')
            }}</span>
            <p
              class="select-item"
              v-show="item.receiptType == sellForm.showReceiptType"
            >
              <img
                src="../../../../assets/newIcons/true.png"
                class="true-logo"
              />
            </p>
          </div>
        </li>
        <li class="pay-way-item" v-if="payways.length < 3" @click="addPayways">
          <p class="add1">
            <img src="../../../../assets/newIcons/add1.png" class="addPng" />
          </p>
          <p class="add-tip">
            <!-- 添加收款方式 -->
            {{ $t('otc.addPayWay') }}
          </p>
        </li>
      </ul>
      <div class="sumit-button" @click="sellOtc">
        <!-- 0手续费出售USDT -->
        {{ $t('otc.freeToSellUSDT') }}
      </div>
    </div>
  </div>
</template>

<script>
import { legalPurchaseApi } from '../../../../server/axios.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // 当前tab
      activeTab: 'buy',
      payways: [],
      baseData: {
        price: 0,
        payWay: '',
      },
      payWayVisible: false,
      payKey: 0,
      paywaysList: [],
      // 支付类型
      payType: this.$t('otc.payWay'),
      // 购买的表单
      buyForm: {
        // 购买数量
        amount: '',
        // 实付款
        pay: 0,
        // 支付方式
        showReceiptType: '', //收款方式类型：1支付宝，2微信，3银行卡
      },
      // 出售的表单
      sellForm: {
        // 出售数量
        amount: '',
        // 实付款
        pay: 0,
        // 支付方式
        showReceiptType: '',
      },
    };
  },
  created() {
    this.getBaseData();
    this.getOtcConfigType();
  },
  computed: {
    ...mapGetters({
      balanceInfosVuex: 'getBalanceInfos',
    }),
  },
  methods: {
    // 获取所有的支付类型
    getOtcConfigType() {
      legalPurchaseApi.otcConfig().then((res) => {
        if (res.code == '200') {
          this.paywaysList = res.data.currencies;
          this.payType = res.data.currencies[0];
        }
      });
    },
    // 支付类型
    selectPayway(i, item) {
      this.payKey = i;
      this.payWayVisible = false;
      this.payType = item;
      this.getBaseData();
      // this.$emit("selectPayways", i);
    },
    // 获取基本数据
    getBaseData() {
      // buySell, filterPayWay, filterCny, pageNo, type
      legalPurchaseApi
        .marketAdv(this.activeTab, 0, '', 1, 'fast', this.payType)
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            if (res.data.data.length > 0) {
              this.baseData = res.data.data[0];
              if (this.activeTab == 'buy') {
                this.payways = JSON.parse(res.data.data[0].payWay);
              }
            }
          }
        });
    },
    // 出售时，我的收款方式
    getMypayways() {
      legalPurchaseApi.getMyPayway().then((res) => {
        if (res.data.myPaymentList.length == 0) {
          // 您暂未添加收款方式，添加收款方式后方可快捷出售
          this.$confirm(this.$t('otc.addPayWayTips'), this.$t('otc.tips'), {
            distinguishCancelAndClose: true,
            confirmButtonText: this.$t('otc.toAdd'),
            cancelButtonText: this.$t('otc.cancel'),
          })
            .then(() => {
              this.$router.push('/legalPurchase/gatherWay');
            })
            .catch((action) => {
              this.$message({
                type: 'info',
                message: this.$t('otc.youHaveCancelAdd'),
              });
            });
        } else {
          if (res.data.myPaymentList.length > 3) {
            this.payways = res.data.myPaymentList.slice(0, 3);
          } else {
            this.payways = res.data.myPaymentList;
          }
        }
      });
    },
    addPayways() {
      this.$router.push('/legalPurchase/gatherWay');
    },
    // 修改tab
    changeTab(key) {
      this.activeTab = key;
      this.getBaseData();
      // 如果是出售，则是按照我的收款方式
      if (key == 'sell') {
        this.getMypayways();
      }
    },
    // 出售时的全部按钮
    amountAll() {
      this.sellForm.amount = this.balanceInfosVuex.holdAmount;
      this.sellForm.pay = this.round(
        this.sellForm.amount * this.baseData.price
      );
    },
    // 修改付款方式
    changeBuyPay(type) {
      if (this.activeTab == 'buy') {
        this.buyForm.showReceiptType = type;
      } else {
        this.sellForm.showReceiptType = type;
      }
    },
    // 计算购买实付款
    handleCalBuyAmount(e) {
      this.buyForm.pay = this.round(e * this.baseData.price);
    },
    // 计算出售实付款
    handleCalSellAmount(e) {
      this.sellForm.pay = this.round(e * this.baseData.price);
    },
    // 快捷购买
    buyOtc() {
      if (this.buyForm.amount == '') {
        this.$message.error(this.$t('otc.inputBuyAmount'));
      } else if (this.buyForm.showReceiptType == '') {
        this.$message.error(this.$t('otc.choosePayWayTips'));
      } else {
        // buySell, adId, amount, price, paymentId
        legalPurchaseApi
          .createOrder(
            this.activeTab,
            this.baseData.adId,
            this.buyForm.amount,
            this.baseData.price,
            this.buyForm.showReceiptType
          )
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              // 携带参数跳转？
              this.$router.push({
                path: '/legalPurchase/orderDetail/buy',
                query: { orderId: res.data.orderId },
              });
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    sellOtc() {
      if (this.sellForm.amount == '') {
        this.$message.error(this.$t('otc.inputSellAmount'));
      } else if (this.sellForm.showReceiptType == '') {
        this.$message.error(this.$t('otc.choosePayWayTips'));
      } else {
        legalPurchaseApi
          .createOrder(
            this.activeTab,
            this.baseData.adId,
            this.sellForm.amount,
            this.baseData.price,
            this.sellForm.showReceiptType
          )
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              // 携带参数跳转？
              this.$router.push({
                path: '/legalPurchase/orderDetail/sell',
                query: { orderId: res.data.orderId },
              });
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    // 跳转页面
    goTransfer() {
      this.$router.push('/assets/balance');
    },
  },
};
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
