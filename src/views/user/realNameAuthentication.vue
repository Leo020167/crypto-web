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
import { storeToRefs } from 'pinia';
// primaryCertification
// advancedCertification

const tab = ref('primaryCertification');

const store = useCertificationStore();

const { primaryCertification, advancedCertification } = storeToRefs(store);

const { getPrimaryCertification, getAdvancedCertification } = store;

onMounted(async () => {
  await getPrimaryCertification();
  await getAdvancedCertification();
});

const primaryCertificationStatus = computed(() => {
  if (primaryCertification.value) {
    return primaryCertification.value.stateDesc;
  }
  return '未认证';
});

const advancedCertificationStatus = computed(() => {
  if (advancedCertification.value) {
    return advancedCertification.value.stateDesc;
  }
  return '未认证';
});

watchEffect(() => {
  if (primaryCertification.value?.state === '1') {
    tab.value = 'advancedCertification';
  }
});
</script>

<style lang="scss" scoped></style>
