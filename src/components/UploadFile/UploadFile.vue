<!--可多个可单个文件上传组件，文件名不固定-->
<template>
  <div class="upload-attach-file-container">
    <!--上传文件按钮-->
    <div class="upload-btn-container" v-if="!ifDisabled">
      <i class="el-icon-upload2" title="上传文件"></i>
      <input
        type="file"
        ref="file"
        name="file"
        class="file-btn"
        @change.prevent="handleChooseFile"
      />上传文件
    </div>
    <!--文件预览展示-->
    <div
      class="upload-file-container"
      v-if="allFiles.length > 0"
      v-loading="showLoading"
    >
      <div class="upload-file-item">
        <div
          class="upload-container"
          :style="{ backgroundImage: currentFile.fileUrl }"
        >
          <a :href="currentFile.originFileUrl" :download="currentFile.fileName">
            <i
              class="downloadBtn el-icon-download"
              v-if="currentFile.cid && currentFile.cid.indexOf('local') === -1"
              title="下载文件"
            ></i>
          </a>
          <i
            class="el-icon-view previewBtn"
            title="预览文件"
            @click="handlePreviewFile(currentFile)"
            v-if="currentFile.cid && currentFile.cid.indexOf('local') === -1"
          ></i>
          <i
            class="deleteBtn el-icon-delete"
            title="删除文件"
            v-if="!ifDisabled"
            @click="handleDeleteFile(currentFile.cid)"
          ></i>
          <div class="pointer" v-if="allFiles.length != 0">
            {{ currentImgIndex + 1 }}/{{ allFiles.length }}
          </div>
        </div>
        <div class="upload-name">
          <i
            class="el-icon-arrow-left icon icon-right left-btn"
            @click="handleShowPreFile"
          ></i>
          <span class="name">{{ currentFile.fileName }}</span>
          <i
            class="el-icon-arrow-right icon icon-right right-btn"
            @click="handleShowNextFile"
          ></i>
        </div>
      </div>
      <div class="allow-file-type">
        允许上传的文件类型: {{ allowUploadFileTypes.join(',') }}
      </div>
    </div>
    <div
      class="upload-file-container"
      style="font-size: 12px"
      v-if="allFiles.length === 0"
    >
      <EmptyTip class="empty-tip-container">未上传相关文件</EmptyTip>
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
import PreviewImage from './PreviewImage';
import PreviewPdf from './PreviewPdf';
export default {
  components: {
    PreviewImage,
    PreviewPdf,
  },
  data() {
    return {
      showLoading: false,
      // 允许上传的文件大小
      allowUploadFileSize: 50 * 1024 * 1024,
      // 允许上传的图片类型
      allowUploadImgFileTypes: ['.jpg', '.jpeg', '.png'],
      // 已选择的文件(存储在本地，待上传)
      localFiles: [],
      // 文件预览，当前文件index
      currentImgIndex: 0,
      // 文件预览，当前预览的文件
      currentFile: {
        fileName: '',
        fileUrl: '',
      },
      // 从服务器上拉下来的文件,用于展示
      showFileList: [],
      // 是否显示图片预览
      showPreviewImage: false,
      // 需要进行图片预览的所有图片
      previewPhotos: [],
      // 是否显示pdf预览
      showPreviewPdf: '',
      // 需要预览的pdf
      pdfSrc: '',
    };
  },
  // 需要传入的属性
  props: {
    // 是否禁用，不可选择文件
    ifDisabled: {
      type: Boolean,
      default: false,
    },
    // 从服务器上拉下来的文件
    serverFiles: {
      type: Array,
      default() {
        return [];
      },
    },
    // 允许上传文件类型
    allowUploadFileTypes: {
      type: Array,
      default() {
        return ['.jpg', '.jpeg', '.png', '.pdf'];
      },
      required: false,
    },
    // 文件根路径,默认/mod-case/mod,例如后台系统应传/cloud-system/system/
    baseFileUrl: {
      type: String,
      default: '/mod-case/mod',
      required: false,
    },
    // 紧接着文件根路径的那个路径，如/cloud-system/system/后面的user/file
    manageFileUrl: {
      type: String,
      default: 'manageFile',
      required: false,
    },
    // 最多上传几个文件
    maxFileNum: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  // 监听服务器返回的文件列表
  watch: {
    serverFiles: {
      handler(oldFileList) {
        this.handleInitFileList(oldFileList);
      },
      deep: true,
    },
  },
  created() {
    // 初始化文件列表
    this.handleInitFileList(this.serverFiles);
  },
  computed: {
    // 所有的文件，包括服务器上的和本地新增的
    allFiles() {
      return [...this.showFileList, ...this.localFiles];
    },
  },
  methods: {
    // 初始化文件列表
    handleInitFileList(oldFileList) {
      this.showFileList = [];
      this.localFiles = [];
      if (oldFileList.length > 0) {
        oldFileList.map((file, index) => {
          let fileName = file.fileName.substring(0, file.fileName.indexOf('.'));
          let suffix = file.fileName.substring(file.fileName.indexOf('.'));
          if (suffix === '.') {
            this.showFileList.push({
              fileName: file.fileName.substring(0, file.fileName.indexOf('.')),
              fileUrl: '',
              originFileUrl: '', // 用于点击文件预览或者下载
              previewUrl: '',
            });
            return;
          }
          let ifImg = this.allowUploadImgFileTypes.indexOf(suffix) !== -1;
          let bgUrl = ifImg
            ? 'url(' +
              `${this.baseFileUrl}/${this.manageFileUrl}/show?fileCode=${file.storageCode}` +
              ')'
            : 'url(' + require('@/assets/file.png') + ')';
          this.showFileList.push({
            fileName: file.fileName,
            fileUrl: bgUrl,
            originFileUrl: `${this.baseFileUrl}/${this.manageFileUrl}/show?fileCode=${file.storageCode}`,
            previewUrl: '',
            cid: file.cid,
            suffix: suffix,
          });
          this.currentFile = this.showFileList[0];
          this.currentImgIndex = 0;
          this.handleLoadImg(this.currentFile.originFileUrl);
        });
      }
    },
    // 给本地文件生成唯一标识码
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    selectFile(e) {
      return new Promise((resolve, reject) => {
        // 判断是否超过限制数量
        if (this.maxFileNum > 0) {
          if (this.localFiles.length >= this.maxFileNum) {
            this.$alert(`最多上传${this.maxFileNum}个文件`, '提示', {
              confirmButtonText: '确定',
            });
            this.$refs.file.value = '';
            reject();
          }
        }
        let file = e.target.files[0];
        let suffix = file.name.lastIndexOf('.');
        let fileType = file.name.substring(suffix);
        const _this = this;
        const allowUploadFileTypesString = this.allowUploadFileTypes.join(',');
        if (this.allowUploadFileTypes.indexOf(fileType) === -1) {
          // 检测文件类型
          this.$alert(
            `上传失败！请选择正确的文件格式！（如：${allowUploadFileTypesString}）!`,
            '提示',
            {
              confirmButtonText: '确定',
            }
          );
          this.$refs.file.value = '';
          reject();
        } else if (file.size <= 0) {
          // 检测文件是否有效
          this.$alert('文件无效，请重新选择', '提示', {
            confirmButtonText: '确定',
          });
          this.$refs.file.value = '';
          reject();
        } else if (file.size > this.allowUploadFileSize) {
          // 检测文件大小
          this.$alert('请勿上传大于10M的文件', '提示', {
            confirmButtonText: '确定',
          });
          this.$refs.file.value = '';
          reject();
        } else {
          // 检测通过
          // 是图片，预览图片
          if (this.allowUploadImgFileTypes.indexOf(fileType) !== -1) {
            // 判断浏览器是否支持FileReader
            if (window.FileReader) {
              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function (e) {
                const pushFile = {
                  originFile: file,
                  fileUrl: 'url(' + e.target.result + ')',
                  fileName: file.name,
                  cid: 'local ' + _this.guid(),
                };
                _this.localFiles.push(pushFile);
                resolve(pushFile);
              };
            }
          } else if (fileType === '.pdf') {
            // 是pdf，封面只显示一张pdf图片
            let pdfImg = 'url(' + require('@/assets/pdf.png') + ')';
            const pushFile = {
              originFile: file,
              fileUrl: pdfImg,
              fileName: file.name,
              cid: 'local ' + _this.guid(),
            };
            _this.localFiles.push(pushFile);
            resolve(pushFile);
          } else {
            // 其他文件
            let fileImg = 'url(' + require('@/assets/file.png') + ')';
            const pushFile = {
              originFile: file,
              fileUrl: fileImg,
              fileName: file.name,
              cid: 'local ' + _this.guid(),
            };
            _this.localFiles.push(pushFile);
            resolve(pushFile);
          }
        }
      });
    },
    // 选择本地文件
    handleChooseFile(e) {
      this.showLoading = true;
      // 展示当前选择的文件并传给父组件
      this.selectFile(e)
        .then((file) => {
          this.currentImgIndex = this.allFiles.length - 1;
          this.currentFile = file;
          this.showLoading = false;
          this.$emit('onAddFile', this.localFiles);
        })
        .catch((err) => {
          this.showLoading = false;
        });
    },
    // 删除文件
    handleDeleteFile(cid) {
      this.$confirm('确定删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.showLoading = true;
          // 删除本地的的文件
          if (cid.indexOf('local') > -1) {
            const deleteIndex = this.localFiles.indexOf(
              this.localFiles.find((item) => item.cid === cid)
            );
            this.$refs.file.value = '';
            this.localFiles.splice(deleteIndex, 1);
            if (this.allFiles.length === 0) return;
            this.currentImgIndex = this.allFiles.length - 1;
            this.currentFile = this.allFiles[this.currentImgIndex];
            this.handleLoadImg(this.currentFile.fileUrl);
          } else {
            // 删除服务器上面的文件
            this.sendDeleteFile(cid)
              .then((res) => {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                });
                const deleteIndex = this.allFiles.indexOf(
                  this.allFiles.find((item) => item.cid === cid)
                );
                this.allFiles.splice(deleteIndex, 1);
                if (this.allFiles.length === 0) {
                  this.showLoading = false;
                  return;
                }
                this.currentFile = this.allFiles[this.currentImgIndex];
                this.handleLoadImg(this.currentFile.originFileUrl);
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '删除失败，请重试或联系管理员',
                });
                this.showLoading = false;
              });
          }
        })
        .catch(() => {});
    },
    // 发送删除文件请求，分为立案和非立案系统
    sendDeleteFile(cid) {
      return new Promise((resolve, reject) => {
        // 收案
        this.api
          .post('/mod-case/mod/flingManageFile/deleteFile', { cid: cid })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 浏览前一个文件
    handleShowPreFile() {
      this.showLoading = true;
      if (this.currentImgIndex > 0) {
        this.currentFile = this.allFiles[this.currentImgIndex - 1];
        this.currentImgIndex -= 1;
      } else {
        this.currentFile = this.allFiles[this.allFiles.length - 1];
        this.currentImgIndex = this.allFiles.length - 1;
      }
      this.handleLoadImg(this.currentFile.originFileUrl);
    },
    handleLoadImg(src) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = src;
        let that = this;
        img.onload = function () {
          that.showLoading = false;
        };
        img.onerror = () => {
          that.showLoading = false;
        };
      });
    },
    // 预览下一个文件
    handleShowNextFile() {
      this.showLoading = true;
      if (this.currentImgIndex + 1 < this.allFiles.length) {
        this.currentFile = this.allFiles[this.currentImgIndex + 1];
        this.currentImgIndex += 1;
      } else {
        this.currentFile = this.allFiles[0];
        this.currentImgIndex = 0;
      }
      this.handleLoadImg(this.currentFile.originFileUrl);
    },
    // 点击图片预览
    handlePreviewFile(currentFile) {
      const suffix = currentFile.suffix;
      // 是图片，预览图片
      if (this.allowUploadImgFileTypes.indexOf(suffix) !== -1) {
        this.previewPhotos.push(currentFile.originFileUrl);
        this.showPreviewImage = true;
      } else if (suffix === '.pdf') {
        this.showPreviewPdf = true;
        this.pdfSrc = currentFile.originFileUrl;
      } else if (suffix === '.docx' || suffix === '.doc') {
        this.$alert('暂不支持此类文件预览', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
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
};
</script>

<style lang="scss" scope>
.upload-attach-file-container {
  padding: 0px 10px;
  width: 320px;
  .upload-btn-container {
    padding: 0px 8px;
    cursor: pointer;
    font-size: 12px;
    height: 22px;
    display: inline-block;
    border: 1px solid $border;
    line-height: 22px;
    position: relative;
    border-radius: 2px;
    .icon {
      font-size: 24px;
      margin-right: 3px;
    }
    .file-btn {
      position: absolute;
      top: 0;
      opacity: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 0;
      cursor: pointer;
    }
  }
  .upload-file-container {
    height: 189px;
    overflow: hidden;
    .empty-tip-contain {
      margin-top: 0 !important;
    }
    .empty-tip-container {
      .def-empty-tip {
        font-size: 12px;
      }
      .empty-tip-contain {
        margin-top: 0 !important;
      }
    }
    .upload-file-item {
      position: relative;
      .upload-container {
        background-color: #ffffff;
        width: 300px;
        border: 1px solid $border;
        cursor: pointer;
        height: 162px;
        overflow: hidden;
        font-size: 12px;
        background-size: contain;
        position: relative;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        user-select: none;
        .deleteBtn,
        .downloadBtn,
        .previewBtn {
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 17px;
          cursor: pointer;
          color: #748696;
        }
        .downloadBtn {
          right: 40px;
        }
        .previewBtn {
          right: 70px;
        }
        .pointer {
          position: absolute;
          left: 10px;
          background-color: $color_main;
          color: #ffffff;
          height: 18px;
          box-sizing: border-box;
          top: 10px;
          padding: 0 5px;
          border-radius: 2px;
          text-align: center;
          line-height: 18px;
        }
      }
      .upload-name {
        position: absolute;
        bottom: 0px;
        opacity: 1;
        left: 0;
        color: $color_main;
        font-weight: bold;
        z-index: 11;
        background-color: rgba(214, 214, 214, 0.8);
        text-align: center;
        width: 100%;
        height: 32px;
        line-height: 32px;
        .icon {
          font-size: 20px;
          margin-top: 5px;
          margin-left: 5px;
          color: #748696;
          cursor: pointer;
          &:hover {
            color: $color_main;
          }
        }
        .name {
          max-width: 80%;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .icon-right:hover {
          color: $color_main;
          font-weight: bold;
          &::before {
            color: $color_main;
          }
        }

        .left-btn {
          float: left;
        }
        .right-btn {
          float: right;
        }
      }
    }
    .allow-file-type {
      font-size: 12px;
      color: rgb(164, 164, 165);
    }
    .empty-tip-contain div {
      text-align: left;
    }
  }
}
</style>
