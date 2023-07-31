<template>
  <div id="app" :key="locale">
    <router-view></router-view>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n-composable';

export default {
  name: 'TradingView',
  setup: () => {
    const { t, locale } = useI18n();

    return { t, locale };
  },
};
</script>

<style>
/* CSS */
</style>
