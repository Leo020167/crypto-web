<template>
  <div class="header-container">
    <div class="header-logo">
      <img :src="require('../../assets/logo.png')" class="gzlogo" alt="LOGO" />
    </div>
    <ul class="nav-container">
      <li class="nav-item">
        <router-link to="/trading">{{ $t('header.trading') }}</router-link>
      </li>
      <li class="nav-item" v-if="currentUserInfos.token">
        <router-link to="/focusBrand">{{ $t('header.subscribe') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/legalPurchase">{{ $t('header.otc') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/newTradeIndex">{{
          $t('header.chuangxinshiyanqu')
        }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/pledge">{{ $t('pledge.title') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/industry-news">{{ $t('hangyedongtai') }}</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/about">{{ $t('guanyuwomen') }}</router-link>
      </li>
    </ul>

    <ul class="login-and-register-container flex items-center">
      <li class="flex items-center justify-center">
        <el-dropdown trigger="click" placement="bottom">
          <img
            alt=""
            :src="`/languages/${localeStorage.locale}.png`"
            class="w-6 h-6 flex items-center justify-center cursor-pointer"
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="locale in localeStorage.locales"
              :key="locale.value"
            >
              <a
                class="flex items-center justify-between text-[#333333] w-44"
                @click="localeStorage.setLocale(locale.value)"
              >
                <span>{{ locale.label }}</span>
                <span
                  class="el-icon-check"
                  v-if="locale.value === localeStorage.locale"
                ></span>
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>

      <!-- 是否登录  否：显示登录、注册；是：资产、个人头像 -->
      <template v-if="!currentUserInfos.token">
        <li class="nav-item">
          <router-link to="/login">{{ $t('common.login_btn') }}</router-link>
        </li>
        <router-link to="/register">
          <li class="nav-item register">{{ $t('common.regist_btn') }}</li>
        </router-link>
      </template>
      <template v-else>
        <li class="nav-item">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ $t('header.assets') }}
              <span class="total-asset"
                >({{ fixedNumber(userAsssetInfos.totalAssets) }}USDT)</span
              >
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="d">{{
                $t('newCommon.text41')
              }}</el-dropdown-item>

              <el-dropdown-item command="g">{{
                $t('newCommon.text66')
              }}</el-dropdown-item>
              <el-dropdown-item command="h">{{
                $t('newCommon.text68')
              }}</el-dropdown-item>
              <el-dropdown-item command="k">{{
                $t('newCommon.text69')
              }}</el-dropdown-item>
              <el-dropdown-item command="l">{{
                $t('newCommon.text70')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="ml-6">
          {{ currentUserInfos.user.userRealName }}
        </li>
        <li class="nav-header">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-links">
              <font-awesome-icon icon="user" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <div class="dropdown-people-tab" @click="myHome">
                <div class="dropdown-left">
                  <p class="phone-nums">{{ currentUserInfos.user.userName }}</p>
                  <p class="uid">UID:{{ currentUserInfos.user.userId }}</p>
                </div>
                <div class="dropdown-right">
                  <img
                    :src="currentUserInfos.user.headUrl"
                    class="phone-avatar"
                  />
                </div>
              </div>
              <router-link to="/user/authentication">
                <el-dropdown-item divided>{{
                  $t('header.verify')
                }}</el-dropdown-item>
              </router-link>
              <router-link to="/user/myCommunity">
                <el-dropdown-item>{{
                  $t('header.my_community')
                }}</el-dropdown-item>
              </router-link>
              <router-link to="/user/changeLoginPassword">
                <el-dropdown-item>{{
                  $t('header.modify_pw')
                }}</el-dropdown-item>
              </router-link>
              <router-link to="/user/changePhone">
                <el-dropdown-item>{{
                  $t('header.modify_phone')
                }}</el-dropdown-item>
              </router-link>
              <router-link to="/user/safePassword">
                <el-dropdown-item>{{
                  $t('header.set_password')
                }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="layOut">{{
                $t('header.logout')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { security } from '@/server/axios.js';
import { useLocaleStore } from '../../stores/locale';
export default {
  setup() {
    const localeStorage = useLocaleStore();
    return {
      localeStorage,
    };
  },
  data() {
    return {
      logo: '',
      showQrCode: false,
      langs: [{ label: 'Deutsch', value: 'zh_TW' }],
      msgVisible: false,
      pageNo: 1,
      messageList: [],
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
      userAsssetInfos: 'getTotalAsset',
      getMsgState: 'getMsgState',
    }),
  },

  methods: {
    getMymessage() {
      this.$router.push('/user/message');
    },
    // 资产跳转命令
    handleCommand(command) {
      if (command == 'a') {
        this.$router.push('/assets/futures');
      } else if (command == 'b') {
        this.$router.push('/assets/digital');
      } else if (command == 'c') {
        this.$router.push('/assets/follows');
      } else if (command == 'f') {
        this.$router.push({ name: 'f', query: { type: 'f' } });
      } else if (command == 'g') {
        this.$router.push({ name: 'g', query: { type: 'g' } });
      } else if (command == 'h') {
        this.$router.push({ name: 'h', query: { type: 'h' } });
      } else if (command == 'j') {
        this.$router.push({ name: 'j', query: { type: 'j' } });
      } else if (command == 'k') {
        this.$router.push({ name: 'k', query: { type: 'k' } });
      } else if (command == 'l') {
        this.$router.push({ name: 'l', query: { type: 'l' } });
      } else if (command == 'layOut') {
        security.loginOut().then((res) => {
          if (res.code === '200') {
            this.$store.dispatch('removeCurrentUserInfo'); // vuex备存
            // this.$router.push('/peopleList');
            this.$router.push("/login");
          }
        });
      } else {
        this.$router.push('/assets/balance');
      }
    },
    // 切换语言
    handleChangeLang(command) {
      localStorage.setItem('lang', command);
      location.reload();
    },
    // 格式化数据
    fixedNumber(num) {
      let n = Number(num).toFixed(2);
      return n;
    },
    // 我的资料
    myHome() {
      this.$router.push('/user/changeUserData');
    },
    // 跳转
    handleToOtherWeb() {
      // 跳转到其他web页面
      let lang =
        this.$i18n.locale == 'zh_CN'
          ? 'cn'
          : this.$i18n.locale == 'zh_TW'
          ? 'tw'
          : 'en';
      window.location.href = `https://www.wwctrade.com/?lang=${lang}`;
    },
  },
};
</script>

<style lang="scss" scope>
.header-container {
  width: 100%;
  height: 56px;
  position: relative;
  line-height: 56px;
  padding-left: 45px;
  background: #1b2945;
  box-shadow: 3px 0 3px #1b2945;
  color: #ffffff;
  display: flex;
  align-items: center;
  z-index: 5;
  .header-logo {
    cursor: pointer;
    .gzlogo {
      height: 40px;
      margin-right: 20px;
      vertical-align: middle;
    }
    .gzname {
      font-size: $h3;
    }
  }

  .nav-container {
    display: flex;
    margin-left: 40px;
    .nav-item {
      margin-left: 24px;
      font-size: 14px;
      color: #aeb9d8;
      transition: all 0.4s;
      vertical-align: top;
      display: inline-block;
      height: 56px;
      line-height: 56px;
      &:hover {
        color: #ffffff;
      }
      .activeNav {
        color: #ffffff;
        display: inline-block;
        height: 56px;
        line-height: 56px;
        border-bottom: 3px solid $color_main;
      }
    }
  }
  .login-and-register-container {
    float: right;
    display: flex;
    position: absolute;
    right: 30px;
    top: 0px;
    .else-tab {
      display: flex;
    }
    .total-asset {
      color: $color_info;
      display: inline-block;
      font-size: 12px;
    }
    .nav-item {
      margin-left: 24px;
      font-size: 14px;
      color: #aeb9d8;
      transition: all 0.4s;
      vertical-align: top;
      display: inline-block;
      height: 56px;
      line-height: 56px;
      cursor: pointer;
      &:hover {
        color: #ffffff;
      }
    }
    .el-dropdown-link {
      cursor: pointer;
      color: #aeb9d8;
      &:hover {
        color: #ffffff;
      }
    }

    .nav-header {
      padding-left: 24px;
      list-style-type: none;
    }
    .register {
      border: 1px solid $color_main;
      height: 28px;
      line-height: 28px;
      margin-top: 15px;
      padding-left: 16px;
      padding-right: 16px;
      border-radius: 2px;
      &:hover {
        color: #ffffff;
        background: $color_main;
      }
    }
    .downLoad {
      position: relative;
    }
    .qrcode-container {
      position: absolute;
      top: 46px;
      background: #ffffff;
      right: 0;
      display: flex;
      padding: 10px;
      width: 100px;
      z-index: 10000;
      transition: all 0.5s ease-in-out;
      .qrcode {
        width: 80px;
        height: 80px;
      }
      .downLoadTips {
        font-size: 15px;
        color: #000;
        margin-left: 15px;
        line-height: 20px;
      }
    }
    .el-dropdown-links {
      color: #aeb9d8;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
}
.pop-title {
  font-size: 16px;
  font-weight: bold;
  .io {
    font-size: 20px;
    color: $color_main;
    vertical-align: middle;
    margin-right: 5px;
  }
}
.pointerin {
  cursor: pointer;
}
.mesg-io {
  position: relative;
  .red-o {
    position: absolute;
    top: 18px;
    right: 0;
    height: 5px;
    width: 5px;
    background-color: red;
    border-radius: 50%;
  }
}
.lang {
  margin-left: 20px;
}
.dropdown-people-tab {
  cursor: pointer;
  display: flex;
  padding: 5px 18px 8px;
  .dropdown-left {
    flex: 1;
    .phone-nums {
      font-size: 14px;
    }
    .uid {
      margin-top: 8px;
      font-size: 12px;
      color: $color_info;
    }
  }
  .dropdown-right {
    margin-left: 15px;
    .phone-avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }
  }
}
</style>
