<template>
  <div class="complaint-box">
    <p class="title">
      <!-- 订单申诉 -->
      {{ $t('otc.orderAppeal') }}
    </p>
    <p class="item-title">
      <span class="ii"></span>
      <!-- 申诉理由 -->
      {{ $t('otc.complaintReason') }}
    </p>
    <p class="complaint-item" v-for="(item, index) in reasonList" :key="index">
      <el-radio v-model="radio" :label="item">{{ item }}</el-radio>
    </p>
    <p class="item-title">
      <span class="ii"></span>
      <!-- 申诉截图（可选） -->
      {{ $t('otc.complaintScreenshot') }}
    </p>
    <div class="complaint-item">
      <div class="img">
        <single-file-upload
          @onAddFile="getFile1"
          :oldFile="placeImg"
          :fileName="'申请申诉链接1'"
        ></single-file-upload>
      </div>
      <div class="img">
        <single-file-upload
          @onAddFile="getFile2"
          :oldFile="placeImg"
          :fileName="'申请申诉链接2'"
        ></single-file-upload>
      </div>
    </div>
    <p class="item-title">
      <span class="ii"></span>
      <!-- 申诉留言（可选） -->
      {{ $t('otc.appealMessage') }}
    </p>
    <div class="complaint-item">
      <!-- 您可以写下您申诉的详细情况 -->
      <el-input
        type="textarea"
        :rows="5"
        resize="none"
        :placeholder="$t('otc.appealDetail')"
        v-model="textarea"
      >
      </el-input>
    </div>
    <div class="btn">
      <div class="left">
        <p class="top">
          <img src="../../../../assets/newIcons/notice.png" class="notice" />
          <!-- 申诉提醒 -->
          {{ $t('otc.appealNotice') }}
        </p>
        <p class="bottom">
          <!-- 提起申诉后资产将会冻结，申诉专员将介入本次交易，直至申诉结束。恶意申诉属于扰乱平台正常运营秩序的行为，情节严重将冻结账户。 -->
          {{ $t('otc.appealFreeze') }}
        </p>
      </div>
      <div class="enter-btn" @click="submitComplaint">
        <!-- 提交申诉 -->
        {{ $t('otc.submitAppeal') }}
      </div>
    </div>
  </div>
</template>

<script>
import SingleFileUpload from '@/components/UploadFile/SingleFileUpload.vue';
import { legalPurchaseApi, uploadImage } from '@/server/axios.js';
export default {
  data() {
    return {
      orderId: null,
      reasonList: [],
      radio: '',
      placeImg: {},
      complaintImg1File: { name: '' },
      complaintImg1: '',
      complaintImg2File: { name: '' },
      complaintImg2: '',
      textarea: '',
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.getReasonList();
  },
  methods: {
    getReasonList() {
      legalPurchaseApi.appealReasonList(this.orderId).then((res) => {
        if (res.code == 200) {
          this.reasonList = res.data;
        }
      });
    },
    getFile1(file) {
      this.complaintImg1File = file;
      this.getImg(file, 1);
    },
    getFile2(file) {
      this.complaintImg2File = file;
      this.getImg(file, 2);
    },
    // 提交图片
    // 上传二维码
    getImg(files, type) {
      let fil = new FormData();
      fil.append('imageFiles', files);
      uploadImage({
        dir: 'identityImage',
        type: 'imageRetOriginal',
        imageFiles: fil,
      }).then((res) => {
        if (res.code == '200') {
          if (type == 1) {
            this.complaintImg1 = res.data.imageUrlList[0];
          } else {
            this.complaintImg2 = res.data.imageUrlList[0];
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 提交申诉1, orderId, reason, image1Url, image2Url, message
    submitComplaint() {
      if (this.radio == '') {
        this.$message.error(this.$t('otc.chooseAppealReason'));
      } else {
        // console.log(this.orderId, this.radio, this.complaintImg1, this.complaintImg2, this.textarea)
        legalPurchaseApi
          .enterAppeal(
            this.orderId,
            this.radio,
            this.complaintImg1,
            this.complaintImg2,
            this.textarea
          )
          .then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.$router.back(-1);
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
  },
  components: {
    SingleFileUpload,
  },
};
</script>

<style lang="scss" scope>
.complaint-box {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  font-size: 12px;
  color: black;
  .title {
    font-size: 16px;
    padding-top: 14px;
    color: black;
    font-weight: bold;
  }
  .item-title {
    margin-top: 20px;
    font-weight: bold;
    .ii {
      display: inline-block;
      width: 2px;
      height: 12px;
      background-color: #6175ae;
      margin-right: 5px;
    }
  }
  .complaint-item {
    margin-top: 11px;
    .img {
      display: inline-block;
      margin-right: 20px;
    }
  }
  .btn {
    margin-top: 20px;
    display: flex;
    .left {
      flex: 1;
      font-size: 12px;
      padding: 12px;
      background-color: #f2f5ff;
      color: #6175ae;
      border: 1px dotted #6175ae;
      .top {
        .notice {
          height: 12px;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      .bottom {
        padding-left: 21px;
        margin-top: 4px;
      }
    }
    .enter-btn {
      margin-left: 20px;
      width: 217px;
      height: 55px;
      background-color: #6175ae;
      border-radius: 4px;
      color: white;
      text-align: center;
      line-height: 55px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
