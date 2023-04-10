<template>
  <div>
    <div class="container bg-white mt-10 p-4">
      <el-tabs v-model="tab" type="card">
        <el-tab-pane
          :label="`初级认证(${primaryCertificationStatus})`"
          name="primaryCertification"
          :disabled="primaryCertification?.state === '1'"
        >
          <PrimaryCertification />
        </el-tab-pane>
        <el-tab-pane
          :label="`高级认证(${advancedCertificationStatus})`"
          name="advancedCertification"
          :disabled="primaryCertification?.state !== '1'"
        >
          <AdvancedCertification />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import PrimaryCertification from './PrimaryCertification.vue';
import AdvancedCertification from './AdvancedCertification.vue';
import { useCertificationStore } from '@/stores/certification';
// primaryCertification
// advancedCertification

const tab = ref('advancedCertification');

const {
  primaryCertification,
  advancedCertification,
  getPrimaryCertification,
  getAdvancedCertification,
} = useCertificationStore();

onMounted(() => {
  getPrimaryCertification();
  getAdvancedCertification();
});

const primaryCertificationStatus = computed(() => {
  if (primaryCertification) {
    return primaryCertification.stateDesc;
  }
  return '未认证';
});

const advancedCertificationStatus = computed(() => {
  if (advancedCertification) {
    return advancedCertification.stateDesc;
  }
  return '未认证';
});

watchEffect(() => {
  if (primaryCertification?.state === '1') {
    tab.value = 'advancedCertification';
  }
});
</script>

<style lang="scss" scoped></style>
