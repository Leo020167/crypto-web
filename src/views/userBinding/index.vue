<template>
  <div>
    <div class="userBinding">
      <!-- <div>
        <el-select style="width: 30%;border-radius: 30px;"
                   v-model="value"
                   @change="onChange()"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div> -->

      <div class="userBindingBtn">
        <div
          v-for="(item, index) in tabList"
          :key="index"
          class="userBindingBtn_info"
        >
          <div class="userBindingBtn_info_top">
            <img
              @click="activeIndex(index)"
              v-if="item.isBind == 0"
              src="../../assets/newIcons/active.jpg"
              alt=""
            />
            <img
              @click="activeIndex(index)"
              v-if="item.isBind == 1"
              src="../../assets/newIcons/active1.jpg"
              alt=""
            />
            <p style="font-size: 16px">
              {{ $t('newCommon.text26') }}{{ index + 1 }}
            </p>
          </div>

          <!-- 盈利部分 -->
          <div class="userBindingBtn_info_center">
            <div style="color: #666666; text-align: left">
              {{ $t('newCommon.text27') }} {{ item.profitRate }}%
              <p style="margin-top: 10px">
                {{ $t('newCommon.text64') }} {{ item.maxMultiNum }}
              </p>
            </div>
            <div style="color: #666666; text-align: left">
              {{ $t('newCommon.text28') }} {{ item.lossRate }}%
              <p style="margin-top: 10px; text-align: right">
                {{ $t('newCommon.text65') }} {{ item.tokenAmount }}
              </p>
            </div>
          </div>

          <!-- 到期 -->
          <div class="userBindingBtn_info_end">
            <div>
              <p style="color: #666666">{{ $t('newCommon.text29') }}</p>
              <p style="margin-top: 7px">{{ item.limit }}USDT</p>
            </div>
            <div>
              <p style="color: #666666">{{ $t('newCommon.text30') }}</p>
              <p style="margin-top: 7px">
                {{ item.duration }}{{ $t('newCommon.text45') }}
              </p>
            </div>
            <div v-if="item.isBind == 1 && item.expireTime != 0">
              <p style="color: #666666">{{ $t('newCommon.text31') }}</p>
              <p style="margin-top: 7px">{{ item.expireTime | formatDate }}</p>
            </div>
          </div>
        </div>
      </div>
      <button v-if="isActive == true" @click="putIndex()" class="buttons">
        {{ $t('newCommon.text32') }}
      </button>
    </div>

    <!-- 设置一个弹窗  v-if="flagView" -->
    <div class="bigYuedu" v-if="flagView"></div>
    <div class="yuedu" v-if="flagView">
      <div class="header">
        <span @click="handleRiskReminder">
          {{ $t('newCommon.text73') }}
        </span>
      </div>
      <!-- 最高倍数 -->
      <!-- baseUrl -->
      <div class="content" v-if="tabType == 0">
        <iframe
          style="width: 100%; height: 100%"
          :src="statementUrl"
          allowfullscreen="allowfullscreen"
          frameborder="0"
          data-id="1"
        ></iframe>
      </div>
      <!-- 风险说明书 -->
      <div class="content" v-if="tabType == 1">
        <iframe
          style="width: 100%; height: 100%"
          :src="statementUrl"
          allowfullscreen="allowfullscreen"
          frameborder="0"
          data-id="1"
        ></iframe>
      </div>
      <div @click="Ty" class="footer" v-if="tabType == 0">
        <span>{{ $t('newCommon.text48') }}</span>
      </div>
      <div @click="Ty" class="footer" v-if="tabType == 1">
        <span>{{ $t('newCommon.text74') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { assetsApi, security, baseUrl } from '@/server/axios.js';
export default {
  filters: {
    formatDate(value) {
      let date = new Date(parseInt(value * 1000));
      console.log(date);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? '0' + MM : MM;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      let h = date.getHours();
      h = h < 10 ? '0' + h : h;
      let m = date.getMinutes();
      m = m < 10 ? '0' + m : m;
      let s = date.getSeconds();
      s = s < 10 ? '0' + s : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
  },
  data() {
    return {
      statementUrl: '',
      flagView: false,
      userId: 0,
      options: [
        {
          value: '0',
          label: this.$t('newCommon.text33'),
        },
        {
          value: '1',
          label: this.$t('newCommon.text34'),
        },
        {
          value: '2 ',
          label: this.$t('newCommon.text35'),
        },
      ],
      value: '0',
      tabList: [],
      activeIndex1: 99999,
      isActive: true,
      multiNum: 0,
      tabType: 0,
    };
  },
  created() {
    security.getDetail1().then((res) => {
      console.log(res);
    });
    this.userId = this.$route.query.userId;
    this.getDataList();
  },
  methods: {
    // 点击风险提示书
    handleRiskReminder() {
      this.tabType = 1;
    },
    // 点击最高倍数
    handleHighestMultiple() {
      this.tabType = 0;
    },
    putIndex() {
      this.flagView = true;
    },
    handleAgree() {
      this.tabType = 0;
    },
    Ty() {
      this.flagView = false;
      this.getComs();
    },
    getComs() {
      if (this.activeIndex1 == 99999) {
        this.$message.warning(this.$t('newCommon.text50'));
        return;
      }
      this.$prompt(this.$t('newCommon.text46'), this.$t('newCommon.text47'), {
        confirmButtonText: this.$t('newCommon.text48'),
        cancelButtonText: this.$t('newCommon.text49'),
      })
        .then(({ value }) => {
          if (value == '') {
            this.$message.error('倍数必须填');
            return;
          }
          assetsApi
            .getApplyForFollow(
              this.userId,
              this.tabList[this.activeIndex1].id,
              value
            )
            .then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                setTimeout(() => {
                  this.$router.go(-1);
                }, 1000);
              } else {
                this.$message.warning(res.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          });
        });
    },
    // 获取当前时间，day为number，getDay(-1):昨天的日期;getDay(0):今天的日期;getDay(1):明天的日期;【以此类推】
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码

      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + '-' + tMonth + '-' + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = '0' + month;
      }
      return m;
    },
    //切换
    activeIndex(index) {
      if (this.isActive == 'false' || this.isActive == false) {
        return;
      }
      if (this.tabList[index].isBind == 1) {
        this.tabList[index].isBind = 0;
      } else {
        var num = 0;
        for (var i = 0; i < this.tabList.length; i++) {
          if (this.tabList[i].isBind == 1) {
            num++;
            this.tabList[i].isBind = 0;
            this.tabList[index].isBind = 1;
          }
        }
        if (num == 0) {
          this.tabList[index].isBind = 1;
        }
      }

      this.activeIndex1 = index;
    },
    onChange() {
      this.getDataList();
    },
    getDataList() {
      assetsApi.getTypes(this.userId, this.value).then((res) => {
        this.statementUrl = res.data.data.statementUrl;
        for (var i = 0; i < res.data.data.types.length; i++) {
          res.data.data.types[i].type = 0;
        }

        this.isActive = res.data.data.showBind;
        if (res.data.data.showBind == 'true') {
          this.isActive = true;
        }
        this.tabList = res.data.data.types;
      });
    },
  },
};
</script>

