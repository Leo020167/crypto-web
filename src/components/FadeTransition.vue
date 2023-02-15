<template>
  <div class="fade-container">
    <transition name="breadcrumb" mode='out-in'>
      <div v-if="show">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.show = true
    },1)
  },
  name: "FadeTransition"
};
</script>

<style scoped lang="scss">
</style>
