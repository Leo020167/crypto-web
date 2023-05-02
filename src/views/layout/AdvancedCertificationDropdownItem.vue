<template>
  <a @click="handleClick">
    <el-dropdown-item>
      {{ $t('gaojirenzheng') }} ({{
        identityAuth ? identityAuth.stateDesc : $t('weirenzheng')
      }})
    </el-dropdown-item>
  </a>
</template>

<script setup>
import { identityGet } from '@/server/axios';
import { Message } from 'element-ui';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useRouter } from 'vue-router/composables';

const { t } = useI18n();

const router = useRouter();

const primaryCertification = ref(null);

onMounted(async () => {
  const res = await identityGet({ type: 1 });
  if (res.code === '200') {
    primaryCertification.value = res.data;
  }
});

const advancedCertification = ref(null);
onMounted(async () => {
  const res = await identityGet({ type: 2 });
  if (res.code === '200') {
    advancedCertification.value = res.data;
  }
});

const identityAuth = computed(() => advancedCertification.value?.identityAuth);

const handleClick = () => {
  if (primaryCertification.value?.identityAuth.state !== '1') {
    Message.error(t('qingxianwanchengchujirenzheng'));
    return;
  }

  router.push('/user/authentication');
};
</script>

<style lang="scss" scoped></style>
