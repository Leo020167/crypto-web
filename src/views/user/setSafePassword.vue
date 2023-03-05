<template>
  <div class="safe-password" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <p class="container-name">{{ $t('changeTradePwd.title1') }}</p>
        <!-- 步骤 -->
        <div class="step-box">
          <el-steps align-center :active="stepActive">
            <el-step
              :title="$t('changeTradePwd.subTitle1')"
              icon="el-icon-folder-opened"
            ></el-step>
            <el-step
              :title="$t('changeTradePwd.subTitle2')"
              icon="el-icon-view"
            ></el-step>
            <el-step
              :title="$t('changeTradePwd.subTitle3')"
              icon="el-icon-bank-card"
            ></el-step>
          </el-steps>
        </div>
        <!-- 身份验证 -->
        <div class="id-verify" v-if="stepActive === 1">
          <p class="main-title">{{ $t('changeTradePwd.title2') }}</p>
          <el-form ref="loginForm" :model="safeForm" class="login-form">
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-input
                    v-model="currentUserInfos.user.phone"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14">
                <el-form-item
                  prop="smsCode"
                  label
                  :status-icon="true"
                  :rules="[
                    {
                      required: true,
                      message: $t('forgetPassword.verifycode_ph'),
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    :placeholder="$t('forgetPassword.verifycode_ph')"
                    v-model="safeForm.smsCode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-button type="primary" @click="handleClickSms">{{
                  smsText
                }}</el-button>
              </el-col>
            </el-row>
            <el-row class="mt">
              <el-col :span="8" :offset="10">
                <el-button
                  type="primary"
                  class="agreen-button"
                  size="large"
                  @click="handleClickNext"
                  >{{ $t('changeTradePwd.nextStep') }}</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 设置交易密码 -->
        <div class="set-some" v-else>
          <p class="main-title">{{ $t('changeTradePwd.title3') }}</p>
          <el-input
            :minlength="6"
            :maxlength="6"
            type="password"
            v-model="payPsw"
            :placeholder="$t('changeTradePwd.pwd1_ph')"
            class="psw"
            step="2"
            :show-password="true"
          ></el-input>
          <el-input
            type="password"
            v-model="payPswAgain"
            :placeholder="$t('changeTradePwd.pwd2_ph')"
            class="psw"
            step="2"
            :show-password="true"
          ></el-input>
          <el-button
            type="primary"
            class="agreen-button"
            size="large"
            @click="handleClickSet"
            >{{ $t('changeTradePwd.sure') }}</el-button
          >
        </div>
      </div>
      <validation
        v-if="getValid"
        @closeValid="closeValid"
        @dragSuccess="handleGetValid"
      ></validation>
    </FadeComponent>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Validation from '../layout/Validation.vue';
