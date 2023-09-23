<template>
  <div
    class="realname-authentication-container"
    v-document-title
    :data-title="documentTitle"
  >
    <FadeComponent>
      <div class="authentication-header">
        <font-awesome-icon icon="user-shield" class="icon" />
        <span class="header-title">
          <!-- title -->
          {{ $t('userInfos.authorization.title') }}
          <span :class="realState == 1 ? 'green-color' : 'red-color'">{{
            realText
          }}</span>
        </span>
      </div>
      <div class="authentication-content">
        <div class="content-header">
          <span class="suffix"></span
          >{{ $t('userInfos.authorization.subTitle1') }}
        </div>
        <el-form
          v-model="authenticationForm"
          label-width="150px"
          :disabled="realState == 0 || realState == 1"
        >
          <el-row>
            <el-col :span="13">
              <el-form-item
                prop="name"
                :label="$t('userInfos.authorization.idCardName')"
              >
                <el-input
                  size="small"
                  v-model="authenticationForm.name"
                  :placeholder="$t('userInfos.authorization.idCardName_ph')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item
                prop="idCadeNo"
                :label="$t('userInfos.authorization.idCardNo')"
              >
                <el-input
                  size="small"
                  v-model="authenticationForm.idCadeNo"
                  :placeholder="$t('userInfos.authorization.idCardNo_ph')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="content-header header2">
          <span class="suffix"></span
          >{{ $t('userInfos.authorization.subTitle2') }}
        </div>
        <div class="uploadFile-container">
          <el-row>
            <el-col :span="5">
              <single-file-upload
                @onAddFile="getPortraitFile"
                :oldFile="portraitUrl"
                :canDelete="false"
                :canUpload="realState != 0 && realState != 1"
                :fileName="'上传人像页'"
              ></single-file-upload>
            </el-col>
            <el-col :span="5" :offset="2">
              <single-file-upload
                @onAddFile="getNationalemblemFile"
                :oldFile="nationalemblemUrl"
                :canDelete="false"
                :canUpload="realState != 0 && realState != 1"
                :fileName="'上传国徽页'"
              ></single-file-upload>
            </el-col>
          </el-row>
        </div>
        <el-row
          class="submit-container"
          v-if="realState != 0 && realState != 1"
        >
          <el-col :span="10" :offset="2">
            <el-button
              class="submitBtn"
              type="primary"
              size="medium"
              :loading="showBtnLoading"
              @click="submitData"
              >{{ $t('userInfos.authorization.submitBtn') }}</el-button
            >
          </el-col>
        </el-row>
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import SingleFileUpload from '@/components/UploadFile/SingleFileUpload.vue';
import { security, uploadImage } from '@/server/axios.js';
export default {
  data() {
    return {
      realState: '0',
      realText: '',
      hasReal: false, //是否已经实名
      authenticationForm: {
        name: '',
        idCadeNo: '',
      },
      portraitFile: {}, //头像、国徽的file
      nationalemblemFile: {},
      portraitUrl: {}, //头像、国徽的img,后台的
      nationalemblemUrl: {},
      newPortrait: false, //用于更新头像、国徽的照片(后期)
      newNationalemblem: false,
      uploadPortrait: '',
      uploadNationalemblem: '',
      showBtnLoading: false,
    };
  },
  created() {
    this.getRealData();
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang(
        '实名认证',
        '實名認證',
        'ID certification'
      );
    },
  },
  methods: {
    getRealData() {
      security.getRealNameData().then((res) => {
        if (res.code === '200') {
          console.log(res);
          let data = res.data.identityAuth;
          if (data) {
            this.authenticationForm = {
              name: data.name,
              idCadeNo: data.certNo,
            };
            this.portraitUrl = { fileUrl: data.frontImgUrl };
            this.nationalemblemUrl = { fileUrl: data.backImgUrl };
            this.uploadPortrait = data.frontImgUrl;
            this.uploadNationalemblem = data.backImgUrl;
            this.realText = data.stateDesc;
            this.realState = data.state;
            this.hasReal = true;
          }
        }
      });
    },
    // 更新信息1  首先更新图片
    submitData() {
      if (!this.authenticationForm.name) {
        // 请输入身份证姓名
        this.$message.error(this.$t('userInfos.authorization.idCardName_ph'));
        return;
      } else if (!this.authenticationForm.idCadeNo) {
        // 请输入身份证号码
        this.$message.error(this.$t('userInfos.authorization.idCardNo_ph'));
        return;
      } else if (!this.hasReal) {
        // 没有实名
        if (!this.newNationalemblem || !this.newPortrait) {
          this.$message.error(this.$t('userInfos.authorization.subTitle2'));
          return;
        } else {
          this.showBtnLoading = true;
          Promise.all([
            this.getRealnameImg(this.portraitFile, 'portrait'),
            this.getRealnameImg(this.nationalemblemFile, 'nationalemblem'),
          ])
            .then((res) => {
              this.submitRealData();
            })
            .catch((err) => {
              this.showBtnLoading = false;
              this.$message({
                message: this.$t('userInfos.authorization.tips1'),
              });
            });
        }
      } else if (this.hasReal) {
        if (this.newPortrait) {
          this.getRealnameImg(this.portraitFile, 'portrait').then(() => {
            this.submitRealData();
          });
        } else if (this.newNationalemblem) {
          this.getRealnameImg(this.nationalemblemFile, 'nationalemblem').then(
            () => {
              this.submitRealData();
            }
          );
        } else {
          this.submitRealData();
        }
      }
    },
    // 更新信息2 正式传
    submitRealData() {
      // name, certNo, frontImgUrl, backImgUrl
      security
        .submitRealname(
          this.authenticationForm.name,
          this.authenticationForm.idCadeNo,
          this.uploadPortrait,
          this.uploadNationalemblem
        )
        .then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
          this.showBtnLoading = false;
        });
    },
    // 上传图片
    getRealnameImg(files, type) {
      let fil = new FormData();
      fil.append('imageFiles', files);
      return new Promise((resolve, reject) => {
        uploadImage({
          dir: 'identityImage',
          type: 'imageRetOriginal',
          imageFiles: fil,
        }).then((res) => {
          if (res.code === '200') {
            let url = res.data.imageUrlList[0];
            if (type === 'portrait') {
              this.uploadPortrait = url;
            } else {
              this.uploadNationalemblem = url;
            }
            resolve();
          } else {
            reject(res);
          }
        });
      });
    },
    // 子组件回传
    // 人像
    getPortraitFile(file) {
      this.portraitFile = file;
      this.newPortrait = true;
    },
    // 国徽
    getNationalemblemFile(file) {
      this.nationalemblemFile = file;
      this.newNationalemblem = true;
    },
  },
  components: {
    SingleFileUpload,
  },
};
</script>
<style lang="scss" scope>
.realname-authentication-container {
  width: 100%;
  background-color: #ebebed;
  color: #000;
  padding-top: 30px;
  padding-bottom: 30px;
  .authentication-header,
  .authentication-content {
    width: 70%;
    background-color: #fff;
    margin: 0 auto;
    padding: 20px;
    .icon {
      color: #6175ae;
      margin-right: 6px;
      font-size: 16px;
    }
    .header-title {
      font-size: 16px;
      .green-color {
        color: green;
      }
      .red-color {
        color: red;
        display: inline-block;
        margin-left: 10px;
        font-size: 13px;
      }
    }
  }
  .authentication-content {
    margin-top: 10px;
    .content-header {
      margin-bottom: 20px;
      height: 20px;
      line-height: 16px;
      font-size: 13px;
      position: relative;
      padding-left: 10px;
      .suffix {
        width: 4px;
        height: 16px;
        margin-right: 10px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #6175ae;
        display: inline-block;
      }
    }
    .uploadFile-container {
      padding-left: 20px;
    }
    .header2 {
      margin-top: 20px;
    }
    .submit-container {
      margin-top: 50px;
      padding-left: 20px;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
