<template>
  <div style="background: #fff">
    <div class="info_info">
      <img style="width: 300px; height: 300px" :src="detail.image" alt="" />
      <div class="info_nav">
        <div class="info_info_nav_top">
          <p style="font-weight: bold; margin-top: 10px; width: 80%">
            {{ detail.title }}
          </p>
          <p
            v-if="detail.state == 0"
            style="background-color: #ffc43e; color: #fff"
            class="tardeIndexNav_status"
          >
            {{ $t('newCommon2.text4') }}
          </p>
          <p
            v-if="detail.state == 1"
            style="background-color: #00ad88; color: #fff"
            class="tardeIndexNav_status"
          >
            {{ $t('newCommon2.text5') }}
          </p>
          <p
            v-if="detail.state == 2"
            style="background-color: #a6a6a6; color: #fff"
            class="tardeIndexNav_status"
          >
            {{ $t('newCommon2.text6') }}
          </p>
        </div>
        <div v-html="detail.content" style="margin: 15px 0"></div>
        <!-- <p style="margin:15px 0;font-weight:bold;"
           v-if="detail.state == 0"> {{$t('newCommon2.text7')}}:{{killTime.h}}:{{killTime.m}}:{{killTime.s}}</p>
        <p style="margin:15px 0;font-weight:bold;"
           v-if="detail.state == 1">{{$t('newCommon2.text8')}}:{{killTime.h}}:{{killTime.m}}:{{killTime.s}}</p> -->
        <!-- 開始申購時間 -->
        <!-- <p style="margin:15px 0;font-weight:bold;opacity: 0.6;">{{$t('newCommon2.text13')}}:{{detail.startTime | formatDate('-')}}</p> -->
        <!-- 結束申購時間 -->
        <!-- <p style="margin:15px 0;font-weight:bold;opacity: 0.6;">{{$t('newCommon2.text14')}}:{{detail.endTime | formatDate('-')}}</p> -->
        <!-- <p style="margin:15px 0;font-weight:bold;">{{$t('newCommon2.text12')}}:{{detail.sum}}USDT</p> -->
        <!-- <p style="margin:15px 0;font-weight:bold;margin-top:30px;"> <span style="color:#00AD88;margin-right:30px;">{{$t('newCommon2.text10')}}:{{detail.alCount}}USDT</span> {{$t('newCommon2.text11')}}：{{userCount}}USDT</p> -->
        <el-button
          style="width: 200px; background: #ffc43e; border: none"
          v-if="detail.state == 0"
          type="danger"
          >{{ $t('newCommon2.text15') }}</el-button
        >
        <el-button
          style="width: 200px; background: #00ad88; border: none"
          v-if="detail.state == 1"
          type="danger"
          @click="getShengou()"
          >{{ $t('newCommon2.text16') }}</el-button
        >
        <el-button
          v-if="detail.state == 2"
          style="width: 200px; background-color: #a6a6a6; border: none"
          type="warning"
          >{{ $t('newCommon2.text6') }}</el-button
        >
      </div>
    </div>
    <div class="hrs"></div>
    <div class="info_info_top">
      <div>
        <p class="progress-title">
          <span>{{ $t('newCommon2.text26') }}</span>
          <span>{{ $t('newCommon2.text27') }}</span>
        </p>
        <el-progress
          :percentage="percentage"
          color="#5ccc65"
          :show-text="false"
        ></el-progress>
        <p class="progress-number">{{ percentage }}%</p>
      </div>

      <div>
        <p class="details-title">{{ $t('newCommon2.text28') }}:</p>
        <p class="details-desc">{{ detail.sum }}</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text48') }}:</p>
        <p class="details-desc">{{ [detail.min, detail.max].join('~') }}</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text29') }}:</p>
        <p class="details-desc">{{ detail.alCount }}</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text27') }}:</p>
        <p class="details-desc">{{ detail.sum - detail.alCount }}</p>
      </div>
      <div v-if="detail.state == 1">
        <p class="details-title">{{ $t('newCommon2.text30') }}:</p>
        <p class="details-desc">
          {{ killTime.h }}:{{ killTime.m }}:{{ killTime.s }}
        </p>
      </div>
      <div v-if="detail.state == 0">
        <p class="details-title">{{ $t('newCommon2.text7') }}:</p>
        <p class="details-desc">
          {{ killTime.h }}:{{ killTime.m }}:{{ killTime.s }}
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text31') }}:</p>
        <p class="details-desc">{{ detail.allSum }}</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text32') }}:</p>
        <p class="details-desc">
          {{ detail.startTime | formatDate('-')
          }}<span>{{ $t('newCommon2.text40') }}</span>
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text33') }}:</p>
        <p class="details-desc">
          {{ detail.endTime | formatDate('-')
          }}<span>{{ $t('newCommon2.text40') }}</span>
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text34') }}:</p>
        <p class="details-desc">
          {{ detail.tradeTime | formatDate('-')
          }}<span>{{ $t('newCommon2.text40') }}</span>
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text35') }}:</p>
        <p class="details-desc">
          {{ detail.liftBanTime | formatDate('-')
          }}<span>{{ $t('newCommon2.text40') }}</span>
        </p>
      </div>
      <!-- <div>
        <p class="details-title">{{ $t("newCommon2.text36") }}:</p>
        <p class="details-desc">1{{ detail.symbol }} = {{ detail.rate }}USDT</p>
      </div> -->
      <div>
        <p class="details-title">{{ $t('newCommon2.text36') }}:</p>
        <p class="details-desc">{{ detail.rate }}USDT</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text37') }}:</p>
        <p class="details-desc">{{ detail.userCount }}</p>
      </div>
      <!--发起成员-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text17') }}:
        </p>
        <div v-html="detail.authorSummary" class="indexInfo"></div>
      </div>
      <!--      项目介绍-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text20') }}:
        </p>
        <div v-html="detail.summary" class="indexInfo"></div>
      </div>
      <!--      币种介绍-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text39') }}:
        </p>
        <div v-html="detail.content" class="indexInfo"></div>
      </div>
      <!--      项目参与条件-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text18') }}:
        </p>
        <div v-html="detail.condition" class="indexInfo"></div>
      </div>
      <!--风险提示-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text19') }}:
        </p>
        <div v-html="detail.warning" class="indexInfo"></div>
      </div>
      <!--申购说明-->
      <div>
        <p style="margin-top: 30px; margin-bottom: 15px; font-weight: bold">
          {{ $t('newCommon2.text38') }}:
        </p>
        <div v-html="detail.description" class="indexInfo"></div>
      </div>
    </div>

    <div style="width: 100%; height: 400px"></div>

    <!-- <div class="tardeIndexNav">
      <div class="tardeIndexNav_nav">
        <img style="width: 600px;height:300px;"
             :src="detail.image"
             alt="">
        <div class="tardeIndexNav_nav_top">
    
        </div>
        <div></div>
        <p style="margin:15px 0;font-weight:bold;">{{$t('newCommon2.text10')}}:{{detail.alCount}}USDT {{$t('newCommon2.text11')}}：{{userCount}}USDT</p>
        <p style="margin:15px 0;font-weight:bold;"
           v-if="detail.state == 0">{{$t('newCommon2.text7')}}:{{killTime.h}}.{{killTime.m}}.{{killTime.s}}</p>
        <p style="margin:15px 0;font-weight:bold;"
           v-if="detail.state == 1">{{$t('newCommon2.text8')}}:{{killTime.h}}.{{killTime.m}}.{{killTime.s}}</p>
        <p style="margin:15px 0;font-weight:bold;">{{$t('newCommon2.text12')}}:{{detail.sum}}USDT</p>
        <p style="margin:15px 0;font-weight:bold;">{{$t('newCommon2.text13')}}:{{detail.createTime}}</p>
        <p style="margin:15px 0;font-weight:bold;">{{$t('newCommon2.text14')}}:{{detail.endTime}}</p>
        <el-button style="width:200px;background:#FFC43E;border:none"
                   v-if="detail.state ==0"
                   type="danger">{{$t('newCommon2.text15')}}</el-button>
        <el-button style="width:200px;background:#00AD88;border:none"
                   v-if="detail.state ==1"
                   type="danger"
                   @click="getShengou()">{{$t('newCommon2.text16')}}</el-button>
        <el-button v-if="detail.state ==2"
                   style="width:200px;background-color:#A6A6A6;border:none"
                   type="warning">{{$t('newCommon2.text6')}}</el-button>

        <p style="margin-top:30px;margin-bottom:15px;font-weight:bold;">{{$t('newCommon2.text17')}}</p>
        <div v-html="detail.createTime"
             class="indexInfo"></div>

        <p style="margin-top:30px;margin-bottom:15px;font-weight:bold;">{{$t('newCommon2.text18')}}</p>
        <div v-html="detail.condition"
             class="indexInfo"></div>

        <p style="margin-top:30px;margin-bottom:15px;font-weight:bold;">{{$t('newCommon2.text19')}}</p>
        <div v-html="detail.warning"
             class="indexInfo"></div>

        <p style="margin-top:30px;margin-bottom:15px;font-weight:bold;">{{$t('newCommon2.text20')}}</p>
        <div v-html="detail.summary"
             class="indexInfo"></div>

      </div>
    </div> -->
  </div>
