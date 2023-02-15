<template>
  <transition name="slide-left">
    <div class="chatting">
      <!-- 聊天界面头部 -->
      <div class="chatting-header">
        <div class="chatting-title">
          <div class="left">
            <img :src="peopleData.headUrl" />
          </div>
          <div class="right">
            <h2>
              <!-- {{
                state == "buy"
                  ? $t("orderDetail.iamSeller")
                  : $t("orderDetail.iamBuyer")
              }} -->
              {{ peopleData.userName }}
            </h2>
            <p class="names">{{CurrentUserInfos.user.userRealName}}</p>
          </div>
        </div>
      </div>

      <!-- 聊天内容区域 -->
      <div ref="chattingContent" class="chatting-content">
        <div v-for="(item, index) in msgs" :key="index">
          <div
            v-if="item.userId == CurrentUserInfos.user.userId"
            class="chatting-item self clearfix"
          >
            <div class="msg-date">
              {{ returnNewTime(item.createTime) }}
            </div>
            <div class="msg-from">
              <div class="msg-content">
                <img
                  :src="item.say"
                  @click="handleBig(item.say)"
                  v-if="item.type == 'img'"
                  class="imgs"
                />
                <p v-else>{{ item.say }}</p>
              </div>
              <img :src="item.headUrl" alt="" />
            </div>
          </div>

          <div v-else class="chatting-item other clearfix">
            <div class="msg-date">
              {{ returnNewTime(item.createTime) }}
            </div>
            <div class="msg-from">
              <img :src="item.toHeadUrl" alt="" />
              <div class="msg-content">
                <img
                  :src="item.say"
                  @click="handleBig(item.say)"
                  v-if="item.type == 'img'"
                  class="imgs"
                />
                <p v-else>{{ item.say }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chatting-input">
        <el-input
          type="textarea"
          :rows="1"
          @keyup.enter.native="send"
          @input="newLine"
          style="margin-left: 5px;margin-top: 2px;"
          ref="textarea"
          v-model.trim="inputContent"
          :placeholder="$t('orderDetail.inputAndSend')"
        ></el-input>
        <div class="img-up">
          <i class="el-icon-picture">
            <input
              type="file"
              ref="file"
              name="file"
              class="upload__input"
              @change.prevent="handleChooseFile"
            />
          </i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { legalPurchaseApi, uploadImage } from "@/server/axios.js";
import { mapGetters } from "vuex";
import { transforTime } from "@/utils/time.js";
export default {
  name: "chatting",
  props: {
    peopleData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    state: {
      type: String,
      default: "buy",
    },
    orderId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      msgs: [],
      inputContent: "",
      oContent: {},
      oTextarea: {},
      isRedAI: false,
      // 允许上传的图片类型
      allowUploadImgFileTypes: [".jpg", ".jpeg", ".png"],
      getBaseChatTimeout: null,
    };
  },
  created() {
    // 先获取一次聊天数据
    this.getBaseChat();
    // 每秒刷一次聊天数据
    this.getBaseChatInterval();
  },
  watch: {
    msgs(val) {
      localStorage.msgs_group = JSON.stringify(val);
    },
  },
  computed: {
    ...mapGetters({
      CurrentUserInfos: "getCurrentUserInfos",
    }),
    name() {
      return "Justin";
    },
    avatarUrl() {
      return this.$store.state.avatarUrl;
    },
  },
  mounted() {
    setInterval(() => (this.isRedAI = !this.isRedAI), 2500);
    this.oContent = document.querySelector(".chatting-content");
    this.oContent.scrollTop = this.oContent.scrollHeight;
    this.oTextarea = document.querySelector("textarea");
    this.oContent.scrollTop = this.oContent.scrollHeight;
  },
  methods: {
    // 定时获取聊天数据
    getBaseChatInterval() {
      clearTimeout(this.getBaseChatTimeout);
      this.getBaseChatTimeout = setTimeout(() => {
        this.getBaseChat();
        this.getBaseChatInterval();
      }, 2000);
    },
    // 获取基础的聊天信息
    getBaseChat() {
      legalPurchaseApi.getChatRecord(this.orderId).then((res) => {
        if (res.code == 200) {
          this.msgs = res.data.reverse();
          setTimeout(
            () => (this.oContent.scrollTop = this.oContent.scrollHeight),
            0
          );
        }
      });
    },
    // 发送文字
    send() {
      if (this.inputContent === "") {
        this.$message.error(this.$t("orderDetail.contentTips"));
        return;
      } else {
        legalPurchaseApi
          .sendChat(this.orderId, "text", this.inputContent, "", "", "")
          .then((res) => {
            if (res.code == 200) {
              this.inputContent = "";
              this.getBaseChat();
            } else {
              this.$message.error(res.msg);
            }
          });
      }
    },
    handleBig(i) {
      this.$emit("preImage", i);
    },
    insertText(str) {
      str = str + ` `;
      const oTextarea = this.$refs.textarea;

      if (document.selection) {
        let sel = document.selection.createRange();

        sel.text = str;
      } else if (
        typeof oTextarea.selectionStart === "number" &&
        typeof oTextarea.selectionEnd === "number"
      ) {
        let startPos = oTextarea.selectionStart;
        let endPos = oTextarea.selectionEnd;
        let cursorPos = startPos;
        let tempVal = oTextarea.value;
        this.inputContent =
          tempVal.substring(0, startPos) +
          str +
          tempVal.substring(startPos, tempVal.length);
        cursorPos += str.length;
        oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;
      } else {
        oTextarea.value += str;
      }
      this.newLine();
    },
    newLine() {
      setTimeout(
        () => (this.oTextarea.scrollTop = this.oTextarea.scrollHeight),
        0
      );
    },
    returnNewTime(time) {
      return transforTime.returnAllTime(time);
    },
    // 选择图片
    handleChooseFile(e) {
      let file = e.target.files[0];
      let suffix = file.name.lastIndexOf(".");
      let fileType = file.name.substring(suffix);
      let fil = new FormData();
      fil.append("imageFiles", file);
      uploadImage({
        dir: "identityImage",
        type: "imageRetOriginal",
        imageFiles: fil,
      }).then((res) => {
        if (res.code == "200") {
          this.sendImage(res.data.imageUrlList[0]);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    sendImage(img) {
      legalPurchaseApi
        .sendChat(this.orderId, "img", "", img, 50, 50)
        .then((res) => {
          if (res.code == 200) {
            this.getBaseChat();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
  beforeDestroy() {
    clearTimeout(this.getBaseChatTimeout);
    this.getBaseChatTimeout = null;
  },
};
</script>

<style lang="scss" scoped>
$blue: #2196f3;

.chatting {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid #e3e3e3;
  .chatting-header {
    height: 70px;
    width: 100%;
    color: white;
    border-bottom: 1px solid #e3e3e3;
    .chatting-title {
      display: flex;
      padding: 18px 20px;
      .left {
        padding-top: 5px;
        img {
          height: 23px;
          border-radius: 50%;
          width: 23px;
        }
      }
      .right {
        padding-left: 18px;
        flex: 1;
        h2 {
          font-size: 16px;
          color: #1a1f33;
        }
        .names {
          margin-top: 5px;
          font-size: 12px;
          color: #3d3a50;
        }
      }
    }

    .chatting-menu {
      width: 30px;
      height: 30px;
      i.icon-menu {
        background: url("./icons/icon-index.svg") no-repeat;
        background-size: contain;
      }
    }
  }

  .chatting-content {
    flex: 1;
    width: 100%;
    overflow: auto;
    .chatting-item {
      padding: 10px;
      width: 100%;
      line-height: 24px;
      font-size: 14px;
      .msg-date {
        text-align: center;
        color: gray;
        font-size: 80%;
      }
      .msg-from {
        display: flex;
        align-items: center;
        span.loc {
          color: gray;
          font-size: 60%;
          margin-right: 5px;
        }
        .msg-author {
          font-size: 1.2rem;
        }
        img {
          width: 30px;
          height: 30px;
          border-radius: 15px;
        }
      }
      .msg-content {
        margin-top: 5px;
        background-color: #f2f5ff;
        max-width: 200px;
        padding: 6px 10px;
        border-radius: 10px;
        .imgs {
          width: 90px;
          height: 90px;
          margin-left: 0;
          cursor: pointer;
        }
      }
    }

    .chatting-item + .chatting-item {
      margin-top: 10px;
    }
    .self {
      .msg-from {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        img {
          margin-left: 10px;
        }
      }

      .msg-content {
        float: right;
        word-wrap: break-word;
        word-break: break-all;
        margin-right: 10px;
      }
    }

    .other {
      .msg-from {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span.loc {
          color: gray;
          font-size: 60%;
          margin-right: 5px;
        }
        img {
          margin-right: 10px;
        }
      }

      .msg-content {
        float: left;
        margin-left: 10px;
        word-wrap: break-word;
        word-break: break-all;
        background-color: #e3e3e3;
      }
    }

    .online {
      width: 200px;
      // max-width: 100%;
      margin: 3px auto;
      border-radius: 4px;
      text-align: center;
      background-color: #fffde7;
    }
  }

  .chatting-input {
    position: relative;
    display: flex;
    height: 40px;
    width: 100%;
    .emoji-display {
      position: absolute;
      width: 100%;
      height: 210px;
      background-color: white;
      top: -210px;
      left: 0;
      overflow-y: auto;
      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          padding: 2px 3px;
          font-size: 2.2rem;
        }
      }
    }
    textarea {
      flex: 1;
      resize: none;
      margin-left: 10px;
      padding-left: 3px;
      padding-right: 3px;
      height: 100%;
      line-height: 39px;
      font-size: 14px;
      border: none;
    }
    .img-up {
      width: 60px;
      height: 100%;
      text-align: center;
      line-height: 54px;

      position: relative;
      .el-icon-picture {
        color: #9a9a9a;
        font-size: 30px;
      }
      .upload__input {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        z-index: 5;
        cursor: pointer;
      }
    }
  }
}
::-webkit-scrollbar {
  width: 2px;
}
::-webkit-scrollbar-track {
  background: #f2f2f2;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  background: #f2f2f2;
}
::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.2);
}
</style>
