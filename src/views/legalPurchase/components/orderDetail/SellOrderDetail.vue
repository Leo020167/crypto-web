<template>
  <FadeComponent>
    <div class="trade-detail">
      <div class="trade-detail-left">
        <div class="trade-detail-content">
          <!-- 头部 -->
          <div class="content-header">
            <span class="header-title">{{ $t('orderDetail.sell') }}USDT</span
            ><span class="header-order-num"
              ><!--{{ $t('orderDetail.orderNumber') }}：{{ orderData.orderId }}-->
              <span class="header-order-num2" style="margin-left: 20px"
                >{{ $t('orderDetail.orderTime') }}：{{
                  (Number(orderData.createTime) * 1000)
                    | transferTime('YYYY-MM-DD HH:mm:ss')
                }}</span
              >
            </span>
          </div>
          <!-- 订单详情 -->
          <div class="content-detail">
            <div class="detail-info">
              <el-row>
                <el-col :span="8" class="info-title">{{
                  $t('orderDetail.amount')
                }}</el-col>
                <el-col :span="8" class="info-title">{{
                  $t('orderDetail.price')
                }}</el-col>
                <el-col :span="8" class="info-title">{{
                  $t('orderDetail.realPay')
                }}</el-col>
              </el-row>
              <el-row>
                <el-col :span="8" class="info-content coin"
                  >{{ orderData.amount }} USDT</el-col
                >
                <el-col :span="8" class="info-content price"
                  >{{ orderData.currencySign }}{{ orderData.price }}</el-col
                >
                <el-col :span="8" class="info-content pay"
                  >{{ orderData.currencySign }}{{ orderData.tolPrice }}</el-col
                >
              </el-row>
            </div>
            <div
              class="trade-way"
              v-if="
                orderData.state == 0 ||
                orderData.state == 1 ||
                orderData.state == 2 ||
                orderData.state == 3
              "
            >
              <!-- 卖家收款方式 -->
              <span class="way-name">{{
                $t('orderDetail.sellerPaymentMethod')
              }}</span>
              <span class="way-tips">
                <img
                  src="../../../../assets/newIcons/warning.png"
                  alt=""
                  class="way-tips-icon"
                />
                {{ orderData.alertTip }}
              </span>
            </div>
            <div
              class="way-content"
              v-if="
                orderData.state == 0 ||
                orderData.state == 1 ||
                orderData.state == 2 ||
                orderData.state == 3
              "
            >
              <div
                class="way-item"
                v-for="(item, index) in payWays"
                :key="index"
              >
                <img :src="item.receiptLogo" alt="" class="way-icon" />
                <span class="way-name" v-if="orderData.receiptName">{{
                  orderData.receiptName
                }}</span
                ><span class="way-number" v-if="item.receiptNo">{{
                  item.receiptNo
                }}</span>
                <img
                  v-if="item.receiptType != 3"
                  src="../../../../assets/newIcons/ewm.png"
                  class="way-icon"
                  @click="showEwm(item.qrCode)"
                />
                <span class="bank-name" v-show="item.receiptType == 3">{{
                  item.bankName
                }}</span>
              </div>
            </div>
            <!-- 购买状态-待付款 -->
            <!-- 状态描述： 我确认已收到付款（此态暂不可用）， 1申诉（专有）、我确认已收到付款， 2从“我确认已收到付款”点击后->完成， 3申诉， -1过期， -2已撤销，-3系统撤销 -->
            <div
              class="content-footer"
              v-if="orderData.state == 0 || orderData.state == 1"
            >
              <p class="left-time" v-if="leftTime > 0">
                {{ leftTime | convertSecondsToHms }}
              </p>
              <div class="pay-tips">
                <p class="tips">{{ orderData.stateValue }}</p>
                <p class="time-tips">
                  <!-- 98.3%的订单会在5分钟内完成 -->
                  <span class="font"
                    >{{ orderData.stateTip }}
                    <span v-if="orderData.state == 0">{{
                      orderData.paySecondTime | convertSecondsToHms
                    }}</span></span
                  >
                </p>
              </div>
              <div class="operation">
                <p class="operation-button gray" v-if="orderData.state == 0">
                  <!-- 我确认已经收到付款 -->
                  {{ $t('orderDetail.sureReceiveMoney') }}
                </p>
                <p
                  class="operation-button"
                  v-if="orderData.state == 1"
                  @click="showenterOrderDialog = true"
                >
                  <!-- 我确认已经收到付款 -->
                  {{ $t('orderDetail.sureReceiveMoney') }}
                </p>
                <p
                  class="operation-tips"
                  v-if="orderData.state == 1"
                  @click="appealOrder"
                >
                  <!-- 我没收到款，提出申诉 -->
                  {{ $t('orderDetail.unReceiveMoney') }}
                </p>
              </div>
            </div>
            <!-- 购买状态-完成 -->
            <div class="content-footer" v-else>
              <img
                src="../../../../assets/newIcons/error.png"
                alt=""
                class="finish-icon"
                v-if="
                  orderData.state == -3 ||
                  orderData.state == -2 ||
                  orderData.state == -1
                "
              />
              <img
                src="../../../../assets/newIcons/time.png"
                alt=""
                class="finish-icon"
                v-else-if="orderData.state == 3"
              />
              <img
                src="../../../../assets/newIcons/finish.png"
                alt=""
                class="finish-icon"
                v-else
              />
              <div class="pay-tips" v-if="orderData.state == 2">
                <p class="tips">{{ $t('orderDetail.hasFinished') }}</p>
                <!-- 已完成 -->
                <p class="time-tips">
                  <span class="font"
                    >{{ $t('orderDetail.youhaveSell')
                    }}{{ orderData.amount }}USDT</span
                  >
                </p>
              </div>
              <div class="pay-tips" v-if="orderData.state == -2">
                <p class="tips">
                  <!-- 已撤销 -->
                  {{ $t('orderDetail.haveCancelSell') }}
                </p>
                <p class="time-tips">
                  <span class="font">
                    <!-- 买家已撤销订单 -->
                    {{ $t('orderDetail.buyerCancel') }}
                  </span>
                </p>
              </div>
              <div class="pay-tips" v-if="orderData.state == -3">
                <p class="tips">
                  <!-- 系统已撤销 -->
                  {{ $t('orderDetail.systemRevoked') }}
                </p>
                <p class="time-tips">
                  <span class="font">
                    <!-- 系统已撤销订单 -->
                    {{ $t('orderDetail.revokedBySystemed') }}
                  </span>
                </p>
              </div>
              <div class="pay-tips" v-if="orderData.state == 3">
                <p class="tips">
                  <!-- 订单申诉中 -->
                  {{ $t('orderDetail.orderAppealing') }}
                </p>
                <p class="time-tips">
                  <!-- 申诉专员正在介入本次交易中！ -->
                  <span class="font">{{ $t('orderDetail.ombudsman') }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-tips">
          <!-- 我的订单自动取消了怎么办？ -->
          <p class="tips-title">{{ $t('orderDetail.howIfCancel') }}</p>
          <p class="tips-content">
            <!-- 若已完成转账，超过60分钟未标记已转账，系统将自动取消该笔订单，请在订单聊天框与卖方联系协商解决。 -->
            {{ $t('orderDetail.cancelTips') }}
          </p>
          <p class="tips-title">
            <!-- 多次取消订单对我有什么影响？ -->
            {{ $t('orderDetail.influenesIfCancel') }}
          </p>
          <p class="tips-content">
            <!-- 如果24小时内主动取消或超时取消有四笔以上（含四笔）订单，将限制OTC买入功能 -->
            {{ $t('orderDetail.limitOtc') }}
          </p>
        </div>
      </div>
      <!-- 聊天室 -->
      <div class="trade-detail-right">
        <Chat
          :peopleData="peopleData"
          :state="orderData.buySell"
          :orderId="orderId"
          @preImage="showEwm"
        ></Chat>
      </div>
      <!-- 付款确认的弹框 -->
      <el-dialog
        title=""
        custom-class="showConfirmOrderDialog"
        :show-close="false"
        :destroy-on-close="true"
        :visible.sync="showenterOrderDialog"
        width="335px"
      >
        <h4>
          <!-- 确认收款并放行 -->
          {{ $t('orderDetail.sureReceiveAnd') }}
        </h4>
        <p>
          <!-- 请务必登录网上银行或第三方支付账号确认收到该笔款项 -->
          {{ $t('orderDetail.toAccountAndSure') }}
        </p>
        <el-checkbox v-model="sureNotPay">
          <!-- 我确定已登录收款账户，并核对收款无误 -->
          {{ $t('orderDetail.iHaveSure') }}
        </el-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showenterOrderDialog = false">{{
            $t('orderDetail.cancel')
          }}</el-button>
          <el-button type="primary" @click="handleConfirmPay">{{
            $t('orderDetail.sure')
          }}</el-button>
        </span>
      </el-dialog>
      <!-- 图片预览 -->
      <div class="preload-box" v-if="showImage">
        <div class="img-box">
          <p class="close">
            <i class="el-icon-circle-close" @click="hideEwm"></i>
          </p>
          <img :src="preLoadImg" class="big-img" />
        </div>
      </div>
    </div>
  </FadeComponent>
