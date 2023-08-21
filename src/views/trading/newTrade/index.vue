<template>
  <div class="tardeIndex">
    <!--    <img style="width: 100%;height:300px"-->
    <!--         src="../../../assets/Caylebanner.png"-->
    <!--         alt="">-->
    <!-- 内容 -->
    <div class="newCollege">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane :label="$t('newCommon2.text5')" name="first">
          <div v-if="resoulist1.length > 0" class="newCollege_fors">
            <div
              class="newCollege_for"
              @click="getInfo(item)"
              v-for="(item, index) in resoulist1"
              :key="index"
            >
              <div class="imgBox">
                <img
                  style="width: 200px; height: 200px"
                  :src="item.image"
                  alt=""
                />
              </div>
              <div class="newCollege_for_right">
                <div class="newCollege_for_title">
                  <p
                    style="margin-top: 8px; font-weight: bold; margin-left: 5px"
                  >
                    {{ item.summary }}
                  </p>
                  <el-tag size="mini">{{ $t('newCommon2.text5') }}</el-tag>
                </div>
                <el-progress
                  :percentage="Number(item.progress || 0)"
                  color="#5ccc65"
                ></el-progress>
                <div class="title_left_box">
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text31') }}:</span
                    ><span>{{ item.sumAmount }} {{ item.symbol }}</span>
                  </p>
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text41') }}:</span
                    ><span>{{ item.rate }} USDT</span>
                  </p>
                </div>
                <div class="title_left_box">
                  <p class="title_left">
                    <span
                      >{{ item.startTime | formatDate('YYYY-MM-DD') }} ~
                      {{ item.endTime | formatDate('YYYY-MM-DD') }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style="" v-else>{{ $t('assets.noset') }}</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('newCommon2.text4')" name="second">
          <div class="newCollege_fors" v-if="resoulist0.length > 0">
            <div
              class="newCollege_for"
              @click="getInfo(item)"
              v-for="(item, index) in resoulist0"
              :key="index"
            >
              <div class="imgBox">
                <img
                  style="width: 200px; height: 200px"
                  :src="item.image"
                  alt=""
                />
              </div>
              <!-- <img v-if="item.image"  :src="item.image" alt=""> -->
              <div class="newCollege_for_right">
                <div class="newCollege_for_title">
                  <p
                    style="margin-top: 8px; font-weight: bold; margin-left: 5px"
                  >
                    {{ item.summary }}
                  </p>
                  <el-tag size="mini">{{ $t('newCommon2.text4') }}</el-tag>
                </div>
                <el-progress
                  :percentage="Number(item.progress || 0)"
                  color="#5ccc65"
                ></el-progress>
                <div class="title_left_box">
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text31') }}:</span
                    ><span>{{ item.sumAmount }} {{ item.symbol }}</span>
                  </p>
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text41') }}:</span
                    ><span>{{ item.rate }} USDT</span>
                  </p>
                </div>
                <div class="title_left_box">
                  <p class="title_left">
                    <span
                      >{{ item.startTime | formatDate('YYYY-MM-DD') }} ~
                      {{ item.endTime | formatDate('YYYY-MM-DD') }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style="" v-else>{{ $t('assets.noset') }}</div>
        </el-tab-pane>
        <el-tab-pane :label="$t('newCommon2.text6')" name="third">
          <div class="newCollege_fors" v-if="resoulist2.length > 0">
            <div
              class="newCollege_for"
              @click="getInfo(item)"
              v-for="(item, index) in resoulist2"
              :key="index"
            >
              <div class="imgBox">
                <img
                  style="width: 200px; height: 200px"
                  :src="item.image"
                  alt=""
                />
              </div>
              <!-- <img :src="item.image"  alt=""> -->
              <div class="newCollege_for_right">
                <div class="newCollege_for_title">
                  <p
                    style="margin-top: 8px; font-weight: bold; margin-left: 5px"
                  >
                    {{ item.summary }}
                  </p>
                  <el-tag size="mini">{{ $t('newCommon2.text6') }}</el-tag>
                </div>
                <el-progress
                  :percentage="Number(item.progress || 0)"
                  color="#5ccc65"
                ></el-progress>
                <div class="title_left_box">
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text31') }}:</span
                    ><span>{{ item.sumAmount }} {{ item.symbol }}</span>
                  </p>
                  <p class="title_left">
                    <span>{{ $t('newCommon2.text41') }}:</span
                    ><span>{{ item.rate }} USDT</span>
                  </p>
                </div>
                <div class="title_left_box">
                  <p class="title_left">
                    <span
                      >{{ item.startTime | formatDate('YYYY-MM-DD') }} ~
                      {{ item.endTime | formatDate('YYYY-MM-DD') }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style="" v-else></div>
        </el-tab-pane>
      </el-tabs>
    </div>
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
      activeName: 'first',
      activeList: [
        { name: this.$t('newCommon2.text4'), type: 0 },
        { name: this.$t('newCommon2.text5'), type: 0 },
        { name: this.$t('newCommon2.text6'), type: 0 },
      ],
      acitveIndex: 1,
      html1: '<p>碉堡了</p>',
      resoulist0: [],
      resoulist1: [],
      resoulist2: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setPercentage(data) {
      let num = ((data.alAmount / data.amount) * 100).toFixed(2) * 1;
      return num;
    },
    getEndTime(endtime, index) {
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
        console.log(h + '.' + m + '.' + s);
        this.resoulist1[index].createTime = h + ':' + m + ':' + s;
        this.resoulist1[index].endTime = h + ':' + m + ':' + s;
        console.log(this.resoulist);
      }, 1000);
    },
    getEndTime1(endtime, index) {
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
        console.log(h + '.' + m + '.' + s);
        this.resoulist0[index].createTime = h + '.' + m + '.' + s;
        this.resoulist0[index].endTime = h + '.' + m + '.' + s;
      }, 1000);
    },
    tabActive(index) {
      this.acitveIndex = index;
      this.getList();
    },
    getInfo(item) {
      console.log(item);
      this.$router.push({ name: 'newTradeIndexInfo', query: { id: item.id } });
    },
    getList() {
      this.resoulist = [];
      assetsApi.getDataListSub().then((res) => {
        console.log(res.data);
        this.resoulist = [];
        for (var i = 0; i < res.data.length; i++) {
          // if (res.data.data[i].state == 2) {
          // console.log(this.resoulist)
          if (res.data[i].state == 0) {
            this.resoulist0.push(res.data[i]);
          }
          if (res.data[i].state == 1) {
            this.resoulist1.push(res.data[i]);
          }
          if (res.data[i].state == 2) {
            this.resoulist2.push(res.data[i]);
          }
          // }
        }

        // for (var i = 0; i < this.resoulist1.length; i++) {
        //   console.log("1")
        //   this.getEndTime(this.resoulist1[i].createTime, i)
        // }

        // for (var i = 0; i < this.resoulist1.length; i++) {
        //   this.getEndTime(this.resoulist1[i].endTime, i)
        // }
        for (let i = 0; i < this.resoulist1.length; i++) {
          this.getEndTime1(this.resoulist0[i].createTime, i);
        }

        for (let i = 0; i < this.resoulist1.length; i++) {
          this.getEndTime1(this.resoulist0[i].endTime, i);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.newCollege {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-left: 10%;
  overflow: hidden;
  /*去掉切换时el-tab-pane底部的蓝色下划线*/
  .el-tabs__active-bar {
    background-color: transparent !important;
  }

  /*去掉tabs底部的下划线*/
  .el-tabs__nav-wrap::after {
    position: static !important;
  }

  .newCollege_fors {
    width: 100%;
    // justify-content: space-between;
    // margin-left: 7%;
    white-space: nowrap; /*第二层设置  不换行  */
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .newCollege_for {
      display: inline-block;
      // width: 200px;
      width: 100%;
      height: 200px;
      // background-color: #a6a6a6;
      background-color: #fff;
      margin-right: 3%;
      margin-bottom: 20px;
      border-radius: 5px;
      overflow: hidden;
      text-align: center;
      display: flex;
      .imgBox {
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          display: block;
        }
      }

      .newCollege_for_right {
        // width:50%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 0 20px 20px;
        .title_left_box {
          display: flex;
          justify-content: space-between;
          .title_left {
            display: flex;
            color: #000;
            width: 50%;
            // font-size:12px;
          }
        }
      }
      .newCollege_for_title {
        // display: flex;
        margin-top: 10px;
        display: flex;
        align-items: center;
        //justify-content: space-between;

        p {
          color: #000;
        }
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
      .newCollege_btn {
        width: 150px;
        height: 32px;
        line-height: 32px;
        border-radius: 5px;
        border: none;
      }
    }
  }
  .newColl_titile {
    // width: 100%;
    font-size: 18px;
    font-weight: bold;
  }
  .newCollege_banner {
    width: 100%;
  }
  .newColl {
    width: 70%;
    margin-left: 15%;
  }
}
.tardeIndex {
  width: 100%;
  .tardeIndexNav {
    display: flex;
    flex-direction: column;
    margin: 30px 40px;
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
  }
  .activeClass {
    display: flex;
    margin: 30px 40px;
    p {
      width: 100px;
      margin-right: 30px;
      font-size: 20px;
      font-weight: bold;
      color: #9ca9b5;
    }
    p:hover {
      cursor: pointer;
    }
  }
  .activeClass1 {
    color: #fff !important;
  }
}
</style>
