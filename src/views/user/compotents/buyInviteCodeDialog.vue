<template>
  <div class="dialog-container">
    <el-dialog :visible.sync="ifShowDialog" @close="closeDialog">
      <!-- 填入数据 -->
      <p class="dialog-title">{{ $t('community.details') }}</p>
      <el-input
        v-model="number"
        @input="watchInviteCode"
        :placeholder="$t('community.input_invite_tip')"
        style="width: 90%"
      ></el-input>
      <!-- 源计算 -->
      <div class="remote-cul">
        <div class="cul-item left">
          <p class="cul-title">{{ $t('community.fee') }} {{ count }}</p>
        </div>
      </div>
      <!-- 温馨提示、确认按钮 -->
      <div class="operation">
        <div class="right">
          <el-button type="primary" @click="enterMetion">{{
            $t('assets.confirm')
          }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'buyInviteCodeDialog',
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
    inviteCodePrice: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      number: '', //购买数量
      count: 0,
    };
  },
  computed: {
    ifShowDialog: {
      get() {
        return this.showDialog;
      },
      set() {
        return this.showDialog;
      },
    },
  },
  created() {
    if (this.inviteCodePrice) {
      this.count = this.inviteCodePrice;
    }
  },
  methods: {
    // 对邀请码数量进行监听
    watchInviteCode() {
      this.count = this.inviteCodePrice;
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('closeBuyInviteCode');
    },
    // 提币确认
    enterMetion() {
      if (this.number) {
        this.$emit('confirmBuyInviteCode', this.count);
      } else {
        this.$message({
          type: 'error',
          message: '请输入兑换数量',
        });
      }
    },
  },
};
</script>

<style lang="scss" scope>
.dialog-container {
  .tip {
    display: flex;
    background-color: #f9e5de;
    padding: 11px 13px;
    border: 2px solid #fcc6c6;
    border-radius: 5px;
    .left {
      .el-icon-warning {
        color: $color_danger;
        font-size: 14px;
      }
    }
    .right {
      flex: 1;
      margin-left: 9px;
      .tip-title {
        font-size: 13px;
        line-height: 14px;
      }
      .tip-text {
        font-size: 13px;
        margin-top: 2px;
        line-height: 21px;
      }
    }
  }
  .dialog-title {
    font-size: 13px;
    color: #aeaeae;
    padding-bottom: 12px;
  }
  .remote-cul {
    display: flex;
    margin-top: 20px;
    .cul-item {
      flex: 1;
      &.left {
        margin-right: 10px;
      }
      &.right {
        margin-left: 10px;
      }
      .cul-title {
        font-size: 13px;
        color: #aeaeae;
        padding-bottom: 12px;
      }
    }
  }
  .operation {
    display: flex;
    margin-top: 10px;
    color: #aeaeae;
    .left {
      flex: 1;
      font-size: 12px;
      line-height: 16px;
      ul {
        padding-left: 12px;
        li {
          list-style-type: disc;
        }
      }
    }
    .right {
      padding-top: 17px;
    }
  }
}
</style>
