<template>
  <FadeComponent>
    <div class="personal-home" v-document-title :data-title="documentTitle">
      <div class="personal-top">
        <div class="personal-data">
          <div class="left">
            <img :src="personalData.headUrl" class="avtar" />
          </div>
          <div class="center">
            <p class="name">{{ personalData.userName }}</p>
            <p class="other">
              <span class="id">ID: {{ personalData.userId }}</span>
              <span class="days">
                <i class="el-icon-date"></i>
                {{ $t('vList.table.join') }}{{ personalData.days
                }}{{ $t('vList.table.day') }}
              </span>
            </p>
            <p class="Introduction">
              {{
                personalData.describes
                  ? personalData.describes
                  : $t('personalHome.earnMoney')
              }}
            </p>
          </div>
          <div class="right">
            <div class="botton-box">
              <el-button
                v-if="CurrentUserInfos.token && personalData.subIsFee == 0"
                class="button-mr"
                type="primary"
                size="mini"
                @click="attentionFee"
                >{{
                  personalData.myIsAttention === '0'
                    ? $t('personalHome.subscribe')
                    : $t('personalHome.alreadySub')
                }}</el-button
              >
              <el-popover v-else placement="bottom" width="350" trigger="click">
                <p class="orderName">
                  {{
                    personalData.myIsAttention === '0'
                      ? $t('personalHome.subscribe')
                      : $t('personalHome.xf')
                  }}
                  <span class="tip">{{
                    personalData.myIsAttention === '0'
                      ? $t('personalHome.tip1')
                      : personalData.isExpireTime == 0
                      ? `${transTime(personalData.expireTime)}${$t(
                          'personalHome.tip2'
                        )}`
                      : $t('personalHome.overDue')
                  }}</span>
                </p>
                <p class="input-box">
                  <el-input
                    v-model="orderAmount"
                    @input="culUsdtNumber"
                    :placeholder="$t('personalHome.ph1')"
                  >
                    <template slot="suffix">{{
                      personalData.subFeeType === 'day'
                        ? $t('personalHome.day')
                        : personalData.subFeeType === 'week'
                        ? $t('personalHome.week')
                        : $t('personalHome.month')
                    }}</template>
                    <template slot="append">{{
                      personalData.subFeeTypeName
                    }}</template>
                  </el-input>
                </p>
                <p class="last-usdt">
                  {{ $t('personalHome.avail') }}
                  {{ BalanceInfos.holdAmount }} USDT
                </p>
                <p class="tip-order">{{ personalData.subNotice }}</p>
                <div class="order-bottom">
                  <p class="left">
                    {{ $t('personalHome.total') }}
                    <span class="tip-usdt">{{ totalAttentionFee }}USDT</span>
                  </p>
                  <el-button type="primary" @click="buyAttention">{{
                    personalData.myIsAttention === '0'
                      ? $t('personalHome.subscribe')
                      : $t('personalHome.xf')
                  }}</el-button>
                </div>
                <el-button
                  slot="reference"
                  v-show="CurrentUserInfos.token"
                  class="button-mr"
                  type="primary"
                  size="mini"
                  >{{
                    personalData.myIsAttention === '0'
                      ? $t('personalHome.subscribe')
                      : $t('personalHome.xf')
                  }}</el-button
                >
              </el-popover>
              <el-button
                v-show="CurrentUserInfos.token"
                type="primary"
                size="mini"
                @click="changePersonalBind(personalData.myIsFollow)"
                >{{
                  personalData.myIsFollow === '0'
                    ? $t('personalHome.applyBind')
                    : $t('personalHome.applyRemoveBind')
                }}</el-button
              >
            </div>
            <p
              :class="
                personalData.isExpireTime == 0
                  ? 'attention-tip color-green'
                  : 'attention-tip color-red'
              "
              v-show="
                personalData.subIsFee == 1 && personalData.myIsAttention == '1'
              "
            >
              {{
                personalData.isExpireTime == 0
                  ? `${transTime(personalData.expireTime)}${$t(
                      'personalHome.due'
                    )}`
                  : $t('personalHome.subOverDue')
              }}
            </p>
            <div class="others">
              <!-- <div class="other-part">
                <p class="part-num">{{personalData.fanNum}}</p>
                <p class="part-title">{{$t('personalHome.fans')}}</p>
              </div> -->
              <div class="other-part mr-part">
                <p class="part-num">{{ personalData.attentionNum }}</p>
                <p class="part-title">{{ $t('personalHome.focus') }}</p>
              </div>
              <div class="other-part">
                <p class="part-num">{{ personalData.radarFollowNum }}</p>
                <p class="part-title">{{ $t('personalHome.followNums') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="personal-power">
        <p class="part-titles">
          <img src="../../assets/p1.png" class="icon-title" />{{
            $t('personalHome.abilityPiture')
          }}
          <el-popover
            placement="top-start"
            :title="$t('personalHome.abilityPiture')"
            trigger="hover"
            width="350"
            :content="$t('personalHome.tip1')"
          >
            <img
              src="../../assets/p5.png"
              slot="reference"
              class="icon-title2"
            />
          </el-popover>
        </p>
        <div class="echart-box">
          <div class="echart-pic" ref="radarBox" v-loading="radarloading"></div>
          <div class="pic-tip">
            <p class="tip-title">{{ $t('personalHome.earn') }}</p>
            <div class="tip-explain">
              <div class="explain-part">
                <p class="explain-num color-success">
                  {{ personalData.correctRate }}%
                </p>
                <p class="explain-title">{{ $t('personalHome.rightRate') }}</p>
              </div>
              <div class="explain-part tac">
                <p
                  :class="
                    personalData.totalProfit > 0
                      ? 'explain-num color-success'
                      : 'explain-num color-danger'
                  "
                >
                  {{ personalData.totalProfit }}
                </p>
                <p class="explain-title">{{ $t('personalHome.totalEarn') }}</p>
              </div>
              <div class="explain-part tar">
                <p
                  :class="
                    personalData.totalProfit > 0
                      ? 'explain-num color-success'
                      : 'explain-num color-danger'
                  "
                >
                  {{ personalData.monthProfit }}
                </p>
                <p class="explain-title">
                  {{ $t('personalHome.lastMonthEarn') }}
                </p>
              </div>
            </div>
            <div class="tip-strategy">
              <div class="strategy-text">{{ recommondtext }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="personal-profit">
        <div class="part-titles">
          <p class="titles-left">
            <img src="../../assets/p2.png" class="icon-title" />{{
              $t('personalHome.zhanghushouyi')
            }}
          </p>
          <ul class="tabs">
            <li
              v-for="(item, index) in tabName"
              :key="index"
              @click="changeProfitTab(index)"
              :class="
                index === profitCurrentNum ? 'tab-parts act-tab' : 'tab-parts'
              "
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          class="echarts-box"
          ref="profitBox"
          v-loading="profitloading"
        ></div>
      </div>
      <div class="follow-sentiment">
        <div class="part-titles">
          <p class="titles-left">
            <img src="../../assets/p3.png" class="icon-title" />{{
              $t('personalHome.followNum')
            }}
          </p>
          <ul class="tabs">
            <li
              :class="
                index === followCurrentNum ? 'tab-parts act-tab' : 'tab-parts'
              "
              @click="changeFollowTab(index)"
              v-for="(item, index) in tabName"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div
          class="echarts-box"
          ref="followBox"
          v-loading="followLoading"
        ></div>
      </div>
      <div class="follow-sentiment">
        <div class="part-titles">
          <p class="titles-left">
            <img src="../../assets/p4.png" class="icon-title" />{{
              $t('personalHome.tradeNum')
            }}
          </p>
          <ul class="tabs">
            <li
              :class="
                index === tradingCurrentNum ? 'tab-parts act-tab' : 'tab-parts'
              "
              @click="changeTradingTab(index)"
              v-for="(item, index) in tabName"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="echarts-box" ref="tradBox" v-loading="tradLoading"></div>
      </div>
    </div>
  </FadeComponent>
</template>

<script>
import { homePageApi } from '@/server/axios.js';
import { transforTime } from '@/utils/time.js';
import { mapGetters } from 'vuex';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/dataZoom';

export default {
  data() {
    return {
      tabName: this.$t('personalHome.tabName'),
      profitCurrentNum: 0,
      followCurrentNum: 0,
      tradingCurrentNum: 0,
      // 数据获取
      userId: null,
      radarloading: true,
      profitloading: true,
      followLoading: true,
      tradLoading: true,
      personalData: { userName: '' },
      radarArray: [], //雷达数据
      radarindicator: [],
      recommondtext: '',
      profitLineX: [],
      profitLineY: [],
      followLineX: [],
      followLineY: [],
      tradingLineX: [],
      tradingLineY: [],
      // 输入类
      orderAmount: '',
      documentTitle: '',
      totalAttentionFee: 0, //订阅合计计算
    };
  },
  created() {
    this.userId = this.$route.query.userId;
    this.getBaseData();
    this.getChartData(0, 1, false);
    this.getChartData(0, 2, false);
    this.getChartData(0, 3, false);
  },
  //  调用绘制图表的方法
  mounted() {
    setTimeout(() => {
      this.drawRadar();
      this.drawProfit(false);
      this.drawFollow(false);
      this.drawTrading(false);
    }, 2000);
  },
  computed: {
    ...mapGetters({
      CurrentUserInfos: 'getCurrentUserInfos',
      BalanceInfos: 'getBalanceInfos',
    }),
    // documentTitle() {
    //   return this.getTitleValueByLang(this.personalData.userName,this.personalData.userName,this.personalData.userName)
    // }
  },
  methods: {
    // 获取大V基础信息
    getBaseData() {
      homePageApi.brandHome(this.userId).then((res) => {
        if (res.code === '200') {
          let data = res.data.userRadar;
          this.personalData = data;
          this.recommondtext = data.recommend.replace(/↵/g, '\n');
          this.radarArray = [
            data.radarFollowBalanceWeight,
            data.radarFollowNumWeight,
            data.radarFollowProfitRateWeight,
            data.radarFollowWinRateWeight,
            data.radarProfitRateWeight,
          ];
          this.documentTitle = this.getTitleValueByLang(
            data.userName,
            data.userName,
            data.userName
          );
          this.radarindicator = [
            {
              name: `${this.$t('personalHome.radius1')}(${
                data.radarFollowBalance
              })`,
              max: 100,
            },
            {
              name: `${this.$t('personalHome.radius2')}(${
                data.radarFollowNum
              })`,
              max: 100,
            },
            {
              name: `${this.$t('personalHome.radius3')}(${
                data.radarFollowProfitRate
              }%)`,
              max: 100,
            },
            {
              name: `${this.$t('personalHome.radius4')}(${
                data.radarFollowWinRate
              }%)`,
              max: 100,
            },
            {
              name: `${this.$t('personalHome.radius5')}(${
                data.radarProfitRate
              })`,
              max: 100,
            },
          ];
        }
      });
    },
    // 免费订阅
    attentionFee() {
      if (this.personalData.myIsAttention == '1') {
        return;
      }
      homePageApi.focusBrand(this.userId, 0).then((res) => {
        if (res.code === '200') {
          this.$message.success(res.msg);
          this.personalData.myIsAttention = '1';
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 订阅和续费
    buyAttention() {
      if (!this.orderAmount || this.orderAmount == 0) {
        this.$message.error(this.$t('personalHome.tip3'));
        return;
      }
      homePageApi.focusBrand(this.userId, this.orderAmount).then((res) => {
        if (res.code === '200') {
          this.$message.success(res.msg);
          this.getBaseData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 计算订阅的合计金额
    culUsdtNumber() {
      let fee = Number(this.personalData.subFee);
      let amount = Number(this.orderAmount);
      this.totalAttentionFee = (fee * amount).toFixed(2);
    },
    // 转换时间
    transTime(time) {
      return transforTime.returnYMD(time);
    },
    // 获取走势图 targetUid, timeType, type
    getChartData(t, y, renew) {
      //month，month3，month6，year
      // y //1个人业绩，2跟单人气，3交易次数
      let time =
        t === 0 ? 'month' : t === 1 ? 'month3' : t === 2 ? 'month6' : 'year';
      homePageApi.brandTradChart(this.userId, time, y).then((res) => {
        if (res.code === '200') {
          if (y === 1) {
            this.profitLineX = this.getXYaxis(res.data.trendData, 'dayTimeFor');
            this.profitLineY = this.getXYaxis(res.data.trendData, 'num');
            if (renew) {
              this.drawProfit(renew);
            }
          } else if (y === 2) {
            this.followLineX = this.getXYaxis(res.data.trendData, 'dayTimeFor');
            this.followLineY = this.getXYaxis(res.data.trendData, 'num');
            if (renew) {
              this.drawFollow(renew);
            }
          } else {
            this.tradingLineX = this.getXYaxis(
              res.data.trendData,
              'dayTimeFor'
            );
            this.tradingLineY = this.getXYaxis(res.data.trendData, 'num');
            if (renew) {
              this.drawTrading(renew);
            }
          }
        }
      });
    },
    getXYaxis(data, string) {
      //获取y轴的收益
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i][string]);
      }
      return arr;
    },
    // 账户绑定和解绑
    changePersonalBind(state) {
      console.log(state);
      if (state == '0') {
        this.$router.push({
          name: 'userBinding',
          query: { userId: this.userId },
        });
        //绑定
        // homePageApi.applyFollow(this.userId).then(res => {
        //   if (res.code === "200") {
        //     this.$message.success(res.msg);
        //   } else {
        //     this.$message.error(res.msg);
        //   }
        // });
      } else {
        homePageApi.cancelFollow(this.userId).then((res) => {
          if (res.code === '200') {
            this.personalData.myIsFollow = '0';
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    // 修改tab,收益
    changeProfitTab(i) {
      if (i === this.profitCurrentNum) {
        return;
      } else {
        this.profitCurrentNum = i;
        this.getChartData(i, 1, true);
      }
    },
    changeFollowTab(i) {
      if (i === this.followCurrentNum) {
        return;
      } else {
        this.followCurrentNum = i;
        this.getChartData(i, 2, true);
      }
    },
    changeTradingTab(i) {
      if (i === this.tradingCurrentNum) {
        return;
      } else {
        this.tradingCurrentNum = i;
        this.getChartData(i, 3, true);
      }
    },
    // 画图类
    drawRadar() {
      let that = this;
      that.radarChart = echarts.init(that.$refs.radarBox);
      let radaroption = {
        grid: { top: 'middle' },
        radar: {
          indicator: that.radarindicator,
          //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
          splitArea: {
            show: false,
            areaStyle: {
              color: 'rgba(255,0,0,0)', // 图表背景的颜色
            },
          },
        },
        series: [
          {
            type: 'radar',
            data: [{ value: that.radarArray }],
            // 设置区域边框和区域的颜色
            itemStyle: {
              normal: {
                color: '#357ce1',
                lineStyle: {
                  color: '#357ce1',
                },
              },
            },
            areaStyle: {
              normal: {
                color: '#357ce1ba', // 选择区域颜色
              },
            },
          },
        ],
      };
      that.radarChart.setOption(radaroption);
    },
    drawProfit(renew) {
      //renew 真: 清空画板， 假init
      let that = this;
      if (renew) {
        that.profitChart.clear();
      } else {
        that.profitChart = echarts.init(that.$refs.profitBox);
      }
      let profitOption = that.getLineOption(
        that.profitLineX,
        that.profitLineY,
        this.$t('personalHome.earn_1')
      );
      that.profitChart.setOption(profitOption);
    },
    drawFollow(renew) {
      let that = this;
      if (renew) {
        that.followChart.clear();
      } else {
        that.followChart = echarts.init(that.$refs.followBox);
      }
      let followOption = that.getLineOption(
        that.followLineX,
        that.followLineY,
        this.$t('personalHome.followNum')
      );
      that.followChart.setOption(followOption);
    },
    drawTrading(renew) {
      let that = this;
      if (renew) {
        that.tradingChart.clear();
      } else {
        that.tradingChart = echarts.init(that.$refs.tradBox);
      }
      let tradOption = that.getLineOption(
        that.tradingLineX,
        that.tradingLineY,
        this.$t('personalHome.tradeNum')
      );
      that.tradingChart.setOption(tradOption);
    },
    getLineOption(x, y, l) {
      let option = {
        grid: [
          {
            top: 15,
            left: 80,
            right: 80,
            bottom: 25,
          },
        ],
        tooltip: { trigger: 'axis' },
        legend: {
          data: [l],
        },
        dataZoom: [
          {
            show: false,
            type: 'inside',
          },
          {
            show: false,
            type: 'slider',
          },
        ],
        xAxis: {
          type: 'category',
          data: x,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: y,
            type: 'line',
            smooth: true,
          },
        ],
      };
      return option;
    },
  },
  beforeDestroy() {
    this.tradingChart.clear();
    this.followChart.clear();
    this.radarChart.clear();
    this.profitChart.clear();
  },
};
</script>

<style lang="scss" scoped>
.personal-home {
  width: 100%;
  background-color: $menuBg;
  .personal-top {
    padding: 35px 0;
    background-color: $bgGrey;
    .personal-data {
      margin: 0 auto;
      width: 92%;
      display: flex;
      .left {
        width: 120px;
        height: 120px;
        .avtar {
          border-radius: 50%;
          width: 120px;
          height: 120px;
        }
      }
      .center {
        flex: 1;
        margin-left: 15px;
        .name {
          margin-top: 18px;
          font-size: 24px;
          font-weight: bold;
        }
        .other {
          margin-top: 22px;
          font-size: 12px;
          .id {
            display: inline-block;
            padding-right: 15px;
            margin-right: 15px;
            border-right: 1px solid white;
          }
        }
        .Introduction {
          margin-top: 13px;
          font-size: 12px;
          max-width: 450px;
          line-height: 18px;
        }
      }
      .right {
        .botton-box {
          text-align: right;
          padding-right: 20px;
          height: 30px;
          .button-mr {
            margin-right: 60px;
          }
        }
        .attention-tip {
          margin-left: -35px;
          margin-top: 4px;
          font-size: 13px;
          width: 128px;
          text-align: center;
        }
        .others {
          margin-top: 35px;
          display: flex;
          .other-part {
            text-align: center;
            &.mr-part {
              padding-left: 8px;
              margin-right: 80px;
            }
            .part-num {
              font-size: 16px;
              font-weight: bold;
              padding-bottom: 10px;
            }
          }
        }
      }
    }
  }

  .personal-power {
    color: $globalBg;
    margin: 0 auto;
    margin-top: 20px;
    width: 92%;
    background-color: white;
    padding: 20px;
    .part-titles {
      font-size: 16px;
      font-weight: bold;
      .icon-title {
        height: 16px;
        vertical-align: middle;
        margin-right: 5px;
      }
      .icon-title2 {
        height: 16px;
        vertical-align: middle;
      }
    }
    .echart-box {
      margin-top: 25px;
      display: flex;
      .echart-pic {
        min-height: 300px;
        width: 480px;
      }
      .pic-tip {
        margin-left: 50px;
        padding-right: 50px;
        width: 60%;
        .tip-title {
          font-size: 16px;
          padding-bottom: 16px;
        }
        .tip-explain {
          margin-top: 15px;
          display: flex;
          .explain-part {
            flex: 1;
            &.tac {
              text-align: center;
            }
            &.tar {
              text-align: right;
            }
            .explain-num {
              font-size: 18px;
            }
            .explain-title {
              margin-top: 10px;
              font-size: 14px;
              color: $color_info;
            }
          }
        }
        .tip-strategy {
          margin-top: 25px;
          .strategy-text {
            line-height: 19px;
            font-size: 14px;
            color: $color_info;
            white-space: pre-wrap;
          }
        }
        .tip-goodAt {
          margin-top: 25px;
          .goodAt-text {
            font-size: 14px;
            color: $color_info;
          }
        }
      }
    }
  }
  .personal-profit,
  .follow-sentiment {
    color: $globalBg;
    margin: 0 auto;
    margin-top: 20px;
    width: 92%;
    background-color: white;
    padding: 20px;
    .part-titles {
      display: flex;
      .titles-left {
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
        .icon-title {
          height: 16px;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      .tabs {
        display: flex;
        margin-left: 10px;
        .tab-parts {
          font-size: 13px;
          padding: 2px 9px;
          border-radius: 15px;
          color: $color_info;
          margin-left: 5px;
          border: 2px solid transparent;
          cursor: pointer;
          &.act-tab {
            border: 2px solid $color_main;
            color: $color_main;
          }
        }
      }
    }
    .echarts-box {
      margin-top: 25px;
      height: 350px;
    }
  }
}
.orderName {
  font-size: 16px;
  font-weight: bold;
  color: $color_main;
  .tip {
    display: inline-block;
    font-size: 13px;
    color: $color_info;
  }
}
.input-box {
  margin-top: 15px;
}
.last-usdt {
  color: $color_info;
  margin-top: 15px;
}
.tip-order {
  margin-top: 15px;
}
.order-bottom {
  display: flex;
  margin-top: 15px;
  .left {
    flex: 1;
    line-height: 40px;
    font-weight: bold;
    color: $color_main;
    .tip-usdt {
      display: inline-block;
      margin-left: 5px;
      font-size: 18px;
    }
  }
}
</style>
