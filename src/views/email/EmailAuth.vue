<template>
  <div>
    <div class="container bg-white mt-10 p-4">
      <div class="mb-5 text-orange-400">爲了保證你的賬號安全，請驗證身份</div>
      <div class="mb-5 font-bold text-black">
        {{ userInfo?.user?.email }}
      </div>
      <el-button type="primary" @click="submitForm">{{
        t('fasongyanzhengma')
      }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useI18n } from 'vue-i18n-composable';
import { useRoute, useRouter } from 'vue-router/composables';

const route = useRoute();
const router = useRouter();

const { userInfo } = useUserStore();

const { t } = useI18n();

const submitForm = () => {
  router.push({
    path: '/email-auth-code',
    query: {
      mode: route.query.mode,
      email: userInfo.user.email,
    },
  });
};
</script>

<style lang="scss" scoped></style>
