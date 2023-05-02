<template>
  <a @click="handleClick">
    <el-dropdown-item :disabled="identityAuth?.state === '1'">
      {{ $t('chujirenzheng') }} ({{
        identityAuth ? identityAuth.stateDesc : $t('weirenzheng')
      }})
    </el-dropdown-item>
  </a>
</template>

<script setup>
import { identityGet } from '@/server/axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

const router = useRouter();
const primaryCertification = ref(null);
onMounted(async () => {
  const res = await identityGet({ type: 1 });
  if (res.code === '200') {
    primaryCertification.value = res.data;
  }
});

const identityAuth = computed(() => primaryCertification.value?.identityAuth);

const handleClick = () => {
  if (identityAuth.value?.state === '1') {
    return;
  }
  router.push('/user/authentication');
};
</script>

<style lang="scss" scoped></style>
