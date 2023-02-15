<!--币种介绍-->
<template>
  <el-drawer
    title
    class="introduction-drawer"
    :visible.sync="ifShowDrawer"
    :append-to-body="true"
    :before-close="handleCloseDrawer"
    :with-header="false"
  >
    <div class="introduction-container">
      <h4 class="title">概况</h4>
      <div class="coinname display-flex">
        <span class="name">{{coinIntroduction.symbol}}</span>
        <el-button type="primary" size="small" @click="handleToTrade(coinIntroduction)">交 易</el-button>
      </div>
      <div class="introduction-content">
        <p class="content-item display-flex">
          <span class="item-title">币种名称</span>
          <span class="item-content">{{coinIntroduction.name}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">发行时间</span>
          <span class="item-content">{{coinIntroduction.issueDate}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">发行总量</span>
          <span class="item-content">{{coinIntroduction.issueAmount}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">流通总量</span>
          <span class="item-content">{{coinIntroduction.circulateAmount}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">众筹价格</span>
          <span class="item-content">{{coinIntroduction.crowdfundPrice}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">白皮书</span>
          <span class="item-content">{{coinIntroduction.whitePaperUrl}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">官网</span>
          <span class="item-content">{{coinIntroduction.officialWebUrl}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">区块查询</span>
          <span class="item-content">{{coinIntroduction.blockUrl}}</span>
        </p>
        <p class="content-item display-flex">
          <span class="item-title">简介</span>
        </p>
        <p
          class="content-item introduction"
        >{{coinIntroduction.desc}}</p>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    // 是否展示弹框
    showDrawer: {
      type: Boolean,
      default: false
    },
    // 币种名称
    coinIntroduction: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ifShowDrawer: {
      get() {
        return this.showDrawer;
      },
      set() {
        return this.showDrawer;
      }
    }
  },
  methods: {
    handleCloseDrawer(done) {
      this.$emit("onCloseDrawer");
      done();
    },
    handleToTrade(coinIntroduction) {
      this.$emit('toTrade', coinIntroduction)
    }
  }
};
</script>

<style lang="scss" scope>
.introduction-container{
  padding: 20px;
  .title {
    margin-bottom: 20px;
  }
  .coinname {
    .name {
      font-size: 17px;
    }
  }
  .introduction-content {
    margin-top: 10px;
    .content-item {
      line-height: 30px;
      .item-title {
        color: #9ca9b5;
        font-size: 14px;
      }
      .item-content {
        color: #596a7a;
        font-size: 13px;
      }
    }
    .introduction {
      font-size: 12px;
      line-height: 18px;
    }
  }
}
</style>

<style lang="scss">
  .introduction-container{
    .el-button {
      width: 100px;
      font-size: 14px;
      background: #2145ae;
    }
  }
</style>