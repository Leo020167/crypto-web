<template>
  <div class="balance-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <!-- 上层展示 -->
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="portrait" />
            <span class="title">資金帳戶</span>
          </p>
          <!-- 数据展示 -->
          <div class="top-data">
            <div class="left">
              <p class="upper-title">{{ $t('assets.total_assets') }}</p>
              <p class="upper-data">
                {{ balanceInfosVuex.assets
                }}<span class="transfor-usdt">{{
                  balanceInfosVuex.assetsCny
                }}</span>
              </p>
              <p class="lower-title">{{ $t('assets.has_use') }}(USDT)</p>
              <p class="last-data">{{ balanceInfosVuex.holdAmount }}</p>
            </div>
            <div class="center">
              <p class="title">{{ $t('assets.freeze') }}(USDT)</p>
              <p class="upper-data">{{ balanceInfosVuex.frozenAmount }}</p>
            </div>
            <div class="right flex justify-end">
              <AssetsButtonGroup />
            </div>
          </div>
        </div>
        <!-- 下层：记录展示 -->
        <div class="bottom">
          <ul class="bul">
            <li
              v-for="(item, index) in tablist"
              :key="index"
              :class="index === currentTabNumber ? 'actTab' : ''"
              @click="changeTabIndex(index)"
            >
              {{ item }}
            </li>
          </ul>
          <div class="show-container" v-loading="recordShow">
            <assets-list
              v-if="currentTabNumber === 0"
              :row-data="balanceInfosVuex?.symbolList"
            ></assets-list>
            <!-- 提币记录 -->
            <up-in-record
              v-if="currentTabNumber === 1 || currentTabNumber === 2"
              @changeUpInPage="changeUpInPage"
              :recordsList="CWrecordsList"
              :total="totalRecords"
              :pageNo="pageNo"
              :pageSize="pageSize"
            ></up-in-record>

            <!-- 法币记录 -->
            <otc-record
              v-if="currentTabNumber === 3"
              @showLoading="showLoading"
            ></otc-record>
          </div>
        </div>
        <!-- 弹窗 -->
        <top-up-dialog
          v-if="isShowTopup"
          :show-dialog="isShowTopup"
          @closeTopup="closeTopup"
          :radioValue="currentChainType"
          :chainList="chainList"
          :chainData="CWmessage"
          @changeRadioValue="changeChainType"
        ></top-up-dialog>
        <metion-dialog
          v-if="isShowMetion"
          :show-dialog="isShowMetion"
          @closeMetion="closeMetion"
          :radioValue="currentChainType"
          :chainList="chainList"
          :chainData="CWmessage"
          @changeRadioValue="changeChainType"
        ></metion-dialog>
        <transfer-dialog
          :show-dialog="isShowTransfer"
          @closeTransfer="closeTransfer"
        ></transfer-dialog>
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import upInRecord from './balanceCompontent/upInRecord.vue'; //充提记录
import TopUpDialog from './balanceCompontent/topUpDialog.vue'; //充币弹窗
import MetionDialog from './balanceCompontent/MetionDialog.vue'; // 提币弹窗
import TransferDialog from './balanceCompontent/TransferDialog.vue'; //划转弹窗
import OtcRecord from './compontent/OtcRecord.vue'; // 法币记录
import { assetsApi } from '@/server/axios.js';
import { mapGetters } from 'vuex';
import AssetsList from './assets-list.vue';
import AssetsButtonGroup from './AssetsButtonGroup.vue';

