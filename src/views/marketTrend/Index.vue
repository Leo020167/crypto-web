<template>
  <div class="marketTrend-container">
    <FadeComponent>
      <!--导航栏和搜索框-->
      <div class="marketTrend-header">
        <ul class="header-nav">
          <li
            :class="activeNav === 1 ? 'activeNav' : ''"
            @click="handleChangeNav(1)"
          >
            <font-awesome-icon icon="star" class="icon-star" />
            <span class="own-market">自选</span>
          </li>
          <li
            :class="activeNav === 3 ? 'activeNav' : ''"
            @click="handleChangeNav(3)"
          >
            数字货币
          </li>
          <li
            :class="activeNav === 2 ? 'activeNav' : ''"
            @click="handleChangeNav(2)"
          >
            股指期货
          </li>
        </ul>
        <div class="header-search">
          <el-input
            type="text"
            v-model="coinname"
            @keyup.enter.native="searchCoin"
            prefix-icon="el-icon-search"
            placeholder="搜索"
            size="small"
          ></el-input>
        </div>
      </div>
      <Optional
        @showDrawer="handleShowDrawer"
        v-if="activeNav === 1"
      ></Optional>
      <Digital @showDrawer="handleShowDrawer" v-if="activeNav === 3"></Digital>
      <Stock @showDrawer="handleShowDrawer" v-if="activeNav === 2"></Stock>
      <!--币种介绍弹框-->
    </FadeComponent>
    <IntroductionDrawer
      :showDrawer="ifShowDrawer"
      @toTrade="handleToTrade"
      :coinIntroduction="coinIntroduction"
      @onCloseDrawer="handleCloseDrawer"
    ></IntroductionDrawer>
  </div>
</template>

<script>
import { getCoinInfo, seachCoin } from '@/server/axios';
import Digital from './Digital';
import IntroductionDrawer from './IntroductionDrawer';
import Optional from './Optional';
import Stock from './Stock';
export default {
  data() {
    return {
      activeNav: 3, // 当前导航栏
      getMyCoinInterval: '',
      coinname: '',
      ifShowDrawer: false, // 是否显示币种介绍弹框
      coinIntroduction: {}, // 币种介绍
    };
  },
  created() {
    // 获取自选
    this.$store.dispatch('getMyOptionals');
  },
  methods: {
    handleChangeNav(navItem) {
      this.activeNav = navItem;
    },
    // 点击某一行，弹出介绍
    handleShowDrawer(symbol) {
      getCoinInfo(symbol).then((res) => {
        if (res.code == 200) {
          this.coinIntroduction = res.data.coin;
          this.ifShowDrawer = true;
        }
      });
    },
    // 关闭弹框
    handleCloseDrawer() {
      this.ifShowDrawer = false;
    },
    // 前往交易页面
    handleToTrade(coinIntroduction) {
      let path = '';
      this.$router.push({
        path: '/trading',
        query: {
          symbol: coinIntroduction.symbol,
        },
      });
    },
    // 搜索
    searchCoin() {
      if (this.coinname === '') {
        return;
      } else {
        seachCoin(this.coinname).then((res) => {
          if (res.code === '200' && res.data.searchResultList.length !== 0) {
            let list = res.data.searchResultList[0];
            if (list.marketType === 'digital') {
              this.$router.push({
                path: '/digitaltrading',
                query: {
                  symbol: list.symbolPair,
                },
              });
            } else {
              this.$router.push({
                path: '/futurestrading',
                query: {
                  symbol: list.symbolPair,
                },
              });
            }
          } else {
            this.$message.error('搜索失败，请确认所输入的币种是否存在');
          }
        });
      }
    },
  },
  components: {
    IntroductionDrawer,
    Digital,
    Stock,
    Optional,
  },
};
</script>

<style lang="scss" scope>
.marketTrend-container {
  width: 100%;
  min-height: 100%;
  .marketTrend-header {
    display: flex;
    justify-content: space-between;
    color: #596a7a;
    background-color: #f2f6fa;
    .header-nav {
      height: 44px;
      line-height: 44px;
      width: 100%;
      text-align: center;
      border-top: 2px solid transparent;
      .activeNav {
        background: #ffffff;
      }
      .icon-star {
        margin-right: 5px;
        color: $color_info;
      }
      li {
        float: left;
        padding: 0 24px;
        cursor: pointer;
      }
    }
    .header-search {
      display: flex;
      margin-top: 5px;
      margin-right: 20px;
      width: 200px;
      height: 32px;
      line-height: 32px;
      border: 1px solid $border;
      background: #ffffff;
      .icon-search {
        margin-top: 9px;
        color: #9ca9b5;
      }
    }
  }
}
</style>

<style lang="scss">
.marketTrend-container {
  .header-search {
    .el-input__inner {
      border: none !important;
      height: 29px !important;
      line-height: 29px !important;
    }
  }
  .el-table tbody {
    .cell {
      font-size: 14px !important;
    }
  }
}
.marketTrendingTable {
  max-width: 94%;
  margin: 0 auto;
  .icon-star {
    margin-right: 8px;
    cursor: pointer;
    color: #d3dfe6;
  }
  tbody {
    .cell {
      cursor: pointer;
    }
    .roudlyPrice {
      color: #9ca9b5;
      font-size: 12px;
    }
    .positiveNumber,
    .negativeNumber {
      color: #0da88b;
      background-color: rgba(13, 168, 139, 0.1);
      width: 90px;
      padding: 3px 14px;
      text-align: center;
      border-radius: 2px;
      font-weight: 400;
      display: inline-block;
    }
    .negativeNumber {
      color: #ef5656;
      background-color: rgba(239, 86, 86, 0.1);
    }
  }
}
</style>
