<template>
  <footer class="bg-[#1b2945] flex items-center h-14">
    <a
      v-for="item in items"
      :key="item.url"
      target="_blank"
      :href="item.url"
      class="py-5 text-[#aeb9d8] hover:text-white w-1/4 text-sm text-center"
      >{{ item.title }}</a
    >
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n-composable';

// http://api.financingy.com/procoin/article/#/passgeDetail?article_id=60

const { t } = useI18n();
const items = t('footer');
</script>

<style lang="scss" scoped></style>
