<template>
  <div class="future-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <!-- 上层展示 -->
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="portrait" />
            <span class="title">{{ $t('newCommon.text36') }}</span>
          </p>
          <!-- 数据展示 -->
          <div class="top-data">
            <div class="left">
              <p class="upper-title">
                {{ $t('assets.total_assets') }}（{{
                  stockAccountVuex.accountType
                }}）
              </p>
              <p class="upper-data">
                {{ stockAccountVuex.assets
                }}<span class="transfor-usdt">{{
                  stockAccountVuex.assetsCny
                }}</span>
              </p>
              <p class="lower-title">{{ $t('assets.eableBail') }}</p>
              <p class="last-data">
                {{ stockAccountVuex.eableBail }}（{{
                  stockAccountVuex.accountType
                }}）
              </p>
            </div>
            <div class="center">
              <p class="upper-title">{{ $t('assets.unprofit') }}</p>
              <p
                :class="
                  stockAccountVuex.profit > 0
                    ? 'upper-data color-red'
                    : stockAccountVuex.profit < 0
                    ? 'upper-data color-green'
                    : 'upper-data'
                "
              >
                {{
                  stockAccountVuex.profit > 0
                    ? `+${stockAccountVuex.profit}`
                    : stockAccountVuex.profit
                }}（{{ stockAccountVuex.accountType }}）
              </p>
              <p class="lower-title">{{ $t('assets.openBail') }}</p>
              <p class="last-data">
                {{ stockAccountVuex.openBail }}（{{
                  stockAccountVuex.accountType
                }}）
              </p>
            </div>
            <div class="center">
              <p class="upper-title">
                {{ $t('assets.riskRate') }}
                <el-popover
                  placement="top-start"
                  width="400"
                  :title="$t('assets.riskDesc')"
                  trigger="hover"
                  :content="riskRateDesc"
                >
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </p>
              <p class="upper-data">{{ stockAccountVuex.riskRate }}%</p>
              <p class="lower-title">{{ $t('assets.frozenBail') }}</p>
              <p class="last-data">{{ stockAccountVuex.frozenBail }}</p>
            </div>
            <div class="right">
              <el-button type="primary" @click="showTransfer">{{
                $t('assets.transfer')
              }}</el-button>
            </div>
          </div>
        </div>
        <!-- 下层：当前订单、历史订单、划转记录展示 （组件）-->
        <div class="bottom">
          <div class="tab-search">
            <ul class="tab">
              <li
                v-for="(item, index) in tablist"
                :key="index"
                :class="
                  index === currentTabNumber ? 'commonTab active' : 'commonTab'
                "
                @click="changeTabIndex(index)"
              >
                {{ item }}
              </li>
            </ul>
            <div class="search" v-show="currentTabNumber === 2">
              <el-input
                v-model="coinType"
                :placeholder="$t('assets.coinType')"
                size="mini"
                class="coin-type"
              ></el-input>
              <el-select
                v-model="directionLabel"
                @change="changeDirectionVal"
                :placeholder="$t('assets.alldirection')"
                size="mini"
                class="direction-value"
              >
                <el-option
                  v-for="item in directionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="stateLabel"
                @change="changeStateVal"
                size="mini"
                class="direction-value"
              >
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="searchCoin">{{
                $t('assets.search')
              }}</el-button>
            </div>
          </div>
          <div class="show-container" v-loading="recordShow">
            <FadeComponent>
              <current-order
                :returnChange="hasReturn"
                v-if="currentTabNumber === 0"
                :orderData="stockAccountVuex.openList"
              ></current-order>
              <current-entrust
                :returnChange="hasReturn"
                v-if="currentTabNumber === 1"
                :entrustData="stockAccountVuex.entrustList"
              ></current-entrust>
              <history-order
                v-if="currentTabNumber === 2"
                @changePage="changeHistoryPage"
                :historyList="historyList"
                :total="historyTotal"
                :pageSize="historyPageSize"
                :pageNo="pageNo"
              ></history-order>
              <transfer-record
                v-if="currentTabNumber === 3"
                :transType="accountType"
                @changePage="changeTransferPage"
                :transferList="transferList"
                :total="transferTotal"
                :pageNo="pageNo"
                :pageSize="TransferPageSize"
              ></transfer-record>
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
import CurrentOrder from './compontent/CurrentOrder.vue';
import CurrentEntrust from './compontent/CurrentEntrust.vue';
import HistoryOrder from './compontent/HistoryOrder.vue';
import TransferRecord from './compontent/TransferRecord.vue'; //划转记录
import TransferDialog from './balanceCompontent/TransferDialog.vue'; //划转弹窗
import { assetsApi, legalPurchaseApi } from '@/server/axios.js';
export default {
  data() {
    return {
      accountType: 'spot',
      currentTabNumber: 0,
      coinType: '', //搜索币种
      directionLabel: '',
      directionValue: '',
      stateLabel: '',
      stateValue: '',
      pageNo: 1,
      recordShow: false,
      // 数据类
      historyList: [], //历史记录
      historyTotal: 0,
      historyPageSize: 0,
      transferList: [], //划转记录
      transferTotal: 0,
      TransferPageSize: 0,
      // 弹窗
      isShowTransfer: false,
      hasReturn: false,
      riskRateDesc: '', //风险率
      stockAccountVuex: {},
      digitalAccountVuexNull: null,
    };
  },
  beforeDestroy() {
    console.log('销毁了');
    clearInterval(this.digitalAccountVuexNull);
  },
  computed: {
    // 订单管理tab
    tablist() {
      if (this.$i18n.locale === 'zh_CN') {
        return this.$t('newCommon.text54');
      } else if (this.$i18n.locale === 'zh_TW') {
        return this.$t('newCommon.text54');
      } else {
        return [
          'Current position',
          'Current order',
          'Historical order',
          'Transfer record',
        ];
      }
    },
    directionOptions() {
      if (this.$i18n.locale === 'zh_CN') {
        return [
          { value: '', label: '全部方向' },
          { value: 'buy', label: '看涨(做多)' },
          { value: 'sell', label: '看跌(做空)' },
        ];
      } else if (this.$i18n.locale === 'zh_TW') {
        return [
          { value: '', label: '全部方向' },
          { value: 'buy', label: '看漲(做多)' },
          { value: 'sell', label: '看跌(做空)' },
        ];
      } else {
        return [
          { value: '', label: 'all directions' },
          { value: 'buy', label: 'Bull (long)' },
          { value: 'sell', label: 'Put (short)' },
        ];
      }
    },
    // 全部状态
    stateOptions() {
      if (this.$i18n.locale === 'zh_CN') {
        return [
          { value: '', label: '全部状态' },
          { value: 'filled', label: '已成交' },
          { value: 'canceled', label: '已撤销' },
        ];
      } else if (this.$i18n.locale === 'zh_TW') {
        return [
          { value: '', label: '全部狀態' },
          { value: 'filled', label: '已成交' },
          { value: 'canceled', label: '已撤銷' },
        ];
      } else {
        return [
          { value: '', label: 'All states' },
          { value: 'filled', label: 'filled' },
          { value: 'canceled', label: 'Cancelled' },
        ];
      }
    },
    documentTitle() {
      return this.getTitleValueByLang(
        '股指期货账户',
        '股指期貨賬戶',
        'Stock Account'
      );
    },
  },
  created() {
    this.digitalAccountVuexNull = setInterval(() => {
      legalPurchaseApi.ceshi().then((res) => {
        console.log(res);
        this.stockAccountVuex = res.data.stockAccount;
      });
    }, 1000);
    let desc = sessionStorage.getItem('riskRateDesc');
    this.riskRateDesc = desc;
    if (this.$route.query.tabHistory) {
      this.currentTabNumber = 2;
      this.recordShow = true;
      this.getHistoryData();
    }
  },
  methods: {
    changeTabIndex(i) {
      if (i === this.currentTabNumber) {
        return;
      } else {
        this.pageNo = 1;
        this.currentTabNumber = i;
        if (i === 2) {
          this.recordShow = true;
          this.getHistoryData();
        } else if (i === 3) {
          this.recordShow = true;
          this.getTransferData();
        }
      }
    },
    // 获取历史记录 symbol, accountType, pageNo, buySell
    getHistoryData() {
      assetsApi
        .getCorrespondRecords(
          this.coinType,
          this.accountType,
          this.pageNo,
          this.directionValue,
          this.stateValue
        )
        .then((res) => {
          setTimeout(() => {
            this.recordShow = false;
          }, 500);
          if (res.code === '200') {
            this.historyList = res.data.data;
            this.historyTotal = Number(res.data.total);
            this.historyPageSize = Number(res.data.pageSize);
          }
        });
    },
    // 下拉change事件 --历史记录
    changeDirectionVal(dir) {
      this.directionValue = dir;
    },
    changeStateVal(state) {
      this.stateValue = state;
    },
    // 搜索 --历史记录
    searchCoin() {
      this.recordShow = true;
      this.pageNo = 1;
      this.getHistoryData();
    },
    // 改变历史记录的页码
    changeHistoryPage(i) {
      this.pageNo = i;
      this.getHistoryData();
    },
    // 获取划转信息
    getTransferData() {
      assetsApi
        .getTransferRecords(this.accountType, this.accountType, this.pageNo)
        .then((res) => {
          setTimeout(() => {
            this.recordShow = false;
          }, 500);
          if (res.code === '200') {
            this.transferList = res.data.data;
            this.transferTotal = Number(res.data.total);
            this.TransferPageSize = Number(res.data.pageSize);
          }
        });
    },
    // 修改划转页码
    changeTransferPage(i) {
      this.pageNo = i;
      this.getTransferData();
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
    CurrentOrder,
    CurrentEntrust,
    HistoryOrder,
    TransferRecord,
    TransferDialog,
  },
};
</script>

<style lang="scss" scope>
.future-container {
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
    .bottom {
      margin-top: 20px;
      background-color: white;
      border-radius: 2px;
      padding: 15px 20px 20px;
      min-height: 400px;
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
      .show-container {
        margin-top: 10px;
      }
    }
  }
}
</style>
