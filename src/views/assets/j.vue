<template>
  <div class="digitals-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="top-img" />
            <span class="title-name">{{ $t('newCommon.text34') }}</span>
          </p>
          <div class="assets-data">
            <div class="left">
              <!-- 总资产(USDT) -->
              <p class="upper-title">
                {{ $t('assets.total_assets') }}（{{
                  digitalAccountVuex.accountType
                }}）
              </p>
              <p class="upper-data">
                {{ digitalAccountVuex.assets }}
                <span class="transfor-usdt">{{
                  digitalAccountVuex.assetsCny
                }}</span>
              </p>
              <!-- 可用保证金(USDT) -->
              <p class="lower-title">{{ $t('assets.eableBail') }}</p>
              <p class="last-data">
                {{ digitalAccountVuex.eableBail }}（{{
                  digitalAccountVuex.accountType
                }}）
              </p>
            </div>
            <div class="center">
              <!-- 未实现盈亏(USDT) -->
              <p class="upper-title">{{ $t('assets.unprofit') }}</p>
              <p
                :class="
                  digitalAccountVuex.profit > 0
                    ? 'upper-data color-red'
                    : digitalAccountVuex.profit < 0
                    ? 'upper-data color-green'
                    : 'upper-data'
                "
              >
                {{
                  digitalAccountVuex.profit > 0
                    ? `+${digitalAccountVuex.profit}`
                    : digitalAccountVuex.profit
                }}（{{ digitalAccountVuex.accountType }}
              </p>
              <!-- 持仓保证金(USDT) -->
              <p class="lower-title">{{ $t('assets.openBail') }}</p>
              <p class="last-data">
                {{ digitalAccountVuex.openBail }}（{{
                  digitalAccountVuex.accountType
                }}）
              </p>
            </div>
            <div class="center">
              <p class="upper-title">
                <!-- 风险率 -->
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
              <p class="upper-data">{{ digitalAccountVuex.riskRate }}%</p>
              <!-- 冻结保证金(USDT) -->
              <p class="lower-title">{{ $t('newCommon.text55') }}</p>
              <p class="last-data">{{ digitalAccountVuex.disableAmount }}</p>
            </div>
            <div class="right">
              <!-- 划转 -->
              <el-button type="primary" class="btns" @click="showTransfer">{{
                $t('assets.transfer')
              }}</el-button>
            </div>
          </div>
        </div>
        <!-- <div class="bottom">
          <div class="tab-search">
            <ul class="tab">
              <li
                v-for="(item, index) in orderRecordTab"
                :key="index"
                :class="index === currentOrderRecord ? 'commonTab active' : 'commonTab'"
                @click="changeORIndex(index)"
              >{{item}}</li>
            </ul>
            <div class="search" v-show="currentOrderRecord === 2">
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
                ></el-option>
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
                ></el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="searchCoin">{{$t('assets.search')}}</el-button>
            </div>
          </div>
          <div class="show-container" v-loading="recordShow">
            <FadeComponent>
              <current-order
                v-if="currentOrderRecord === 0"
                :returnChange="hasReturn"
                :orderData="digitalAccountVuex.openList"
              ></current-order>
              <current-entrust
                :returnChange="hasReturn"
                v-if="currentOrderRecord === 1"
                :entrustData="digitalAccountVuex.entrustList"
              ></current-entrust>
              <history-order
                v-if="currentOrderRecord === 2"
                @changePage="changeHistoryPage"
                :historyList="historyList"
                :total="historyTotal"
                :pageSize="historyPageSize"
                :pageNo="pageNo"
              ></history-order>
              <transfer-record
                v-if="currentOrderRecord === 3"
                :transType="accountType"
                @changePage="changeTransferPage"
                :transferList="transferList"
                :total="transferTotal"
                :pageNo="pageNo"
                :pageSize="TransferPageSize"
              ></transfer-record>
            </FadeComponent>
          </div>
        </div> -->
      </div>
    </FadeComponent>
    <transfer-dialog
      :show-dialog="isShowTransfer"
      @closeTransfer="closeTransfer"
    ></transfer-dialog>
  </div>
</template>

<script>
import TransferDialog from './balanceCompontent/TransferDialog.vue'; //划转弹窗
import { assetsApi, legalPurchaseApi } from '@/server/axios.js';

export default {
  data() {
    return {
      accountType: 'digital',
      bundlingState: false, //绑定状态
      openSwitch: true, //跟单状态修改操作
      currentAssets: 0,
      currentOrderRecord: 0,
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
      digitalAccountVuex: {},
      digitalAccountVuexNull: null,
    };
  },
  beforeDestroy() {
    console.log('销毁了');
    clearInterval(this.digitalAccountVuexNull);
  },
  created() {
    this.digitalAccountVuexNull = setInterval(() => {
      legalPurchaseApi.ceshi().then((res) => {
        console.log('1--', res);
        this.digitalAccountVuex = res.data.followStockAccount;
      });
    }, 1000);
    console.log(this.$route.query);
    let desc = sessionStorage.getItem('riskRateDesc');
    this.riskRateDesc = desc;
    if (this.$route.query.tabHistory) {
      this.currentOrderRecord = 2;
      this.recordShow = true;
      this.getHistoryData();
    }
  },
  computed: {
    // 订单管理tab
    orderRecordTab() {
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
    // 方向tab
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
        '数字货币账户',
        '數字貨幣賬戶',
        'Digital Account'
      );
    },
  },
  methods: {
    changeORIndex(i) {
      if (i === this.currentOrderRecord) {
        return;
      } else {
        this.pageNo = 1;
        this.currentOrderRecord = i;
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
          this.recordShow = false;
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
          this.recordShow = false;
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