import { security } from '@/server/axios.js';
export default {
  data() {
    return {
      stepActive: 1,
      safeForm: {
        //步骤1
        smsCode: '',
      },
      getValid: false, // 是否开始拖动验证
      locationx: 0,
      dragImgKey: '',
      dragType: null,
      smsText: this.$t('changePhone.getCode'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      payPsw: '', //步骤2
      payPswAgain: '',
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
    documentTitle() {
      return this.getTitleValueByLang(
        '设置交易密码',
        '設置交易密碼',
        'Set transaction password'
      );
    },
  },
  methods: {
    //   获取验证码,先滑动
    handleClickSms() {
      if (this.isCoding) {
        return;
      } else if (this.dragImgKey) {
        // 已经拖动了，直接获取验证码
        this.getSmsCode();
      } else {
        // 还没有拖动，拖动弹窗准备
        this.dragType = 'sms';
        this.getValid = true;
      }
    },
    // 正式获取手机验证码
    getSmsCode() {
      const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/.test(
        this.currentUserInfos.user.phone
      );
      console.log(this.currentUserInfos);
      security
        .getSms(
          this.currentUserInfos.user.phone,
          this.currentUserInfos.user.countryCode,
          this.locationx,
          this.dragImgKey,
          isEmail ? 2 : 1
        )
        .then((res) => {
          if (res.code == 200) {
            this.countDown();
            this.$message.success(res.msg);
          } else if (res.code === '40016') {
            this.dragType = 'sms';
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 获取手机验证码的倒计时
    countDown() {
      const TIME_COUNT = 60;
      this.smsText = this.$t('regist.smsText1');
      if (!this.timer) {
        this.codeTime = TIME_COUNT;
        this.isCoding = true;
        this.timer = setInterval(() => {
          if (this.codeTime > 0 && this.codeTime <= TIME_COUNT) {
            this.codeTime--;
            this.smsText = `${this.codeTime}s${this.$t('regist.smsText3')}`;
          } else {
            this.isCoding = false;
            clearInterval(this.timer);
            this.timer = null;
            this.smsText = this.$t('regist.smsText2');
          }
        }, 1000);
      }
    },
    // 拖动验证关闭
    closeValid() {
      this.getValid = false;
    },
    // 拖动验证成功回调事件,并且关闭拖动验证窗口
    handleGetValid(x, key) {
      this.locationx = x;
      this.dragImgKey = key;
      this.getValid = false;
      if (this.dragType === 'sms') {
        this.getSmsCode();
      } else if (this.dragType === 'next') {
        this.handleClickNext();
      } else if (this.dragType === 'enter') {
        this.handleClickSet();
      }
    },
    // 下一步 phone, smsCode, dragImgKey, locationx
    handleClickNext() {
      if (!this.safeForm.smsCode) {
        this.$message.error(this.$t('regist.smsCode_ph'));
        return;
      }
      security
        .IdVerify(
          this.currentUserInfos.user.phone,
          this.safeForm.smsCode,
          this.dragImgKey,
          this.locationx
        )
        .then((res) => {
          if (res.code === '200') {
            this.stepActive = 2;
            clearInterval(this.timer);
            this.isCoding = false;
            this.timer = null;
            this.smsText = this.$t('regist.smsText2');
          } else if (res.code === '40016') {
            this.dragType = 'next';
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 提交交易密码 payPass, configPayPass, oldPhone, oldSmsCode, dragImgKey, locationx
    handleClickSet() {
      security
        .updatePayPassword(
          this.payPsw,
          this.payPswAgain,
          this.currentUserInfos.user.phone,
          this.safeForm.smsCode,
          this.dragImgKey,
          this.locationx
        )
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.safeForm.smsCode = '';
            this.stepActive = 1;
            this.dragImgKey = '';
          } else if (res.code === '40016') {
            this.dragType = 'enter';
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
  components: {
    Validation,
  },
};
</script>

<style lang="scss" scoped>
.safe-password {
  width: 100%;
  height: auto;
  color: $globalTextColor;
  padding-top: 2px;
  .main-container {
    width: 96%;
    margin: 15px auto;
    background-color: white;
    min-height: 600px;
    .container-name {
      text-align: center;
      font-size: 17px;
      font-weight: bold;
      margin-top: 20px;
      padding-bottom: 20px;
    }
    .step-box {
      text-align: center;
      margin-top: 25px;
    }
    .id-verify {
      margin: 0 auto;
      margin-top: 25px;
      width: 35%;
      border: 1px solid $color_main;
      border-radius: 5px;
      padding: 20px 60px 50px;
      .main-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        padding-top: 10px;
        padding-bottom: 30px;
      }
      .mt {
        margin-top: 20px;
      }
    }
    .set-some {
      margin: 0 auto;
      margin-top: 25px;
      width: 30%;
      border: 1px solid $color_main;
      border-radius: 5px;
      padding: 20px 60px 50px;
      text-align: center;
      .main-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        padding-top: 10px;
        padding-bottom: 10px;
      }
      .psw {
        margin-top: 35px;
        text-align: center;
      }
      .agreen-button {
        margin-top: 35px;
        width: 100%;
      }
    }
  }
}
</style>
