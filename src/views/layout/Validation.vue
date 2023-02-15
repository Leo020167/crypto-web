<template>
  <div
    class="validation ripple fadeInUp"
    @mousemove="moving"
    @mouseup="moveEnd"
  >
    <p class="close">
      <i class="el-icon-circle-close icon-close" @click="hideVaild"></i>
    </p>
    <h1>{{ validTitle }}</h1>
    <div class="drge-img" :style="commonStyle">
      <div class="loading" v-show="showLoading">
        <div
          v-loading="isLoading"
          class="load"
          :color="loadingColor"
          :height="loadingHeight"
          :width="loadingWidth"
        ></div>
        <p v-show="isError" class="tips" @click="renew">
          {{ $t("login.sms_tip2") }}
        </p>
      </div>
      <div class="top-img" :style="dragBgStyle">
        <p class="move-img" :style="dragMiniStyle"></p>
        <p class="e-tips ripple fadeIn" v-if="showdragTip">{{ drgeTip }}</p>
      </div>
      <div class="bottom-tips">
        <p
          :class="progressR ? 'reds' : 'greens'"
          :style="progressWidth"
          v-show="showProgress"
        ></p>
        <p
          :class="progressR ? 'touch-btn' : 'success-btn'"
          :style="touchStyle"
          ref="touchMoves"
          @mousedown="moveStart"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import { imgVerify } from "../../server/axios";

import dragS from "../../assets/dragS.png";
import dragMove from "../../assets/dragMove.png";
export default {
  name: "Validation",
  props: {
    validTitle: {
      type: String,
      default() {
        return this.$t("drag.title");
      },
    },
  },
  data() {
    return {
      // loading框
      showLoading: true,
      // loading-icon
      isLoading: true,
      // errorLoading
      isError: false,
      loadingColor: "#fe5400",
      loadingHeight: "140px",
      loadingWidth: "140px",
      showdragTip: false,
      drgeTip: "",
      showProgress: false,
      // 颜色
      progressR: true,
      commonStyle: {
        width: "297px",
      },
      dragBgStyle: {
        backgroundImage: "",
        width: "297px",
        height: "180px",
      },
      dragMiniStyle: {
        backgroundImage: "",
        width: "0",
        height: "0",
        top: "0",
        left: "0",
      },
      touchStyle: {
        width: "0",
        left: "0",
        backgroundImage: "",
      },
      progressWidth: {
        width: "0",
      },
      // 方块图
      dragImg: "",
      // 此时的图片验证码的key
      dragImgKey: "",
      // 当前屏幕的宽度
      screenWidth: document.body.clientWidth,
      // 缩放比例(大小的背景)
      dragLis: 1,
      // 移动X轴的距离
      locationX: 0,
      // 移动条距离屏幕左边的距离
      dragLeft: 0,
      // 图片宽度
      placeWidth: 0,
      touchWidth: 0,
      testX: 0,
      //   测试添加
      isMouseDown: false, // 为了辨认鼠标是否被按下的行为确认
    };
  },
  created() {
    this.getVerifyImage();
  },
  methods: {
    // 获取验证码图片
    getVerifyImage() {
      imgVerify.outDragImg().then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.testX = data.testX;
          // 拖动图片的背景比例计算,宽高比
          let SizeCor = data.sourceImgWidth / data.sourceImgHeight;
          // 计算图片的宽度(根据屏幕的宽度)
          let bgWidth = this.screenWidth * 0.25;
          // 计算背景图片的高度
          let bgHeight = bgWidth / SizeCor;
          this.dragImgKey = data.dragImgKey;
          let newBI = new Image();
          newBI.src = data.bigImgName;
          newBI.onload = () => {
            this.dragBgStyle = {
              backgroundImage: `url("${newBI.src}")`,
              width: bgWidth + "px",
              height: bgHeight + "px",
            };
            this.showLoading = false;
          };
          // 计算小方块的宽高比
          this.dragLis = data.sourceImgWidth / bgWidth;
          let miniH = data.smallImgHeight / this.dragLis;
          let miniW = data.smallImgWidth / this.dragLis;
          let miniTop = data.locationy / this.dragLis;
          this.dragMiniStyle = {
            backgroundImage: `url("${data.smallImgName}")`,
            height: miniH + "px",
            width: miniW + "px",
            top: miniTop + "px",
            left: "0",
          };
          // 拖动条
          this.touchStyle = {
            width: miniW + "px",
            left: 0,
            backgroundImage: "url(" + dragMove + ")",
          };
          this.commonStyle = { width: bgWidth + 20 + "px" };
          this.placeWidth = bgWidth;
          this.touchWidth = miniW;
          this.isError = false;
        } else {
          this.isLoading = false;
          this.isError = true;
        }
      });
    },
    // 当在屏幕上按下手指时触发
    moveStart() {
      this.showdragTip = false;
      this.showProgress = true;
      this.isMouseDown = true; // 鼠标操作按下确认
      this.dragLeft = this.$refs.touchMoves.getBoundingClientRect().left; //小滑块的位置，距离左边的距离
    },
    // 当在屏幕上移动鼠标时触发
    moving(e) {
      if (!this.isMouseDown) {
        return;
      }
      e.preventDefault();
      let dragLeft = this.dragLeft;
      let lefts = e.clientX - dragLeft - 50;
      let maxLf = this.placeWidth - this.touchWidth;
      if (lefts <= 0) {
        this.dragMiniStyle.left = "0";
        this.touchStyle.left = "0";
        this.locationX = "0";
      } else if (lefts > 0 && lefts < maxLf) {
        this.dragMiniStyle.left = lefts + "px";
        this.touchStyle.left = lefts + "px";
        this.locationX = Math.round(lefts * this.dragLis);
      } else {
        this.dragMiniStyle.left = maxLf + "px";
        this.touchStyle.left = maxLf + "px";
        this.locationX = Math.round(maxLf * this.dragLis);
      }
      this.progressWidth.width = this.touchStyle.left;
    },
    // 当在屏幕上抬起手指时触发
    moveEnd() {
      if (!this.isMouseDown) {
        return;
      }
      this.isMouseDown = false;
      this.showLoading = true;
      this.isLoading = true;
      this.checkDrag();
    },
    // 验证
    checkDrag() {
      // locationx, dragImgKey
      imgVerify.checkDragImg(this.locationX, this.dragImgKey).then((res) => {
        if (res.code == 200) {
          let maxLf = this.placeWidth - this.touchWidth;
          setTimeout(() => {
            this.touchStyle.left = maxLf + "px";
            this.progressR = false;
            this.touchStyle.backgroundImage = "url(" + dragS + ")";
            this.progressWidth.width = maxLf + "px";
            this.$emit("dragSuccess", this.locationX, this.dragImgKey);
          }, 800);
        } else {
          this.showdragTip = true;
          this.drgeTip = `${res.msg}`;
          this.locationX = 0;
          this.progressWidth.width = 0;
          setTimeout(() => {
            this.getVerifyImage();
          }, 800);
        }
      });
    },
    // 网络错误
    renew() {
      this.locationX = 0;
      this.progressWidth.width = 0;
      this.getVerifyImage();
    },
    // 关闭
    hideVaild() {
      this.$emit("closeValid");
    },
  },
};
</script>

