<template>
  <FadeComponent>
    <div class="trade-detail">
      <div class="trade-detail-left">
        <div class="trade-detail-content">
          <!-- 头部 -->
          <div class="content-header">
            <!-- 购买 -->
            <span class="header-title">{{ $t('orderDetail.buy') }}USDT</span>
            <!-- 订单号 -->
            <span class="header-order-num"
              >{{ $t('orderDetail.orderNumber') }}：{{ orderData.orderId }}
              <!-- 订单时间 -->
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
                <!-- 数量 -->
                <el-col :span="8" class="info-title">{{
                  $t('orderDetail.amount')
                }}</el-col>
                <!-- 单价 -->
                <el-col :span="8" class="info-title">{{
                  $t('orderDetail.price')
                }}</el-col>
                <!-- 实付款 -->
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
            <!-- 状态描述： 0取消（购买专有）， 1从“我已付款成功”， 2完成， 3申诉， -1过期， -2已撤销，-3系统撤销 -->
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
                    >{{ orderData.stateTip
                    }}<span v-if="orderData.state == 0">{{
                      orderData.paySecondTime | convertSecondsToHms
                    }}</span></span
                  >
                </p>
              </div>
              <div class="operation">
                <p
                  class="operation-button"
                  v-if="orderData.state == 0"
                  @click="showConfirmOrderDialog = true"
                >
                  <!-- 我已经向对方转账 -->
                  {{ $t('orderDetail.hasTransferMoney') }}
                </p>
                <p class="operation-button gray" v-if="orderData.state == 1">
                  <!-- 已标记付款，等待放行 -->
                  {{ $t('orderDetail.hasMarkedPay') }}
                </p>
                <p
                  class="operation-tips"
                  v-if="orderData.state == 0"
                  @click="showCancelOrderDialog = true"
                >
                  <!-- 我不想购买，取消订单 -->
                  {{ $t('orderDetail.dontWantToBuy') }}
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
                <p class="tips">
                  <!-- 购买成功 -->
                  {{ $t('orderDetail.hasBuy') }}
                </p>
                <p class="time-tips">
                  <span class="font">
                    <!-- 您已经成功购买 -->
                    {{ $t('orderDetail.youHasBuy') }}
                    {{ orderData.amount }}USDT
                  </span>
                </p>
              </div>
              <div class="pay-tips" v-if="orderData.state == -2">
                <p class="tips">
                  <!-- 撤销成功 -->
                  {{ $t('orderDetail.revocationSuccessfully2') }}
                </p>
                <p class="time-tips">
                  <span class="font">
                    <!-- 订单取消无法查看交易信息 -->
                    {{ $t('orderDetail.revocation2') }}
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
            <!-- 若已完成转账，超过20分钟未标记已转账，系统将自动取消该笔订单，请在订单聊天框与卖方联系协商解决。 -->
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
        :visible.sync="showConfirmOrderDialog"
        width="335px"
      >
        <h4>
          <!-- 付款确认 -->
          {{ $t('orderDetail.surePay') }}
        </h4>
        <p>
          <!-- 请确认您已向卖家付款 -->
          {{ $t('orderDetail.makeSurePay') }}
        </p>
        <p class="tips">
          <!-- 恶意点击将直接冻结账户 -->
          {{ $t('orderDetail.freezeIfClick') }}
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showConfirmOrderDialog = false">{{
            $t('orderDetail.cancel')
          }}</el-button>
          <el-button type="primary" @click="handleConfirmPay">{{
            $t('orderDetail.sure')
          }}</el-button>
        </span>
      </el-dialog>
      <!-- 取消付款的弹框 -->
      <el-dialog
        title=""
        custom-class="showConfirmOrderDialog"
        :show-close="false"
        :destroy-on-close="true"
        :visible.sync="showCancelOrderDialog"
        width="335px"
      >
        <h4>
          <!-- 确认取消订单 -->
          {{ $t('orderDetail.sureCancel') }}
        </h4>
        <p class="tips">
          <!-- 如您已经向卖家付款，请不要取消订单 -->
          {{ $t('orderDetail.dontCancelIfPay') }}
        </p>
        <p class="rules">
          <!-- 取消规则：买家当日累计4笔取消， 会限制当日买入功能。 -->
          {{ $t('orderDetail.cancelRules') }}
        </p>
        <el-checkbox v-model="sureNotPay">
          <!-- 我确认还没有付款给对方 -->
          {{ $t('orderDetail.sureNotPay') }}
        </el-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCancelOrderDialog = false">{{
            $t('orderDetail.cancel')
          }}</el-button>
          <el-button type="primary" @click="handleConfirmCancel">{{
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
      // 计时器
      leftTimeout: null,
      // 是否显示确认付款的弹框
      showConfirmOrderDialog: false,
      // 是否显示取消付款的弹框
      showCancelOrderDialog: false,
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
    // 获取订单详情
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
        .catch((err) => {});
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
    // 确认取消
    handleConfirmCancel() {
      if (!this.sureNotPay) {
        // 我确认还没付款给对方
        this.$alert(this.$t('orderDetail.sureNotPay'));
        return;
      }
      legalPurchaseApi.deleteOrder(this.orderId).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.showCancelOrderDialog = false;
          this.getOrderData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 确认付款
    handleConfirmPay() {
      legalPurchaseApi.payForOrder(this.orderId).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.showConfirmOrderDialog = false;
          this.getOrderData();
        } else {
          this.$message.error(res.msg);
        }
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
