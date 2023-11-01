<template>
  <div class="bg-[rgb(14,26,50)]">
    <section class="relative bg-top bg-no-repeat pb-24 head">
      <div class="relative z-50 pb-12">
        <div class="container mx-auto flex items-start justify-between pt-24">
          <div class="w-5/12">
            <div class="text-left">
              <div class="text-3xl font-bold lg:text-4xl">
                {{ $t('home.title') }}
              </div>
              <div class="mt-2 text-xs font-light opacity-50 lg:text-base">
                {{ $t('home.description') }}
              </div>
            </div>
            <div class="flex items-center gap-2 py-6">
              <button
                @click="handleClick"
                class="btn w-5/12 rounded-sm bg-blue-600 px-8 py-1 text-white hover:bg-blue-500"
                style="height: 40px"
              >
                {{ $t('qujiaoyi') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <HomeBanner />

    <MarketTrend />

    <section class="py-8">
      <div class="container mx-auto">
        <div class="text-center">
          <div class="block-title text-4xl">{{ $t('chanpinhefuwu') }}</div>
          <div class="block-subtitle mx-auto mt-3 w-1/2 text-base">
            {{ $t('chanpinhefuwu2') }}
          </div>
        </div>
        <div class="grid gap-8 py-20 text-center lg:grid-cols-3">
          <div class="card flex flex-col bg-opacity-0 py-3">
            <img
              src="/img/adicon-3.e3712dc4.png"
              alt=""
              class="mx-auto my-4 mb-8 h-40 w-60 object-contain"
            />
            <div>
              <p class="text-xl">{{ $t('quanqiubuju') }}</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                {{ $t('quanqiubuju2') }}
              </p>
            </div>
          </div>
          <div class="card bg-opacity-0 py-3">
            <img
              src="/img/adicon-2.ec6e0988.png"
              alt=""
              class="mx-auto mb-8 mt-4 h-40 w-60 object-contain"
            />
            <div>
              <p class="text-xl">{{ $t('xitonganquan') }}</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                {{ $t('xitonganquan2') }}
              </p>
            </div>
          </div>
          <div class="card bg-opacity-0 py-3">
            <img
              src="/img/adicon-1.0363c6da.png"
              alt=""
              class="my-4 mb-8 h-40 w-auto object-contain"
            />
            <div style="width: 100%; text-align: center">
              <p class="text-xl">{{ $t('liuchangdejiaoyitiyan') }}</p>
              <p class="mt-1 px-4 text-sm leading-7 text-gray-400">
                {{ $t('liuchangdejiaoyitiyan2') }}
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
            <div class="mt-4">
              Nicheswap{{ $t('quanqiuyouzhishuzizichan') }}
            </div>
            <div class="mt-2">
              Copyright © 2021 - Nicheswap All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>

    <a
      :href="link"
      target="_blank"
      class="bg-white fixed right-20 bottom-20 w-12 h-12 rounded-full overflow-hidden"
    >
      <img
        src="/img/tab1_menu4.png"
        alt=""
        class="w-full h-full object-cover"
      />
    </a>
  </div>
</template>

<script>
import HomeBanner from '@/components/HomeBanner.vue';
import MarketTrend from '@/components/MarketTrend.vue';
import { useUserStore } from '@/stores/user';
import queryString from 'query-string';
import { mapGetters } from 'vuex';
export default {
  setup() {
    const store = useUserStore();

    const userInfo = store.userInfo?.user;

    const metadata = userInfo
      ? JSON.stringify({
          userId: userInfo?.userId,
          userName: userInfo?.userName,
          phone: userInfo?.phone,
          email: userInfo?.email,
          inviteName: userInfo?.inviteName,
          agencyCode: userInfo?.agencyCode,
        })
      : null;

    const link =
      `https://chat.ichatlink.net/widget/standalone.html?` +
      queryString.stringify(
        {
          eid: 'bddc07a2a2af8729822e70d4f153ed8a',
          clientid: userInfo?.userId,
          language: 'en',
          metadata,
        },
        {
          encode: false,
          skipEmptyString: true,
          skipNull: true,
        }
      );

    return { link };
  },
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
  components: { MarketTrend, HomeBanner },
};
</script>

<style lang="scss" scope>
.head {
  background-image: url('/img/banner.a237a6bb.png');
  background-size: 100%;
}
</style>
