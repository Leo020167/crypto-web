<template>
  <div class="legalPurchase-container">
    <!-- 头部的tab -->
    <div
      class="top-container"
      :style="{ background: isEasyTrade ? '#00285C' : '#1A1F33' }"
    >
      <div class="top-content">
        <ul class="left">
          <li :class="!isEasyTrade ? 'auto-tab act' : 'auto-tab'">
            <router-link to="/legalPurchase/freeTrade">
              <!-- 自选交易 -->
              {{ $t('otc.zixuanjiaoyi') }}
            </router-link>
          </li>
          <li :class="isEasyTrade ? 'fast-tab act' : 'fast-tab'">
            <router-link to="/legalPurchase/easyTrade">
              <!-- 一键买卖 -->
              {{ $t('otc.yijianmaimai') }}
            </router-link>
          </li>
        </ul>
        <div class="right">
          <div class="item-tab">
            <img
              src="../../assets/newIcons/tab-icon-1.png"
              @click="handleToRecord"
              class="record-img"
            />
          </div>
          <el-popover class="item-tab" placement="bottom" v-model="tabVisible">
            <div clss="tab-inbox">
              <p class="initem" @click="golink(0)">
                <img
                  src="../../assets/newIcons/adv.png"
                  style="width: 22px; vertical-align: middle"
                />
                <span class="name">
                  <!-- 我的广告 -->
                  {{ $t('otc.myadv') }}
                </span>
              </p>
              <p class="initem" @click="golink(1)">
                <img
                  src="../../assets/newIcons/authentication.png"
                  style="width: 22px; vertical-align: middle"
                />
                <span class="name">
                  <!-- 商家认证 -->
                  {{ $t('otc.certificate') }}
                </span>
              </p>
              <p class="initem end" @click="golink(2)">
                <img
                  src="../../assets/newIcons/collection.png"
                  style="width: 22px; vertical-align: middle"
                />
                <span class="name">
                  <!-- 收款管理 -->
                  {{ $t('otc.management') }}
                </span>
              </p>
            </div>
            <img
              slot="reference"
              src="../../assets/newIcons/tab-icon-2.png"
              class="other-img"
            />
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 中部的内容 切换头部tab 背景颜色-->
    <div
      class="lemain-container"
      :style="{ background: isEasyTrade ? '#00285C' : '#ffffff' }"
    >
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabVisible: false,
    };
  },
  methods: {
    golink(i) {
      let router =
        i == 0
          ? '/legalPurchase/myAdv'
          : i == 1
          ? '/legalPurchase/certificate'
          : '/legalPurchase/gatherWay';
      this.$router.push(router);
      this.tabVisible = false;
    },
    // 前往余额账户-法币记录tab
    handleToRecord() {
      this.$router.push({
        path: '/assets/balance',
        query: {
          currentTabNumber: 3,
        },
      });
    },
  },
  computed: {
    // 是否是一键买卖的tab
    isEasyTrade() {
      return this.$route.path.includes('easyTrade');
    },
  },
};
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
