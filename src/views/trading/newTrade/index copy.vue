<template>
  <div class="tardeIndex">
    <!-- <div class="activeClass">
      <p v-for="(item,index) in activeList"
         :class="[acitveIndex == index ? 'activeClass1' : '']"
         @click="tabActive(index)"
         :key="index"> {{item.name}}</p>
    </div> -->
    <img style="width: 100%;height:300px"
         src="../../../assets/banner99.png"
         alt="">
    <!-- 内容 -->
    <div class="newCollege">
      <p style="font-size:25px;font-weight: bold;margin-top:30px;margin-bottom:20px;">進行中</p>
      <div v-if="resoulist1.length>0"
           class="newCollege_fors">
        <div class="newCollege_for"
             @click="getInfo(item)"
             v-for="(item,index) in resoulist1"
             :key="index">
          <img :src="item.image"
               alt="">
          <div class="newCollege_for_title">
            <p style="margin-top:8px;font-weight:bold;margin-left:5px">{{item.symbol}}</p>
            <!-- <p style="background-color:#00AD88;color:#fff;margin-left:5px"
               class="tardeIndexNav_status">進行中</p> -->
          </div>
          <div style="width:89%;height:16px;margin-top:5px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px "
               v-html="item.summary"></div>
          <p style="margin:15px 0;font-weight:bold;margin-left:5px">{{$t('newCommon2.text8')}}:{{item.endTime }}</p>
          <button @click="GetMide()"
                  style="background:#00AD88;color:#fff;"
                  class="newCollege_btn">進行中</button>
        </div>
      </div>
      <div style="  margin-left: 7%;"
           v-else>
        暫無....
      </div>
    </div>
    <div class="newCollege">
      <p style="font-size:25px;font-weight: bold;margin-top:30px;margin-bottom:20px;">待開始</p>
      <div class="newCollege_fors"
           v-if="resoulist0.length>0">
        <div class="newCollege_for"
             @click="getInfo(item)"
             v-for="(item,index) in resoulist0"
             :key="index">
          <img v-if="item.image"
               :src="item.image"
               alt="">
          <div class="newCollege_for_title">
            <p style="margin-top:8px;font-weight:bold;margin-left:5px">{{item.symbol}}</p>
            <!-- <p style="background-color:#FFC43E ;color:#000;margin-left:5px"
               class="tardeIndexNav_status">待開始</p> -->
          </div>
          <div style="width:80%;height:16px;margin-top:5px;  white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px "
               v-html="item.summary"></div>
          <p style="margin:15px 0;font-weight:bold;margin-left:5px">{{$t('newCommon2.text7')}}:{{item.createTime }}</p>
          <button @click="GetMide()"
                  style="background:#FFC43E;color:#fff;"
                  class="newCollege_btn">待開始</button>
        </div>
      </div>
      <div style="  margin-left: 7%;"
           v-else>
        暫無....
      </div>
    </div>
    <div class="newCollege">
      <p style="font-size:25px;font-weight: bold;margin-top:30px;margin-bottom:20px;">已結束</p>
      <div class="newCollege_fors"
           v-if="resoulist2.length>0">
        <div class="newCollege_for"
             @click="getInfo(item)"
             v-for="(item,index) in resoulist2"
             :key="index">
          <img :src="item.image"
               alt="">
          <div class="newCollege_for_title">
            <p style="margin-top:8px;font-weight:bold;margin-left:5px">{{item.symbol}}</p>
            <!-- <p style="background-color:#A6A6A6;color:#fff;margin-left:5px"
               class="tardeIndexNav_status">已結束</p> -->
          </div>
          <div style="width:80%;margin-top:5px; height:16px; white-space: nowrap;text-overflow: ellipsis;overflow: hidden;margin-left:5px "
               v-html="item.summary"></div>
          <p style="margin:15px 0;font-weight:bold;margin-left:5px">已結束</p>
          <button @click="GetMide()"
                  style="background:#A6A6A6;color:#fff;"
                  class="newCollege_btn">已結束</button>
        </div>
      </div>
      <div style="  margin-left: 7%;"
           v-else>
        暫無....
      </div>
    </div>
  </div>
</template>

