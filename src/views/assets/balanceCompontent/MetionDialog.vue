<template>
  <div class="dialog-container">
    <el-dialog :visible.sync="ifShowDialog" @close="closeDialog">
      <!-- 风险提示 -->
      <div class="tip">
        <p class="left"><i class="el-icon-warning"></i></p>
        <div class="right">
          <p class="tip-title">{{ $t('assets.riskDesc') }}</p>
          <p class="tip-text">{{ $t('assets.tips7') }}</p>
        </div>
      </div>
      <!-- 填入数据 -->
      <p class="dialog-title">{{ $t('assets.chainType') }}</p>
      <el-radio-group v-model="getRadioValue" @change="changRadio">
        <el-radio
          v-for="(item, index) in chainList"
          :key="index"
          :label="item"
          >{{ item }}</el-radio
        >
      </el-radio-group>
      <p class="dialog-title">{{ $t('assets.withdrawAddress') }}</p>
      <el-input
        v-model="address"
        :placeholder="$t('assets.inputAddress')"
        style="width: 50%"
      ></el-input>
      <p class="dialog-title">
        {{ $t('assets.WithdrawalAmount')
        }}<span class="available-tip"
          >（{{ $t('assets.has_use') }}: {{ chainData.amount }} USDT）</span
        >
      </p>
      <el-input
        v-model="number"
        style="width: 50%"
        @input="watchWithdrawNum"
        :placeholder="$t('assets.WithdrawalAmount')"
      >
        <template slot="suffix">USDT</template>
        <el-button slot="append" @click="handleAll">{{
          $t('assets.all')
        }}</el-button>
      </el-input>
      <!-- 源计算 -->
      <div class="remote-cul">
        <div class="cul-item left">
          <p class="cul-title">{{ $t('assets.fee') }}</p>
          <el-input v-model="chainData.withdrawFee" :disabled="true">
            <template slot="append">USDT</template>
          </el-input>
        </div>
        <div class="cul-item right">
          <p class="cul-title">{{ $t('assets.AmountReceived') }}</p>
          <el-input v-model="numberEnter" :disabled="true" placeholder="0.0000">
            <template slot="append">USDT</template>
          </el-input>
        </div>
      </div>
      <!-- 温馨提示、确认按钮 -->
      <div class="operation">
        <div class="left">
          <p class="left-title">{{ $t('assets.tips') }}</p>
          <ul>
            <li>
              {{ $t('assets.mini_withdraw') }}:
              {{ chainData.minWithdrawAmt }} USDT。
            </li>
            <li>{{ $t('assets.tips6') }}</li>
            <li>{{ $t('assets.tips5') }}</li>
          </ul>
        </div>
        <div class="right">
          <el-button type="primary" @click="enterMetion">{{
            $t('assets.confirm')
          }}</el-button>
        </div>
      </div>
    </el-dialog>
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
import PayPasswordToast from '@/components/payPasswordToast.vue';
import { assetsApi } from '@/server/axios.js';
export default {
  name: 'MetionDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    chainList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    chainData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    radioValue: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      address: '', //提币地址
      number: '', //提币数量
      getRadioValue: this.radioValue,
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      message: '',
      payPass: '',
      numberEnter: '', //到账数量
    };
  },
  computed: {
    ifShowDialog: {
      get() {
        return this.showDialog;
      },
      set() {
        return this.showDialog;
      },
    },
  },
  methods: {
    // 单选, 需回传父组件
    changRadio(i) {
      this.$emit('changeRadioValue', i);
    },
    // 对提币数量的小数位数监听
    watchWithdrawNum(s) {
      let scale = Number(this.chainData.maxWithdrawDecimals);
      this.number = this.justNum(s, scale);
    },
    // 调整小数
    justNum(value) {
      value = value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3'); //只能输入scale个小数
      this.numberEnter = value - this.chainData.withdrawFee;
      return value;
    },
    // 提币数量，点击全部
    handleAll() {
      this.number = this.chainData.amount;
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeMetion');
    },
    // 提币确认
    enterMetion() {
      // amount, chainType, address, payPass
      assetsApi
        .submitWithdraw(
          this.number,
          this.getRadioValue,
          this.address,
          this.payPass
        )
        .then((res) => {
          if (res.code === '200') {
            this.showPayPwd = false;
            this.$message.success(res.msg);
            this.$emit('closeMetion');
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
            this.$message({
              type: 'error',
              message: res.msg,
            });
          }
        });
    },
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      this.enterMetion();
    },
  },
  components: {
    PayPasswordToast,
  },
};
</script>

<style lang="scss" scope>
.dialog-container {
  .tip {
    display: flex;
    background-color: #f9e5de;
    padding: 11px 13px;
    border: 2px solid #fcc6c6;
    border-radius: 5px;
    .left {
      .el-icon-warning {
        color: $color_danger;
        font-size: 14px;
      }
    }
    .right {
      flex: 1;
      margin-left: 9px;
      .tip-title {
        font-size: 13px;
        line-height: 14px;
      }
      .tip-text {
        font-size: 13px;
        margin-top: 2px;
        line-height: 21px;
      }
    }
  }
  .dialog-title {
    margin-top: 20px;
    font-size: 13px;
    color: #aeaeae;
    padding-bottom: 12px;
  }
  .remote-cul {
    display: flex;
    margin-top: 20px;
    .cul-item {
      flex: 1;
      &.left {
        margin-right: 10px;
      }
      &.right {
        margin-left: 10px;
      }
      .cul-title {
        font-size: 13px;
        color: #aeaeae;
        padding-bottom: 12px;
      }
    }
  }
  .operation {
    display: flex;
    margin-top: 10px;
    color: #aeaeae;
    .left {
      flex: 1;
      font-size: 12px;
      line-height: 16px;
      ul {
        padding-left: 12px;
        li {
          list-style-type: disc;
        }
      }
    }
    .right {
      padding-top: 17px;
    }
  }
}
</style>
