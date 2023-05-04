<!--盘口-->
<template>
  <div class="dish-container">
    <h5 class="dish-title" v-show="showDishTitle">
      {{ $t('trade.dish.title') }}
    </h5>
    <p class="titles">
      <span class="price">{{ $t('trade.dish.price') }}</span>
      <span class="amount">{{ $t('trade.dish.amount') }}</span>
      <span class="amount-all">{{ $t('trade.dish.total') }}</span>
    </p>
    <div class="sell-positionBox" :style="{ height: height + 'px' }">
      <ul class="sell-box">
        <li
          v-for="(item, index) in dishData.sells"
          :key="index"
          class="table-list"
          @click="handleDishSellRowClick(item)"
        >
          <span class="price color-red">{{ item.price }}</span>
          <span class="amount">{{ item.amount }}</span>
          <span class="amount-all">{{ item.total }}</span>
          <span class="long" :style="{ width: item.depthRate + 'px' }"></span>
        </li>
      </ul>
    </div>
    <div class="current-price">
      <span
        :class="
          dishData.rate > 0 ? 'last-price color-green' : 'last-price color-red'
        "
        >{{ dishData.last }}</span
      >
      <!-- <span class="cny-price">{{dishData.lastCny}}</span> -->
    </div>
    <ul class="buy-box" :style="{ height: height + 'px' }">
      <li
        v-for="(item, index) in dishData.buys"
        :key="index"
        class="table-list"
        @click="handleDishBuyRowClick(item)"
      >
        <span class="long" :style="{ width: item.depthRate + 'px' }"></span>
        <span class="price color-green">{{ item.price }}</span>
        <span class="amount">{{ item.amount }}</span>
        <span class="amount-all">{{ item.total }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    dishData: {
      type: Object,
      default: function () {
        return { buys: [], sells: [], symbol: 'BTC' };
      },
    },
    showDishTitle: {
      type: Boolean,
      default: true,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleDishSellRowClick(data) {
      this.$emit('sellDish', data);
    },
    // 买的操作
    handleDishBuyRowClick(data) {
      this.$emit('buyDish', data);
    },
  },
};
</script>

<style lang="scss" scope>
.dish-container {
  .dish-title {
    font-size: 15px;
    padding-bottom: 8px;
  }
  .titles {
    display: flex;
    color: #b0b8db;
    font-size: 13px;
    line-height: 24px;
    .price {
      flex: 1;
    }
    .amount {
      flex: 1;
      text-align: center;
    }
    .amount-all {
      flex: 1;
      text-align: right;
      padding-right: 10px;
    }
  }
  .sell-positionBox {
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  .sell-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .table-list {
      display: flex;
      color: #b0b8db;
      font-size: 13px;
      line-height: 24px;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: rgba(250, 250, 250, 0.034);
      }
      .long {
        height: 24px;
        position: absolute;
        right: 0;
        background-color: rgba(0, 173, 136, 0.2);
      }
      .price {
        flex: 1;
      }
      .amount {
        flex: 1;
        text-align: center;
      }
      .amount-all {
        flex: 1;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
  .current-price {
    height: 40px;
    line-height: 40px;
    font-size: 17px;
    .cny-price {
      display: inline-block;
      margin-left: 5px;
      color: #6d707e;
      font-size: 15px;
    }
  }

  .buy-box {
    overflow: hidden;
    .table-list {
      display: flex;
      color: #b0b8db;
      font-size: 13px;
      line-height: 24px;
      position: relative;
      cursor: pointer;
      &:hover {
        background-color: rgba(250, 250, 250, 0.034);
      }
      .long {
        height: 24px;
        position: absolute;
        right: 0;
        background-color: rgba(226, 33, 78, 0.2);
      }
      .price {
        flex: 1;
      }
      .amount {
        padding-right: 10px;
        text-align: center;
      }
      .amount-all {
        flex: 1;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}
</style>
