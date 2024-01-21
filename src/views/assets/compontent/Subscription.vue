<template>
  <div class="history-order">
    <!-- 还没有法币记录哦 -->
    <NullRecord v-if="SubscriptionList.length === 0">{{
      $t('orderDetail.Subscription.noOtcRecord')
    }}</NullRecord>
    <div class="data-show" v-else>
      <el-table
        :data="SubscriptionList"
        style="width: 100%"
        :row-class-name="setClassName"
      >
        <!-- 类型 -->
        <el-table-column :label="$t('orderDetail.Subscription.title')">
          <template slot-scope="scope">
            <p>
              {{ $t('orderDetail.Subscription.subscribe') }}（{{
                scope.row.symbol
              }}
              - {{ scope.row.title }}）
            </p>
          </template>
        </el-table-column>
        <!-- 数量 -->
        <el-table-column :label="$t('orderDetail.Subscription.amount')">
          <template slot-scope="scope">
            <p>{{ scope.row.count }}</p>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('orderDetail.Subscription.creatTime')">
          <template slot-scope="scope">
            <p>{{ (scope.row.time * 1000) | transferTime }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderDetail.Subscription.luckyCount')">
          <template slot-scope="scope">
            <p>{{ scope.row.luckyCount }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderDetail.Subscription.inOut')">
          <template slot-scope="scope">
            <p>{{ scope.row.stateDesc }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderDetail.Subscription.paidAmount')">
          <template slot-scope="scope">
            <p>{{ scope.row.paidAmount }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderDetail.Subscription.unpaidAmount')">
          <template slot-scope="scope">
            <p>{{ scope.row.unpaidAmount }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderDetail.Subscription.tradeTime')">
          <template slot-scope="scope">
            <p>{{ scope.row.tradeTime * 1000 | transferTime }}</p>
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
import { assetsApi } from '@/server/axios.js';

export default {
  name: 'OTCOdrder',
  data() {
    return {
      SubscriptionList: [],
      total: 0,
      pageSize: 5,
      pageNo: 1,
      buySell: '',
    };
  },
  created() {
    this.getRecord();
  },
  methods: {
    getRecord() {
      // pageNo
      assetsApi.getSubscribeRecord(this.pageNo).then((res) => {
        this.$emit('showLoading');
        if (res.code == 200) {
          this.SubscriptionList = res.data.data
          this.pageSize = Number(res.data.pageSize);
          this.total = Number(res.data.total);
        }
      });
    },
    // 为表格里的>的显示加餐
    setClassName({ row, index }) {
      return row.closeState !== 'canceled' ? '' : 'expandNo';
    },
    changePage(page) {
      this.pageNo = page;
      this.getRecord();
    },
    // 时间转换
    transallTime(time) {
      return transforTime.returnAllTime(time);
    },
  },
};
</script>
