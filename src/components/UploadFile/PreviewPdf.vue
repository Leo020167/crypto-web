<template>
  <div class="preview-pdf-container">
    <div class="mask" @click="$emit('closePreview')"></div>
    <div class="pdf-container" @click="$emit('closePreview')">
      <iframe :src="totalPdfSrc" width="100%" height="100%"></iframe>
      <i class="el-icon-circle-close close-btn" @click="$emit('closePreview')" title="关闭"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pdfSrc: {
      type: String,
      default: ""
    }
  },
  computed: {
    totalPdfSrc() {
      return `./static/pdf/viewer.html?file=${encodeURIComponent(this.pdfSrc)}`;
    }
  }
};
</script>

<style lang="scss" scope>
.preview-pdf-container {
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
  .pdf-container {
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
    user-select: none;
    text-align: center;
    .pdf {
      z-index: 1201;
      width: 100%;
      height: 100%;
    }
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
}
</style>