</template>

<script>
import { legalPurchaseApi } from '@/server/axios.js';
import { mapGetters } from 'vuex';
// 聊天室
import Chat from './Chat/Main.vue';

import { ReflashOTCOrderDetailTime } from '@/utils/Enums';

export default {
  data() {
    return {
      // 订单号，来自链接query
      orderId: null,
      orderData: {},
      peopleData: {},
      payWays: [],
      // 剩余时间(秒)
      leftTime: 0,
      // 用于展示的剩余时间
      showLeftTime: '',
      // 显示的倒计时计时器
      leftTimeout: null,
      // 是否显示确认已收到付款的弹框
      showenterOrderDialog: false,
      // 确认还没付款给对方
      sureNotPay: false,
      // 图片
      showImage: false,
      preLoadImg: '',
      // 定时获取订单数据计时器
      getOrderDetailTimeout: null,
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
  },
  created() {
    this.orderId = this.$route.query.orderId;
    // 先获取一次订单详情数据
    this.getOrderData();
    // 每秒再刷一次订单详情数据
    this.getOrderDataInterval();
  },
  filters: {
    // 秒转时分秒
    convertSecondsToHms(value) {
      if (!value) return;
      let secondTime = value;
      let minuteTime = 0; // 分
      let hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      var result =
        '' + parseInt(secondTime) < 10
          ? '0' + parseInt(secondTime) + '秒'
          : parseInt(secondTime) + '秒';
      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + '分' + result;
      }
      if (hourTime > 0) {
        result = '' + parseInt(hourTime) + '小时' + result;
      }
      return result;
    },
  },
  methods: {
    // 获取订单详情s
    getOrderData() {
      if (!this.orderId) return;
      legalPurchaseApi
        .getOrderData(this.orderId)
        .then((res) => {
          if (res.code == 200) {
            this.peopleData = res.data.chatStaff;
            this.orderData = res.data.order;
            this.payWays = JSON.parse(res.data.order.showPayWay);
            this.leftTime = Number(res.data.order.paySecondTime);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 定时获取订单数据
    getOrderDataInterval() {
      clearTimeout(this.getOrderDetailTimeout);
      this.getOrderDetailTimeout = setTimeout(() => {
        this.getOrderData();
        this.getOrderDataInterval();
      }, ReflashOTCOrderDetailTime);
    },
    // 放大图片
    showEwm(src) {
      this.showImage = true;
      this.preLoadImg = src;
    },
    hideEwm() {
      this.showImage = false;
    },
    // 确认收款并放行
    handleConfirmPay() {
      if (!this.sureNotPay) {
        this.$alert(this.$t('orderDetail.sureReceiveMoney'));
        return;
      }
      legalPurchaseApi.getOrderPay(this.orderId).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getOrderData();
          this.showenterOrderDialog = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 申诉/legalPurchase/complaint
    appealOrder() {
      this.$router.push({
        path: '/legalPurchase/complaint',
        query: { orderId: this.orderId },
      });
    },
  },
  beforeDestroy() {
    clearTimeout(this.getOrderDetailTimeout);
    this.getOrderDetailTimeout = null;
  },
  components: {
    Chat,
  },
};
</script>

<style lang="scss" scope>
@import './orderDetail.scss';
</style>
<style lang="scss">
.showConfirmOrderDialog {
  border-radius: 10px;
  h4 {
    font-size: 16px;
    color: #3d3a50;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 20px;
  }
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 30px 20px 0;
  }
  .tips {
    color: $color_main;
  }
  .rules {
    color: #9a9a9a;
    line-height: 26px;
  }
}
</style>
