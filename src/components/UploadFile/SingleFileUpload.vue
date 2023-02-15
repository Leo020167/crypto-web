<!--单个文件上传组件,固定文件名，需传入文件名, 详细参数参照props-->
<template>
  <div class="single-file-upload-container">
    <div class="handle-container">
      <el-button
        type="text"
        v-if="canUpload"
        class="uploadBtn handleBtn"
        icon="el-icon-upload "
      >
        <input
          type="file"
          ref="file"
          name="file"
          class="upload__input"
          @change.prevent="handleChooseFile"
        />{{ $t('singleUploadFile.upload') }}
      </el-button>
    </div>
    <div
      class="single-file-upload"
      v-if="file.fileUrl"
      @click="previewImages(file.fileUrl)"
      :style="{ backgroundImage: file.fileUrl ? file.fileUrl : '' }"
    ></div>
    <div class="single-file-upload" v-else>
      <null-record class="upload-tips">{{
        $t('singleUploadFile.clickToUpload')
      }}</null-record>
    </div>
    <!--图片预览-->
    <PreviewImage
      @closePreview="handleClosePreviewImage"
      :photos="previewPhotos"
      v-if="showPreviewImage"
    ></PreviewImage>
    <!--pdf-->
    <PreviewPdf
      @closePreview="handleClosePreviewPdf"
      :pdfSrc="pdfSrc"
      v-if="showPreviewPdf"
    ></PreviewPdf>
  </div>
</template>

<script>
import PreviewImage from '@/components/UploadFile/PreviewImage.vue';
import PreviewPdf from '@/components/UploadFile/PreviewPdf.vue';
export default {
  name: 'SingleFileUpload',
  data() {
    return {
      // 允许上传的文件大小
      allowUploadFileSize: 50 * 1024 * 1024,
      // 允许上传的所有文件类型
      allowUploadFileTypes: ['.jpg', '.jpeg', '.png', '.pdf'],
      // 允许上传的图片类型
      allowUploadImgFileTypes: ['.jpg', '.jpeg', '.png'],
      // 文件
      file: {},
      // 需要预览的图片集合
      previewPhotos: '',
      // 是否预览图片
      showPreviewImage: false,
      // 需要预览的pdf路径
      pdfSrc: '',
      // 是否预览pdf
      showPreviewPdf: false,
    };
  },
  props: {
    // 文件路径
    oldFile: {
      type: Object,
      default() {
        return {};
      },
    },
    // 能否删除
    canDelete: {
      type: Boolean,
      default: true,
    },
    // 能否上传
    canUpload: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    oldFile: {
      handler(file) {
        if (!file.fileUrl) return;
        let fileUrl = 'url(' + file.fileUrl + ')';
        this.file = Object.assign(
          {},
          {},
          {
            fileUrl: fileUrl,
          }
        );
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 选择文件
    handleChooseFile(e) {
      let file = e.target.files[0];
      let suffix = file.name.lastIndexOf('.');
      let fileType = file.name.substring(suffix);
      const allowUploadFileTypesString = this.allowUploadFileTypes.join(',');
      if (this.allowUploadFileTypes.indexOf(fileType) === -1) {
        // 检测文件类型
        this.$alert(
          `${this.$t(
            'singleUploadFile.tips1'
          )}${allowUploadFileTypesString}）!`,
          this.$t('singleUploadFile.tipsBtn'),
          {
            confirmButtonText: this.$t('singleUploadFile.sure'),
          }
        );
        this.$refs.file.value = '';
      } else if (file.size <= 0) {
        // 检测文件是否有效
        this.$alert(
          this.$t('singleUploadFile.tips2'),
          this.$t('singleUploadFile.tipsBtn'),
          {
            confirmButtonText: this.$t('singleUploadFile.sure'),
          }
        );
        this.$refs.file.value = '';
      } else if (file.size > this.allowUploadFileSize) {
        // 检测文件大小
        this.$alert(
          this.$t('singleUploadFile.tips3'),
          this.$t('singleUploadFile.tipsBtn'),
          {
            confirmButtonText: this.$t('singleUploadFile.sure'),
          }
        );
        this.$refs.file.value = '';
      } else {
        // 检测通过
        // 检测是否是图片，是就预览图片
        const _this = this;
        if (this.allowUploadImgFileTypes.indexOf(fileType) !== -1) {
          // 判断浏览器是否支持FileReader
          if (window.FileReader) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
              _this.file = Object.assign({}, this.file, {
                originFile: file, // 原始文件，用于上传
                suffix: fileType, // 后缀
                fileUrl: 'url(' + e.target.result + ')', // 预览路径
                fileName: file.name, // 文件名
              });
              _this.$emit('onAddFile', file);
            };
          }
        }
      }
    },
    // 预览文件
    handlePreviewFile() {
      const suffix = this.file.suffix;
      // 是图片，预览图片
      if (this.allowUploadImgFileTypes.indexOf(suffix) !== -1) {
        this.previewPhotos.push(this.file.previewFileUrl);
        this.showPreviewImage = true;
      } else if (suffix === '.pdf') {
        this.showPreviewPdf = true;
        this.pdfSrc = this.file.previewFileUrl;
      }
    },
    // 点击预览
    previewImages(url) {
      this.previewPhotos = url;
      this.showPreviewImage = true;
    },
    // 删除文件
    handleDeleteFile() {},
    // 关闭图片预览
    handleClosePreviewImage() {
      this.showPreviewImage = false;
      this.previewPhotos = [];
    },
    // 关闭pdf预览
    handleClosePreviewPdf() {
      this.showPreviewPdf = false;
      this.pdfSrc = '';
    },
  },
  components: {
    PreviewImage,
    PreviewPdf,
  },
};
</script>

<style lang="scss" scope>
.single-file-upload-container {
  width: 250px;
  display: inline-block;
  margin-right: 20px;
  .handle-container {
    text-align: right;
    .deleteBtn {
      color: $color_info;
    }
    .uploadBtn {
      position: relative;
      cursor: pointer;
      .upload__input {
        opacity: 0;
        position: absolute;
        top: 0;
        cursor: pointer;
        right: -25px;
        width: 230%;
        height: 100%;
      }
    }
  }
  .single-file-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
    height: 150px;
    outline: none;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    user-select: none;
    .empty-tip-contain {
      margin-top: 12px !important;
    }
  }
  .file-name {
    width: 100%;
    text-align: center;
    font-size: 13px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 10px;
    color: $color_info;
    white-space: nowrap;
  }
}
</style>
