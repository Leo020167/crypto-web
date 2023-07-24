<template>
  <div class="total-asset-box">
    <div
      :class="
        userState.token
          ? 'trading-top-left-top'
          : 'trading-top-left-top changeHeight'
      "
    >
      <!--总资产-->
      <div class="total-assets" v-if="userState.token">
        <p class="title">{{ $t('trade.totalAssets.title') }}</p>
        <p class="assets">
          <span class="dolar-asset">{{ this.totalAsset.totalAssets }}</span>
          <span class="EUR-asset">{{ this.totalAsset.tolAssetsCny }}</span>
        </p>
      </div>
      <div class="header-search">
        <el-autocomplete
          type="text"
          :fetch-suggestions="searchCoin"
          prefix-icon="el-icon-search"
          v-model="searchCoinName"
          @select="handleSelectCoin"
          :placeholder="$t('trade.totalAssets.search')"
          size="small"
          :trigger-on-focus="false"
        >
          <template slot-scope="{ item }">
            <div class="suggestions-name">
              {{ item.value }}<span class="name">{{ item.name }}</span>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <!-- 新添加tab -->
      <ul class="tabList">
        <li
          v-for="(item, index) in marketTab"
          @click="handleChangeTabIndex(index)"
          :class="index === tabIndexNum ? 'tabList-item act' : 'tabList-item'"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
      <div class="table-list-box">
        <!-- v-loading="showTableLoading" -->
        <!-- 沪深、港股，排序按钮不要了，这两列加个分页，page -->
        <el-table
          ref="coinTable"
          :data="filteredQuotes"
          :height="height"
          @sort-change="handleSortChange"
          highlight-current-row
          @row-click="handleRowClick"
          :header-cell-class-name="handleSetHeaderCellName"
          :cell-class-name="handleSetCellName"
          :row-class-name="handleSetRowClass"
          :empty-text="''"
        >
          <el-table-column
            :label="$t('trade.totalAssets.label1')"
            prop="name"
            :sortable="sortTypes"
            width="70px"
          >
            <template slot-scope="scope">
              <div class="symbol-and-option">
                <img
                  :src="scope.row.image"
                  alt=""
                  class="h-3.5 w-3.5 object-contain"
                />
                <div class="symbol-content">
                  <p class="symbol">{{ scope.row.splitData }}</p>
                  <p class="name">{{ scope.row.name }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('trade.totalAssets.label2')"
            prop="price"
            :sortable="sortTypes"
            width="100px"
          >
            <template slot-scope="scope">
              <span class="label2-price">{{ scope.row.price }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('trade.totalAssets.label3')"
            prop="gains"
            :sortable="sortTypes"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.rate == 'noData'"></span>
              <span
                :class="[
                  parseFloat(scope.row.rate) > 0 ? 'color-red' : 'color-green',
                ]"
              >
                {{ parseFloat(scope.row.rate) > 0 ? '+' : '' }}
                {{ scope.row.rate }}%</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 不登录，隐藏 -->
    <div class="trading-top-left-bottom" v-if="userState.token">
      <!--股指期货账户-->
      <div class="futures-account-header">
        <span
          class="futures-account-header-title"
          v-if="contentIndex == 0"
        ></span>
        <span
          class="futures-account-header-title"
          v-if="contentIndex == 1"
        ></span>
        <span
          class="futures-account-header-title"
          v-if="contentIndex == 2"
        ></span>
        <!-- <span class="futures-account-header-title"
              v-if="contentIndex == 3"></span> -->
        <!-- 划转 -->
        <!-- <span class="futures-account-header-btn" @click="showTransferBox">{{
          $t('trade.totalAssets.transfer')
        }}</span> -->
      </div>
      <div class="futures-account-content">
        <div class="content-item">
          <span class="content-item1-span" v-if="contentIndex == 0">{{
            $t('newCommon.text70')
          }}</span>

          <el-popover
            placement="left-end"
            title=""
            width="260"
            trigger="hover"
            :content="riskRateDesc"
          >
            <span
              class="content-item1-span"
              style="cursor: pointer"
              slot="reference"
            >
              {{ $t('trade.totalAssets.dangerRate') }}
              <i class="el-icon-question"></i>
            </span>
          </el-popover>
        </div>
        <div class="content-item item2">
          <span class="content-item3-span">{{
            this.totalAsset && this.totalAsset.totalAssets
          }}</span>
          <span class="content-item4-span"
            >{{ accountInfo && accountInfo.riskRate }}%
          </span>
        </div>
        <div class="content-item item2-1">
          <span class="content-item21-span"
            >{{ this.totalAsset && this.totalAsset.tolAssetsCny }}
          </span>
        </div>
        <div class="content-item item3">
          <span class="content-item1-span">{{
            $t('trade.totalAssets.eableBail')
          }}</span>
          <span class="content-item2-span">{{
            $t('trade.totalAssets.unProfit')
          }}</span>
        </div>
        <div class="content-item item4">
          <span class="content-item5-span">{{
            accountInfo && accountInfo.eableBail
          }}</span>
          <span
            :class="
              accountInfo && accountInfo.profit > 0
                ? 'content-item5-span color-red'
                : accountInfo && accountInfo.profit < 0
                ? 'content-item5-span color-green'
                : 'content-item5-span'
            "
            >{{
              accountInfo && accountInfo.profit > 0
                ? `+${accountInfo.profit}`
                : accountInfo && accountInfo.profit
            }}</span
          >
        </div>
        <div class="content-item item3">
          <span class="content-item1-span">{{
            $t('trade.totalAssets.openBail')
          }}</span>
          <span class="content-item2-span">{{
            $t('trade.totalAssets.frozenBail')
          }}</span>
        </div>
        <div class="content-item item4">
          <span class="content-item5-span">{{
            accountInfo && accountInfo.openBail
          }}</span>
          <span class="content-item5-span">{{
            accountInfo && accountInfo.frozenBail
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OptionalIcon from '@/components/Optional/OptionalIcon.vue';
import { findMyCoin, legalPurchaseApi, seachCoin } from '@/server/axios';
import { ReflashRealSeconds } from '@/utils/Enums';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      searchCoinName: '', // 币种搜索框
      searchList: [],
      showTableLoading: true,
      getMyCoinInterval: '', // 定时器
      quotes: [], // 行情列表
      sortField: '', // 将要排序的列名
      sortType: 0, // 排序方式：0正常， 2升序，1降序
      riskRateDesc: '', //风险率
      coinType: ['spot'],
      sortTypes: 'digital',
      pageNo: 1,
      contentIndex: 0,
      accountInfo: {},
      ceshiTest: true,
    };
  },
  props: {
    userState: {
      type: Object,
      default: function () {
        return { token: '' };
      },
    },
    tabIndexNum: {
      type: Number,
      default: 0,
    },
    currentCoinType: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 396,
    },
  },
  watch: {
    searchCoinName(newValue) {
      if (!newValue) {
        this.symbol = undefined;
      }
    },
  },
  computed: {
    ...mapGetters({
      totalAsset: 'getTotalAsset', // 总资产
    }),
    marketTab() {
      return this.$t('newCommon.text37');
    },
    filteredQuotes() {
      if (this.symbol) {
        return this.quotes.filter((v) => v.symbol === this.symbol);
      }
      return this.quotes;
    },
  },
  created() {
    legalPurchaseApi.ceshi().then((res) => {
      this.accountInfo = res?.data?.spotAccount;
    });

    this.getMyCoinInterval = setInterval(() => {
      this.getMyCoin();
    }, ReflashRealSeconds);

    let desc = sessionStorage.getItem('riskRateDesc');
    this.riskRateDesc = desc;
  },
  methods: {
    // 分页
    changePage(i) {
      this.currentPage = i;
      this.getMyCoin();
    },
    // 获取列表
    getMyCoin() {
      findMyCoin({
        tab: 'spot',
        sortField: this.sortField,
        sortType: this.sortType,
        page: this.pageNo,
      }).then((res) => {
        if (res.code == 200) {
          this.showTableLoading = false;
          let data = res.data.quotes;
          let arr = [];
          for (let i = 0; i < data.length; i++) {
            let op = data[i].symbol;
            data[i].splitData = op;
            arr.push(data[i]);
          }
          if (this.tabIndexNum == 1 || this.tabIndexNum == 2) {
            arr.push({
              symbol: '',
              splitData: '',
              name: '',
              price: '下一页',
              rate: 'noData',
            });
          }
          this.quotes = arr;

          if (this.ceshiTest) {
            this.$emit(
              'returnFirstSymbol',
              res.data?.quotes?.[0]?.symbol,
              res.data?.quotes?.[0],
              this.ceshiTest
            );
            this.ceshiTest = false;
          }
          if (!this.currentCoinType) {
            this.$emit('returnFirstSymbol', res.data.quotes?.[0]?.symbol); //返回上级，获取相应的k线、历史记录、开仓记录等
          }
        }
      });
    },
    // 排序
    handleSortChange(column, prop, order) {
      if (column.column.order === 'ascending') {
        // 升序
        this.sortType = 2;
      } else if (column.column.order === 'descending') {
        this.sortType = 1; //降序
      } else {
        this.sortType = 0; //正常
      }
      // 最新价排序
      switch (column.column.label) {
        case '最新价':
          this.sortField = 'price';
          break;
        case '涨幅':
          this.sortField = 'rate';
          break;
        default:
          this.sortField = 'symbol';
          break;
      }
      this.showTableLoading = true;
      this.getMyCoin();
    },
    // 点击获取新的交易对数据
    handleRowClick(row) {
      if (row.symbol == '') {
        // 下一页操作 coinTable
        this.pageNo += 1;
        this.$nextTick(() => {
          this.$refs.coinTable.bodyWrapper.scrollTop = 0;
        });
      } else if (row.symbol === this.currentCoinType) {
        return;
      } else {
        this.$emit('getCurrentCointype', row.symbol, row.marketType, row); //返回上级，获取相应的k线、历史记录、开仓记录等
      }
    },
    handleSetRowClass({ row }) {
      if (row.symbol == this.currentCoinType) {
        return 'coinTableRowClass act_row';
      } else {
        return 'coinTableRowClass';
      }
    },
    handleSetHeaderCellName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 2) {
        return 'coinTableHeaderCellClass';
      }
    },
    handleSetCellName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 2) {
        return 'coinTableCellClass';
      }
    },
    beforeDestroy() {
      window.clearInterval(this.getMyCoinInterval);
    },
    // 点击划转操作
    showTransferBox() {
      this.$emit('showTransferBox');
    },
    // 搜索
    searchCoin(queryString, cb) {
      if (!this.searchCoinName) {
        return;
      }
      seachCoin(this.searchCoinName).then((res) => {
        if (res.code === '200' && res.data.searchResultList.length !== 0) {
          let list = res.data.searchResultList;
          this.searchList = list;
          let arr = [];
          for (let i = 0; i < list.length; i++) {
            let val = list[i].symbol;
            let symbol = list[i].symbolPair;
            let marketType = list[i].marketType;
            let name = list[i].name;
            arr.push({
              value: val,
              name: name,
              symbolPair: symbol,
              marketType: marketType,
            });
          }
          cb(arr);
        } else {
          // this.$message.error("搜索失败，请确认所输入的币种是否存在");
        }
      });
    },
    // 搜索框选择
    handleSelectCoin(item) {
      this.$emit('getCurrentCointype', item.symbolPair);
      this.symbol = item.symbolPair;
    },
    // 更换tab的序号
    handleChangeTabIndex(i) {
      // 获取相对应的资产资料
      this.contentIndex = i;
      if (i === this.tabIndexNum) {
        return;
      } else {
        this.pageNo = 1;
        let type = this.coinType[i]; //null是表示不修改当前的type
        this.sortTypes = false;
        this.$emit('changeTabIndex', i, type);
        if (i !== 0) {
          // 为了获取相对应的资产资料
          this.$store.dispatch('changeAssetTab', i);
        }
      }

      legalPurchaseApi.ceshi().then((res) => {
        this.accountInfo = res.data.spotAccount;
      });
    },
  },
  beforeDestroy() {
    window.clearInterval(this.getMyCoinInterval);
    this.getMyCoinInterval = null;
  },
  components: {
    OptionalIcon, // 自选的star
  },
};
</script>

<style lang="scss" scoped>
.total-asset-box {
  height: 100%;
}
.suggestions-name {
  font-size: 17px;
  .name {
    margin-left: 10px;
    font-size: 13px;
  }
}
.tabList {
  display: flex;
  margin-top: 15px;
  padding: 0 17px;
  .tabList-item {
    cursor: pointer;
    margin-right: 15px;
    font-size: 12px;
    line-height: 20px;
    &.act {
      border-bottom: 2px solid #6175ae;
    }
  }
}
.table-list-box {
  width: 100%;
}
.coinTable {
  .el-loading-mask {
    background-color: #171b2b !important;
  }
}
.io {
  display: inline-block;
  transform: scale(0.7);
  margin-left: -4px;
  color: #b0b8db42;
  font-size: 12px;
}
</style>
