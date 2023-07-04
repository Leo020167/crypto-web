<template>
  <div>
    <div class="container bg-white mt-10 p-4">
      <el-tabs v-model="tab" type="card">
        <el-tab-pane
          :label="primaryCertificationStatus"
          name="primaryCertification"
          :disabled="primaryCertification?.state === '1'"
        >
          <PrimaryCertification />
        </el-tab-pane>
        <el-tab-pane
          :label="advancedCertificationStatus"
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
import { useCertificationStore } from '@/stores/certification';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import AdvancedCertification from './AdvancedCertification.vue';
import PrimaryCertification from './PrimaryCertification.vue';

const { t } = useI18n();

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
    return `${t('chujirenzheng')}(${primaryCertification.value.stateDesc})`;
  }
  return t('weirenzheng');
});

const advancedCertificationStatus = computed(() => {
  if (advancedCertification.value) {
    return `${t('gaojirenzheng')}(${advancedCertification.value.stateDesc})`;
  }
  return t('weirenzheng');
});

watchEffect(() => {
  if (primaryCertification.value?.state === '1') {
    tab.value = 'advancedCertification';
  }
});
</script>

<style lang="scss" scoped></style>
