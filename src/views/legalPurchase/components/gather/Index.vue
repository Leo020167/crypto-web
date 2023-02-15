<template>
  <div class="gather-box">
    <div class="top">
      <div class="left">
        <img src="../../../../assets/newIcons/collection.png" class="logo" />
        <!-- 收款管理 -->
        <p class="my-name">{{ $t('otc.collectionManagement') }}</p>
      </div>
      <div class="right" @click="showToast">
        <img src="../../../../assets/newIcons/add.png" class="add-logo" />
        <!-- 添加收款方式 -->
        <p class="add-text">{{ $t('otc.addPayWay') }}</p>
      </div>
    </div>
    <el-table class="gather-list" :data="gatherList" style="width: 100%">
      <!-- 收款方式 -->
      <el-table-column :label="$t('otc.paymentWays')">
        <template slot-scope="scope">
          <img :src="scope.row.receiptLogo" class="type-logo" />
          <span class="type-text">{{ scope.row.receiptTypeValue }}</span>
        </template>
      </el-table-column>
      <!-- 收款人 -->
      <el-table-column
        prop="receiptName"
        :label="$t('otc.payee')"
      ></el-table-column>
      <!-- 收款账号 -->
      <el-table-column :label="$t('otc.receivingAccount')">
        <template slot-scope="scope">
          <span v-show="scope.row.receiptType == 3">{{
            transferBankcard(scope.row.receiptNo)
          }}</span>
          <span v-show="scope.row.receiptType != 3">{{
            scope.row.receiptNo
          }}</span>
        </template>
      </el-table-column>
      <!-- 银行名称/收款码 -->
      <el-table-column :label="$t('otc.receivingType')">
        <template slot-scope="scope">
          <span v-show="scope.row.receiptType == 3">{{
            scope.row.bankName
          }}</span>
          <img
            :src="scope.row.qrCode"
            class="ewm"
            v-show="scope.row.receiptType != 3"
          />
        </template>
      </el-table-column>
      <!-- 修改/删除 -->
      <el-table-column :label="$t('otc.modify')">
        <template slot-scope="scope">
          <img
            src="../../../../assets/newIcons/edit.png"
            @click="handleEdit(scope.row)"
            class="edit-btn"
          />
          <img
            src="../../../../assets/newIcons/delete.png"
            @click="handleDelete(scope.row)"
            class="delete-btn"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗：添加、编辑方式 -->
    <el-dialog :visible.sync="dialogVisible" width="1086px">
      <div class="ways">
        <!-- <div class="name">收款方式</div> -->
        <div class="checkbox">
          <div
            v-for="(item, index) in waysArray"
            :key="index"
            :class="
              item.receiptType == currentReceiptType
                ? 'check-item yes'
                : 'check-item'
            "
            @click="changePayways(item.receiptType)"
          >
            <p class="check-name">
              <img :src="item.receiptLogo" class="pay-type" />
              {{ item.receiptTypeValue }}
            </p>
            <p
              class="select-item"
              v-show="item.receiptType == currentReceiptType"
            >
              <img
                src="../../../../assets/newIcons/true.png"
                class="true-logo"
              />
            </p>
          </div>
        </div>
      </div>
      <div class="des">
        <div class="des-item">
          <!-- 收款人 -->
          <p class="item-name">{{ $t('otc.paymentPeople') }}</p>
          <el-input class="input-box" v-model="name"></el-input>
        </div>
        <div class="des-item">
          <!-- 收款账号 -->
          <p class="item-name">{{ $t('otc.receivingAccount') }}</p>
          <el-input class="input-box" v-model="id"></el-input>
        </div>
        <!-- 银行名称 -->
        <div class="des-item" v-if="currentReceiptType == 3">
          <p class="item-name">{{ $t('otc.bankName') }}</p>
          <el-input class="input-box" v-model="bankName"></el-input>
        </div>
        <!-- 收款码 -->
        <div
          class="des-item"
          v-else-if="currentReceiptType != 3 && currentReceiptType"
        >
          <p class="item-name">{{ $t('otc.receivingCode') }}</p>
          <single-file-upload
            @onAddFile="getNewEwmFile"
            :oldFile="oldEwm"
            :canDelete="false"
            :fileName="$t('otc.receivingCode')"
          ></single-file-upload>
        </div>
      </div>
      <div class="ways-tips">
        <img src="../../../../assets/newIcons/notice.png" class="notice-img" />
        <!-- 请务必使用与您注册手机号码一致的实名账号 -->
        {{ $t('otc.addTip') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 确认添加 -->
        <el-button
          type="primary"
          :loading="showBtnLoading"
          @click="enterSave"
          >{{ $t('otc.confirmAdd') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SingleFileUpload from '@/components/UploadFile/SingleFileUpload.vue';
import { legalPurchaseApi, uploadImage } from '@/server/axios.js';
export default {
  data() {
    return {
      showBtnLoading: false,
      gatherList: [], //我目前拥有的收款方式
      dialogVisible: false, //弹窗
      waysArray: [], //数据收款方式组合
      currentReceiptType: null, //默认不选择
      name: '',
      id: '',
      bankName: '',
      oldEwmUrl: '',
      oldEwm: {}, //初始化
      hasNewEwm: false, //是否有更新
      newEwmFile: {},
      newEwmUrl: '',
      currentState: 0, //目前的弹窗是用来修改的==》1，添加==》0
    };
  },
  created() {
    this.getGather();
  },
  methods: {
    // 获取我的收款信息
    getGather() {
      legalPurchaseApi.getMyPayway().then((res) => {
        if (res.code == 200) {
          this.gatherList = res.data.myPaymentList;
        }
      });
    },
    // 转换银行卡
    transferBankcard(text) {
      let newNum = text.replace(/(.{4})/g, '$1 ');
      return newNum;
    },
    // 按钮事件
    handleEdit(data) {
      //修改收款方式
      this.getPaywaysArr();
      this.dialogVisible = true;
      this.currentState = 1;
      this.currentReceiptType = data.receiptType;
      this.name = data.receiptName;
      this.id = data.receiptNo;
      this.bankName = data.receiptType == 3 ? data.bankName : '';
      this.oldEwmUrl = data.receiptType != 3 ? data.qrCode : '';
      this.oldEwm = data.receiptType != 3 ? { fileUrl: data.qrCode } : {};
      this.hasNewEwm = false;
    },
    handleDelete(data) {
      // “是否删除该收款方式？”的弹窗
      this.$confirm(this.$t('otc.addTip1'), this.$t('otc.tips'), {
        confirmButtonText: this.$t('otc.enter'),
        cancelButtonText: this.$t('otc.cancel'),
        type: 'warning',
      })
        .then(() => {
          legalPurchaseApi.deletePayway(data.paymentId).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.getGather();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('otc.undelete'), //取消删除
          });
        });
    },
    // 弹窗事件
    showToast() {
      //展示弹窗,获取方式列表,添加
      this.currentState = 0;
      this.dialogVisible = true;
      this.hasNewEwm = false;
      this.name = '';
      this.id = '';
      this.bankName = '';
      this.oldEwm = {};
      this.getPaywaysArr();
    },
    // 获取支付方式
    getPaywaysArr() {
      legalPurchaseApi.getPaywayArr().then((res) => {
        if (res.code == 200) {
          this.waysArray = res.data.paymentOptionList;
        }
      });
    },
    changePayways(way) {
      this.currentReceiptType = way;
    },
    getNewEwmFile(file) {
      this.newEwmFile = file;
      this.hasNewEwm = true;
    },
    // 弹窗： 添加或者修改收款方式的判断
    enterSave() {
      if (!this.currentReceiptType) {
        this.$message.error(this.$t('otc.addTip2')); //请选择收款方式
      } else if (!this.name || !this.id) {
        this.$message.error(this.$t('otc.addTip3')); //请完善收款人或收款账号信息
      } else if (this.currentReceiptType == 3 && !this.bankName) {
        this.$message.error(this.$t('otc.addTip4')); //请完善银行名称
      } else {
        // 如果是支付宝或者微信，则先要上传图片
        if (this.hasNewEwm) {
          Promise.all([this.getEWMImg(this.newEwmFile)])
            .then((res) => {
              this.submitWaysData();
            })
            .catch((err) => {
              this.showBtnLoading = false;
              this.$message({
                message: this.$t('otc.uploadFailed'), //上传失败
              });
            });
        } else {
          this.submitWaysData();
        }
      }
    },
    // 上传二维码
    getEWMImg(files) {
      let fil = new FormData();
      fil.append('imageFiles', files);
      return new Promise((resolve, reject) => {
        uploadImage({
          dir: 'identityImage',
          type: 'imageRetOriginal',
          imageFiles: fil,
        }).then((res) => {
          if (res.code === '200') {
            this.newEwmUrl = res.data.imageUrlList[0];
            resolve();
          } else {
            reject(res);
          }
        });
      });
    },
    // 上传收款数据
    submitWaysData() {
      // receiptType, paymentId, receiptName, receiptNo, bankName, qrCodeUrl
      let bankName = this.currentReceiptType == 3 ? this.bankName : '';
      let qrCodeUrl =
        this.currentReceiptType != 3 && this.hasNewEwm
          ? this.newEwmUrl
          : this.oldEwmUrl;
      legalPurchaseApi
        .addPayways(
          this.currentReceiptType,
          this.currentState,
          this.name,
          this.id,
          bankName,
          qrCodeUrl
        )
        .then((res) => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.dialogVisible = false;
            this.getGather();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
  components: {
    SingleFileUpload,
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.ewm {
  width: 200px;
  height: 200px;
}
</style>