<style lang="scss" scoped>
.validation {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.67);
  z-index: 10000;
  .close {
    margin-top: 5rem;
    text-align: right;
    font-size: 30px;
    .icon-close {
      margin-right: 120px;
      cursor: pointer;
      color: white;
    }
  }
  // 标题
  h1 {
    font-size: 16px;
    color: white;
    font-weight: 500;
    text-align: center;
    margin-top: 1.6rem;
    margin-bottom: 1.4667rem;
  }
  // 图片区域
  .drge-img {
    background-color: #ffffff;
    border-radius: 0.1333rem;
    border: solid 1px #dcdcdc;
    padding: 10px;
    margin: 0 auto;
    position: relative;
    .loading {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(205, 205, 205, 0.76);
      text-align: center;
      z-index: 10;
      .load {
        margin-top: 100px;
      }
      .tips {
        margin-top: 100px;
        color: white;
      }
    }
    .top-img {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 125px;
      position: relative;
      .move-img {
        position: absolute;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        /* border: 1px solid red; */
        box-sizing: border-box;
      }
      .e-tips {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        line-height: 35px;
        height: 35px;
        color: white;
        background-color: #fe5400;
      }
    }
    .bottom-tips {
      margin-top: 0.5rem;
      background-color: #eeeeee;
      height: 50px;
      line-height: 50px;
      text-align: center;
      position: relative;
      .touch-btn {
        position: absolute;
        top: 0;
        height: 50px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
      }
      .success-btn {
        position: absolute;
        top: 0;
        height: 50px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: white;
        cursor: pointer;
      }
      .reds {
        position: absolute;
        top: 0;
        left: 0;
        height: 50px;
        background-color: #fe5400;
      }
      .greens {
        position: absolute;
        top: 0;
        left: 0;
        height: 50px;
        background-color: #30ca99;
        color: white;
      }
    }
  }
}
</style>
