<template>
  <div class="change-phone" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <p class="container-name">{{ $t('changePhone.title1') }}</p>
        <!-- 步骤 -->
        <div class="step-box">
          <el-steps align-center :active="stepActive">
            <el-step
              :title="$t('changePhone.subTitle1')"
              icon="el-icon-folder-opened"
            ></el-step>
            <el-step
              :title="$t('changePhone.subTitle2')"
              icon="el-icon-view"
            ></el-step>
            <el-step
              :title="$t('changePhone.subTitle3')"
              icon="el-icon-bank-card"
            ></el-step>
          </el-steps>
        </div>
        <!-- 身份验证 -->
        <div class="id-verify" v-if="stepActive === 1">
          <p class="main-title">{{ $t('changePhone.title2') }}</p>
          <el-form ref="IDForm" class="login-form">
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
                    v-model="smsCode"
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
              <el-col :span="15" :offset="8">
                <el-button
                  type="primary"
                  class="agreen-button"
                  size="large"
                  @click="handleClickNext"
                  >{{ $t('changePhone.nextStep') }}</el-button
                >
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 设置新的手机 -->
        <div class="id-verify" v-else>
          <p class="main-title">{{ $t('changePhone.title3') }}</p>
          <el-form ref="IDForms" class="login-form">
            <el-row>
              <el-col :span="8" class="prephone">
                <el-select v-model="countryValue">
                  <el-option
                    v-for="item in countryArray"
                    :key="item.name"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="15" :offset="1">
                <el-form-item
                  :rules="[
                    {
                      required: true,
                      message: $t('changePhone.newPhone_ph'),
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    :placeholder="$t('changePhone.newPhone_ph')"
                    v-model="newPhone"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="14">
                <el-form-item
                  prop="newSmsCode"
                  label
                  :status-icon="true"
                  :rules="[
                    {
                      required: true,
                      message: $t('changePhone.newCode_ph'),
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    :placeholder="$t('changePhone.newCode_ph')"
                    v-model="newSmsCode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-button type="primary" @click="handleClickNewSms">{{
                  smsText
                }}</el-button>
              </el-col>
            </el-row>
            <el-row class="mt">
              <el-col :span="15" :offset="8">
                <el-button
                  type="primary"
                  class="agreen-button"
                  size="large"
                  @click="handleClickChange"
                  >{{ $t('changePhone.modify') }}</el-button
                >
              </el-col>
            </el-row>
          </el-form>
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
import { security } from '@/server/axios.js';
import { mapGetters } from 'vuex';
import Validation from '../layout/Validation.vue';
export default {
  data() {
    return {
      stepActive: 1,
      smsCode: '', //步骤1
      getValid: false, // 是否开始拖动验证
      locationx: 0,
      dragImgKey: '',
      dragType: null,
      smsText: this.$t('changePhone.getCode'), // 验证码文字
      codeTime: 60,
      isCoding: false, //验证码正在发送过程中
      newPhone: '',
      newSmsCode: '',
      countryArray: [
        { label: '+44 United Kiongdom', value: '+44', name: 'United Kiongdom' },
      ], //国家集合
      countryValue: '+44',
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
    documentTitle() {
      return this.getTitleValueByLang(
        '更换登录手机号',
        '更換登錄手機號',
        'Change login phone number'
      );
    },
  },
  methods: {
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
    //   获取验证码,先滑动
    handleClickSms() {
      if (this.isCoding) {
        return;
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
      security
        .getSms(
          this.currentUserInfos.user.phone,
          '',
          this.locationx,
          this.dragImgKey
        )
        .then((res) => {
          if (res.code == 200) {
            this.countDown();
            this.$message.success(res.msg);
          } else if (res.code === '40016') {
            this.dragType = 'old';
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
      if (this.dragType === 'new') {
        this.handleClickNewSms();
      } else if (this.dragType === 'old') {
        this.getSmsCode();
      } else if (this.dragType === 'fristStep') {
        this.handleClickNext();
      } else if (this.dragType === 'enter') {
        this.handleClickChange();
      }
    },
    // 下一步 phone, smsCode, dragImgKey, locationx
    handleClickNext() {
      if (!this.smsCode) {
        this.$message.error(this.$t('regist.smsCode_ph'));
        return;
      }
      security
        .IdVerify(
          this.currentUserInfos.user.phone,
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
            this.smsText = this.$t('regist.smsText2');
          } else if (res.code === '40016') {
            this.dragType = 'fristStep';
            this.getValid = true;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 获取新的验证码
    handleClickNewSms() {
      this.$refs.IDForms.validate((valid) => {
        if (valid) {
          security
            .getSms(this.newPhone, '', this.locationx, this.dragImgKey)
            .then((res) => {
              if (res.code == 200) {
                this.countDown();
                this.$message.success(res.msg);
              } else if (res.code === '40016') {
                this.dragType = 'new';
                this.getValid = true;
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      });
    },
    //修改 newPhone, newSmsCode, dragImgKey, locationx, oldPhone, oldSmsCode
    handleClickChange() {
      if (!this.newPhone) {
        this.$message.error(this.$t('changePhone.newPhone_ph'));
        return;
      }
      if (!this.newSmsCode) {
        this.$message.error(this.$t('changePhone.newCode_ph'));
        return;
      }
      security
        .updateNewPhone(
          this.countryValue,
          this.newPhone,
          this.newSmsCode,
          this.dragImgKey,
          this.locationx,
          this.currentUserInfos.user.phone,
          this.smsCode
        )
        .then((res) => {
          if (res.code === '200') {
            this.$store.dispatch('changeUserPhone', this.newPhone); // vuex备存
            this.$message.success(res.msg);
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
.change-phone {
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
      margin-top: 20px;
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
        .agreen-button {
          width: 200px;
        }
      }
    }
  }
}

.el-button {
  white-space: normal;
}
</style>
