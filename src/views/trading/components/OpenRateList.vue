<template>
  <div class="hands flex">
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
const props = defineProps({
  rates: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['change']);

const handleClick = (value) => {
  const rate = value / 100;
  emit('change', rate);
};
</script>

<style lang="scss" scoped>
.hands {
  border: 1px solid #374265;
  border-radius: 4px;
  height: 36px;
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
