<template lang="">
  <div>
    <div class="mt-4">
      <el-checkbox v-model="zeroAssets">隱藏0資產</el-checkbox>
    </div>
    <div class="py-4">
      <el-table :data="items" style="width: 100%">
        <el-table-column prop="symbol" label="幣種" align="center">
        </el-table-column>
        <el-table-column prop="sumAmount" label="全部" align="center">
        </el-table-column>
        <el-table-column prop="holdAmount" label="可用" align="center">
        </el-table-column>
        <el-table-column prop="frozenAmount" label="冻结" align="center">
        </el-table-column>
        <el-table-column prop="usdtAmount" label="折合USDT" align="center">
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
export default {
  props: {
    rowData: [],
  },
  data: () => ({
    zeroAssets: false,
  }),
  computed: {
    items() {
      if (this.zeroAssets) {
        return this.rowData.filter(
          (v) => Number(v.holdAmount) > 0 || Number(v.frozenAmount) > 0
        );
      }
      return this.rowData;
    },
  },
  created() {},
};
</script>
<style lang=""></style>
