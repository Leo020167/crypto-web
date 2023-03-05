<template>
  <div style="background: #fff">
    <div class="info_info">
      <img style="width: 300px; height: 300px" :src="detail.image" alt="" />
      <div class="info_nav">
        <div class="info_info_nav_top">
          <p style="font-weight: bold; margin-top: 10px; width: 80%">
            {{ detail.title }}
          </p>
        </div>
        <div v-html="detail.content" style="margin: 15px 0"></div>
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
          <span>{{ $t('newCommon2.text42') }}</span>
        </p>
        <el-progress
          :percentage="percentage"
          color="#5ccc65"
          :show-text="false"
        ></el-progress>
        <p class="progress-number">{{ percentage }}%</p>
      </div>

      <div>
        <p class="details-title">{{ $t('newCommon2.text43') }}:</p>
        <p class="details-desc">
          {{ $t(`newCommon2.text43_${detail.state}`) }}
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text42') }}:</p>
        <p class="details-desc">{{ detail.allSum }}</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text44') }}:</p>
        <p class="details-desc">{{ detail?.rate }}USDT</p>
      </div>

      <div>
        <p class="details-title">{{ $t('newCommon2.text45') }}:</p>
        <p class="details-desc">USDT</p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text46') }}:</p>
        <p class="details-desc">
          {{ detail.startTime | formatDate() }}
        </p>
      </div>
      <div>
        <p class="details-title">{{ $t('newCommon2.text47') }}:</p>
        <p class="details-desc">
          {{ detail.endTime | formatDate() }}
        </p>
      </div>
    </div>

    <div style="width: 100%; height: 400px"></div>
  </div>
</template>

<script>
import { assetsApi } from '@/server/axios.js';
import moment from 'moment';
export default {
  filters: {
    // 时间戳处理
    formatDate: function (value, format = 'YYYY-MM-DD HH:mm') {
      if (value) {
        return moment(new Date(Number(value) * 1000)).format(format);
      }
      return '';
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
    console.log(this.$route.query);
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
      this.$router.replace('/trading');
      // this.$prompt(this.$t('newCommon2.text21'), this.$t('newCommon2.text24'), {
      //   confirmButtonText: this.$t('newCommon2.text22'),
      //   cancelButtonText: this.$t('newCommon2.text23'),
      // })
      //   .then(({ value }) => {
      //     assetsApi
      //       .getDataListSubInfoApply(
      //         this.subscribeId,
      //         value,
      //         this.$store.state.user.userInfos.user.userId
      //       )
      //       .then((res) => {
      //         console.log(res);
      //         if (res.code == 400) {
      //           this.$message.error(res.msg);
      //         } else {
      //           this.$message.success(res.msg);
      //           this.gerInfo();
      //         }
      //       });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '取消输入',
      //     });
      //   });
    },
    gerInfo() {
      assetsApi.getDataListSubInfo(this.subscribeId).then((res) => {
        this.detail = res.data.detail;
        this.getEndTime(res.data.detail.endTime);
        this.userCount = res.data.userCount;
        this.percentage = res.data.progress || 0;
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
