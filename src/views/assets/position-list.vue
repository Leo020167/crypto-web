<template lang="">
  <div>
    <div class="py-4">
      <el-table :data="items" style="width: 100%">
        <el-table-column
          prop="symbol"
          :label="$t('position-list.text1')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          :label="$t('position-list.text2')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="availableAmount"
          :label="$t('position-list.text3')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="frozenAmount"
          :label="$t('position-list.text4')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="usdtAmount"
          :label="$t('position-list.text5')"
          align="center"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          :label="$t('position-list.text6')"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              >{{ $t('position-list.text7') }}</el-button
            >

            <el-button
              v-if="showTrading"
              type="text"
              size="small"
              @click="$router.replace('/trading')"
              >{{ $t('position-list.text12') }}</el-button
            >
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

    <el-dialog
      :title="$t('position-list.text7')"
      :visible.sync="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="formData" label-width="80px">
        <el-form-item :label="$t('position-list.text8')" prop="price">
          <el-input-number v-model="formData.price"></el-input-number>
        </el-form-item>

        <el-form-item :label="$t('position-list.text9')" prop="hand">
          <el-input-number v-model="formData.hand"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{
          $t('position-list.text10')
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ $t('position-list.text11') }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { proOrderOpen } from '@/server/axios';
export default {
  props: {
    showTrading: {
      type: Boolean,
      default: true,
    },
    rowData: [],
  },
  data: () => ({
    visible: false,
    zeroAssets: false,
    selected: null,
    formData: {
      price: undefined,
      hand: undefined,
    },
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
  methods: {
    handleSubmit() {
      proOrderOpen({
        symbol: this.selected?.symbol,
        buySell: 'sell',
        orderType: 'limit',
        price: this.formData.price ?? '0',
        hand: this.formData.hand ?? '0',
      }).then((data) => {
        if (data.code === '200') {
          this.$message.success(data.msg);
          this.visible = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handleClick(selected) {
      this.selected = selected;
      this.visible = true;
    },
    handleClose() {
      this.formData = {};
      this.visible = false;
    },
  },
};
</script>
<style lang=""></style>
