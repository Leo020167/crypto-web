<template>
  <div class="current-order">
    <!-- No data -->
    <!-- {{ orderData }}111 -->
    <NullRecord v-if="orderData.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <div v-else>
      <PositionList
        v-if="currentIndex == 0"
        :show-trading="false"
        :row-data="orderData"
      />

      <ul class="table-list" v-else>
        <li class="table-list-item des-title">
          <span class="item-des">{{ $t('assets.coinType') }}</span>
          <!-- <span class="item-des">{{$t('assets.symbol')}}</span> -->
          <span class="item-des">{{ $t('assets.maimaifangxiang') }}</span>
          <span class="item-des">{{ $t('assets.shuliang') }}</span>
          <span class="item-des">{{ $t('assets.weituojia') }}</span>
          <span class="item-des">{{ $t('assets.zongjineusdt') }}</span>
          <span class="item-des">{{ $t('assets.operation') }}</span>
        </li>

        <li
          class="table-list-item des"
          v-for="(item, index) in items2"
          :key="index"
        >
          <div class="table-show">
            <div class="item-des normal">
              {{ item.symbol }}
            </div>
            <div class="item-des normal">
              <p v-if="item.buySell === 'buy'">{{ $t('assets.mairu') }}</p>
              <p v-else>{{ $t('assets.maichu') }}</p>
            </div>
            <div class="item-des normal">
              {{ item.amount }}
            </div>
            <div class="item-des normal">
              {{ item.price }}
            </div>
            <div class="item-des normal">
              {{ item.sum }}
            </div>

            <div class="item-des normal">
              <el-button
                @click="columnClick(item)"
                size="small"
                type="primary"
                >{{ $t('assets.cancelTrade') }}</el-button
              >
            </div>
          </div>
          <div class="arrow-data" v-show="index === currentArrowIndex">
            <!-- 平仓下拉弹出层 -->
            <p class="arrow-title">{{ $t('assets.closeOut_title') }}</p>
            <ul class="arrow-list">
              <li class="arrow-list-title">
                <!-- 平仓时间 -->
                <span class="item-title">{{ $t('assets.closeOut_time') }}</span>
                <!-- 平仓价 -->
                <span class="item-title">{{
                  $t('assets.closeOut_price')
                }}</span>
                <!-- 平仓手数 -->
                <span class="item-title">{{ $t('assets.closeOut_num') }}</span>
                <!-- 平仓手续费 -->
                <span class="item-title">{{ $t('assets.closeOut_fee') }}</span>
                <!-- 盈利分成 -->
                <span class="item-title">{{ $t('assets.closeOut_win') }}</span>
                <!-- 平仓盈亏(USDT) -->
                <span class="item-title">{{ $t('assets.closeOut_lose') }}</span>
              </li>
              <li
                v-if="item.closeDetails && item.closeDetails.length === 0"
                class="nothing"
              >
                {{ $t('assets.no_data') }}
              </li>
              <li
                class="arrow-list-item"
                v-else
                v-for="(arrowItem, indexs) in item.closeDetails"
                :key="indexs"
              >
                <span class="item-des">{{
                  transallTime(arrowItem.closeTime)
                }}</span>
                <span class="item-des">{{ arrowItem.closePrice }}</span>
                <span class="item-des"
                  >{{ arrowItem.closeHand }}{{ $t('assets.hand') }}</span
                >
                <span class="item-des">{{ arrowItem.closeFee }}</span>
                <span class="item-des">{{ arrowItem.profitShare }}</span>
                <span class="item-des">{{ arrowItem.profit }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <stop-loss-dialog
      :orderId="orderId"
      :currentLossSet="orderSetStop"
      :show-dialog="showStopLossDialog"
      @closeDialog="closeStopLoss"
    ></stop-loss-dialog>
    <stop-win-dialog
      :orderId="orderId"
      :currentWinSet="orderSetStop"
      :show-dialog="showStopWinDialog"
      @closeDialog="closeStopWin"
    ></stop-win-dialog>
    <pay-password-toast
      v-if="showPayPwd"
      :showError="showError"
      :errormsg="message"
      @hidePwd="hidePwd"
      @getPwd="getPwd"
    ></pay-password-toast>
    <!-- 普通平仓弹窗 -->
    <el-dialog
      :title="$t('assets.common_close_out_dialog_title')"
      :visible.sync="commonVisible"
      width="30%"
    >
      <p class="commonInput-box">
        <!-- 普通平仓手数 -->
        <input
          type="number"
          class="inputCommon"
          :placeholder="$t('assets.common_close_out_dialog_num')"
          v-model="commonCloseNum"
          @keyup="checkNum"
        />
        <span class="io">{{ $t('assets.hand') }}</span>
      </p>
      <!-- 持仓手数： -->
      <p class="common-tip">
        {{ $t('assets.common_close_out_dialog_hold_num') }}：
        {{ commonData.openHand }}{{ $t('assets.hand') }}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commonVisible = false">{{
          $t('assets.cancel')
        }}</el-button>
        <el-button type="primary" @click="enterCommon">{{
          $t('assets.sure')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PayPasswordToast from '@/components/payPasswordToast.vue';
import StopLossDialog from '@/components/stopLoss.vue';
import StopWinDialog from '@/components/stopWin.vue';
import { assetsApi } from '@/server/axios.js';
import { transforTime } from '@/utils/time.js';
import PositionList from '../position-list.vue';
export default {
  name: 'CurrentOrder',
  props: {
    orderData: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 1,
    },
    returnChange: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      showStopLossDialog: false,
      showStopWinDialog: false,
      orderId: null,
      orderSetStop: null,
      currentArrowIndex: null,
      commonCloseNum: '', //普通平仓
      commonData: {},
      closeHand: 0,
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      // 支付弹窗提示
      message: this.$t('payDialog.message1'),
      payPass: '',
      commonVisible: false,
      items2: [],
    };
  },
  created() {
    this.getRecords();
    this.intervalId = setInterval(this.getRecords, 1000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    enterCancle() {
      assetsApi.cancelOrder2(this.orderId).then((res) => {
        if (res.code === '200') {
          this.$message.success(res.msg);
          this.showPayPwd = false;
          if (this.returnChange) {
            this.$emit('cancelOrder');
          }
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
          this.$confirm(this.$t('payDialog.message2'), this.$t('assets.tips'), {
            confirmButtonText: this.$t('payDialog.toSetPwd'),
            cancelButtonText: this.$t('payDialog.cancel_set'),
            type: 'warning',
          })
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
    columnClick(data) {
      this.$confirm(this.$t('assets.cencel_order'), this.$t('assets.tips'), {
        confirmButtonText: this.$t('assets.sure'),
        cancelButtonText: this.$t('assets.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.orderId = data.orderId;
          this.enterCancle();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('assets.already_cancel'),
          });
        });
    },
    getRecords() {
      assetsApi
        .getCorrespondRecords('', 'spot', '1', '', '0', '2', 1)
        .then((res) => {
          this.items2 = res.data.data;
        });
    },
    // 点击下拉箭头
    handleArrowPlay(index) {
      if (index === this.currentArrowIndex) {
        this.currentArrowIndex = null;
      } else {
        this.currentArrowIndex = index;
      }
    },
    // 普通平仓
    columnCommonClick(data) {
      this.commonData = data;
      this.commonVisible = true;
    },
    checkNum() {
      var license_num = this.commonCloseNum;
      license_num = license_num.replace(/[^\d]/g, ''); // 清除“数字”和“.”以外的字符
      if (license_num.indexOf('.') < 0 && license_num != '') {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        license_num = parseInt(license_num);
      }
      this.commonCloseNum = license_num;
    },
    enterCommon() {
      if (this.commonCloseNum > this.commonData.openHand) {
        // 请勿输入比${this.commonData.openHand}大的数值
        this.$message.error(
          `${this.$t('assets.message1')}${this.commonData.openHand}${this.$t(
            'assets.message2'
          )}`
        );
        return;
      }
      this.$confirm(
        this.$t('assets.isClosePosition') +
          `${this.commonCloseNum}` +
          this.$t(`assets.hand`),
        this.$t('assets.confirm_title'),
        {
          confirmButtonText: this.$t('assets.sure'),
          cancelButtonText: this.$t('assets.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.orderId = this.commonData.orderId;
          this.closeHand = Number(this.commonCloseNum);
          this.enterClose();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('assets.already_cancel'),
          });
        });
      this.commonVisible = false;
    },
    // 快捷平仓操作
    columnFastClick(data) {
      this.$confirm(
        this.$t('assets.confirm_title'),
        this.$t('assets.confirm_title'),
        {
          confirmButtonText: this.$t('assets.sure'),
          cancelButtonText: this.$t('assets.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.orderId = data.orderId;
          this.closeHand = 0;
          this.enterClose();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('assets.already_cancel'),
          });
        });
    },
    enterClose() {
      assetsApi
        .closePosition(this.orderId, this.closeHand, this.payPass)
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.showPayPwd = false;
            if (this.returnChange) {
              this.$emit('orderChange');
            }
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
              this.$t('assets.tips'),
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
    transTime(time) {
      return transforTime.defaultTime(time);
    },
    transTimes(time) {
      return transforTime.defaultDetail(time);
    },
    transallTime(time) {
      return transforTime.returnAllTime(time);
    },
    // 止损弹窗
    showStopLoss(data) {
      this.orderId = data.orderId;
      this.orderSetStop =
        data.stopLossPrice === '0'
          ? this.$t('assets.unset')
          : `${data.stopLossPrice}`;
      this.showStopLossDialog = true;
    },
    closeStopLoss() {
      this.showStopLossDialog = false;
    },
    // 止盈弹窗
    showStopWin(data) {
      this.orderId = data.orderId;
      this.orderSetStop =
        data.stopWinPrice === '0'
          ? this.$t('assets.unset')
          : `${data.stopWinPrice}`;
      this.showStopWinDialog = true;
    },
    closeStopWin() {
      this.showStopWinDialog = false;
    },
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      this.enterClose();
    },
  },
  components: {
    StopLossDialog,
    StopWinDialog,
    PayPasswordToast,
    PositionList,
  },
};
</script>

<style lang="scss" scope>
.table-list {
  width: 100%;
  .table-list-item {
    border-bottom: 1px solid $border;
    &.des-title {
      display: flex;
      color: $color_info;
      font-size: 13px;
      height: 28px;
      .item-des {
        flex: 1;
      }
    }
    &.des {
      font-size: 13px;
      &:hover {
        background-color: $menuHover;
      }
    }
    .table-show {
      height: 60px;
      display: flex;
      .item-des {
        flex: 1;
        &.normal {
          line-height: 60px;
        }
        .scope-ptext {
          margin-top: 15px;
          padding-bottom: 5px;
        }
        &.spec {
          display: flex;
          .btn {
            flex: 1;
          }
          .up-down {
            margin-left: 15px;
            .icon {
              cursor: pointer;
              padding-top: 20px;
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
.redText {
  color: #e2214e;
}
.greenText {
  color: #00ad88;
}
.setting-btn {
  display: inline-block;
  width: 56px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
}
.setting-lose-btn {
  background-color: #00ad88 !important;
  color: #fff !important;
}
.setting-win-btn {
  background-color: #e2214e !important;
  color: #fff !important;
}
.common-btn,
.fast-btn {
  display: block;
  padding: 1px 3px;
  width: 68px;
  text-align: center;
  line-height: 22px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 12px;
  color: white;
  background-color: $color_main;
  border-radius: 2px;
}
.common-btn {
  margin-top: 5px;
}
.fast-btn {
  margin-top: 5px;
}
// 下拉显示
.arrow-data {
  border: 1px solid #f5f7fa;
  background-color: #fafafb;
  padding: 20px;
  // margin-bottom: 10px;
  .arrow-title {
    font-size: 15px;
    font-weight: bold;
  }
  .arrow-list {
    margin-top: 10px;
    .arrow-list-title {
      display: flex;
      .item-title {
        flex: 1;
        color: #5e5d62;
        font-size: 13px;
      }
    }
    .nothing {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
    }
    .arrow-list-item {
      display: flex;
      line-height: 30px;
      .item-des {
        flex: 1;
      }
    }
  }
}
// 弹窗
.commonInput-box {
  .inputCommon {
    border: none;
    outline: none;
    border-bottom: 1px solid $border;
    font-size: 13px;
    padding: 10px 0px;
    width: 90%;
  }
  .io {
    display: inline-block;
    font-size: 16px;
  }
}
.common-tip {
  margin-top: 15px;
  color: $color_info;
}
</style>
