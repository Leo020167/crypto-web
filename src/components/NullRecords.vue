<template>
  <div class="empty-container">
    <img :src="nullConent" alt class="logo" />
    <div class="tips">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import nullConent from "@/assets/null-content.png";
export default {
  data() {
    return {
      nullConent: nullConent,
    };
  },
};
</script>

<style lang="scss" scope>
.empty-container {
  width: 100%;
  text-align: center;
  color: #a8a8a8;
  height: 200px;
  .logo {
    margin-top: 20px;
    width: 100px;
    height: 80px;
  }
  .tips {
    margin-top: 20px;
  }
}
</style>
