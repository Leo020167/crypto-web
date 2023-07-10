<template>
  <FadeComponent>
    <div class="trading-container" v-document-title :data-title="documentTitle">
      <div class="trading-top" :style="{ height: topHeight + 'px' }">
        <div class="trading-top-left">
          <!--总资产-->
          <total-assets
            :height="leftTop"
            :currentCoinType="symbol"
            :tabIndexNum="assetTabIndex"
            :accountInfo="accountInfo"
            :userState="CurrentUserInfos"
            @returnFirstSymbol="handleReturnFirstSymbol"
            @changeTabIndex="changeAssetTabIndex"
            @getCurrentCointype="getCurrentCoinType"
            @showTransferBox="showTransfer"
          ></total-assets>
        </div>
        <div
          :class="
            widthChangeClass === 'max'
              ? 'trading-top-middle'
              : 'trading-top-middle centerMax'
          "
        >
          <div class="symbol-text">
            <div class="symbol-name">
              <p class="name">{{ symbolData.name }}</p>
              <p class="symbol">{{ symbolData.symbol }}</p>
            </div>
            <div class="now-price">
              <p
                :class="
                  symbolData.rate > 0
                    ? 'usdt-price color-green'
                    : symbolData.rate < 0
                    ? 'usdt-price color-red'
                    : 'usdt-price'
                "
              >
                {{ symbolData.last }}
                <span class="currentCoinType">{{ symbolData.currency }}</span>
              </p>
              <p class="cny-price">
                <span
                  :class="
                    symbolData.amt < 0
                      ? 'symbol-state color-green'
                      : symbolData.amt > 0
                      ? 'symbol-state color-red'
                      : 'symbol-state'
                  "
                  >{{
                    symbolData.amt > 0 ? `+${symbolData.amt}` : symbolData.amt
                  }}</span
                >
                <span
                  style="margin-left: 10px"
                  :class="
                    symbolData.rate < 0
                      ? 'symbol-state color-green'
                      : symbolData.rate > 0
                      ? 'symbol-state color-red'
                      : 'symbol-state'
                  "
                  >{{
                    symbolData.rate > 0
                      ? `+${symbolData.rate}`
                      : symbolData.rate
                  }}%</span
                >
                <span
                  class="openMarketStr"
                  v-if="symbolData && symbolData.openMarketStr"
                  >{{ symbolData.openMarketStr }}</span
                >
              </p>
            </div>
            <div class="symbol-other">
              <p class="other-name">{{ $t('trade.high') }}</p>
              <p class="symbol-state">{{ symbolData.high }}</p>
            </div>
            <div class="symbol-other">
              <p class="other-name">{{ $t('trade.low') }}</p>
              <p class="symbol-state">{{ symbolData.low }}</p>
            </div>
            <div class="symbol-other">
              <p class="other-name">{{ $t('trade.amount') }}(m)</p>
              <p class="symbol-state">{{ symbolData.amount }}</p>
            </div>
          </div>

          <div class="trading-top-middle-top">
            {{ symbol }}
            <!--K线组件-->
            <kline
              :symbol="symbol"
              :height="centerTop"
              @getLineType="getKlineType"
            ></kline>
          </div>

          <div class="trading-top-middle-bottom">
            <!--交易组件-->
            <!-- {{ symbolType }} -->
            <trade-spot
              v-if="symbolType === 'spot'"
              :buyData="buySetdat"
              :sellData="sellSetDat"
              :marketType="symbolType"
              :compots="compots"
              :coinType="symbol"
            ></trade-spot>
            <trade
              v-else
              :buyData="buySetdat"
              :sellData="sellSetDat"
              :marketType="symbolType"
              :coinType="symbol"
            ></trade>
          </div>
        </div>
        <div
          :class="
            widthChangeClass === 'max'
              ? 'trading-top-right'
              : 'trading-top-right rightMin'
          "
        >
          <div class="max-trading" v-if="widthChangeClass === 'max'">
            <dish
              class="dishClass"
              :height="rightDishHeight"
              :dishData="dishData"
              @buyDish="handleBuySet"
              @sellDish="handleSellSet"
            ></dish>
            <dish-in-time
              class="intimeClass"
              :style="{ height: topHeight - 40 + 'px' }"
              :timeDish="timeDish"
            ></dish-in-time>
          </div>
          <div class="min-trading" v-else>
            <p class="dish-min-tab flex items-center">
              <span
                :class="dishTabIndex === 0 ? 'dish-tab act' : 'dish-tab'"
                @click="changDishTab(0)"
                >{{ $t('trade.dishTab1') }}</span
              >
              <span
                :class="dishTabIndex === 1 ? 'dish-tab act' : 'dish-tab'"
                @click="changDishTab(1)"
                >{{ $t('trade.dishTab2') }}</span
              >
            </p>
            <div class="dish-boxs">
              <dish
                v-show="dishTabIndex === 0"
                :height="rightDishHeight"
                class="min-dishClass"
                :showDishTitle="showDishTitle"
                :dishData="dishData"
                @buyDish="handleBuySet"
                @sellDish="handleSellSet"
              ></dish>
              <dish-in-time
                v-show="dishTabIndex === 1"
                class="min-intimeClass"
                :style="{ height: rightHeight + 'px' }"
                :showIntimeTitle="showDishTitle"
                :timeDish="timeDish"
              ></dish-in-time>
            </div>
          </div>
        </div>
      </div>
      <div class="trading-bottom">
        <div class="current-stocks">
          <!--当前开仓/当前委托-->
          <ul class="ul-tab">
            <li
              v-for="(item, index) in currentTab"
              :key="index"
              @click="changeCurrentTab(index)"
              :class="index === currentTabIndex ? 'tab-title act' : 'tab-title'"
            >
              {{ item }}
            </li>
          </ul>

          <CurrentOrder
            class="orderSize"
            v-if="symbolType === 'stock' || symbolType === 'digital'"
            :current-index="dishTabIndex"
            :account-type="symbolType"
            :returnChange="getOrderChange"
            @orderChange="cancelOrder"
          />

          <CurrentOrder1
            class="orderSize"
            v-if="symbolType === 'spot'"
            :returnChange="getOrderChange"
            @orderChange="cancelOrder"
            :currentIndex="dishTabIndex"
            :orderData="
              dishTabIndex == 0
                ? newAccountInfo && newAccountInfo.openList
                : delegatedData
            "
          />
        </div>
        <div class="history-stocks">
          <!--历史开仓-->
          <div class="title">
            {{ $t('trade.histroryTitle') }}
          </div>
          <template v-if="symbolType == 'spot'">
            <SpotHistoryOrder :history-list="historyList" />
          </template>
          <template v-else>
            <HistoryOrder :historyList="historyList" />
          </template>
        </div>
      </div>
    </div>
    <transfer-dialog
      :show-dialog="isShowTransfer"
      @closeTransfer="closeTransfer"
    ></transfer-dialog>
  </FadeComponent>
