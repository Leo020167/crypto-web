<template>
  <div class="history-order">
    <NullRecord v-if="historyList.length === 0">{{
      $t('common.no_data')
    }}</NullRecord>
    <div class="data-show" v-else>
      <el-table
        :data="historyList"
        style="width: 100%"
        :row-class-name="setClassName"
      >
        <el-table-column
          prop="symbol"
          label="幣種"
          align="left"
        ></el-table-column>
        <el-table-column prop="buySell" label="買賣方向" align="left">
          <template slot-scope="scope">
            <p :class="scope.row.buySell === 'buy' ? 'redText' : 'greenText'">
              {{ scope.row.buySell === 'buy' ? '買入' : '賣出' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="fee"
          label="手續費"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="amount"
          label="數量"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="價格"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="fee"
          label="金額（USDT）"
          align="left"
        ></el-table-column>
        <el-table-column prop="createTime" label="時間" align="left">
          <template slot-scope="scope">
            <p>{{ transallTime(scope.row.createTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="盈虧" align="left">
          <template slot-scope="scope">
            <p
              v-if="scope.row.buySell === 'sell'"
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
            <p v-else>-</p>
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
  methods: {
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
  color: #00ad88;
}
.greenText {
  color: #e2214e;
}
.el-table__expanded-cell[class*='cell'] {
  padding: 0;
}
.table-list-more {
  border: 1px solid #f5f7fa;
  background-color: #fafafb;
  padding: 20px;
  .more-title {
    color: black;
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
        color: black;
      }
    }
  }
}
.expandNo .el-table__expand-column .cell {
  display: none;
}
</style>
