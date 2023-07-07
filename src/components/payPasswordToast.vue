<template>
  <div class="pwd-container">
    <div class="bg" @click="hidePwd"></div>
    <div class="input-container">
      <h2>
        {{ $t('qingshurujiaoyimima') }}:<i
          class="el-icon-close"
          @click="hidePwd"
        ></i>
      </h2>
      <form autocomplete="off" class="setPwd-container">
        <div class="setPwd1">
          <input
            type="number"
            maxlength="6"
            @input="changePwd1"
            autocomplete="new-password"
            v-model="pwd1"
            ref="pwd1"
            name="pwd1"
            class="phone"
            :placeholder="$t('qingshuru6weijiaoyimima')"
          />
          <ul class="pwd-wrap" @click="focusPwd1">
            <li :class="pwd1.length == 0 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 0"></i>
            </li>
            <li :class="pwd1.length == 1 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 1"></i>
            </li>
            <li :class="pwd1.length == 2 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 2"></i>
            </li>
            <li :class="pwd1.length == 3 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 3"></i>
            </li>
            <li :class="pwd1.length == 4 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 4"></i>
            </li>
            <li :class="pwd1.length == 5 && showPwd1Brink ? 'psd-blink' : ''">
              <i v-if="pwd1.length > 5"></i>
            </li>
          </ul>
        </div>
      </form>
      <div class="pwd-tips">
        <p :class="errormsg ? 'Msg error' : 'Msg'">
          {{ errormsg ? errormsg : $t('qingshuru6weijiaoyimima') }}
        </p>
        <span class="forget" @click="forgetPwd">
          {{ $t('jiaoyimimaguanli') }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pwd1: '',
      showPwd1Brink: false,
    };
  },
  props: ['errormsg', 'showError'],
  mounted() {
    this.focusPwd1();
  },
  watch: {
    errormsg() {
      this.pwd1 = '';
      this.focusPwd1();
    },
  },
  methods: {
    hidePwd() {
      this.$emit('hidePwd');
    },
    changePwd1() {
      if (this.pwd1.length >= 6) {
        this.pwd1 = this.pwd1.slice(0, 6);
        this.$emit('getPwd', this.pwd1);
      }
    },
    focusPwd1() {
      this.$refs.pwd1.focus();
      this.showPwd1Brink = true;
    },
    forgetPwd() {
      this.$router.push('/user/safePassword');
    },
  },
};
</script>

<style lang="scss" scoped>
.pwd-container {
  .bg {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 3;
    top: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.7);
  }
  .input-container {
    position: fixed;
    width: 450px;
    height: 200px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 9999999999999;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    border: solid 1px #e5e5e5;
    padding: 15px 20px;
    h2 {
      font-size: 15px;
      box-sizing: border-box;
      padding-bottom: 11px;
      color: $globalTextColor;
      border-bottom: 1px solid rgba(205, 205, 205, 0.32);
      .el-icon-close {
        float: right;
        font-size: 15px;
        cursor: pointer;
      }
    }
    .phone {
      outline: none;
      border: none;
      width: 180px;
    }
    .pwd-tips {
      margin-top: 120px;
      margin-left: 40px;
      font-size: 13px;
      color: #959595;
      display: flex;
      .Msg {
        flex: 1;
        &.error {
          color: #ff4835;
        }
      }
      .forget {
        color: #376eb8;
        font-size: 13px;
        margin-right: 40px;
        cursor: pointer;
      }
    }
    .setPwd1 {
      padding-left: 12px;
      font-size: 15px;
      position: relative;
      background: #ffffff !important;
      margin-top: 36px;
      input {
        position: absolute;
        left: 100px;
        width: 50%;
      }
      .psd-blink {
        display: inline-block;
        background: url('../assets/blink.gif') no-repeat center;
      }
      .pwd-wrap {
        width: 80%;
        height: 60px;
        padding-bottom: 1px;
        margin: 0 auto;
        margin-top: 0px;
        background: #fff;
        border: 1px solid #ddd;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        cursor: pointer;
        position: absolute;
        left: 0px;
        right: 0;
        top: 0%;
        z-index: 10;
        li {
          list-style-type: none;
          text-align: center;
          line-height: 60px;
          background-color: #f4f4f4;
          -webkit-box-flex: 1;
          flex: 1;
          -webkit-flex: 1;
          border-right: 1px solid #dcdcdc;
          &:last-child {
            border-right: 0;
          }
          i {
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #000;
            display: inline-block;
          }
        }
      }
    }
    .submit {
      margin-top: 44px;
      width: 301px;
      height: 52px;
      background-image: linear-gradient(-90deg, #fe5400 0%, #fe7629 100%);
      border-radius: 4px;
      color: #ffffff;
      margin-left: 50px;
      text-align: center;
      line-height: 52px;
      cursor: pointer;
    }
  }
}
</style>
