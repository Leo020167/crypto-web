<template>
  <div class="change-loginpsw" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <p class="title">{{$t('changePwd.title')}}</p>
        <el-form class="change-psw-form" :model="formData" ref="pswForm">
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="oldPsw"
                label
                :status-icon="true"
                :rules="[{ required: true, message: $t('changePwd.oldPwd_ph'), trigger: 'blur'}]"
              >
                <el-input
                  v-model="formData.oldPsw"
                  type="password"
                  :show-password="true"
                  :placeholder="$t('changePwd.oldPwd_ph')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="newPsw"
                label
                :status-icon="true"
                :rules="[{ required: true, validator: checkPassword, trigger: 'blur'}]"
              >
                <el-input
                  v-model="formData.newPsw"
                  type="password"
                  :show-password="true"
                  :placeholder="$t('changePwd.newPwd_ph')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                prop="newPswAgain"
                label
                :status-icon="true"
                :rules="[{ required: true, validator: checkPassword, trigger: 'blur'}]"
              >
                <el-input
                  v-model="formData.newPswAgain"
                  type="password"
                  :show-password="true"
                  :placeholder="$t('changePwd.newPwdTwice_ph')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-button
                type="primary"
                class="agreen-button"
                size="large"
                @click="handleClickChange"
              >{{$t('changePwd.sure')}}</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import { validateCode } from "@/utils/RegVerify.js";
import {security} from '@/server/axios.js';
export default {
  data() {
    return {
      formData: {
        oldPsw: "",
        newPsw: "",
        newPswAgain: ""
      }
    };
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang('更改登录密码','更改登錄密碼','Change login password')
    }
  },
  methods: {
    checkPassword(rule,value,callback) {
      return validateCode.call(this,rule,value,callback)
    },
    handleClickChange() {
      this.$refs.pswForm.validate(valid => {
        if (valid) {
          security
            .updateUserPass(
              this.formData.oldPsw,
              this.formData.newPsw,
              this.formData.newPswAgain
            )
            .then(res => {
              if (res.code === "200") {
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.change-loginpsw {
  width: 100%;
  height: auto;
  color: $globalTextColor;
  padding-top: 2px;
  .main-container {
    width: 96%;
    margin: 15px auto;
    background-color: white;
    min-height: 600px;
    .title {
      padding-top: 30px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .change-psw-form {
      width: 35%;
      margin: 0 auto;
      margin-top: 30px;
      border: 1px solid $color_main;
      padding: 30px 35px;
      .agreen-button {
        width: 100%;
      }
    }
  }
}
</style>