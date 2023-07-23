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
          :label="$t('position-list.text1')"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="buySell"
          :label="$t('assets.maimaifangxiang')"
          align="left"
        >
          <template slot-scope="scope">
            <p :class="scope.row.buySell === 'buy' ? 'redText' : 'greenText'">
              {{
                scope.row.buySell === 'buy'
                  ? $t('assets.mairu')
                  : $t('assets.maichu')
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('assets.fee')"
          prop="fee"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('assets.shuliang')"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="price"
          :label="$t('position-list.text8')"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="sum"
          :label="$t('newCommon.text29') + '(USDT)'"
          align="left"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('newCommon.text30')"
          align="left"
        >
          <template slot-scope="scope">
            <p>{{ transallTime(scope.row.createTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('position-list.text15')" align="left">
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
