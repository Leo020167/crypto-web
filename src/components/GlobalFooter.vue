<template>
  <footer class="bg-[#1b2945] flex items-center h-14">
    <a
      v-for="item in $t('footer')"
      :key="item.url"
      target="_blank"
      :href="item.url"
      class="py-5 text-[#aeb9d8] hover:text-white w-1/4 text-sm text-center"
      >{{ item.title }}</a
    >
  </footer>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss" scoped></style>
