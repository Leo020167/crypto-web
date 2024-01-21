<template>
  <div class="current-order">
    <el-table :data="recordsList" style="width: 100%">
      <el-table-column :label="$t('assets.date')" align="center">
        <template slot-scope="scope">
          <p>{{ transAllTime(scope.row.time) }}</p>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="type"-->
<!--        :label="$t('assets.type')"-->
<!--        align="center"-->
<!--      ></el-table-column>-->
      <el-table-column
        prop="fee"
        :label="$t('assets.fee')"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="amount"
        :label="$t('assets.AmountReceived')"
        align="center"
      ></el-table-column>
      <el-table-column :label="$t('assets.status')" align="center">
        <template slot-scope="scope">
          <p class="state-text">
            {{
              scope.row.state === 0
                ? `${$t('assets.pending')}`
                : scope.row.state === 1
                ? `${$t('assets.processing')}`
                : `${$t('assets.completed')}`
            }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="total > pageSize"
      @changePage="changePages"
      :recordsTotal="total"
      :currentPage="pageNo"
      :pageSize="pageSize"
    ></Pagination>
  </div>
</template>

<script>
import { transforTime } from '@/utils/time.js';
export default {
  name: 'UpInRecord',
  props: {
    recordsList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    total: {
      type: Number,
      default: 1,
    },
    pageNo: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    changePages(i) {
      this.$emit('changeUpInPage', i);
    },
    // 时间转换
    transAllTime(time) {
      return transforTime.returnAllTime(time);
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
</style>
