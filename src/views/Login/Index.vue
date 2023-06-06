<template>
  <FadeComponent>
    <div class="login-container" v-document-title :data-title="documentTitle">
      <h4 class="login-title">{{ $t('login.title') }}</h4>
      <el-form ref="loginForm" :model="loginForm" class="login-form">
        <!-- 账号 -->
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="phone"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('login.phone_ph'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                type="number"
                :placeholder="$t('login.phone_ph')"
                v-model="loginForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 密码 -->
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="password"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('login.password_ph'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                type="password"
                @keyup.enter.native="handleClickLogin"
                :show-password="showPassword"
                :placeholder="$t('login.password_ph')"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 验证码 -->
        <el-row v-show="showSmsBox">
          <el-col :span="14">
            <el-form-item
              prop="smsCode"
              label
              :status-icon="true"
              :rules="smsRequireRule"
            >
              <el-input
                :placeholder="$t('login.verifycode_ph')"
                v-model="loginForm.smsCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="1">
            <el-button type="primary" @click="handleClickSms">{{
              smsText
            }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <span
              class="forget-pwd"
              style="color: #357ce1"
              @click="getEamil()"
              >{{ this.$t('newCommon.login_btn_email_message') }}</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="forget-pwd" @click="handleForget"
              >{{ $t('login.reset_pw') }}？</span
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              :loading="loading"
              type="primary"
              class="agreen-button"
              size="large"
              @click="handleClickLogin"
              >{{ $t('common.login_btn') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
    </div>
    <validation
      v-if="getValid"
      @closeValid="closeValid"
      @dragSuccess="handleGetValid"
    ></validation>
  </FadeComponent>
</template>

<script>
import { security } from '@/server/axios.js';
import Validation from '../layout/Validation.vue';
export default {
  data() {
    return {
      countryValue: '',
      loginForm: {
        phone: '', // 手机号码
        password: '', // 密码
        smsCode: '',
      },
      showPassword: true,
      getValid: false, // 拖动滑块验证事件
      locationx: 0,
      dragImgKey: '',
      showSmsBox: false, // 验证码书写框的出现（40015）
      smsRequireRule: [], //出现时要求输入[{ required: true, message: '请输入验证码', trigger: 'blur' }]
      smsText: this.$t('login.sms_tip1'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      triggeringState: 0, //触发滑动事件： 0 登录过程触发 1 发送验证码触发
      passwordError: false, //密码错误
      fromPath: '',
      loading: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 通过 `vm` 访问组件实例
      if (
        from.fullPath === '/forgetPassword' ||
        from.fullPath === '/register'
      ) {
        vm.fromPath = '/trading';
      } else {
        vm.fromPath = from.fullPath;
      }
    });
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang('登录', '登錄', 'Login');
    },
  },
  methods: {
    getEamil() {
      this.$router.push({ name: 'loginEamil' });
    },
    // 拖动滑块验证事件
    closeValid() {
      //关闭
      this.getValid = false;
    },
    handleGetValid(x, key) {
      //滑块拖动成功回调
      this.locationx = x;
      this.dragImgKey = key;
      this.getValid = false;
      //是否有分步，待考究
      if (this.triggeringState === 0) {
        // 触发登录
        this.gotoLogin();
      } else if (this.triggeringState === 1) {
        // 触发手机验证码
        this.handleClickSms();
      }
    },
    // 点击注册
    handleClickLogin() {
      this.$refs.loginForm.validate((valid) => {
        // 存在答应,滑动验证
        if (valid && !this.passwordError) {
          this.gotoLogin();
        } else if (valid && this.passwordError) {
          this.gotoLogin();
        }
        // 否则自动校准
      });
    },
    gotoLogin() {
      this.loading = true;
      // phone, userPass, smsCode, locationx, dragImgKey
      security
        .login(
          this.loginForm.phone,
          this.loginForm.password,
          this.loginForm.smsCode,
          this.locationx,
          this.dragImgKey,
          1,
          ''
        )
        .then((res) => {
          if (res.code === '200') {
            this.$store.dispatch('changeCurrentUerInfos', res.data); // vuex备存
            // if (this.fromPath) {
            //   this.$router.push(this.fromPath);
            // } else {
            //   this.$router.replace("/trading"); // 页面跳转到行情页
            // }
            this.$router.replace('/trading'); // 页面跳转到行情页
          } else if (res.code === '40016') {
            // 滑块拖动验证
            this.getValid = true;
          } else if (res.code === '40015') {
            // 错误次数过多，需要验证码
            this.showSmsBox = true;
            this.smsRequireRule = [
              { required: true, message: '请输入验证码', trigger: 'blur' },
            ];
          } else if (res.msg === '密码错误，请重新输入！') {
            this.$message.error(res.msg);
            this.passwordError = true;
          } else {
            this.$message.error(res.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取验证码
    handleClickSms() {
      if (this.isCoding) {
        return;
      } else {
        security
          .getSms(
            this.loginForm.phone,
            this.countryValue,
            this.locationx,
            this.dragImgKey,
            1
          )
          .then((res) => {
            if (res.code === '200') {
              this.countDown();
              this.$message.success(res.msg);
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
    // 获取手机验证码的倒计时
    countDown() {
      const TIME_COUNT = 60;
      this.smsText = `60s重新获取`;
      if (!this.timer) {
        this.codeTime = TIME_COUNT;
        this.isCoding = true;
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
    // 忘记密码
    handleForget() {
      this.$router.push('/forgetPassword');
    },
  },
  components: {
    Validation,
  },
};
</script>

<style lang="scss" scope>
.login-container {
  width: 496px;
  margin: 15vh auto 0;
  background: #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  padding: 40px;
  .login-title {
    color: #263241;
    font-size: 20px;
    text-align: center;
    font-weight: 400;
  }
  .login-form {
    margin-top: 20px;
    .prephone {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid $border;
    }
    .forget-pwd {
      text-align: right;
      width: 100%;
      display: inline-block;
      font-size: 13px;
      color: $globalTextColor;
      cursor: pointer;
    }
    .agreen-button {
      margin-top: 10px;
      width: 100%;
    }
  }
}
</style>
