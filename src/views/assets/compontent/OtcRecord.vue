<template>
  <div class="history-order">
    <!-- 还没有法币记录哦 -->
    <NullRecord v-if="otcList.length === 0">{{$t('otc.noOtcRecord')}}</NullRecord>
    <div class="data-show" v-else>
      <el-table :data="otcList" style="width: 100%" :row-class-name="setClassName">
        <!-- 时间 -->
        <el-table-column :label="$t('otc.time')" align="left">
            <template slot-scope="scope">
                <p>{{scope.row.createTime * 1000 | transferTime}}</p>
            </template>
        </el-table-column>
        <!-- 类型 -->
        <el-table-column :label="$t('otc.type')">
            <template slot-scope="scope">
                <p>{{scope.row.buySell == 'buy' ? $t('otc.buy') : $t('otc.sell')}}</p>
            </template>
        </el-table-column>
        <!-- 数量 -->
        <el-table-column :label="$t('otc.number')">
            <template slot-scope="scope">
                <p>{{scope.row.amount}}USDT</p>
            </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('otc.state')"  prop="stateValue"></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('otc.operate')">
          <template slot-scope="scope">
            <!-- 查看详情 -->
            <el-button type="primary" size="small" @click="handleCheckDetail(scope.row)">{{$t('otc.details')}}</el-button>
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
import { transforTime } from "@/utils/time.js";
import {legalPurchaseApi} from '@/server/axios.js';
import qs from "qs";
export default {
  name: "OTCOdrder",
  data() {
    return {
      otcList: [],
      total: 0,
      pageSize: 5,
      pageNo: 1,
      buySell: '',
      state: '' //state=0待付款，state=1已付款，state=2已完成，state=-1已过期，state=-2已撤销
    };
  },
  created() {
      this.getRecord()
  },
  methods: {
    getRecord() {
        // buySell, state, pageNo
        legalPurchaseApi.otcOrderRecord(this.buySell, this.state, this.pageNo).then((res) => {
            this.$emit('showLoading')
            if (res.code == 200) {
                this.otcList = res.data.data
                this.pageSize = Number(res.data.pageSize)
                this.total = Number(res.data.total);
            }
        })
    },
    // 为表格里的>的显示加餐
    setClassName({row, index}) {
      return row.closeState !== 'canceled' ? '' : 'expandNo'
    },
    changePage(page) {
        this.pageNo = page
        this.getRecord()
    },
    // 时间转换
    transallTime(time){
      return transforTime.returnAllTime(time)
    },
    // 点击法币记录
    handleCheckDetail(row={}) {
      if (!row.buySell) return
      if (row.buySell == "buy") {
        // 前往购买订单详情
        this.$router.push({
          path: '/legalPurchase/orderDetail/buy',
          query: {
           orderId: row.orderId
          }
        })
      } else {
        // 前往卖出订单详情
        this.$router.push({
          path: '/legalPurchase/orderDetail/sell',
          query: {
            orderId: row.orderId
          }
        })
      }
    }
  }
};
</script>