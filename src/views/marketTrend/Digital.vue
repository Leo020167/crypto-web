<template>
  <div class="digital-container">
    {{quotes}}
    <el-table
      ref="marketTrendingTable"
      class="marketTrendingTable"
      :data="quotes"
      v-loading="showTableLoading"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      style="width: 100%"
    >
      <el-table-column label="交易对">
        <template slot-scope="scope">
          <OptionalIcon :symbol="scope.row.symbol"></OptionalIcon>
          <span class="marketTypeName">{{scope.row.symbol}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新价" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span class="currentPrice">{{scope.row.price}}</span>
          <br />
          <span class="roudlyPrice">{{scope.row.priceCny}}</span>
        </template>
      </el-table-column>
      <el-table-column label="涨跌幅" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span
            class="gains"
            :class="scope.row.rate > 0 ? 'positiveNumber' : 'negativeNumber'"
          >{{scope.row.rate > 0 ? '+' + scope.row.rate : scope.row.rate}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span class="highestPrice">{{scope.row.high}}</span>
          <br />
          <span class="roudlyPrice">{{scope.row.highCny}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span class="highestPrice">{{scope.row.low}}</span>
          <br />
          <span class="roudlyPrice">{{scope.row.lowCny}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易量" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span class="turnover">{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易额" :sortable="'custom'" align="center">
        <template slot-scope="scope">
          <span class="trasitionVolume">{{scope.row.balance}}</span>
          <br />
          <span class="roudlyPrice">{{scope.row.balanceCny}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {findMyCoin} from '@/server/axios';
import OptionalIcon from '@/components/Optional/OptionalIcon';
import {ReflashMarketData} from '@/utils/Enums'
export default {
    data() {
        return {
            showTableLoading: true,
            getMyCoinInterval: '', // 定时器
            quotes: [], // 行情列表
            sortField: '', // 将要排序的列名
            sortType: 0 // 排序方式：0正常， 2升序，1降序
        }
    },
    mounted() {
        this.getMyCoinInterval = setInterval(() => {
            this.getMyCoin()
        }, ReflashMarketData)
    },
    methods: {
        // 获取列表
        getMyCoin() {
            findMyCoin({
                tab: 'digital',
                sortField: this.sortField,
                sortType: this.sortType
            }).then(res => {
                if (res.code == 200) {
                    this.showTableLoading = false
                    this.quotes = res.data.quotes
                }
            })
        },
        // 排序
        handleSortChange(column) {
          if (column.column.order === "ascending") {
            // 升序
            this.sortType = 2
          } else  if (column.column.order === "descending"){
            this.sortType = 1 //降序
          } else {
            this.sortType = 0 //正常
          }
          // 最新价排序
          switch(column.column.label) {
            case '最新价':
              this.sortField = 'price';
              break;
            case '涨跌幅':
              this.sortField = 'rate';
              break;
            case '最高价':
              this.sortField = 'high';
              break;
            case '最低价':
              this.sortField = 'low';
              break;
            case '交易量':
              this.sortField = 'amount';
              break;
            case '交易额':
              this.sortField = 'balance';
              break;
            default: 
              this.sortField = 'symbol';
              break;
          }
          this.showTableLoading = true
          this.getMyCoin()
        },
        handleRowClick(row, column, event) {
          if (column.label === '交易对') {
            return
          }
          this.$emit('showDrawer',row.symbol)
        }
    },
    beforeDestroy() {
        window.clearInterval(this.getMyCoinInterval)
        this.getMyCoinInterval = null
    },
    components: {
      OptionalIcon
    }
}
</script>

<style lang="scss" scope>
  .digital-container {
    .marketTrendingTable {
      min-height: 500px;
    }
    .icon-star-on {
      color: #357CE1 !important;
    }
  }
</style>