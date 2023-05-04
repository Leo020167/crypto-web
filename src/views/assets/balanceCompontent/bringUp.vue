<template>
  <div>
    <div class="px-12 py-7 text-[#666666]">
      <div class="bg-white py-4 px-8 rounded-md">
        <div class="flex items-center mb-4">
          <img src="../../../assets/logo.png" class="w-8 h-8" />
          <span class="ml-1 text-black">{{ $t('withdrawCoins.title') }}</span>
        </div>

        <div class="flex items-center gap-8 text-xs">
          <div class="w-[500px]">
            <el-select v-model="symbol" @change="onSymbolChanged">
              <el-option
                v-for="item in coinList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>

          <div>
            <div>{{ $t('withdrawCoins.text1') }}</div>
            <div class="mt-1">
              {{ configs?.availableAmount ?? '--' }} {{ symbol }}
            </div>
          </div>
          <div>
            <div>{{ $t('withdrawCoins.text2') }}</div>
            <div class="mt-1">
              {{ configs?.frozenAmount ?? '--' }} {{ symbol }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-md mt-4">
        <div class="mb-5" v-if="symbol === 'USDT'">
          <span>{{ $t('withdrawCoins.text3') }}</span>
          <div class="mt-4">
            <el-radio-group v-model="chainType">
              <el-radio-button
                :label="item"
                v-for="item in chainTypeList"
                :key="item"
              ></el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div>
          <span
            >{{ $t('withdrawCoins.text4') }}
            <router-link class="text-[#2E8DED] text-xs ml-2.5" to="/address">{{
              $t('withdrawCoins.text5')
            }}</router-link>
          </span>
          <div class="mt-4 w-[550px]">
            <el-autocomplete
              v-model="addressStr"
              :fetch-suggestions="querySearch"
              @select="handleSelect"
              :placeholder="$t('transfer_dialog.please_choose')"
              style="width: 100%"
              @clear="handleClear"
              @change="handleChange"
              clearable
            ></el-autocomplete>
          </div>
        </div>

        <div class="mt-5">
          <span>{{ $t('withdrawCoins.text6') }}</span>
          <div class="w-[550px] h-[40px] mt-4 text-[#2E8DED] flex items-center">
            <el-input
              type="number"
              v-model="amount"
              :min="Number(configs?.fee ?? 0)"
              class="mr-5"
            ></el-input>
            <el-button type="primary" @click="onSubmit">{{
              $t('withdrawCoins.text7')
            }}</el-button>
          </div>
        </div>
        <div
          class="bg-[#F6F7F9] py-4 px-5 mt-5 text-xs text-[#3E4660] rounded-md leading-6 w-[550px]"
        >
          <div class="flex items-center justify-between">
            <span>{{ $t('withdrawCoins.text8') }} ({{ symbol }})</span>
            <span>{{ configs?.fee }}</span>
          </div>
          <div class="flex items-center justify-between mt-3">
            <span>{{ $t('withdrawCoins.text9') }}({{ symbol }})</span>
            <span>
              {{ price }}
            </span>
          </div>
        </div>

        <div
          class="bg-[#F6F7F9] py-4 px-5 mt-5 text-xs text-[#999999] rounded-md leading-6 w-[550px]"
        >
          {{ $t('withdrawCoins.text10') }}
        </div>
      </div>
    </div>

    <validation
      v-if="getValid"
      @closeValid="closeValid"
      @dragSuccess="handleGetValid"
    ></validation>

    <!-- 验证 -->
    <div v-if="showFlag" class="phoneYz">
      <el-card v-if="userInfo.phone != ''" class="box-card">
        <div slot="header" class="clearfix">
          <h3>{{ $t('newCommon.text47') }}</h3>
          <el-button
            style="float: right; padding: 3px 0"
            @click="showFlag = false"
            type="text"
            >{{ $t('assets.close') }}</el-button
          >
        </div>
        <div class="phoneImage">
          <p>{{ $t('newCommon.text61') }}:</p>
          <el-input v-model="userInfo.phone" disabled></el-input>
        </div>
        <div class="phoneImage1">
          <p>{{ $t('newCommon.text63') }}:</p>
          <el-input v-model="codeSms"></el-input>
          <el-button @click="GetCodeStatus()" :disabled="isCoding">{{
            smsText
          }}</el-button>
        </div>
        <el-button type="primary" @click="GetYanZhengSms" class="cardButton">{{
          $t('newCommon.text48')
        }}</el-button>
      </el-card>

      <el-card v-else class="box-card">
        <div slot="header" class="clearfix">
          <h3>{{ $t('newCommon.text47') }}</h3>
          <el-button
            style="float: right; padding: 3px 0"
            @click="showFlag = false"
            type="text"
            >{{ $t('newCommon.close') }}</el-button
          >
        </div>
        <div class="phoneImage">
          <p>{{ $t('newCommon.text62') }}:</p>
          <el-input v-model="userInfo.phone" disabled></el-input>
        </div>
        <div class="phoneImage1">
          <p>{{ $t('newCommon.text63') }}:</p>
          <el-input v-model="codeSms"></el-input>
          <el-button @click="GetCodeStatusEmail()" :disabled="isCoding">{{
            smsText
          }}</el-button>
        </div>
        <el-button
          type="primary"
          @click="GetYanZhengSmsEmail"
          class="cardButton"
          >{{ $t('newCommon.text48') }}</el-button
        >
      </el-card>
    </div>

    <pay-password-toast
      v-if="showPayPwd"
      :showError="showError"
      :errormsg="message"
      @hidePwd="hidePwd"
      @getPwd="getPwd"
    />
  </div>
</template>

<script>
import {
  security,
  coinList,
  getWithdrawConfigs,
  addressList,
  withdrawSubmit,
} from '@/server/axios.js';

import Validation from '../../layout/Validation.vue';
import PayPasswordToast from '@/components/payPasswordToast.vue';
import md5 from 'js-md5';

export default {
  components: {
    Validation,
    PayPasswordToast,
  },
  data() {
    return {
      addressStr: '',
      smsText: this.$t('login.sms_tip1'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      codeSms: '',
      getValid: false,
      radio: 0,
      imageUrl: '',
      number: '',
      file: '',
      balance: 0,
      allNumber: '',
      url: '',
      locationx: 0,
      dragImgKey: '',
      userInfo: {},
      showFlag: false,
      timer: null,

      chainTypeList: [],
      coinList: [],
      symbol: 'USDT',
      configs: {
        addressList: [],
        availableAmount: '',
        fee: '',
        frozenAmount: '',
      },
      chainType: '',
      amount: '',
      addressList: [],
      addressId: '',
      //
      showPayPwd: false,
      showError: false, //40032
      message: 'Please enter the 6-digit payment password',
      payPass: '',
    };
  },
  watch: {
    symbol: {
      immediate: true,
      handler() {
        if (this.symbol) {
          getWithdrawConfigs({ symbol: this.symbol }).then((res) => {
            this.configs = res.data;
          });
        }
      },
    },
    addressParams: {
      immediate: true,
      handler() {
        addressList(this.addressParams).then((res) => {
          this.addressList = res.data;
        });
      },
    },
  },
  computed: {
    price() {
      return this.amount
        ? (Number(this.amount) - Number(this.configs?.fee)).toFixed(2)
        : '0.00';
    },
    addressParams() {
      return { symbol: this.symbol, chainType: this.chainType };
    },
    currentAddress() {
      return this.addressList.find((v) => v.id === this.addressId);
    },
  },
  created() {
    this.userInfo = this.$store.state.user.userInfos.user;

    coinList({ inOut: -1 }).then((res) => {
      this.chainTypeList = res.data.chainTypeList;
      this.coinList = res.data.coinList;
      this.chainType = this.chainTypeList?.[0];
    });
  },
  mounted() {
    if (!this.userInfo.payPass) {
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
    }
  },
  methods: {
    // 支付弹窗消失
    hidePwd() {
      this.showPayPwd = false;
    },
    // 支付弹窗的回调事件
    getPwd(psw) {
      this.payPass = psw;
      withdrawSubmit({
        amount: this.amount,
        symbol: this.symbol,
        address: this.addressStr,
        chainType: this.chainType ?? '',
        addressId: this.addressId ?? '0',
        payPass: md5(this.payPass).toUpperCase(),
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.$router.go(-1);
        }
      });
    },
    handleChange() {
      this.addressId = null;
    },
    handleClear() {
      this.addressId = null;
    },
    handleSelect(item) {
      this.addressId = item.id;
    },
    querySearch(queryString, cb) {
      cb(
        this.addressList.map((v) => ({
          ...v,
          value: `${[v.symbol, v.address, v.remark].filter(Boolean).join(' ')}`,
        }))
      );
    },
    onSymbolChanged() {
      this.addressId = '';
    },
    GetYanZhengSmsEmail() {
      security
        .IdVerifyEmail(
          this.userInfo.email,
          this.codeSms,
          this.dragImgKey,
          this.locationx
        )
        .then((res) => {
          if (res.code === '200') {
            this.stepActive = 2;
            clearInterval(this.timer);
            this.isCoding = false;
            this.timer = null;
            this.showFlag = false;
            this.smsText = this.$t('regist.smsText2');
            this.GetPutData();
          } else if (res.code === '40016') {
            this.dragType = 'fristStep';
            this.showFlag = false;
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    GetYanZhengSms() {
      security
        .IdVerify(
          this.userInfo.phone,
          this.smsCode,
          this.dragImgKey,
          this.locationx
        )
        .then((res) => {
          if (res.code === '200') {
            this.stepActive = 2;
            clearInterval(this.timer);
            this.isCoding = false;
            this.timer = null;
            this.showFlag = false;
            this.smsText = this.$t('regist.smsText2');
            this.GetPutData();
          } else if (res.code === '40016') {
            this.showFlag = false;
            this.dragType = 'fristStep';
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 发送验证码 验证成功后走这一步
    GetPutData() {
      // 请求一个接口, 验证码验证成功了才能走这一步
      this.$confirm(
        this.$t('assets.text16') +
          this.price +
          this.symbol +
          this.$t('assets.text17'),
        this.$t('assets.tips'),
        {
          confirmButtonText: this.$t('assets.sure'),
          cancelButtonText: this.$t('assets.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          withdrawSubmit({
            amount: this.amount,
            symbol: this.symbol,
            address: this.addressStr,
            chainType: this.chainType ?? '',
            addressId: this.addressId ?? '0',
          }).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.$router.go(-1);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
    GetCodeStatus() {
      this.getValid = true;
    },
    GetCodeStatusEmail() {
      if (this.isCoding) {
        return;
      } else {
        security
          .getSms(
            this.userInfo.email,
            this.countryValue,
            this.locationx,
            this.dragImgKey,
            2
          )
          .then((res) => {
            if (res.code === '200') {
              // this.countDown();
              this.$message.success(res.msg);
              this.GetCode();
            } else if (res.code === '40016') {
              // 滑块拖动验证
              this.getValid = true;
              this.triggeringState = 1;
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    // 发送验证码
    handleClickSms() {
      if (this.isCoding) {
        return;
      } else {
        security
          .getSms(
            this.userInfo.phone,
            this.countryValue,
            this.locationx,
            this.dragImgKey,
            1
          )
          .then((res) => {
            if (res.code === '200') {
              // this.countDown();
              this.$message.success(res.msg);
              this.GetCode();
            } else if (res.code === '40016') {
              // 滑块拖动验证
              this.getValid = true;
              this.triggeringState = 1;
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    GetCode() {
      const TIME_COUNT = 60;
      this.smsText = `60s重新获取`;
      if (!this.timer) {
        // this.getValid = true;
        this.codeTime = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.codeTime > 0 && this.codeTime <= TIME_COUNT) {
            this.codeTime--;
            this.smsText = `${this.codeTime}s重新获取`;
          } else {
            this.isCoding = false;
            clearInterval(this.timer);
            this.timer = null;
            this.smsText = '点击获取验证码';
          }
        }, 1000);
      }
    },
    handleGetValid(x, key) {
      //滑块拖动成功回调
      this.locationx = x;
      this.dragImgKey = key;
      this.getValid = false;
      //是否有分步，待考究
      if (this.triggeringState === 0) {
        alert('登录');
      } else if (this.triggeringState === 1) {
        alert('触发验证码');
        // 触发手机验证码
        // this.handleClickSms();
      } else {
        this.isCoding = false;
        this.handleClickSms();
      }
    },
    closeValid() {
      //关闭
      this.getValid = false;
    },

    onSubmit() {
      if (!this.addressStr && !this.addressId) {
        this.$message.error('請選擇提幣地址');
        return;
      }

      if (!this.amount || !this.amount.trim().length) {
        this.$message.error('請輸入提幣數量');
        return;
      }
      if (Number(this.amount) < Number(this.configs?.data?.fee)) {
        this.$message.error('提幣數量不足');
        return;
      }

      this.showPayPwd = true;
    },
  },
};
</script>

<style lang="scss">
.phoneYz {
  position: absolute;
  width: 30%;
  left: 35%;
  top: 30%;
  .cardButton {
    width: 100%;
    margin-top: 30px;
  }
  .phoneImage {
    display: flex;
    align-items: center;
    p {
      width: 17%;
    }
  }
  .phoneImage1 {
    display: flex;
    align-items: center;
    margin-top: 30px;
    p {
      width: 17%;
    }
    .el-input {
      width: 50%;
      margin-right: 30px;
    }
  }
}
.topUp {
  width: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px;
}
.topUpImage {
  width: 240px;
  margin-left: 60px;
  margin-top: 30px;
}
.topNav {
  display: flex;
  align-items: center;
  margin-top: 30px;
  button {
    width: 70px;
    height: 30px;
    padding: 0;
    margin-left: 20px;
  }
}
.cb {
  width: 100px;
  margin-top: 30px;
}
.avatar-uploader .el-upload {
  background-color: #ffffff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.spans {
  cursor: pointer;
}
.spans:hover {
  color: red;
}
.priceNumber {
  margin-top: 30px;
}
</style>
