<template>
  <div class="bg-[rgb(14,26,50)]">
    <section
      class="relative bg-top bg-no-repeat pb-24"
      style="
        background-image: url('img/banner.a237a6bb.png');
        background-size: 100%;
      "
    >
      <div class="relative z-50 pb-12">
        <div class="container mx-auto flex items-start justify-between pt-24">
          <div class="w-5/12">
            <div class="text-left">
              <div class="text-3xl font-bold lg:text-4xl">
                值得用户信赖的加密货币交易平台
              </div>
              <div class="mt-2 text-xs font-light opacity-50 lg:text-base">
                竭力承诺以严格协议和行业领先的技术措施为用户安全保驾护航
              </div>
            </div>
            <div class="flex items-center gap-2 py-6">
              <button
                @click="handleClick"
                class="btn w-5/12 rounded-sm bg-blue-600 px-8 py-1 text-white hover:bg-blue-500"
                style="height: 40px"
              >
                去交易
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="grid-col-3 container mt-8 grid grid-cols-3 gap-x-6 pb-8">
        <img
          src="/img/lQDPJxejoC1Xcm7NAU3NAyCw5MdNT4-b574EI4TFD0D-AA_800_333.jpg_720x720q90g.jpg"
          alt=""
          class="block w-full rounded-lg"
        />
        <img
          src="/img/lQDPJwY7GhPlR47NAU3NAyCw8U4AKG9x4sAEI4naccDMAA_800_333.jpg_720x720q90g.jpg"
          alt=""
          class="block w-full rounded-lg"
        />
        <img
          src="/img/lQDPJx1S0TVHva7NAU3NAyCwx0zDV9qDox8EI4atPcB8AA_800_333.jpg_720x720q90g.jpg"
          alt=""
          class="block w-full rounded-lg"
        />
      </div>
    </section>

    <MarketTrend />

    <section class="py-8">
      <div class="container mx-auto">
        <div class="text-center">
          <div class="block-title text-4xl">产品和服务</div>
          <div class="block-subtitle mx-auto mt-3 w-1/2 text-base">
            为全球数百万用户提供安全可靠的数字资产交易和资产管理服务，助力区块链经济演进，重塑行业新生态格局
          </div>
        </div>
        <div class="grid gap-8 py-20 text-center lg:grid-cols-3">
          <div class="card flex flex-col bg-opacity-0 py-3">
            <img
              src="/img/adicon-3.e3712dc4.png"
              alt=""
              class="mx-auto my-4 mb-8 h-40 w-60"
            />
            <div>
              <p class="text-xl">全球布局</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                在全球多个国家都建立了当地的服务中心，将多种商业形式融为一体
              </p>
            </div>
          </div>
          <div class="card bg-opacity-0 py-3">
            <img
              src="/img/adicon-2.ec6e0988.png"
              alt=""
              class="mx-auto mb-8 mt-4 h-40 w-60"
            />
            <div>
              <p class="text-xl">系统安全</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                专业的分布式架构和防DoS攻击系统，冷热钱包分离，用户资产多维保护
              </p>
            </div>
          </div>
          <div class="card bg-opacity-0 py-3">
            <img
              src="/img/adicon-1.0363c6da.png"
              alt=""
              class="my-4 mb-8 h-40 w-auto"
            />
            <div style="width: 100%; text-align: center">
              <p class="text-xl">流畅的交易体验</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                采用高效的撮合交易引擎，确保交易体验顺畅，每秒可处理数百万笔订单，并为2000多万在线用户的平稳运行支付费用
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer
      class="footer-bar hidden bg-[rgb(16,35,62)] bg-cover bg-no-repeat text-sm text-gray-500 lg:block"
    >
      <div class="container py-4 lg:py-8">
        <div class="text-xs lg:flex lg:items-center lg:justify-between">
          <img src="/img/logo.png" alt="" class="h-6 lg:h-12" />
          <div class="lg:text-right">
            <div class="mt-4">Cryptographe全球优质数字资产</div>
            <div class="mt-2">
              Copyright © 2021 - Cryptographe All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import MarketTrend from '@/components/MarketTrend.vue';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
  },
  methods: {
    handleClick() {
      if (this.currentUserInfos.token) {
        this.$router.push('/trading');
      } else {
        this.$router.push('/Login');
      }
    },
  },
  components: { MarketTrend },
};
</script>

<style lang="scss" scope></style>
