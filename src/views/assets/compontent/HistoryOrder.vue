<template>
  <div class="history-order">
    <NullRecord v-if="historyList.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <div class="data-show" v-else>
      <el-table
        row-key="orderId"
        :data="historyList"
        style="width: 100%"
        :expand-row-keys="expandRowKeys"
        :row-class-name="setClassName"
        @expand-change="expandChange"
      >
        <el-table-column :label="$t('assets.time')" align="left">
          <template slot-scope="scope">
            <p>{{ transTime(scope.row.openTime) }}</p>
            <p>{{ transTimes(scope.row.openTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="symbol"
          :label="$t('assets.symbol')"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="buySellValue"
          :label="$t('assets.buySellValue')"
          align="left"
        >
          <template slot-scope="scope">
            <p :class="scope.row.buySell === 'buy' ? 'redText' : 'greenText'">
              {{ scope.row.buySellValue }}
            </p>
          </template>
        </el-table-column>
        <!-- 开仓价 -->
        <el-table-column
          prop="openPrice"
          :label="$t('assets.openPrice')"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="openBail"
          :label="$t('assets.openBail')"
          align="left"
        ></el-table-column>
        <!-- 开仓手数 -->
        <el-table-column :label="$t('assets.openHand2')" align="left">
          <template slot-scope="scope">
            <p class="scope-ptext">{{ scope.row.openHand }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="openFee"
          :label="$t('assets.openFee')"
          align="left"
        ></el-table-column>
        <el-table-column :label="$t('assets.stopLossPrice')" align="left">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.stopLossPrice == '0'
                  ? $t('assets.noset')
                  : scope.row.stopLossPrice
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('assets.stopWinPrice')" align="left">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.stopWinPrice == '0'
                  ? $t('assets.noset')
                  : scope.row.stopWinPrice
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('assets.closeOut_win')" align="left">
          <template slot-scope="scope">
            <p
              :class="
                scope.row.profit > 0
                  ? 'redText'
                  : scope.row.profit < 0
                  ? 'greenText'
                  : ''
              "
            >
              {{
                scope.row.profit > 0 ? `+${scope.row.profit}` : scope.row.profit
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="nowStateDesc"
          width="70"
          :label="$t('assets.status')"
          align="left"
        ></el-table-column>
        <el-table-column type="expand" width="20">
          <template slot-scope="props">
            <div class="table-list-more">
              <p class="more-title">{{ $t('assets.closeOut_title') }}</p>
              <ul class="table-more">
                <li class="title">
                  <span class="title-item">{{
                    $t('assets.closeOut_time')
                  }}</span>
                  <span class="title-item">{{
                    $t('assets.closeOut_price')
                  }}</span>
                  <span class="title-item">{{
                    $t('assets.closeOut_num')
                  }}</span>
                  <span class="title-item">{{
                    $t('assets.closeOut_fee')
                  }}</span>
<!--                  <span class="title-item">{{-->
<!--                    $t('assets.closeOut_win')-->
<!--                  }}</span>-->
                  <span class="title-item">{{
                    $t('assets.closeOut_lose')
                  }}</span>
                </li>
                <li
                  class="des"
                  v-for="(item, index) in props.row.closeDetails"
                  :key="index"
                >
                  <span class="des-item">{{
                    transallTime(item.closeTime)
                  }}</span>
                  <span class="des-item">{{ item.closePrice }}</span>
                  <span class="des-item"
                    >{{ item.closeHand }}{{ $t('assets.hand') }}</span
                  >
                  <span class="des-item">{{ item.closeFee }}</span>
<!--                  <span class="des-item">{{ item.profitShare }}</span>-->
                  <span class="des-item">{{ item.profit }}</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-show="total > pageSize"
        @changePage="changePage"
        :recordsTotal="total"
        :currentPage="pageNo"
        :pageSize="pageSize"
      ></Pagination>
    </div>
  </div>
</template>

<script>
import { transforTime } from '@/utils/time.js';
export default {
  name: 'HistoryOrder',
  props: {
    historyList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 0,
    },
    pageNo: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    expandRowKeys: [],
  }),
  methods: {
    expandChange(row, expanded) {
      this.expandRowKeys = expanded.map((v) => v.orderId);
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
    changePage(no) {
      this.$emit('changePage', no);
    },
    // 为表格里的>的显示加餐
    setClassName({ row }) {
      return row.closeState !== 'canceled' ? '' : 'expandNo';
    },
  },
};
</script>

<style lang="scss" scope>
.redText {
  color: #e2214e;
}
.greenText {
  color: #00ad88;
}
.el-table__expanded-cell[class*='cell'] {
  padding: 0;
}
.table-list-more {
  border: 1px solid #f5f7fa;
  background-color: #fafafb;
  padding: 20px;
  .more-title {
    color: #b0b8db!important;
    font-weight: bold;
  }
  .table-more {
    margin-top: 10px;
    .title {
      display: flex;
      .title-item {
        flex: 1;
        font-size: 13px;
      }
    }
    .des {
      display: flex;
      line-height: 30px;
      .des-item {
        flex: 1;
        color: #b0b8db!important;
      }
    }
  }
}
.expandNo .el-table__expand-column .cell {
  display: none;
}
</style>
