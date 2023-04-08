<template>
  <div class="home-container">
    <VHeader></VHeader>
    <div class="main">
      <div class="content-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Header from './layout/Header.vue';
import { mapGetters } from 'vuex';
import { ReflashAccountSeconds } from '@/utils/Enums';
import { security } from '@/server/axios.js';
export default {
  components: {
    VHeader: Header,
  },
  data() {
    return {
      // 定时器
      intervalSetter: '',
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
  },
  created() {
    this.intervalSetter = setInterval(() => {
      // 判断token是否存在，存在即开始定时刷新账户数据
      if (this.currentUserInfos.token) {
        this.getGloblAccountData();
      }
    }, ReflashAccountSeconds);
    this.getDangerRate();
  },
  methods: {
    // 在登录的状态下，全局获取资产账户页
    getGloblAccountData() {
      this.$store.dispatch('getGlobalAccountData');
    },
    getDangerRate() {
      security.getDangerRateInfo().then((res) => {
        if (res.code == 200) {
          let text = res.data.riskRateDesc;
          sessionStorage.setItem('riskRateDesc', text);
        }
      });
    },
  },
  beforeDestroy() {
    window.clearInterval(this.intervalSetter);
    this.intervalSetter = null;
  },
};
</script>

<style lang="scss" scope>
.home-container {
  width: 100%;
  height: 100%;
  min-width: 1280px;
  .main {
    width: 100%;
    height: calc(100% - 56px);
    color: #e5ebf5;
    .content-container {
      margin: 0 auto;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      position: relative;
      background: #252a44;
      @include scrollBar;
    }
  }
}
</style>
