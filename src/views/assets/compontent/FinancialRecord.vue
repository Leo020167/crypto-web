<template>
  <div class="current-order">
    <!-- No data -->
    <NullRecord v-if="orderData.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <ul class="table-list" v-else>
      <li class="table-list-item des-title">
        <span class="item-des">{{ $t('assets.time') }}</span>
        <span class="item-des">{{ $t('assets.type') }}</span>
        <span class="item-des">{{ $t('orderDetail.amount') }}(Token)</span>
        <span class="item-des">{{ $t('assets.status') }}</span>
      </li>
      <li
        class="table-list-item des"
        v-for="(item, index) in orderData"
        :key="index"
      >
        <div class="table-show">
          <div class="item-des">
            <p class="scope-ptext">{{ transTime(item.createTime) }}</p>
            <p>{{ transTimes(item.createTime) }}</p>
          </div>
          <div class="item-des normal">
            {{ item.remark }}
          </div>
          <div class="item-des normal">
            {{ item.amount }}
          </div>
          <div class="item-des normal">已成功</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { transforTime } from '@/utils/time.js';
export default {
  name: 'CurrentOrder',
  props: {
    orderData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      orderId: null,
      commonData: {},
    };
  },
  methods: {
    // 普通平仓
    columnCommonClick(data) {
      this.commonData = data;
      this.commonVisible = true;
    },
    enterCommon() {
      if (this.commonCloseNum > this.commonData.openHand) {
        // 请勿输入比${this.commonData.openHand}大的数值
        this.$message.error(
          `${this.$t('assets.message1')}${this.commonData.openHand}${this.$t(
            'assets.message2'
          )}`
        );
        return;
      }
      this.$confirm(
        this.$t('assets.isClosePosition') +
          `${this.commonCloseNum}` +
          this.$t(`assets.hand`),
        this.$t('assets.confirm_title'),
        {
          confirmButtonText: this.$t('assets.sure'),
          cancelButtonText: this.$t('assets.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.orderId = this.commonData.orderId;
          this.closeHand = Number(this.commonCloseNum);
          this.enterClose();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('assets.already_cancel'),
          });
        });
      this.commonVisible = false;
    },
    // 快捷平仓操作
    columnFastClick(data) {
      this.$confirm(
        this.$t('assets.confirm_title'),
        this.$t('assets.confirm_title'),
        {
          confirmButtonText: this.$t('assets.sure'),
          cancelButtonText: this.$t('assets.cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.orderId = data.orderId;
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('assets.already_cancel'),
          });
        });
    },
    transTime(time) {
      return transforTime.defaultTime(time);
    },
    transTimes(time) {
      return transforTime.defaultDetail(time);
    },
    transallTime(time) {
      return transforTime.returnAllTime(time);
    },
  },
  components: {},
};
</script>

<style lang="scss" scope>
.table-list {
  width: 100%;
  .table-list-item {
    border-bottom: 1px solid $border;
    &.des-title {
      display: flex;
      color: $color_info;
      font-size: 13px;
      height: 28px;
      .item-des {
        flex: 1;
      }
    }
    &.des {
      font-size: 13px;
      &:hover {
        background-color: $menuHover;
      }
    }
    .table-show {
      height: 60px;
      display: flex;
      .item-des {
        flex: 1;
        &.normal {
          line-height: 60px;
        }
        .scope-ptext {
          margin-top: 15px;
          padding-bottom: 5px;
        }
        &.spec {
          display: flex;
          .btn {
            flex: 1;
          }
          .up-down {
            margin-left: 15px;
            .icon {
              cursor: pointer;
              padding-top: 20px;
              font-size: 12px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
.redText {
  color: #e2214e;
}
.greenText {
  color: #00ad88;
}
.setting-btn {
  display: inline-block;
  width: 56px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  font-size: 12px;
  color: #fff;
  border-radius: 2px;
}
.setting-lose-btn {
  background-color: #00ad88 !important;
  color: #fff !important;
}
.setting-win-btn {
  background-color: #e2214e !important;
  color: #fff !important;
}
.common-btn,
.fast-btn {
  display: block;
  padding: 1px 3px;
  width: 68px;
  text-align: center;
  line-height: 22px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 12px;
  color: white;
  background-color: $color_main;
  border-radius: 2px;
}
.common-btn {
  margin-top: 5px;
}
.fast-btn {
  margin-top: 5px;
}
// 下拉显示
.arrow-data {
  border: 1px solid #f5f7fa;
  background-color: #fafafb;
  padding: 20px;
  // margin-bottom: 10px;
  .arrow-title {
    font-size: 15px;
    font-weight: bold;
  }
  .arrow-list {
    margin-top: 10px;
    .arrow-list-title {
      display: flex;
      .item-title {
        flex: 1;
        color: #5e5d62;
        font-size: 13px;
      }
    }
    .nothing {
      margin-top: 30px;
      font-size: 12px;
      text-align: center;
    }
    .arrow-list-item {
      display: flex;
      line-height: 30px;
      .item-des {
        flex: 1;
      }
    }
  }
}
// 弹窗
.commonInput-box {
  .inputCommon {
    border: none;
    outline: none;
    border-bottom: 1px solid $border;
    font-size: 13px;
    padding: 10px 0px;
    width: 90%;
  }
  .io {
    display: inline-block;
    font-size: 16px;
  }
}
.common-tip {
  margin-top: 15px;
  color: $color_info;
}
</style>
