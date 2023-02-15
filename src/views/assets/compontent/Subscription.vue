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
        <el-table-column :label="$t('Subscription.type')">
          <template slot-scope="scope">
            <p v-if="scope.row.inOut == '2'">
              {{ $t('orderDetail.Subscription.inOut3') }}（{{
                scope.row.subSymbol
              }}
              - {{ scope.row.subTitle }}）
            </p>
            <p v-else-if="scope.row.inOut == '3'">
              {{ $t('orderDetail.Subscription.inOut4') }}（{{
                scope.row.subSymbol
              }}
              - {{ scope.row.subTitle }}）
            </p>
            <p v-else-if="scope.row.inOut == '4'">
              {{ $t('orderDetail.Subscription.inOut5') }}（{{
                scope.row.subSymbol
              }}
              - {{ scope.row.subTitle }}）
            </p>
          </template>
        </el-table-column>
        <!-- 数量 -->
        <el-table-column :label="$t('Subscription.amount')">
          <template slot-scope="scope">
            <p>{{ scope.row.amount }}</p>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column :label="$t('Subscription.inOut')" prop="inOut">
          <template slot-scope="scope">
            <p>{{ scope.row.stateDesc }}</p>
          </template>
        </el-table-column>
        <!-- 时间 -->
        <el-table-column :label="$t('Subscription.creatTime')" align="left">
          <template slot-scope="scope">
            <p v-if="scope.row.inOut == '2'">
              {{ (scope.row.createTime * 1000) | transferTime }}
            </p>
            <p v-else-if="scope.row.inOut == '3'">
              {{ (scope.row.createTime * 1000) | transferTime }}
            </p>
            <p v-else-if="scope.row.inOut == '4'">
              {{ (scope.row.createTime * 1000) | transferTime }}
            </p>
            <p v-else></p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Subscription.transferTime')" align="left">
          <template slot-scope="scope">
            <p>{{ (scope.row.transferTime * 1000) | transferTime }}</p>
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
      assetsApi.getCWRecord2('', this.pageNo, '2').then((res) => {
        this.$emit('showLoading');
        if (res.code == 200) {
          this.SubscriptionList = res.data.data.filter(function (data) {
            console.log('data', data);
            //只返回id是偶数的
            return (
              data.inOut === '2' || data.inOut === '3' || data.inOut === '4'
            ); //只显示状态 234的数据
          });
          // this.SubscriptionList = res.data.data
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