</template>

<script>
// 资产组件
import TotalAssets from './components/TotalAssets.vue';
// k线图组件
import Kline from './components/Kline.vue';
// 盘口组件
import Dish from './components/Dish.vue';
import DishInTime from './components/DishInTime.vue';
// 交易组件
import Trade from './components/Trade.vue';
// 就一版: 交易组件
import TradeSpot from './components/TradeSpot.vue';
// 当前开仓/历史委托
import CurrentOrder from '../assets/compontent/CurrentOrder.vue';
import CurrentOrder1 from '../assets/compontent/CurrentOrder1.vue';
// 历史开仓
import { assetsApi, getDish, legalPurchaseApi } from '@/server/axios.js';
import { ReflashRealSeconds } from '@/utils/Enums';
import { mapGetters } from 'vuex';
import TransferDialog from '../assets/balanceCompontent/TransferDialog.vue'; //划转弹窗
import HistoryOrder from '../assets/compontent/HistoryOrder.vue';
import SpotHistoryOrder from '../assets/compontent/SpotHistoryOrder.vue';
export default {
  components: {
    Kline,
    Dish,
    DishInTime,
    TotalAssets,
    Trade,
    CurrentOrder,
    HistoryOrder,
    SpotHistoryOrder,
    TransferDialog,
    TradeSpot,
    CurrentOrder1,
  },
  data() {
    return {
      // 基础类
      currentTab: this.$t('trade.currentTab'),
      currentTabIndex: 0,
      isShowTransfer: false, //划转弹窗
      // 数据类
      symbol: '', //默认BTC
      klineType: this.$t('newCommon.text53'), //默认一分钟
      buySetdat: {},
      sellSetDat: {},
      historyList: [],
      delegatedData: [],
      symbolData: {
        symbol: '--/--',
        last: '0.0000',
        lastCny: '≈' + this.$t('newCommon.text59') + '0.00',
        rate: '0.00',
        high: '0.00',
        low: '0.00',
        amount: '0',
      },
      dishData: { buys: [], sells: [], symbol: 'BTC' }, //盘口
      timeDish: [], //实时
      intervalGetDishData: null, // 定时器获取盘口数据
      getOrderChange: true,
      getLastPrice: false,
      // 屏幕宽度class
      widthChangeClass: 'min', //min===一列, max===两列
      showDishTitle: false,
      dishTabIndex: 0,
      assetTabIndex: 0,
      symbolType: 'spot',
      documentTitle: '',
      // 动态控制top的交易比例
      topHeight: 0,
      leftTop: 396,
      centerTop: 396,
      rightHeight: 0,
      rightDishHeight: 0,
      newAccountInfo: {},
      digitalAccountVuexNull: null,
      ceshi1Flag: true,
      ceshiIndex: 1,
      compots: '',
    };
  },
  created() {
    const query_param = this.$route.query;
    this.symbol = query_param.symbol ? query_param.symbol : '';
    if (query_param && query_param.type) {
      this.assetTabIndex =
        query_param.type == 'digital' ? 1 : query_param.type == 'stock' ? 2 : 0;
    }
    if (query_param && query_param.lang) {
      let lang =
        query_param.lang == 'en'
          ? 'en'
          : query_param.lang == 'tw'
          ? 'zh_TW'
          : 'zh_CN';
      if (lang != this.$i18n.locale) {
        let obj = JSON.parse(JSON.stringify(this.$router.currentRoute.query));
        delete obj.lang;
        this.$router.push({
          query: obj,
        });
        this.handleChangeLang(lang);
      }
    }
    // 页面比例调整
    let windowWidth = document.body.clientWidth;
    this.widthChangeClass = windowWidth > 1540 ? 'max' : 'min';
    let getHeight = document.body.clientHeight;
    let windowHeight = windowWidth > 1540 ? getHeight * 0.88 : getHeight * 1.2;
    this.topHeight = windowHeight;
    this.leftTop = this.CurrentUserInfos.token
      ? windowHeight - 460
      : windowHeight - 115;
    this.centerTop = windowHeight - 405.4;
    this.rightHeight = windowHeight - 67.6;
    this.rightDishHeight =
      windowWidth > 1540
        ? (windowHeight - 126.4) / 2
        : (windowHeight - 131.6) / 2;
    // this.changDishTab(0, true)
    this.getList();
  },
  mounted() {
    // 给默认的symbol、klineType获取盘口数据（是否会跟k线的数据发生断开现象？）

    this.intervalGetDishData = setInterval(() => {
      this.getRecords();
      this.getDishData();
    }, ReflashRealSeconds);
  },

  computed: {
    ...mapGetters({
      accountInfo: 'getDigitalAndStockInfo',
      CurrentUserInfos: 'getCurrentUserInfos',
    }),
  },
  methods: {
    getList() {
      legalPurchaseApi.ceshi().then((res) => {
        this.newAccountInfo = res.data.digitalAccount;
      });
    },
    // 切换语言
    handleChangeLang(command) {
      localStorage.setItem('lang', command);
      location.reload();
    },
    // 当前开仓和当前委托tab切换
    changeCurrentTab(i) {
      if (i === this.currentTabIndex) {
        return;
      } else {
        this.currentTabIndex = i;
        this.kaicangIndex = i;

        // 获取数据,传递数据就行了
        this.changDishTab(i);
      }
    },
    // 从（资产组件）获取当前交易对，以此获取其他信息
    getCurrentCoinType(type, marketType, row) {
      this.compots = row.coinType;
      if (type === this.symbol) {
        return;
      }
      this.symbol = type;
      // this.symbolType = marketType
      // 获取开仓和历史记录/
      this.getRecords();
    },
    // 判断当前链接是否有symbol传入，没有则默认列表第一个symbol
    handleReturnFirstSymbol(symbol, row, flag) {
      if (flag) {
        this.compots = row.coinType;
      }
      if (!this.symbol) {
        this.symbol = symbol;
      }
    },
    showTransfer() {
      this.isShowTransfer = true;
    },
    closeTransfer() {
      this.isShowTransfer = false;
    },
    // 从（k线组件）中获取相对应的klineType,以此更新盘口数据，以及获得最新的一根k线数据
    getKlineType(type) {
      if (type === this.klineType) {
        return;
      }
      this.klineType = type;
      clearInterval(this.intervalGetDishData);
      this.intervalGetDishData = setInterval(() => {
        this.getDishData();
      }, ReflashRealSeconds);
    },
    // 从（盘口组件）中点击中获取买卖的价格
    handleBuySet(data) {
      this.buySetdat = data;
    },
    handleSellSet(data) {
      this.sellSetDat = data;
    },
    // 撤单后，更新记录
    cancelOrder() {
      this.getRecords();
    },
    // 全部历史记录
    goHistory() {
      this.$router.push({ path: '/assets/digital', query: { tabHistory: 1 } });
    },
    // 改变右侧的tab
    changDishTab(i, flag) {
      if (flag) {
        this.digitalAccountVuexNull = setInterval(() => {
          legalPurchaseApi.ceshi().then((res) => {
            this.newAccountInfo = res.data.fxAccount;
          });
        }, 1000);
        return;
      }
      if (this.dishTabIndex == i) {
        return;
      } else {
        (this.delegatedData = ''),
          assetsApi
            .getCorrespondRecords(
              '',
              this.symbolType,
              1,
              '',
              '',
              this.symbolType == 'spot' ? '2' : '0',
              '1'
            )
            .then((res) => {
              if (res.code == '200') {
                this.delegatedData = res.data.data;
              }
            });
        this.dishTabIndex = i;
      }
    },
    // 改变左侧资产的tab
    changeAssetTabIndex(i, type) {
      this.assetTabIndex = i;
      this.symbolType = type == 'null' ? this.symbolType : type;

      this.getRecords();
      this.ceshiIndex = i;
      clearInterval(this.digitalAccountVuexNull);
      this.digitalAccountVuexNull = setInterval(() => {
        legalPurchaseApi.ceshi().then((res) => {
          if (i == 0) {
            this.newAccountInfo = res.data.stockAccount;
          } else if (i == 1) {
            this.newAccountInfo = res.data.digitalAccount;
          } else if (i == 2) {
            this.newAccountInfo = res.data.spotAccount;
          } else {
            this.newAccountInfo = {};
          }
        });
      }, 1000);
    },
    // 请求类
    // 获取历史记录  symbol, accountType, pageNo, buySell
    getRecords() {
      if (!this.CurrentUserInfos.token) {
        return;
      }
      assetsApi
        .getCorrespondRecordsWithPageSize(
          '',
          this.symbolType,
          1,
          '',
          this.symbolType == 'spot' ? '1' : '',
          this.symbolType == 'spot' ? '2' : '0',
          this.symbolType == 'spot' ? '1' : '-1',
          1000
        )
        .then((res) => {
          if (res.code == '200') {
            this.historyList = res.data.data;
          }
        });
    },
    // 获取盘口类数据 symbol, depth, klineType
    getDishData() {
      getDish(this.symbol, '30', this.klineType).then((res) => {
        if (res.code == 200) {
          let data = res.data[this.symbol];
          this.symbolData = data;
          this.documentTitle = this.getTitleValueByLang(
            `${data.last} ${data.symbol}`,
            `${data.last} ${data.symbol}`,
            `${data.last} ${data.symbol}`
          );
          // 封装盘口， 卖为倒序
          let buyData = data.buys;
          let sellData = data.sells;
          this.timeDish = data.dealList;
          if (!this.getLastPrice) {
            this.getLastPrice = true;
            this.buySetdat = { price: data.last };
            this.sellSetDat = { price: data.last };
          }
          this.dishData = {
            buys: buyData,
            sells: sellData,
            last: data.last,
            lastCny: data.lastCny,
            symbol: this.symbol,
            rate: data.rate,
          };
        }
      });
    },
  },
  beforeDestroy() {
    // 清除定时器
    window.clearInterval(this.intervalGetDishData);
    this.intervalGetDishData = null;
  },
};
</script>

<style lang="scss" scope>
@import './index.scss';
</style>

<style lang="scss">
@import './index-table.scss';
</style>