</template>

<script>
import { assetsApi } from '@/server/axios.js';
export default {
  filters: {
    // 时间戳处理
    formatDate: function (value, spe = '/') {
      value = value * 1000;
      let data = new Date(value);
      let year = data.getFullYear();
      let month = data.getMonth() + 1;
      let day = data.getDate();
      let h = data.getHours();
      let mm = data.getMinutes();
      let s = data.getSeconds();
      month = month > 10 ? month : +month;
      day = day > 10 ? day : +day;
      console.log(month, day);
      return (
        `${year}${spe}${month}${spe}${day}` + '      ' + `${h}时${mm}分${s}秒`
      );
    },
  },
  data() {
    return {
      percentage: 0,
      subscribeId: 0,
      detail: {},
      userCount: 0,
      killTime: { h: 0, m: 0, s: 0 },
    };
  },
  created() {
    this.subscribeId = this.$route.query.id;
    this.gerInfo();
  },
  methods: {
    getEndTime(endtime) {
      let timer = setInterval(() => {
        // 当前时间戳（ms）
        let nowTime = new Date().getTime();
        // 倒计时(s)
        let resTime = Math.floor(parseInt(endtime) - nowTime / 1000);
        if (resTime < 0) {
          clearInterval(timer);
          return;
        }
        // 转成时分秒
        let h = Math.floor(resTime / 3600);
        h = h < 10 ? '0' + h : h;
        let m = Math.floor((resTime % 3600) / 60);
        m = m < 10 ? '0' + m : m;
        let s = resTime % 60;
        s = s < 10 ? '0' + s : s;
        this.killTime.h = h;
        this.killTime.m = m;
        this.killTime.s = s;
      }, 1000);
    },
    getShengou() {
      this.$prompt(this.$t('newCommon2.text21'), this.$t('newCommon2.text24'), {
        confirmButtonText: this.$t('newCommon2.text22'),
        cancelButtonText: this.$t('newCommon2.text23'),
      })
        .then(({ value }) => {
          if (
            !value ||
            Number(value) < Number(this.detail.min) ||
            Number(value) > Number(this.detail.max)
          ) {
            this.$message.error(
              this.$t('newCommon2.text49', {
                min: this.detail.min,
                max: this.detail.max,
              })
            );
            return;
          }

          assetsApi
            .getDataListSubInfoApply(
              this.subscribeId,
              value,
              this.$store.state.user.userInfos.user.userId
            )
            .then((res) => {
              if (res.code == 400) {
                this.$message.error(res.msg);
              } else {
                this.$message.success(res.msg);
                this.gerInfo();
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
    gerInfo() {
      assetsApi.getDataListSubInfo(this.subscribeId).then((res) => {
        console.log(res);
        this.detail = res.data.detail;
        this.getEndTime(res.data.detail.endTime);
        this.userCount = res.data.userCount;
        this.percentage =
          ((this.detail.alCount / this.detail.sum) * 100).toFixed(2) * 1;
      });
    },
  },
};
</script>

<style lang="scss">
.hrs {
  width: 70%;
  margin: 30px 0;
  margin-left: 15%;
  height: 1px;
  background-color: #000;
}
.info_info_top {
  width: 70%;
  margin-left: 15%;
  display: flex;
  flex-direction: column;
  color: #000;
  .info_info_top > div {
    display: flex;
    p {
    }
  }

  .progress-title {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 15px;
    font-weight: bold;
  }
  .progress-number {
    margin-top: 10px;
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    color: #ebeef5;
  }
}
.info_info {
  margin-top: 20px;
  width: 70%;
  margin-left: 15%;
  display: flex;
  margin-top: 20px;
  border-radius: 10px;

  .info_nav {
    color: #000;
    flex: 1;
    margin-left: 15px;
    .info_info_nav_top {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .tardeIndexNav_status {
      width: 80px;
      height: 30px;
      line-height: 30px;
      background-color: #22578a;
      text-align: center;
      font-weight: bold;
      margin-left: 20px;
    }
  }
  img {
    flex-shrink: 1;
    width: 170px;
    height: 170px;
    background-color: #000;
  }
}
.tardeIndexNav {
  display: flex;
  flex-direction: column;
  margin: 20px 30px;
  margin-left: 30%;
  .tardeIndexNav_nav:hover {
    cursor: pointer;
  }
  .tardeIndexNav_nav {
    width: 640px;
    padding: 10px;
    margin-top: 15px;
    border-radius: 3px;
    .tardeIndexNav_nav_top {
      display: flex;
      align-items: cneter;
      margin-top: 15px;
      margin-bottom: 10px;
      .tardeIndexNav_status {
        width: 80px;
        height: 30px;
        line-height: 30px;
        background-color: #22578a;
        text-align: center;
        font-weight: bold;
        margin-left: 20px;
      }
    }
  }
  .indexInfo {
    background-color: #e9feff;
    color: #7dbf9f;
    padding: 10px;
    width: 600px;
    border-radius: 3px;
  }
}

.details-title {
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  // color:#a9a9ab;
}
.details-desc {
}
</style>
