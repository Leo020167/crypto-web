<template>
  <div class="flex hands">
    <a
      v-for="item in props.rates"
      :key="item"
      class="hand flex flex-1 items-center justify-center"
      @click="handleClick(item)"
      >{{ item }}%</a
    >
  </div>
</template>

<script setup>
import currency from 'currency.js';
const props = defineProps({
  rates: {
    type: Array,
    default: () => [],
  },
  maxHand: {
    type: [String, Number],
    default: '0',
    required: true,
  },
});

const emit = defineEmits(['change']);

const handleClick = (value) => {
  const precision = Number(String(props.maxHand).split('.')?.[1]?.length ?? 2);
  const hand = currency(props.maxHand, {
    symbol: '',
    separator: '',
    precision,
  })
    .multiply(value / 100)
    .format();

  emit('change', hand);
};
</script>

<style lang="scss" scoped>
.hands {
  height: 36px;
  border: 1px solid #374265;
  border-radius: 4px;
  a {
    color: #a2a3aa;
    &:not(:last-child) {
      border-right: 1px solid #374265;
    }
    &:hover {
      background-color: #374265;
      color: #fff;
    }
  }
}
</style>
