<template>
  <a @click="handleClick">
    <el-dropdown-item>
      {{ $t('bangdingyouxiang') }}
    </el-dropdown-item>
  </a>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router/composables';

const router = useRouter();

const { userInfo } = useUserStore();

const handleClick = () => {
  if (userInfo.user.email) {
    router.push({ path: '/email-auth', query: { mode: 1 } });
  } else {
    router.push('/bind-email');
  }
};
</script>

<style lang="scss" scoped></style>
