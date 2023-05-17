<template>
  <section class="py-12">
    <div class="container mt-8 pb-8">
      <div class="swiper-banner w-full">
        <swiper :options="swiperOption">
          <swiper-slide v-for="banner in bannerSliders" :key="banner.bannerId">
            <img
              :src="banner.imageUrl"
              alt=""
              class="block w-full rounded-lg"
            />
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script setup>
import { homeConfig } from '@/server/axios';

import { onMounted, ref } from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

const swiperOption = {
  slidesPerView: 3,
  spaceBetween: 24,
  loop: true,
  autoplay: {
    delay: 5000,
  },
};

const bannerSliders = ref([]);
onMounted(async () => {
  const res = await homeConfig({});

  if (res.code === '200') {
    bannerSliders.value = res.data.banner;
  }
});

console.log(bannerSliders);
</script>

<style lang="scss" scoped>
.swiper-container {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  list-style: none;
  padding: 0;
  z-index: 1;
}
</style>
