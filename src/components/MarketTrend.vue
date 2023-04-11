<template>
  <section class="relative z-40 -mt-6">
    <div class="container">
      <div class="my-8 text-center text-4xl">{{ $t('shichangqushi') }}</div>
      <div class="p-4">
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="item in items"
            :key="item.symbol"
            class="card relative flex cursor-pointer flex-col items-center gap-2 overflow-hidden pb-14 text-left text-white"
          >
            <div class="pt-4">
              <div class="text-white opacity-80">
                {{ item.symbol }}/{{ item.currency }}
              </div>
            </div>
            <div class="text-xl font-bold text-white">{{ item.price }}</div>
            <div
              class="text-sm"
              :class="[
                Number(item.rate) < 0 ? 'text-red-400' : 'text-green-400',
              ]"
            >
              {{ item.rate }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { findMyCoin } from '@/server/axios';
import { useIntervalFn } from '@vueuse/core';
import { computed, ref } from 'vue';

const currencies = ref([]);

useIntervalFn(async () => {
  const res = await findMyCoin({
    tab: 'spot',
    sortField: '',
    sortType: '',
  });

  if (res.code === 200) {
    currencies.value = res.data.quotes;
  }
}, 30 * 1000);

const items = computed(() => currencies.value.slice(0, 8));
</script>

<style lang="scss" scoped></style>
