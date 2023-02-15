<template>
  <div class="px-12 py-7">
    <div class="flex items-center px-4 py-2.5 mb-4 bg-white">
      <img src="../../assets/logo.png" class="w-8 h-8" />
      <span class="ml-1 text-black">質押記錄</span>
    </div>
    <div class="bg-white px-6 pb-6">
      <el-tabs v-model="status">
        <el-tab-pane label="進行中" name="0" />
        <el-tab-pane label="已結束" name="1" />
      </el-tabs>

      <el-table :data="rowData" style="width: 100%">
        <el-table-column prop="symbol" label="幣種" align="center" />
        <el-table-column prop="count" label="質押數量" />
        <el-table-column prop="preProfit" label="纍計收益" />
        <el-table-column prop="startTime" label="質押開始時間" align="center">
          <template v-slot="{ row }">
            {{ returnAllTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="質押周期" align="center">
          <template v-slot="{ row }"> {{ row.duration }}天 </template>
        </el-table-column>
        <el-table-column prop="endTime" label="質押到期時間" align="center">
          <template v-slot="{ row }">
            {{ returnAllTime(row.endTime) }}
          </template>
        </el-table-column>

        <template slot="empty">
          <el-empty
            :image="require('../../assets/empty.png')"
            class="pt-10"
          ></el-empty>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import { pledgeHistory } from '@/server/axios';
import { transforTime } from '@/utils/time';
export default {
  data: () => ({
    status: '0',
    rowData: [],
  }),
  created() {
    this.getPledges('0');
  },
  watch: {
    status() {
      this.getPledges(this.status);
    },
  },
  methods: {
    returnAllTime: transforTime.returnAllTime,
    getPledges(status) {
      pledgeHistory({ status }).then((data) => {
        this.rowData = data.data;
      });
    },
  },
};
</script>

<style lang="scss"></style>
