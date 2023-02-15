<template>
  <div class="preview-image-container">
    <div class="mask" @click="$emit('closePreview')"></div>
    <div class="image-container"  @click="$emit('closePreview')" :style="{backgroundImage: photos}">
      <i class="el-icon-circle-close close-btn" @click="$emit('closePreview')" title="关闭"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    photos: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss" scope>
.preview-image-container {
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.3;
    left: 0;
    top: 0;
    z-index: 1200;
  }
  .close-btn {
    font-size: 30px;
    position: fixed;
    right: 0;
    left: 0;
    margin: 0 auto;
    bottom: 2%;
    z-index: 1201;
    color: #ffffff;
    cursor: pointer;
    &:hover {
      color: $color_main;
    }
  }
  .image-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 2px;
    width: 70%;
    height: 88%;
    margin: auto;
    z-index: 1201;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    user-select: none;
    text-align: center;
    .viewer-container {
      width: 70%;
      height: 88%;
    }
  }
}
</style>