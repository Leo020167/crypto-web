<template>
  <div class="dialog-container">
    <el-dialog
      title="設定止損"
      :visible.sync="ifShowDialog"
      @close="closeDialog"
      v-loading="showLoading"
    >
      <div class="opration-stop">
        <span class="name">止損價</span>
        <span class="pro-state">{{ currentLossSet }}</span>
        <p class="input-box">
          <input
            v-model="setPercent"
            class="input-text"
            placeholder="請輸入止損價"
          />
        </p>
      </div>
      <div class="botton">
        <el-button class="cancel" type="text" @click="closeDialog"
          >取消</el-button
        >
        <el-button type="primary" @click="enterStop">確定</el-button>
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
import { assetsApi } from '@/server/axios.js';
import PayPasswordToast from '@/components/payPasswordToast.vue';
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
      default: null,
    },
    currentLossSet: {
      type: String,
      default: 'Not set',
    },
  },
  data() {
    return {
      setPercent: '',
      showLoading: false,
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      message: 'Please enter the 6-digit payment password',
      payPass: '',
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
    closeDialog() {
      this.$emit('closeDialog');
    },
    enterStop() {
      // orderId, stopWinPrice
      if (!this.setPercent) {
        this.$message.error('Please enter the stop loss price');
        return;
      }
      assetsApi
        .stopLossConfig(this.orderId, this.setPercent, this.payPass)
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.$emit('closeDialog');
            this.setPercent = '';
            this.showPayPwd = false;
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
              'You have not set the transaction password. Go to set it?',
              'Tips',
              {
                confirmButtonText: 'Go to settings',
                cancelButtonText: 'Unset',
                type: 'warning',
              }
            )
              .then(() => {
                this.$router.push('/user/safePassword');
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: 'Unset',
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
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      this.enterStop();
    },
  },
  components: {
    PayPasswordToast,
  },
};
</script>

<style lang="scss" scoped>
.dialog-container {
  .el-dialog {
    width: 35%;
  }
  .opration-stop {
    display: flex;
    font-size: 14px;
    .name {
      color: #8b8996;
    }
    .pro-state {
      color: #8b8996;
      margin-left: 20px;
      margin-right: 28px;
    }
    .input-box {
      flex: 1;
      display: flex;
      .input-text {
        flex: 1;
        outline: none;
        border: none;
        border-bottom: 1px solid #b1b0b947;
        padding-bottom: 4px;
      }
    }
  }
  .botton {
    margin-top: 35px;
    text-align: right;
    .cancel {
      margin-right: 20px;
    }
  }
}
</style>
