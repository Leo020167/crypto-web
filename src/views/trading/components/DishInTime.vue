<template>
  <div class="dish-in-time">
    <h5 class="intime-title" v-show="showIntimeTitle">
      {{ $t('trade.dishInTime.title') }}
    </h5>
    <ul class="intime-list">
      <li class="list-item">
        <span class="intime-left">{{ $t('trade.dishInTime.price') }}</span>
        <span class="intime-center">{{ $t('trade.dishInTime.amount') }}</span>
        <span class="intime-right">{{ $t('trade.dishInTime.time') }}</span>
      </li>
      <li class="list-item" v-for="(item, index) in timeDish" :key="index">
        <span
          :class="
            item.buySell === 'buy'
              ? 'intime-left color-green'
              : 'intime-left color-red'
          "
          >{{ item.price }}</span
        >
        <span class="intime-center">{{ item.amount }}</span>
        <span class="intime-right">{{ transTime(item.time) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { transforTime } from '@/utils/time.js';
export default {
  props: {
    showIntimeTitle: {
      type: Boolean,
      default: true,
    },
    timeDish: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    transTime(time) {
      return transforTime.defaultDetail(time);
    },
  },
};
</script>

<style lang="scss" scoped>
.dish-in-time {
  .intime-title {
    font-size: 15px;
    padding-bottom: 8px;
  }
  .intime-list {
    .list-item {
      display: flex;
      color: #b0b8db;
      font-size: 13px;
      line-height: 24px;
      .intime-left {
        flex: 1;
      }
      .intime-center {
        flex: 1;
        text-align: center;
      }
      .intime-right {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
