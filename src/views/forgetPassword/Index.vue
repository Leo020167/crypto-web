<template>
  <FadeComponent>
    <div class="forget-password" v-document-title :data-title="documentTitle">
      <p class="forget-title">{{ $t('forgetPassword.title') }}</p>
      <el-form ref="forgetForm" :model="forgetForm" class="forget-form">
        <el-row>
          <el-col :span="8">
            <el-select v-model="countryValue">
              <el-option
                v-for="item in countryArray"
                :key="item.name"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!-- 手机号码 -->
          <el-col :span="15" :offset="1">
            <el-form-item
              prop="phone"
              label
              :status-icon="true"
              :rules="[
                {
                  required: true,
                  message: $t('forgetPassword.account_ph'),
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                type="number"
                :placeholder="$t('forgetPassword.account_ph')"
                v-model="forgetForm.phone"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item
              prop="smsCode"
              label
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
                v-model="forgetForm.smsCode"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="1">
            <el-button type="primary" class="" @click="handleClickSms">{{
              smsText
            }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="newPassword"
              label
              :status-icon="true"
              :rules="[
                { required: true, validator: checkPassword, trigger: 'blur' },
              ]"
            >
              <el-input
                type="password"
                :show-password="showPassword"
                :placeholder="$t('forgetPassword.newpw_ph')"
                v-model="forgetForm.newPassword"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              prop="newPasswordAgain"
              label
              :status-icon="true"
              :rules="[
                { required: true, validator: checkPassword, trigger: 'blur' },
              ]"
            >
              <el-input
                type="password"
                :show-password="showPassword"
                :placeholder="$t('forgetPassword.newpw2_ph')"
                v-model="forgetForm.newPasswordAgain"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button
              type="primary"
              class="next-button"
              size="large"
              @click="handleChangepsw"
              >{{ $t('forgetPassword.submit_btn') }}</el-button
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
import { validateCode } from '@/utils/RegVerify.js';
import Validation from '../layout/Validation.vue';
export default {
  data() {
    return {
      forgetForm: {
        phone: '',
        smsCode: null,
        newPassword: '',
        newPasswordAgain: '',
      },
      countryArray: [{ label: '+86 中国', value: '+86', name: '中国' }], //国家集合
      countryValue: this.$t('newCommon.text56'),
      getValid: false, // 拖动滑块验证事件
      locationx: 0,
      dragImgKey: '',
      smsText: this.$t('regist.smsText2'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      showPassword: true,
    };
  },
  created() {
    this.initCountryCode();
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang(
        '忘记密码?',
        '忘記密碼?',
        'Forgot Password?'
      );
    },
  },
  methods: {
    // 验证密码
    checkPassword(rule, value, callback) {
      return validateCode.call(this, rule, value, callback);
    },
    // 初始化，获取国家区号
    initCountryCode() {
      security.getNewCountryCode().then((res) => {
        console.log(res);
        if (res.code === '200') {
          var arr = [];
          if (this.$t('newCommon.text56') == '+49 Deutschland') {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let label = `${data[i].areaCode}  ${data[i].deName}`;
              let value = data[i].areaCode;
              let name = data[i].deName;
              let obj = { label: label, value: value, name: name };
              arr.push(obj);
            }
          } else if (this.$t('newCommon.text56') == '+44 United Kiongdom') {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let label = `${data[i].areaCode}  ${data[i].enName}`;
              let value = data[i].areaCode;
              let name = data[i].enName;
              let obj = { label: label, value: value, name: name };
              arr.push(obj);
            }
          } else {
            let data = res.data;
            for (let i = 0; i < data.length; i++) {
              let label = `${data[i].areaCode}  ${data[i].tcName}`;
              let value = data[i].areaCode;
              let name = data[i].tcName;
              let obj = { label: label, value: value, name: name };
              arr.push(obj);
            }
          }

          this.countryArray = arr;
        }
      });
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
      this.handleClickSms();
    },
    // 获取验证码
    handleClickSms() {
      if (this.isCoding) {
        return;
      } else if (!this.forgetForm.phone || this.forgetForm.phone.length != 11) {
        this.$message(this.$t('regist.message1'));
      } else if (this.dragImgKey) {
        // 已经拖动了，直接获取验证码
        this.getSmsCode();
      } else {
        // 还没有拖动，拖动弹窗准备
        this.getValid = true;
      }
    },
    getSmsCode() {
      security
        .getSms(
          this.forgetForm.phone,
          this.countryValue,
          this.locationx,
          this.dragImgKey
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
    // 确定
    handleChangepsw() {
      if (!this.forgetForm.smsCode) {
        this.$message.error(this.$t('forgetPassword.message1'));
        return;
      }
      if (this.forgetForm.newPassword !== this.forgetForm.newPasswordAgain) {
        this.$message.error(this.$t('forgetPassword.message2'));
        return;
      }
      // phone, smsCode, userPass, dragImgKey, locationx
      security
        .forgetPass(
          this.countryValue,
          this.forgetForm.phone,
          this.forgetForm.smsCode,
          this.forgetForm.newPassword,
          this.dragImgKey,
          this.locationx
        )
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
            this.$router.push('/login');
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

<style lang="scss" scope>
.forget-password {
  width: 496px;
  margin: 15vh auto 0;
  background: #fff;
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  box-shadow: 0 1px 1px rgba(8, 31, 64, 0.25);
  padding: 40px;
  .forget-title {
    color: #263241;
    font-size: 20px;
    text-align: center;
    font-weight: 400;
  }
  .forget-form {
    margin-top: 20px;
    .prephone {
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      border: 1px solid $border;
    }
    .forget-pwd {
      font-size: 13px;
      color: $globalTextColor;
      cursor: pointer;
    }
    .agreen-button,
    .next-button {
      margin-top: 10px;
      width: 100%;
    }
  }
}

.el-button {
  white-space: normal;
}
</style>