<style lang="scss">
.bigYuedu {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 88;
  background-color: #000;
  top: 0%;
  opacity: 0.5;
}
.yuedu {
  width: 30%;
  height: 38%;
  background-color: #fff;
  position: absolute;
  top: 18%;
  left: 36%;
  border-radius: 5px;
  z-index: 89;
  .header {
    width: 100%;
    background-color: red;
    text-align: center;
    color: #fff;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 5px 10px;
      border: 1px solid #fff;
      border-radius: 5px;
      display: block;
      height: 30px;
      cursor: pointer;
      line-height: 17px;
      box-sizing: border-box;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .content {
    width: 100%;
    margin-top: 2px;
    height: 68%;
    padding: 0 4px;
  }
  .footer {
    width: 100%;
    height: 50px;
    color: #fff;
    border-top: 1px solid #959595;
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 5px 10px;
      border: 1px solid red;
      border-radius: 5px;
      display: block;
      height: 30px;
      cursor: pointer;
      line-height: 17px;
      box-sizing: border-box;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: red;
    text-align: center;
    color: #fff;
  }
}
.userBinding {
  width: 100%;
  height: 700px;
  background-color: #f1f0f6;
  padding: 30px 0 30px 30px;
  margin: 0 auto;
  text-align: center;
}
.userBindingBtn {
  width: 30%;
  margin: 0 auto;
  margin-top: 40px;
  .userBindingBtn_info_end {
    width: 90%;
    margin-left: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    div {
      display: flex;
      flex-direction: column;
      text-align: left;
      color: #000000;
    }
  }
  .userBindingBtn_info {
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    margin-top: 20px;
    margin: 0 auto;
    .userBindingBtn_info_center {
      width: 90%;
      margin-left: 5%;
      margin-right: 5%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #000000;
      margin-top: 10px;
      margin-bottom: 14px;
    }
    .userBindingBtn_info_top {
      margin-top: 10px;
      margin-left: 10px;
      display: flex;
      align-items: center;
      img {
        width: 25px;
      }
      p {
        color: #000000;
        margin-left: 10px;
      }
    }
  }
}
.buttons {
  width: 100px;
  height: 40px;
  background-color: #fc6e1c;
  border-radius: 5px;
  color: #ffffff;
  margin-top: 25px;
}
</style>
