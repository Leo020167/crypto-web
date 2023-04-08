<template>
  <div class="flex items-center">
    <el-button type="primary" class="btns" @click="showTopup">{{ $t('assets.deposit') }}</el-button>
    <el-button type="primary" class="btns" @click="showMetion">{{
      $t('assets.withdraw')
    }}</el-button>

    <TransferDialog :show-dialog="transfer" @closeTransfer="transfer = false" />
  </div>
</template>

<script>
import TransferDialog from './balanceCompontent/TransferDialog.vue';

export default {
  components: { TransferDialog },
  data: () => ({
    transfer: false,
    dialogState: 0,
  }),
  methods: {
    showTopup() {
      this.dialogState = 1;
      this.getChainDetailData();
    },
    showMetion() {
      this.dialogState = -1;
      this.getChainDetailData();
    },
    goOtcPage() {
      this.$router.push('/legalPurchase');
    },
    getChainDetailData() {
      111;
      if (this.dialogState === 1) {
        this.$router.push({ name: 'topUps' });
      } else {
        this.$router.push({ name: 'bringUp' });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
