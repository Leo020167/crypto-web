<template>
  <div class="ceriticate-box">
    <div class="top">
      <img src="../../../../assets/newIcons/authentication.png" class="logo" />
      <div class="my-name">
        <!-- 商家认证 -->
        {{ $t('otc.certificate') }}
        <p class="disPass" v-if="certifacateData.state == '-1'">
          <img
            src="../../../../assets/newIcons/notice.png"
            class="notice-png"
          />
          <span class="unPass">
            {{ !!certifacateData.reason ? certifacateData.reason : '' }}
          </span>
        </p>
      </div>
    </div>
    <div class="contents">
      <p class="contents-title">
        <span class="ii"></span> {{ $t('otc.certificateInfo') }}
        <span class="state">
          <!-- 0未认证，1认证中，2认证通过，3申请取消认证，4取消认证通过，-1认证失败 -->
          {{
            certifacateData.state == 0
              ? $t('otc.unCertificate')
              : certifacateData.state == 1
              ? $t('otc.certificating')
              : certifacateData.state == 2
              ? $t('otc.certificatePass')
              : certifacateData.state == 3
              ? $t('otc.applyCancelCertificate')
              : certifacateData.state == 4
              ? $t('otc.applyCancelCertificatePass')
              : certifacateData.state == -1
              ? $t('otc.certificateFail')
              : ''
          }}</span
        >
      </p>
      <div class="base-content">
        <div class="base-item">
          <p class="item-name">
            <!-- 姓名 -->
            {{ $t('otc.name') }}
          </p>
          <el-input
            v-model="certifacateData.realName"
            :disabled="true"
          ></el-input>
        </div>
        <div class="base-item">
          <p class="item-name">
            <!-- 证件号码 -->
            {{ $t('otc.idNumber') }}
          </p>
          <el-input
            v-model="certifacateData.certNo"
            :disabled="true"
          ></el-input>
        </div>
        <div class="base-item">
          <p class="item-name">
            <!-- 缴纳保证金 -->
            {{ $t('otc.deposit') }}
          </p>
          <el-input v-model="certifacateData.securityDeposit" :disabled="true">
            <span slot="suffix">USDT</span>
          </el-input>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <div class="left">
        <p class="tips">
          <!-- 保证金用于发布出售或购买USDT广告，提交认证信息即时从资产余额中进行冻结。 -->
          {{ $t('otc.tips1') }}
        </p>
        <p class="reading">
          <el-checkbox v-model="checked">
            <!-- 同意冻结 -->
            {{ $t('otc.freeze') }}
            <span class="blue-text"
              >{{ certifacateData.securityDeposit }}USDT</span
            >
            <!-- 作为广告方保证资产，且同意 -->
            {{ $t('otc.agreenFreeze') }}
            <span class="blue-text">
              <!-- 商家服务协议 -->
              《{{ $t('otc.agreenment') }}》</span
            ></el-checkbox
          >
        </p>
      </div>
      <div
        class="right"
        v-if="
          certifacateData.state == 0 ||
          certifacateData.state == 4 ||
          certifacateData.state == -1 ||
          certifacateData.state == 2
        "
      >
        <div
          class="enter-btn"
          @click="enterApplicant"
          :loading="showLoading"
          v-if="
            certifacateData.state == 0 ||
            certifacateData.state == 4 ||
            certifacateData.state == -1
          "
        >
          <!-- 提交认证 -->
          {{ $t('otc.submitCertificate') }}
        </div>
        <div
          class="enter-btn"
          @click="cancelApplicant"
          :loading="showLoading"
          v-if="certifacateData.state == 2"
        >
          <!-- 取消提交认证 -->
          {{ $t('otc.cancelCertificate') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { legalPurchaseApi } from '../../../../server/axios.js';
export default {
  data() {
    return {
      certifacateData: {},
      checked: true,
      showLoading: false,
    };
  },
  created() {
    this.getBaseData();
  },
  methods: {
    // 获取初始值
    getBaseData() {
      legalPurchaseApi.getCertificateData().then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.certifacateData = res.data.otcCertification;
        }
      });
    },
    // 申请成为商家
    enterApplicant() {
      if (this.certifacateData.idCertify != 1) {
        //   未实名不能申请商家认证
        this.$msgbox({
          title: this.$t('otc.unableTocertificateWithoutName'),
          message: this.$t('otc.toCertificateTips'),
          confirmButtonText: this.$t('otc.toCertificate'),
          cancelButtonText: this.$t('otc.cancel'),
          callback: (action) => {
            this.$router.push('/user/authentication');
          },
        });
      } else {
        this.showLoading = true;
        legalPurchaseApi
          .Applicant()
          .then((res) => {
            this.showLoading = false;
            this.getBaseData();
            if (res.code == 200) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      }
    },
    // 取消成为商家
    cancelApplicant() {
      this.showLoading = true;
      legalPurchaseApi
        .cancelApplicant()
        .then((res) => {
          this.showLoading = false;
          this.getBaseData();
          if (res.code == 200) {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {
          this.showLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