export default {
  components: {
    upInRecord,
    AssetsButtonGroup,
    TopUpDialog,
    MetionDialog,
    TransferDialog,
    OtcRecord,

    AssetsList,
  },
  data() {
    return {
      transfer: false,
      accountType: 'balance',
      currentTabNumber: 0,
      pageNo: 1, //记录公用标签
      pageSize: 0,
      totalRecords: 0,
      isShowTopup: false, //是否展示充币弹窗
      isShowMetion: false, //是否展示提币弹窗
      isShowTransfer: false, //是否展示划转弹窗
      recordShow: false, // 记录的loading
      dialogState: 1, //弹窗的充值、提币的状态---用于请求
      //数据
      CWrecordsList: [], //充币、提现记录
      transferList: [], // 划转记录
      chainList: [], //链类型(子)
      currentChainType: '',
      CWmessage: { withdrawFee: '0.0000', address: '' }, //充币和提币的详细信息
    };
  },
  computed: {
    ...mapGetters({
      balanceInfosVuex: 'getBalanceInfos',
    }),
    tablist() {
      return this.$t('capital-account.tabs');
    },
    documentTitle() {
      return this.$t('capital-account.title');
    },
  },
  created() {
    this.recordShow = true;
    // 判断是否有指定特定的tab
    const query = this.$route.query;
    if (Object.keys(query).length > 0) {
      if (!!query.currentTabNumber) {
        this.currentTabNumber = +query.currentTabNumber;
      }
    }
    this.getCWrecordData();
  },
  methods: {
    // 获取充币、提币信息
    getCWrecordData() {
      let state = this.currentTabNumber === 1 ? '1' : '-1';
      assetsApi.getCWRecord(state, this.pageNo).then((res) => {
        setTimeout(() => {
          this.recordShow = false;
        }, 500);
        if (res.code === '200') {
          this.CWrecordsList = res.data.data;
          this.totalRecords = Number(res.data.total);
          this.pageSize = Number(res.data.pageSize);
        }
      });
    },
    // 修改充币、提币的页码
    changeUpInPage(i) {
      this.pageNo = i;
      this.getCWrecordData();
    },
    // 获取划转信息列表
    getTransferRecordData() {
      assetsApi
        .getTransferRecords(this.accountType, this.accountType, this.pageNo)
        .then((res) => {
          setTimeout(() => {
            this.recordShow = false;
          }, 500);
          if (res.code === '200') {
            this.transferList = res.data.data;
            this.totalRecords = Number(res.data.total);
            this.pageSize = Number(res.data.pageSize);
          }
        });
    },
    // 修改划转的页码
    changeTransferPage(i) {
      this.pageNo = i;
      this.getTransferRecordData();
    },
    // 切换tab标签
    changeTabIndex(i) {
      this.recordShow = true;
      this.currentTabNumber = i;
      this.pageNo = 1;
      this.getCWrecordData();
    },
    // 充币、提币的链类型改变，重新触发====充币、提币的相关链的信息
    changeChainType(type) {
      this.currentChainType = type;
      this.getChainDetailData();
    },
    // 充币、提币的相关链的信息
    getChainDetailData() {
      assetsApi.getInfoDeposite().then((res) => {
        this.chainList = res.data.infos;
        if (this.dialogState === 1) {
          // this.isShowTopup = true
          this.$router.push({ name: 'topUps' });
        } else {
          this.$router.push({ name: 'bringUp' });
        }
      });

      //   }
      // })
    },
    // 充币弹窗
    showTopup() {
      this.dialogState = 1;
      this.getChainDetailData();
    },
    closeTopup() {
      this.isShowTopup = false;
    },
    // 提币弹窗
    showMetion() {
      this.dialogState = -1;
      this.getChainDetailData();
    },
    closeMetion() {
      this.isShowMetion = false;
    },
    // 划转弹窗
    showTransfer() {
      this.isShowTransfer = true;
    },
    closeTransfer() {
      this.isShowTransfer = false;
    },
    // 法币记录，关闭loading
    showLoading() {
      this.recordShow = false;
    },
  },
};
</script>

<style lang="scss" scope>
.balance-container {
  width: 100%;
  height: auto;
  background-color: $globalBg;
  color: $globalTextColor;
  padding-top: 2px;
  .main-container {
    width: 96%;
    margin: 0 auto;
    background-color: $globalBg;
    .top {
      margin-top: 10px;
      background-color: white;
      border-radius: 2px;
      padding: 10px 20px 22px;
      .top-title {
        line-height: 30px;
        display: flex;
        .portrait {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          display: inline-block;
        }
        .title {
          font-size: 15px;
          font-weight: bold;
          margin-left: 10px;
        }
      }
      .top-data {
        margin-top: 15px;
        display: flex;
        .left,
        .center {
          .upper-title {
            font-size: 14px;
            color: #8b8996;
          }
          .upper-data {
            font-size: 14px;
            margin-top: 12px;
            .transfor-usdt {
              margin-left: 12px;
              font-size: 12px;
              color: #9e9ca7;
            }
          }
          .lower-title {
            margin-top: 26px;
            font-size: 13px;
            color: #8b8996;
            &.mt {
              margin-top: 65px;
            }
          }
          .last-data {
            margin-top: 12px;
            font-size: 13px;
          }
        }
        .center {
          margin-left: 15px;
          width: 250px;
          text-align: right;
        }
        .right {
          margin-top: 20px;
          flex: 1;
          padding-right: 20px;
          text-align: right;
          .btns {
            margin-left: 10px;
          }
        }
      }
    }
    .bottom {
      margin-top: 20px;
      background-color: white;
      border-radius: 2px;
      padding: 15px 20px 20px;
      min-height: 400px;
      .bul {
        display: flex;
        li {
          margin-right: 24px;
          font-size: 15px;
          padding-bottom: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .actTab {
          color: #409efe;
          border-bottom: 2px solid #409efe;
        }
      }
      .show-container {
        margin-top: 10px;
      }
    }
  }
}
</style>
