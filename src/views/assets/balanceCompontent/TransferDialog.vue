<template>
  <div class="dialog-container">
    <el-dialog
      :visible.sync="ifShowDialog"
      @close="closeDialog"
      v-loading="showLoading"
    >
      <div class="ways-1">
        <div class="point-line">
          <span class="blue-point"></span>
          <span class="point"></span>
          <span class="point"></span>
          <span class="point"></span>
          <span class="red-point"></span>
        </div>
        <!-- 划转方向选择 -->
        <div class="select-way">
          <div class="from">
            <p class="el-dropdown-link">
              <span class="direction">{{ $t('assets.from') }}</span>
              <el-select
                v-model="fromDirectionValue"
                class="select-box"
                @change="changeFromDirection"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in accountTypeList"
                  :key="item.accountType"
                  :label="item.accountName"
                  :value="item.accountType"
                >
                </el-option>
              </el-select>
            </p>
          </div>
          <div class="to">
            <p class="el-dropdown-link">
              <span class="direction">{{ $t('assets.to') }}</span>
              <el-select
                v-model="toDirectionValue"
                class="select-box"
                @change="changeToDirection"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in accountTypeList"
                  :key="item.accountType"
                  :label="item.accountName"
                  :value="item.accountType"
                >
                </el-option>
              </el-select>
            </p>
          </div>
        </div>
      </div>
      <p class="dialog-title">{{ $t('assets.transfer_amount') }}</p>
      <div class="transfer-number">
        <input type="number" class="number-input" v-model="number" />
        <span class="io">
          <el-select v-model="symbol" style="width: 100px">
            <el-option
              v-for="item in transferSymbols"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </span>
        <span class="all-btn" @click="handleAll">{{ $t('assets.all') }}</span>
      </div>
      <p class="use-tip">
        {{ $t('assets.has_use') }}：{{ useUsdt }}
        {{ symbol }}
      </p>
      <div class="operation">
        <div class="left">
          {{ $t('assets.tips8') }}
        </div>
        <div class="right">
          <el-button class="cancel" type="text" @click="closeDialog">{{
            $t('assets.cancel')
          }}</el-button>
          <el-button type="primary" @click="enterTransfer">{{
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
import { assetsApi } from '@/server/axios.js';
import PayPasswordToast from '@/components/payPasswordToast.vue';
export default {
  name: 'TransferDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fromDiretion: {},
      toDiretion: {},
      fromDirectionValue: '',
      toDirectionValue: '',
      number: '', //划转数量
      showLoading: false,
      accountTypeList: [],
      useUsdt: '0',
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      // 请输入6位支付密码
      message: this.$t('payDialog.message1'),
      payPass: '',
      transferSymbols: [],
      symbol: '',
    };
  },
  created() {
    this.getTransferDirection();
    this.getTransferSymbols();
  },
  watch: {
    fromDirectionValue() {
      this.getTransferSymbols();
    },
    toDirectionValue() {
      this.getTransferSymbols();
    },
    symbol() {
      this.getFromNumberUse();
    },
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
    getTransferSymbols() {
      this.symbols = assetsApi
        .getTransferSymbols({
          fromAccountType: this.fromDirectionValue,
          toAccountType: this.toDirectionValue,
        })
        .then((res) => {
          if (res.code === '200') {
            this.transferSymbols = res.data;
            this.symbol = res.data?.includes('USDT') ? 'USDT' : res.data?.[0];
          }
        });
    },
    // 获取基本划转数据
    getTransferDirection() {
      assetsApi.getAssetTypeData().then((res) => {
        if (res.code === '200') {
          this.accountTypeList = res.data.accountTypeList;
        }
      });
    },
    // 改变‘从’的值
    changeFromDirection(v) {
      let dir = {};
      for (let i = 0; i < this.accountTypeList.length; i++) {
        if (this.accountTypeList[i].accountType === v) {
          dir = this.accountTypeList[i];
        }
      }
      this.fromDiretion = dir;
      this.getFromNumberUse();
    },
    // 获取‘从’的可用数量                                      (小数点)
    getFromNumberUse() {
      assetsApi
        .getSymbolMaxAmount(this.fromDirectionValue, this.symbol)
        .then((res) => {
          if (res.code === '200') {
            this.useUsdt = res.data;
          }
        });
    },
    // 改变‘到’的值
    changeToDirection(v) {
      let dir = {};
      for (let i = 0; i < this.accountTypeList.length; i++) {
        if (this.accountTypeList[i].accountType === v) {
          dir = this.accountTypeList[i];
        }
      }
      this.toDiretion = dir;
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeTransfer');
    },
    // 全部
    handleAll() {
      this.number = this.useUsdt;
    },
    // 确定 amount, fromAccountType, toAccountType
    enterTransfer() {
      if (!this.number) {
        this.$message.error(this.$t('assets.input_transferNum'));
        return;
      } else if (
        this.fromDirectionValue === this.toDirectionValue ||
        !this.fromDirectionValue ||
        !this.toDirectionValue
      ) {
        this.$message.error(this.$t('assets.complete_transferDir'));
        return;
      } else if (!this.symbol) {
        this.$message.error(this.$t('assets.input_transferSymbol'));
      } else {
        this.entertransforNumber();
      }
    },
    entertransforNumber() {
      assetsApi
        .transferAssets(
          this.number,
          this.fromDirectionValue,
          this.toDirectionValue,
          this.payPass,
          this.symbol
        )
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.$emit('closeTransfer');
            this.fromDirectionValue = '';
            this.toDirectionValue = '';
            this.number = '';
            this.useUsdt = '0.00';
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
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      this.entertransforNumber();
    },
  },
  components: {
    PayPasswordToast,
  },
};
</script>

