<template>
  <div class="follow-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="main-container">
        <div class="top">
          <p class="top-title">
            <img src="../../assets/logo.png" class="top-img" /><span
              class="title-name"
              >{{ $t('header.subscribe_account') }}</span
            >
          </p>
          <div class="main-operation">
            <div class="mentor-tab">
              <div class="name">
                {{ $t('assets.teacher') }}：
                <p
                  class="dpf"
                  @click="goPersonalHome(followUserData.dvUid)"
                  v-if="followUserData.dvUid !== '0'"
                >
                  <img :src="followUserData.dvHeadUrl" class="avatar" />
                  {{ followUserData.dvUserName }} ID: {{ followUserData.dvUid }}
                </p>
                <p class="dpf disbind" v-else>{{ $t('assets.nobunding') }}~</p>
              </div>
              <p class="opration-unbundling">
                <el-button
                  size="small"
                  @click="changeBindState(followUserData.dvUid)"
                  plain
                  >{{
                    followUserData.dvUid !== '0'
                      ? `${$t('assets.untie')}`
                      : `${$t('assets.bind')}`
                  }}</el-button
                >
              </p>
            </div>
            <div class="openFollow-tab">
              <p class="open-state">
                {{ $t('assets.openFollow') }}:
                {{
                  followUserData.isOpen == 1
                    ? `${$t('assets.isopen')}`
                    : `${$t('assets.noopen')}`
                }}
              </p>
              <p class="opration-switch">
                <el-button
                  size="small"
                  @click="openFollowSwitch(followUserData.isOpen)"
                  plain
                  >{{
                    followUserData.isOpen == '0'
                      ? `${$t('assets.open')}`
                      : `${$t('assets.close')}`
                  }}</el-button
                >
              </p>
            </div>
            <div class="openFollow-tab">
              <p class="open-state">
                {{ $t('assets.single_multiple') }}: {{ followUserData.multiple
                }}{{ $t('assets.times') }}
              </p>
              <p class="opration-switch">
                <el-button size="small" @click="showTimes" plain>{{
                  $t('assets.customize')
                }}</el-button>
              </p>
            </div>
          </div>
          <ul class="tab">
            <li
              v-for="(item, index) in assetsTab"
              :key="index"
              :class="
                index === currentAssets ? 'commonTab active' : 'commonTab'
              "
              @click="changeFollowType(index)"
            >
              {{ item }}
            </li>
          </ul>
          <div class="assets-data">
            <div class="left">
              <p class="upper-title">
                {{ $t('assets.total_assets') }}（{{ followData.accountType }}）
              </p>
              <p class="upper-data">
                {{ followData.assets
                }}<span class="transfor-usdt">{{ followData.assetsCny }}</span>
              </p>
              <p class="lower-title">{{ $t('assets.eableBail') }}</p>
              <p class="last-data">
                {{ followData.eableBail }}（{{ followData.accountType }}）
              </p>
            </div>
            <div class="center">
              <p class="upper-title">{{ $t('assets.unprofit') }}</p>
              <p
                :class="
                  followData.profit > 0
                    ? 'upper-data color-red'
                    : followData.profit < 0
                    ? 'upper-data color-green'
                    : 'upper-data'
                "
              >
                {{
                  followData.profit > 0
                    ? `+${followData.profit}`
                    : followData.profit
                }}（{{ followData.accountType }}）
              </p>
              <p class="lower-title">{{ $t('assets.openBail') }}</p>
              <p class="last-data">
                {{ followData.openBail }}（{{
                  digitalAccountVuex.accountType
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
              <p class="upper-data">{{ followData.riskRate }}%</p>
              <p class="lower-title">{{ $t('assets.frozenBail') }}</p>
              <p class="last-data">{{ followData.frozenBail }}</p>
            </div>
            <div class="right">
              <el-button type="primary" class="btns" @click="showTransfer">{{
                $t('assets.transfer')
              }}</el-button>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="tab-search">
            <ul class="tab">
              <li
                v-for="(item, index) in orderRecordTab"
                :key="index"
                :class="
                  index === currentOrderRecord
                    ? 'commonTab active'
                    : 'commonTab'
                "
                @click="changeORIndex(index)"
              >
                {{ item }}
              </li>
            </ul>
            <div class="search" v-show="currentOrderRecord === 2">
              <el-input
                v-model="coinType"
                :placeholder="$t('assets.coinType')"
                size="mini"
                class="coin-type"
              ></el-input>
              <el-select
                v-model="directionValue"
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
                v-if="currentOrderRecord === 0"
                :returnChange="hasReturn"
                :orderData="followData.openList"
              ></current-order>
              <current-entrust
                v-if="currentOrderRecord === 1"
                :returnChange="hasReturn"
                :entrustData="followData.entrustList"
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
        </div>
      </div>
    </FadeComponent>
    <transfer-dialog
      :show-dialog="isShowTransfer"
      @closeTransfer="closeTransfer"
    ></transfer-dialog>
    <follow-time
      :show-dialog="isShowTimes"
      @closeDialog="closeTimes"
    ></follow-time>
  </div>
</template>

<script>
import FollowTime from '@/components/followTimes.vue';
import { assetsApi } from '@/server/axios.js';
import { mapGetters } from 'vuex';
import TransferDialog from './balanceCompontent/TransferDialog.vue'; //划转弹窗
import CurrentEntrust from './compontent/CurrentEntrust.vue';
import CurrentOrder from './compontent/CurrentOrder.vue';
import HistoryOrder from './compontent/HistoryOrder.vue';
import TransferRecord from './compontent/TransferRecord.vue'; //划转记录
export default {
  data() {
    return {
      accountType: 'followdigital', //followstock
      currentAssets: 0,
      currentOrderRecord: 0,
      coinType: '', //搜索币种
      directionLabel: '',
      directionValue: '',
      stateLabel: '',
      stateValue: '',
      pageNo: 1,
      recordShow: false,
      // 数据
      historyList: [], //历史记录
      historyTotal: 0,
      historyPageSize: 0,
      transferList: [], //划转记录
      transferTotal: 0,
      TransferPageSize: 0,
      // 弹窗
      isShowTransfer: false,
      isShowTimes: false,
      hasReturn: false,
      riskRateDesc: '', //风险率
    };
  },
  created() {
    let desc = sessionStorage.getItem('riskRateDesc');
    this.riskRateDesc = desc;
  },
  computed: {
    ...mapGetters({
      followUserData: 'getFollowUserInfo',
      followData: 'getFollowAccountInfos',
    }),
    // 头部tab
    assetsTab() {
      if (this.$i18n.locale === 'zh_CN') {
        return ['数字货币', '股指期货'];
      } else if (this.$i18n.locale === 'zh_TW') {
        return ['數字貨幣', '股指期貨'];
      } else {
        return ['Digital Currency', 'Stock Index Futures'];
      }
    },
    // 订单管理tab
    orderRecordTab() {
      if (this.$i18n.locale === 'zh_CN') {
        return ['当前开仓', '当前委托', '历史订单', '划转记录'];
      } else if (this.$i18n.locale === 'zh_TW') {
        return ['當前開倉', '當前委托', '歷史訂單', '劃轉記錄'];
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
      return this.getTitleValueByLang('跟单账户', '跟單賬戶', 'Follow Account');
    },
  },
  methods: {
    // 上半部分的tab
    changeFollowType(i) {
      if (i === this.currentAssets) {
        return;
      } else {
        this.currentAssets = i;
        // 修改同时更换
        if (i === 0) {
          this.accountType = 'followdigital';
          this.$store.dispatch('changeFollowTab', 0); // vuex备存
          if (this.currentOrderRecord === 2) {
            this.pageNo = 1;
            this.getHistoryData();
          } else if (this.currentOrderRecord === 3) {
            this.pageNo = 1;
            this.getTransferData();
          }
        } else {
          this.accountType = 'followstock';
          this.$store.dispatch('changeFollowTab', 1); // vuex备存
          if (this.currentOrderRecord === 2) {
            this.pageNo = 1;
            this.getHistoryData();
          } else if (this.currentOrderRecord === 3) {
            this.pageNo = 1;
            this.getTransferData();
          }
        }
      }
    },
    // 下半部分的tab
    changeORIndex(i) {
      if (i === this.currentOrderRecord) {
        return;
      } else {
        this.currentOrderRecord = i;
        this.pageNo = 1;
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
    // 开启跟单授权
    openFollowSwitch(val) {
      let state = val == 0 ? 1 : 0;
      assetsApi.openFollow(state).then((res) => {
        if (res.code === '200') {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 解绑与去绑定
    changeBindState(id) {
      if (id != '0') {
        assetsApi.unBind(id).then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$router.push('/peopleList');
      }
    },
    // 跟单倍数弹窗
    showTimes() {
      this.isShowTimes = true;
    },
    closeTimes() {
      this.isShowTimes = false;
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
    // 去跟单老师的空间
    goPersonalHome(id) {
      this.$router.push({ path: '/personalHome', query: { userId: id } });
    },
  },
  components: {
    CurrentOrder,
    CurrentEntrust,
    HistoryOrder,
    TransferRecord,
    TransferDialog,
    FollowTime,
  },
};
</script>

<style lang="scss" scope>
.follow-container {
  width: 100%;
  min-height: auto;
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
      .main-operation {
        margin-top: 10px;
        background-color: #ebebed;
        padding: 10px 20px;
        font-size: 14px;
        margin-bottom: 25px;
        .mentor-tab {
          display: flex;
          line-height: 30px;
          .name {
            flex: 1;
            .dpf {
              display: inline-block;
              cursor: pointer;
              &.disbind {
                color: slategray;
              }
            }
            .avatar {
              display: inline-block;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              margin: 0 5px;
              vertical-align: middle;
            }
          }
          .opration-unbundling {
            flex: 1;
          }
        }
        .openFollow-tab {
          display: flex;
          margin-top: 15px;
          line-height: 30px;
          .open-state,
          .opration-switch {
            flex: 1;
          }
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
