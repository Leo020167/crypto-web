<template>
  <FadeComponent>
    <div
      class="register-container"
      v-document-title
      :data-title="documentTitle"
    >
      <h4 class="register-title">{{ $t('regist.title') }}</h4>
      <el-form ref="registerForm" :model="registerForm" class="register-form">
        <!-- 手机号码 -->
        <el-row>
          <el-col :span="8" class="prephone">
            <el-select v-model="countryValue">
              <el-option
                v-for="item in countryArray"
                :key="`${item.name}${item.value}`"
                :value="item.value"
                :label="item.label"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="15" :offset="1">
            <el-form-item
              prop="phone"
              label
              :status-icon="true"
              :rules="[{ required: true, trigger: 'blur' }]"
            >
              <el-input
                type="number"
                :placeholder="$t('regist.phone_ph')"
                v-model="registerForm.phone"
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
                { required: true, trigger: 'blur', validator: checkPassword },
              ]"
            >
              <el-input
                type="password"
                :placeholder="$t('regist.pw_ph')"
                :show-password="showPassword"
                v-model="registerForm.password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 再次输入密码 -->
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="secordPassword"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('regist.pw2_ph'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                type="password"
                :placeholder="$t('regist.pw2_ph')"
                :show-password="showPassword"
                v-model="registerForm.secordPassword"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 验证码 -->
        <el-row class="mb-1">
          <el-col :span="14">
            <el-form-item
              prop="smsCode"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('regist.smsCode_ph'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                :placeholder="$t('regist.smsCode_ph')"
                v-model="registerForm.smsCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="1">
            <el-button type="primary" @click="handleClickSms">{{
              smsText
            }}</el-button>
          </el-col>
        </el-row>
        <!-- 邀请码 -->
        <el-row>
          <el-col :span="14">
            <el-form-item prop="inviteCode" label :status-icon="true">
              <el-input
                :placeholder="$t('regist.inviteCode_ph')"
                v-model="registerForm.inviteCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="1">
            <span class="invitationCode">{{ $t('regist.inviteCode') }}</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <span @click="getEamilRegister()" class="text-main">{{
              $t('newCommon.login_btn_email_message1')
            }}</span>
          </el-col>
        </el-row>

        <!-- 同意协议 -->
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="agreeProtocol"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('regist.agreeProtocol_ph'),
                  trigger: 'change',
                },
              ]"
            >
              <el-checkbox v-model="registerForm.agreeProtocol">
                <span class="text-info">{{
                  $t('regist.agreeProtocol_btn')
                }}</span>
                <a
                  href="https://api.financingy.com/trade/article/#/passgeDetail?article_id=48"
                  target="_blank"
                  class="text-main"
                  >《{{ $t('regist.agreeProtocol_title') }}》</a
                >
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 邮箱注册协议 -->

        <!-- 注册按钮 -->
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              class="agreen-button"
              size="large"
              :loading="showRegistBtnLoading"
              @click="handleClickRegister"
              >{{ $t('regist.btn') }}</el-button
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
import { useLocaleStore } from '@/stores/locale';
import { validateCode } from '@/utils/RegVerify.js';
import { storeToRefs } from 'pinia';

import Validation from '../layout/Validation.vue';
export default {
  setup() {
    const store = useLocaleStore();
    const { locale } = storeToRefs(store);

    return { locale };
  },
  data() {
    return {
      countryArray: [], //国家集合
      countryValue: '+852',
      registerForm: {
        eamil: '',
        phone: '', // 手机号码
        password: '', // 输入密码
        secordPassword: '', // 再次输入密码
        smsCode: '', // 验证码
        agreeProtocol: [], // 是否同意协议
        inviteCode: '', // 邀请码
      },
      showPassword: true,
      getValid: false, // 是否开始拖动验证
      locationx: 0,
      dragImgKey: '',
      smsText: this.$t('regist.smsText2'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      inviteCode: '', // 邀请码（暂时没有）
      showRegistBtnLoading: false,
    };
  },
  watch: {
    locale() {
      this.isCoding = false;
      clearInterval(this.timer);
      this.timer = null;
      this.smsText = this.$t('regist.smsText2');
    },
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang('注册', '注册', 'Regist');
    },
  },
  created() {
    this.initCountryCode();
  },
  methods: {
    getEamilRegister() {
      this.$router.push({ name: 'registerEamil' });
    },
    // 初始化，获取国家区号
    initCountryCode() {
      security.getNewCountryCode().then((res) => {
        if (res.code === '200') {
          var arr = [];

          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            let label = `${data[i].areaCode} ${data[i].tcName}`;
            let value = data[i].areaCode;
            let name = data[i].tcName;
            let obj = { label: label, value: value, name: name };
            arr.push(obj);
          }

          this.countryArray = arr;
        }
      });
    },
    // 验证密码
    checkPassword(rule, value, callback) {
      return validateCode.call(this, rule, value, callback);
    },
    // 点击注册
    handleClickRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.showRegistBtnLoading = true;
          security
            .register(
              this.countryValue,
              this.registerForm.phone,
              this.registerForm.smsCode,
              '',
              '',
              this.registerForm.password,
              this.registerForm.secordPassword,
              this.registerForm.inviteCode,
              '',
              1
            )
            .then((res) => {
              this.showRegistBtnLoading = false;
              if (res.code === '200') {
                this.$message.success(res.msg);
                this.$store.dispatch('changeCurrentUerInfos', res.data); // vuex备存
                this.$router.replace('/trading'); // 页面跳转到行情页
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(() => {
              this.showRegistBtnLoading = false;
            });
        }
      });
    },
    // 获取手机验证码判断过程
    handleClickSms() {
      if (this.isCoding) {
        return;
      } else if (!this.registerForm.phone) {
        this.$message(this.$t('regist.message1'));
      } else if (this.dragImgKey) {
        // 已经拖动了，直接获取验证码
        this.getSmsCode();
      } else {
        // 还没有拖动，拖动弹窗准备
        this.getValid = true;
      }
    },
    // 正式获取手机验证码
    getSmsCode() {
      console.log(this.countryValue);
      security
        .getSms(
          this.registerForm.phone,
          this.countryValue,
          this.locationx,
          this.dragImgKey,
          1
        )
        .then((res) => {
          if (res.code == 200) {
            this.countDown();
            this.$message.success(res.msg);
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
      // 分步： ①只是单纯的拖动  ②发送手机验证码拖动--->触发后台发送验证码事件
      if (this.onlyValid) {
        this.handleClickRegister();
        this.onlyValid = false;
      } else {
        this.getSmsCode();
      }
    },
  },
  components: {
    Validation,
  },
};
</script>

<style lang="scss" scope>
.register-container {
  width: 496px;
  margin: 15vh auto 0;
  background: #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  padding: 40px;
  .register-title {
    color: #263241;
    font-size: 20px;
    text-align: center;
    font-weight: 400;
  }
  .invitationCode {
    display: inline-block;
    width: 142px;
    border-radius: 5px;
    color: #fff;
    height: 38px;
    background-color: #2e8ded;
    text-align: center;
    line-height: 38px;
  }
  .register-form {
    margin-top: 20px;
    .prephone {
      height: 40px;
      color: #000;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
    }
    .agreen-button {
      width: 100%;
    }

    .el-button {
      white-space: pre-wrap;
    }
  }
}
</style>