<style lang="scss" scope>
.dialog-container {
  .ways-1 {
    display: flex;
    border: 1px solid #b1b0b947;
    .point-line {
      display: flex;
      flex-direction: column;
      padding: 17px 0 0 20px;
      .blue-point {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-top: 16px;
        background-color: $color_main;
      }
      .point {
        margin: 0 auto;
        margin-top: 12px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: $color_info;
      }
      .red-point {
        width: 6px;
        height: 6px;
        margin-top: 13px;
        border-radius: 50%;
        background-color: $color_danger;
      }
    }
    .select-way {
      flex: 1;
      margin-left: 20px;
      margin-right: 20px;
      padding: 17px 0;
      .from {
        padding-bottom: 13px;
        border-bottom: 1px dotted #b1b0b947;
        .direction {
          display: inline-block;
          width: 45px;
          padding-right: 2px;
        }
        .select-box {
          width: 90%;
        }
      }
      .to {
        padding-top: 15px;
        .direction {
          display: inline-block;
          width: 45px;
          padding-right: 2px;
        }
        .select-box {
          width: 90%;
        }
      }
    }
  }
  .dialog-title {
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 15px;
  }
  .transfer-number {
    display: flex;
    border-bottom: 1px solid #b1b0b947;
    .number-input {
      border: none;
      flex: 1;
      font-size: 16px;
      padding: 8px 0 8px 10px;
      outline: none;
      border-bottom: 1px solid #ededed;
    }
    .io {
      font-size: 12px;
      margin: 0 15px;
      padding-top: 10px;
      display: inline-block;
      border-right: 1px solid #b1b0b947;
      padding-right: 15px;
      color: #b1b0b9;
    }
    .all-btn {
      font-size: 12px;
      line-height: 35px;
      padding-right: 20px;
      cursor: pointer;
    }
  }
  .use-tip {
    margin-top: 10px;
    font-size: 13px;
    color: #b1b0b9;
  }
  .operation {
    margin-top: 20px;
    .left {
      flex: 1;
      background-color: #f8f8f8;
      font-size: 13px;
      line-height: 20px;
      padding: 5px 10px;
      letter-spacing: 1px;
    }
    .right {
      text-align: right;
      margin-top: 20px;
      .cancel {
        margin-right: 20px;
      }
    }
  }
}
</style>
