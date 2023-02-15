<template>
  <div class="current-entrust">
    <NullRecord v-if="items.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <el-table :data="items" style="width: 100%" v-else>
      <el-table-column :label="$t('assets.time')" width="150">
        <template slot-scope="scope">
          <p>{{ transTime(scope.row.openTime) }}</p>
          <p>{{ transTimes(scope.row.openTime) }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="symbol"
        :label="$t('assets.symbol')"
        align="left"
      ></el-table-column>
      <el-table-column
        prop="buySellValue"
        width="92"
        :label="$t('assets.buySellValue')"
        align="left"
      >
        <template slot-scope="scope">
          <p :class="scope.row.buySell === 'buy' ? 'redText' : 'greenText'">
            {{ scope.row.buySellValue }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('assets.weituoPrice')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="openBail"
        :label="$t('assets.openBails')"
        align="center"
      ></el-table-column>
      <el-table-column
        width="92"
        :label="$t('assets.openHand2')"
        align="center"
      >
        <template slot-scope="scope">
          <p class="scope-ptext">
            {{ scope.row.openHand }}{{ $t('assets.hand') }}
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('assets.openFee')" align="center">
        <template>
          <p class="scope-ptext">---</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('assets.stopLossPrice')" align="center">
        <template>
          <!-- 暂无 -->
          <p class="scope-ptext">{{ $t('assets.noset') }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('assets.stopWinPrice')" align="center">
        <template>
          <p class="scope-ptext">{{ $t('assets.noset') }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('assets.profit')" align="center">
        <template>
          <p class="scope-ptext">---</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('assets.operation')" align="center">
        <template slot-scope="scope">
          <el-button
            @click="columnClick(scope.row)"
            size="small"
            type="primary"
            >{{ $t('assets.cancelTrade') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import { transforTime } from '@/utils/time.js';
import { assetsApi } from '@/server/axios.js';
import PayPasswordToast from '@/components/payPasswordToast.vue';
export default {
  name: 'CurrentEntrust',
  props: {
    accountType: {
      type: String,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },

    returnChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderId: '',
      // 支付弹窗
      showPayPwd: false,
      showError: false, //40032
      message: this.$t('payDialog.message1'),
      payPass: '',
      items: [],
    };
  },
  watch: {
    currentIndex: {
      immediate: true,
      handler() {
        this.getRecords();
      },
    },
  },
  created() {
    this.intervalId = setInterval(this.getRecords, 2000);
  },
  beforeDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    getRecords() {
      assetsApi
        .getCorrespondRecords(
          '',
          this.accountType,
          1,
          '',
          '',
          '1',
          this.currentIndex === 0 ? 1 : 0
        )
        .then((res) => {
          this.items = res.data.data;
        });
    },
    // 撤单操作
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
    enterCancle() {
      assetsApi.cancleOrder(this.orderId, this.payPass).then((res) => {
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
    transTime(time) {
      //年月日
      return transforTime.defaultTime(time);
    },
    transTimes(time) {
      return transforTime.defaultDetail(time);
    },
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      this.enterCancle();
    },
  },
  components: {
    PayPasswordToast,
  },
};
</script>

<style lang="scss" scope>
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
  color: #5e5d62;
  background-color: #d8d7dc;
  border-radius: 2px;
}
</style>