<script>
import { assetsApi } from "@/server/axios.js";
export default {
  data () {
    return {
      activeList: [{ name: this.$t('newCommon2.text4'), type: 0 }, { name: this.$t('newCommon2.text5'), type: 0 }, { name: this.$t('newCommon2.text6'), type: 0 }],
      acitveIndex: 1,
      html1: "<p>碉堡了</p>",
      resoulist0: [],
      resoulist1: [],
      resoulist2: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getEndTime (endtime, index) {
      let timer = setInterval(() => {
        // 当前时间戳（ms）
        let nowTime = (new Date).getTime();
        // 倒计时(s)
        let resTime = Math.floor((parseInt(endtime) - nowTime / 1000));
        if (resTime < 0) {
          clearInterval(timer);
          return
        }
        // 转成时分秒
        let h = Math.floor(resTime / 3600);
        h = h < 10 ? '0' + h : h;
        let m = Math.floor((resTime % 3600) / 60);
        m = m < 10 ? '0' + m : m;
        let s = resTime % 60;
        s = s < 10 ? '0' + s : s;
        console.log(h + "." + m + "." + s)
        this.resoulist1[index].createTime = h + ":" + m + ":" + s
        this.resoulist1[index].endTime = h + ":" + m + ":" + s
        console.log(this.resoulist)
      }, 1000)
    },
    getEndTime1 (endtime, index) {
      let timer = setInterval(() => {
        // 当前时间戳（ms）
        let nowTime = (new Date).getTime();
        // 倒计时(s)
        let resTime = Math.floor((parseInt(endtime) - nowTime / 1000));
        if (resTime < 0) {
          clearInterval(timer);
          return
        }
        // 转成时分秒
        let h = Math.floor(resTime / 3600);
        h = h < 10 ? '0' + h : h;
        let m = Math.floor((resTime % 3600) / 60);
        m = m < 10 ? '0' + m : m;
        let s = resTime % 60;
        s = s < 10 ? '0' + s : s;
        console.log(h + "." + m + "." + s)
        this.resoulist0[index].createTime = h + "." + m + "." + s
        this.resoulist0[index].endTime = h + "." + m + "." + s
      }, 1000)
    },
    tabActive (index) {
      this.acitveIndex = index;
      this.getList()
    },
    getInfo (item) {
      console.log(item);
      this.$router.push({ name: "newTradeIndexInfo", query: { id: item.id } })
    },
    getList () {
      var that = this
      this.resoulist = []
      assetsApi.getDataListSub().then((res) => {
        console.log(res.data)
        this.resoulist = []
        for (var i = 0; i < res.data.length; i++) {
          // if (res.data.data[i].state == 2) {
          // console.log(this.resoulist)
          if (res.data[i].state == 0) {
            this.resoulist0.push(res.data[i])
          }
          if (res.data[i].state == 1) {
            this.resoulist1.push(res.data[i])
          }
          if (res.data[i].state == 2) {
            this.resoulist2.push(res.data[i])
          }
          // }
        }

        for (var i = 0; i < this.resoulist1.length; i++) {
          console.log("1")
          this.getEndTime(this.resoulist1[i].createTime, i)
        }

        for (var i = 0; i < this.resoulist1.length; i++) {
          this.getEndTime(this.resoulist1[i].endTime, i)
        }
        for (var i = 0; i < this.resoulist1.length; i++) {
          console.log("1")
          this.getEndTime1(this.resoulist0[i].createTime, i)
        }

        for (var i = 0; i < this.resoulist1.length; i++) {
          this.getEndTime1(this.resoulist0[i].endTime, i)
        }
        console.log(this.resoulist)
      })
    }
  }
}
</script>

<style lang="scss">
.newCollege {
  width: 73%;
  display: flex;
  flex-direction: column;
  margin-left: 15%;
  overflow: hidden;
  .newCollege_fors {
    width: 100%;
    // justify-content: space-between;
    margin-left: 7%;
    white-space: nowrap; /*第二层设置  不换行  */
    overflow-y: auto;
    .newCollege_for {
      display: inline-block;
      width: 200px;
      height: 300px;
      background-color: #a6a6a6;
      margin-right: 3%;
      margin-bottom: 20px;
      border-radius: 5px;
      overflow: hidden;
      text-align: center;
      img {
        display: block;
        width: 100% !important;
        height: 150px !important;
      }
      .newCollege_for_title {
        display: flex;
        margin-top: 10px;
        text-align: center;
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
    width: 100%;
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