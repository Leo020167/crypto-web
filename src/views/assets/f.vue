<template>
  <div class="digitals-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="top-img" />
            <span class="title-name">{{ $t('newCommon.text44') }}</span>
          </p>
          <div class="assets-data">
            <div class="left">
              <!-- 总资产(USDT) -->
              <p class="upper-title">
                {{ $t('assets.total_assets') }}（AIDTC）
              </p>
              <p class="upper-data">
                {{ digitalAccountVuex.assets }}
                <span class="transfor-usdt">{{
                  digitalAccountVuex.assetsCny
                }}</span>
              </p>
              <!-- 可用保证金(USDT) -->
              <p class="lower-title">{{ $t('assets.eableBail') }}（AIDTC）</p>
              <p class="last-data">{{ digitalAccountVuex.eableBail }}</p>
            </div>
            <div class="center">
              <!-- 未实现盈亏(USDT) -->
              <p class="upper-title">{{ $t('assets.shizhiusdt') }}</p>
              <p
                :class="
                  digitalAccountVuex.assetsCny > 0
                    ? 'upper-data color-red'
                    : digitalAccountVuex.assetsCny < 0
                    ? 'upper-data color-green'
                    : 'upper-data'
                "
              >
                {{
                  digitalAccountVuex.assetsCny > 0
                    ? `+${digitalAccountVuex.assetsCny}`
                    : digitalAccountVuex.assetsCny
                }}
              </p>
              <!-- 持仓保证金(USDT) -->
              <p class="lower-title">{{ $t('assets.openBailTfu') }}</p>
              <p class="last-data">{{ digitalAccountVuex.openBail }}</p>
            </div>
            <!--            <div class="center">-->
            <!--              <p class="upper-title">-->
            <!--                &lt;!&ndash; 风险率 &ndash;&gt;-->
            <!--                {{$t('assets.riskRate')}}-->
            <!--                <el-popover placement="top-start"-->
            <!--                            width="400"-->
            <!--                            :title="$t('assets.riskDesc')"-->
            <!--                            trigger="hover"-->
            <!--                            :content="riskRateDesc">-->
            <!--                  <i class="el-icon-question"-->
            <!--                     slot="reference"></i>-->
            <!--                </el-popover>-->
            <!--              </p>-->
            <!--              <p class="upper-data">{{digitalAccountVuex.riskRate}}%</p>-->
            <!--              &lt;!&ndash; 冻结保证金(USDT) &ndash;&gt;-->
            <!--              <p class="lower-title">{{$t('newCommon.text55')}}</p>-->
            <!--              <p class="last-data">{{digitalAccountVuex.disableAmount}}</p>-->
            <!--            </div>-->
            <div class="right">
              <!-- 划转 -->
              <el-button type="primary" class="btns" @click="showTransfer">{{
                $t('assets.transfer')
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="show-container" v-loading="recordShow">
            <FadeComponent>
              <financial-record :orderData="CWrecordsList"></financial-record>
            </FadeComponent>
          </div>
        </div>
      </div>
    </FadeComponent>
    <transfer-dialog
      :show-dialog="isShowTransfer"
      @closeTransfer="closeTransfer"
    ></transfer-dialog>
  </div>
</template>

<script>
import FinancialRecord from './compontent/FinancialRecord.vue';
import TransferDialog from './balanceCompontent/TransferDialog.vue'; //划转弹窗
import { assetsApi, legalPurchaseApi } from '@/server/axios.js';

export default {
  data() {
    return {
      accountType: 'digital',
      pageNo: 1,
      recordShow: false,
      // 弹窗
      isShowTransfer: false,
      hasReturn: false,
      riskRateDesc: '', //风险率,
      digitalAccountVuex: {},
      digitalAccountVuexNull: null,
      CWrecordsList: [],
      totalRecords: 0,
      pageSize: 10,
    };
  },
  beforeDestroy() {
    console.log('销毁了');
    clearInterval(this.digitalAccountVuexNull);
  },
  created() {
    this.digitalAccountVuexNull = setInterval(() => {
      legalPurchaseApi.ceshi().then((res) => {
        this.digitalAccountVuex = res.data.tokenAccount;
        console.log('this.digitalAccountVuex', this.digitalAccountVuex);
      });
    }, 1000);
    this.getCWrecordData();
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang(
        '数字货币账户',
        '數字貨幣賬戶',
        'Digital Account'
      );
    },
  },
  methods: {
    // 获取充币、提币信息
    getCWrecordData() {
      assetsApi.getRecordList(this.pageNo).then((res) => {
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
    // 划转弹窗
    showTransfer() {
      this.isShowTransfer = true;
    },
    closeTransfer() {
      this.isShowTransfer = false;
    },
  },
  components: {
    FinancialRecord,
    TransferDialog,
  },
};
</script>

<style lang="scss" scope>
.digitals-container {
  width: 100%;
  min-height: auto;
  // background-color: $globalBg;
  color: $globalTextColor;
  padding-top: 2px;
  .main-container {
    width: 96%;
    margin: 0 auto;
    background-color: #252a44;
    .top {
      background-color: white;
      border-radius: 2px;
      padding: 10px 20px 22px;
      .top-title {
        .top-img {
          display: inline-block;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 8px;
        }
        .title-name {
          font-size: 15px;
          font-weight: bold;
          display: inline-block;
          line-height: 30px;
        }
      }
      .assets-data {
        display: flex;
        margin-top: 10px;
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
        }
      }
    }
    .tab {
      display: flex;
      padding-bottom: 15px;
      .commonTab {
        font-size: 15px;
        padding-bottom: 4px;
        font-weight: bold;
        margin-right: 20px;
        cursor: pointer;
        &.active {
          border-bottom: 2px solid $color_main;
          color: $color_main;
        }
      }
    }
    .bottom {
      margin-top: 20px;
      padding: 17px 15px;
      background-color: white;
      min-height: 400px;
      .tab-search {
        display: flex;
        .tab {
          flex: 1;
        }
        .search {
          .coin-type {
            width: 100px;
          }
          .direction-value {
            margin-left: 15px;
            width: 120px;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
