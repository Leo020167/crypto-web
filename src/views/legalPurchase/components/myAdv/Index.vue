<template>
  <FadeComponent>
    <div class="adv-box">
      <div class="adv-tab">
        <div class="left">
          <img src="../../../../assets/newIcons/adv.png" class="logo" />
          <!-- 我的广告 -->
          <p class="my-name">{{ $t('otc.collectionManagement') }}</p>
        </div>
        <!-- 发布广告 -->
        <div class="right" @click="showAdvToast">
          <img src="../../../../assets/newIcons/addAdv.png" class="add-logo" />
          <p class="add-text">{{ $t('otc.placeAdv') }}</p>
        </div>
      </div>
      <div class="adv-contain">
        <el-table :data="advList" style="width: 100%">
          <!-- 广告方 -->
          <el-table-column :label="$t('otc.advertiser')" align="left">
            <template slot-scope="scope">
              <div class="adv-info">
                <img :src="scope.row.userLogo" alt="" class="adv-logo" />
                <span class="names">{{ scope.row.userName }}</span>
                <span class="orderNum">{{ scope.row.orderNum }}</span>
                <span class="divider"></span>
                <span class="rate">{{ scope.row.limitRate }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 数量 -->
          <el-table-column :label="$t('otc.number')">
            <template slot-scope="scope">
              <span class="mmtext">{{ scope.row.amount }} USDT</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column :label="$t('assets.status')" width="90px">
            <template slot-scope="scope">
              <!-- 已下架状态 -->
              <span class="adv-status offLine" v-if="scope.row.isOnline == 0">{{
                $t('otc.offLine')
              }}</span>
              <!-- 出售中状态 -->
              <span
                class="adv-status selling"
                v-if="scope.row.isOnline == 1 && scope.row.buySell == 'sell'"
                >{{ $t('otc.selling') }}</span
              >
              <!-- 购买中状态 -->
              <span
                class="adv-status buying"
                v-if="scope.row.isOnline == 1 && scope.row.buySell == 'buy'"
                >{{ $t('otc.buying') }}</span
              >
            </template>
          </el-table-column>
          <!-- 限额 -->
          <el-table-column prop="money" :label="$t('otc.limit')">
            <template slot-scope="scope">
              <span class="mmtext"
                >{{ scope.row.minCny }} EUR- {{ scope.row.maxCny }} EUR</span
              >
            </template>
          </el-table-column>
          <!-- 单价 -->
          <el-table-column :label="$t('otc.price')" width="80px">
            <template slot-scope="scope">
              <span class="price-text"
                >{{ $t('newCommon.text59') }}{{ scope.row.price }}</span
              >
            </template>
          </el-table-column>
          <!-- 支付方式 -->
          <el-table-column :label="$t('otc.payWay')" width="180">
            <template slot-scope="scope">
              <img
                v-show="scope.row.isPayWx == 1"
                src="../../../../assets/newIcons/weChat.png"
                class="pay-img"
              />
              <img
                v-show="scope.row.isPayBank == 1"
                src="../../../../assets/newIcons/bank.png"
                class="pay-img"
              />
              <img
                v-show="scope.row.isPayAli == 1"
                src="../../../../assets/newIcons/zhifubao.png"
                class="pay-img"
              />
            </template>
          </el-table-column>
          <!-- 类型 -->
          <el-table-column width="80px" :label="$t('otc.type')">
            <template slot-scope="scope">
              <span>{{ scope.row.buySell == 'buy' ? '购买' : '出售' }}</span>
            </template>
          </el-table-column>
          <!-- 删除/上下架/修改 -->
          <el-table-column
            :label="$t('otc.operating')"
            align="right"
            width="130"
          >
            <template slot-scope="scope">
              <img
                src="../../../../assets/newIcons/delete.png"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              />
              <img
                src="../../../../assets/newIcons/up.png"
                class="upDown-btn"
                @click="handleUpDown(scope.row)"
                v-show="scope.row.isOnline == 0"
              />
              <img
                src="../../../../assets/newIcons/down.png"
                class="upDown-btn"
                @click="handleUpDown(scope.row)"
                v-show="scope.row.isOnline == 1"
              />
              <img
                src="../../../../assets/newIcons/edit.png"
                class="edit-btn"
                @click="handleEdit(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 弹窗 -->
      <FadeComponent>
        <div class="toast-box" v-if="editShow">
          <div class="addAdvBox">
            <div class="top-name">
              <!-- 我想 -->
              <p class="want">{{ $t('otc.want') }}</p>
              <!-- 买/卖 -->
              <p
                :class="editData.wantType == 'buy' ? 'select' : 'bs'"
                @click="changeBs('buy')"
              >
                {{ $t('otc.buy') }}
              </p>
              <p
                :class="editData.wantType == 'sell' ? 'select' : 'bs'"
                @click="changeBs('sell')"
              >
                {{ $t('otc.sell') }}
              </p>
              <p class="usdt-name">USDT</p>
              <p class="close-btn">
                <span class="el-icon-close" @click="closeToast"></span>
              </p>
            </div>
            <!-- 单价 -->
            <div class="edit-box">
              <div class="left">
                <p class="main-name">
                  {{ $t('otc.price') }}
                  <!-- 当前购买最低价或当前出售最高价 -->
                  <span class="currentHightestOrLowerestPrice">{{
                    editData.wantType == 'buy'
                      ? $t('otc.minBuyPrice')
                      : $t('otc.maxSellPrice')
                  }}</span>
                  <span class="currentPrice">{{
                    editData.wantType == 'buy' ? maxSellPrice : minBuyPrice
                  }}</span>
                  <span class="currentHightestOrLowerestPrice">
                    EUR/USDT
                    <span class="fillIn" @click="handleFillIn">填入</span>
                  </span>
                </p>
                <el-input class="input-box" v-model="editData.price">
                  <span slot="suffix">EUR/USDT</span>
                </el-input>
              </div>
              <!-- 数量 -->
              <div class="right">
                <p class="main-name">
                  {{ $t('otc.number') }}
                  <span class="currentHightestOrLowerestPrice"
                    >({{ $t('otc.freezeWantSell') }})</span
                  >
                </p>
                <div class="mode-box">
                  <el-input class="input-box" v-model="editData.num">
                    <span slot="suffix">USDT</span>
                  </el-input>
                </div>
              </div>
              <!-- 限额 -->
              <div class="center">
                <p class="main-name">{{ $t('otc.limit') }}</p>
                <div class="mode-box">
                  <el-input
                    class="input-box input-box-limit"
                    v-model="editData.minMoney"
                  >
                    <span slot="suffix">EUR</span>
                  </el-input>
                  <span class="ii">～</span>
                  <el-input
                    class="input-box input-box-limit"
                    v-model="editData.maxMoney"
                  >
                    <span slot="suffix">EUR</span>
                  </el-input>
                </div>
              </div>
            </div>
            <!-- 方式（可多选） -->
            <div class="road-box">
              <p class="road-title">{{ $t('otc.moreSelect') }}</p>
              <div class="checkbox">
                <div
                  v-for="(item, index) in myPaymentList"
                  :key="index"
                  :class="[
                    'check-item',
                    editData.payWay.includes(item.paymentId) ? 'yes' : '',
                  ]"
                  @click="changePayways(item.paymentId)"
                >
                  <p class="check-name">
                    <img :src="item.receiptLogo" class="pay-type" />
                    {{ item.receiptTypeValue }}
                  </p>
                  <p
                    class="select-item"
                    v-if="editData.payWay.includes(item.paymentId)"
                  >
                    <img
                      src="../../../../assets/newIcons/true.png"
                      class="true-logo"
                    />
                  </p>
                </div>
                <div class="pay-way-item" @click="addPayways">
                  <p class="add1">
                    <img
                      src="../../../../assets/newIcons/add1.png"
                      class="addPng"
                    />
                  </p>
                  <p class="add-tip">
                    <!-- 添加收款方式 -->
                    {{ $t('otc.addPayWay') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="say-box">
              <!-- 留言内容 -->
              <p class="say-name">{{ $t('otc.messageContent') }}</p>
              <el-input
                type="textarea"
                v-model="editData.sayContent"
                class="say-text"
              ></el-input>
            </div>
            <div class="btn">
              <!-- 确认发布 -->
              <p
                class="enterUpdate"
                @click="publishNewAdv"
                v-loading="publishNewAdvBtnLoading"
              >
                {{ $t('otc.confirmRelease') }}
              </p>
            </div>
          </div>
        </div>
      </FadeComponent>
    </div>
  </FadeComponent>
</template>

<script>
import { legalPurchaseApi, getAdPrice } from '@/server/axios.js';
export default {
  data() {
    return {
      editType: 0, //0:新增， 1：修改
      advList: [],
      // 修改、增加
      editShow: false,
      myPaymentList: [], //我的收款方式
      // 选中的付款方式，可多选
      checkedPayWays: [],
      // 确认发布按钮的Loading
      publishNewAdvBtnLoading: false,
      editData: {
        wantType: 'buy',
        price: '',
        num: '',
        minMoney: '',
        maxMoney: '',
        payWay: [],
        sayContent: '',
      },
      // 出售的最高价格
      maxSellPrice: 0,
      // 购买的最低价格
      minBuyPrice: 0,
    };
  },
  created() {
    this.getList();
    // 发布购买广告获取广告最低价格
    this.getAdPrice('buy');
    // 发布出售广告获取广告最高价格
    this.getAdPrice('sell');
  },
  methods: {
    // 点击填入价格
    handleFillIn() {
      if (this.editData.wantType == 'buy') {
        this.editData.price = this.maxSellPrice;
      } else {
        this.editData.price = this.minBuyPrice;
      }
    },
    // 获取发布广告的最高/最低价
    getAdPrice(buysell) {
      getAdPrice(buysell)
        .then((res) => {
          if (buysell == 'buy') {
            this.minBuyPrice = res.data.price;
          } else {
            this.maxSellPrice = res.data.price;
          }
        })
        .catch(() => {});
    },
    // 获取我的广告列表
    getList() {
      legalPurchaseApi.myAdvList().then((res) => {
        if (res.code == 200) {
          this.advList = res.data.myAdList;
        }
      });
    },
    // 添加发布广告按钮 ==打开弹窗
    showAdvToast() {
      this.editType = 0;
      this.getPayway();
      this.editShow = true;
    },
    // 如果是出售，则需要获取我的收款方式,对方迁就我的方式
    getPayway() {
      // 您暂未添加收款方式，添加收款方式后方可发布广告
      legalPurchaseApi.getMyPayway().then((res) => {
        if (res.data.myPaymentList.length == 0) {
          this.$confirm(this.$t('otc.advTip'), this.$t('otc.tips'), {
            distinguishCancelAndClose: true,
            confirmButtonText: this.$t('otc.toAdd'),
            cancelButtonText: this.$t('otc.cancelPlace'),
          })
            .then(() => {
              this.$router.push('/legalPurchase/gatherWay');
            })
            .catch((action) => {
              this.$message({
                type: 'info',
                message: this.$t('otc.advTip1'),
              });
              this.editShow = false;
            });
        } else {
          this.myPaymentList = res.data.myPaymentList;
        }
      });
    },
    // 发布确认按钮
    publishNewAdv() {
      let data = this.editData;
      if (data.price == '' || data.price < 0) {
        this.$message.error(this.$t('otc.advTip2')); //请输入单价
      } else if (
        data.minMoney < 0 ||
        data.maxMoney < 0 ||
        data.maxMoney < data.minMoney
      ) {
        // 请注意限额价格的设置，不能小于0，且最小限额不允许大于最大限额
        this.$message.error(this.$t('otc.advTip3'));
      } else if (data.num == '' || data.num < 0) {
        //请输入数量，且数量不允许小于0
        this.$message.error(this.$t('otc.advTip4'));
      } else if (data.payWay.length == 0) {
        // 请选择方式
        this.$message.error(this.$t('otc.advTip5'));
      } else {
        if (this.editType == 0) {
          this.newAdv();
        } else {
          this.editAdv();
        }
      }
    },
    // 新增发布
    // buySell, price, minCny, maxCny, amount, payWay, content
    newAdv() {
      let data = this.editData;
      let payways = data.payWay.toString();
      this.publishNewAdvBtnLoading = true;
      legalPurchaseApi
        .publishAdv(
          data.wantType,
          data.price,
          data.minMoney,
          data.maxMoney,
          data.num,
          payways,
          data.sayContent.trim()
        )
        .then((res) => {
          this.publishNewAdvBtnLoading = false;
          if (res.code == 200) {
            this.editShow = false;
            this.getList();
            this.$message.success(res.msg);
            this.editData = {
              wantType: 'buy',
              price: '',
              num: '',
              minMoney: '',
              maxMoney: '',
              payWay: [],
              sayContent: '',
            };
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.publishNewAdvBtnLoading = false;
        });
    },
    // 修改
    editAdv() {
      let data = this.editData;
      let payways = data.payWay.toString();
      legalPurchaseApi
        .upDateAdv(
          data.adId,
          data.wantType,
          data.price,
          data.minMoney,
          data.maxMoney,
          data.num,
          payways,
          data.sayContent
        )
        .then((res) => {
          if (res.code == 200) {
            this.editShow = false;
            this.getList();
            this.$message.success(res.msg);
            this.editData = {
              wantType: 'buy',
              price: '',
              num: '',
              minMoney: '',
              maxMoney: '',
              payWay: [],
              sayContent: '',
            };
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    // 删除
    handleDelete(data) {
      // 是否确认删除该广告
      this.$confirm(this.$t('otc.advTip6'), this.$t('otc.tips'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('otc.enter'),
        cancelButtonText: this.$t('otc.cancel'),
      })
        .then(() => {
          legalPurchaseApi.deleteAdv(data.adId).then((res) => {
            if (res.code == 200) {
              this.getList();
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch((action) => {
          this.$message({
            type: 'info',
            message: this.$t('otc.advTip7'), //您已取消删除广告
          });
        });
    },
    // 上下架
    handleUpDown(data) {
      let state = data.isOnline == 1 ? 0 : 1;
      legalPurchaseApi.upDownAdv(data.adId, state).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 编辑
    handleEdit(data) {
      this.getPayway();
      let payway = [];
      let way = JSON.parse(data.payWay);
      for (let i = 0; i < way.length; i++) {
        let num = way[i].paymentId.toString();
        payway.push(num);
      }
      let arr = {
        adId: data.adId,
        wantType: data.buySell,
        price: data.price,
        num: data.amount,
        minMoney: data.minCny,
        maxMoney: data.maxCny,
        payWay: payway,
        sayContent: data.content,
      };
      this.editData = arr;
      this.editType = 1;
      this.editShow = true;
    },
    // 弹窗
    closeToast() {
      this.editShow = false;
      this.editData = {
        wantType: 'buy',
        price: '',
        num: '',
        minMoney: '',
        maxMoney: '',
        payWay: [],
        sayContent:
          '1.本卡已连接公安监控系统，请用合法资金购买' +
          ' 2.为了您的财产安全，请勿把币转移到小平台绝大部分被诈骗财币两空。' +
          ' 3.请勿用自己账户提他人买币，为蝇头小利，成为洗钱的犯罪人员，给自己带来牢狱之灾。' +
          '【请您知晓以上原因造成的损失您自行承担后果】',
      };
    },
    addPayways() {
      this.$router.push('/legalPurchase/gatherWay');
    },
    changeBs(type) {
      if (this.editType == 1) {
        this.$message.error(this.$t('otc.advTip8'));
        return;
      }
      this.editData.price = '';
      this.editData.wantType = type;
    },
    // 选择修改支付方式
    changePayways(type) {
      if (this.editData.payWay.includes(type)) {
        this.editData.payWay.splice(this.editData.payWay.indexOf(type), 1);
      } else {
        this.editData.payWay.push(type);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.adv-box {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  font-size: 14px;
  .adv-status {
    display: inline-block;
    min-width: 36px;
    padding: 0px 7px;
    height: 22px;
    margin-top: 6px;
    border-radius: 2px;
    text-align: center;
    line-height: 22px;
    color: #ffffff;
  }
  .offLine {
    background: #9a9a9a;
  }
  .selling {
    background: #00ad88;
  }
  .buying {
    background: #e2214e;
  }
  .adv-tab {
    display: flex;
    padding-top: 13px;
    .left {
      flex: 1;
      .logo {
        height: 22px;
        vertical-align: -40%;
      }
      .my-name {
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 1px;
        margin-left: 10px;
        color: black;
      }
    }
    .right {
      padding-top: 7px;
      cursor: pointer;
      .add-logo {
        width: 12px;
        vertical-align: text-bottom;
      }
      .add-text {
        display: inline-block;
        font-size: 16px;
        color: #6175ae;
        font-weight: bold;
        margin-left: 10px;
      }
    }
  }
  .adv-contain {
    margin-top: 30px;
    .adv-info {
      .adv-logo {
        height: 23px;
        width: 23px;
        vertical-align: middle;
      }
      .names {
        margin-left: 5px;
        color: #3d3a50;
        font-size: 14px;
      }
      .orderNum {
        font-size: 12px;
        color: #6175ae;
        margin-left: 11px;
      }
      .divider {
        border-left: 1px solid #9a9a9a;
        margin: 0 10px;
      }
      .rate {
        font-size: 12px;
        color: #6175ae;
      }
    }
    .price-text {
      color: #6175ae;
    }

    .payWay {
      display: inline-block;
    }
    .pay-img {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    .delete-btn {
      width: 16px;
      cursor: pointer;
    }
    .upDown-btn {
      margin-left: 26px;
      width: 16px;
      cursor: pointer;
    }
    .edit-btn {
      margin-left: 26px;
      width: 16px;
      cursor: pointer;
    }
  }
  // 弹窗
  .toast-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background-color: rgba($color: #000000, $alpha: 0.7);
    .addAdvBox {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1000px;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      .top-name {
        height: 40px;
        line-height: 40px;
        display: flex;
        width: 100%;
        .want {
          font-size: 16px;
          color: #1a1717;
          font-weight: bold;
        }
        .select {
          width: 130px;
          background: #6175ae;
          border-radius: 2px;
          font-size: 12px;
          color: white;
          text-align: center;
          margin-left: 53px;
          cursor: pointer;
        }
        .bs {
          width: 130px;
          background: #f0f0f0;
          border-radius: 2px;
          font-size: 12px;
          color: #9a9a9a;
          text-align: center;
          margin-left: 47px;
          cursor: pointer;
        }
        .usdt-name {
          margin-left: 53px;
          font-size: 16px;
          color: #1a1717;
        }
        .close-btn {
          flex: 1;
          text-align: right;
        }
      }
      .edit-box {
        margin-top: 20px;
        display: flex;
        .currentHightestOrLowerestPrice {
          font-size: 12px;
        }
        .currentPrice {
          color: $color_main;
        }
        .main-name {
          font-size: 14px;
          color: #9a9a9a;
          margin-bottom: 10px;
          .fillIn {
            margin-left: 10px;
            cursor: pointer;
            color: $color_main;
          }
        }
        .left {
          .input-box {
            width: 250px;
          }
        }
        .mode-box {
          display: flex;
          .input-box {
            width: 250px;
            height: 40px;
          }
          .input-box-limit {
            width: 130px;
            height: 40px;
          }
          .ii {
            font-size: 12px;
            line-height: 40px;
            margin-left: 4px;
            margin-right: 4px;
          }
        }
        .center,
        .right {
          margin-left: 54px;
        }
      }
      .road-box {
        margin-top: 20px;
        .road-title {
          font-size: 14px;
          color: #9a9a9a;
        }
        .checkbox {
          display: flex;
          margin-top: 10px;
          .pay-way-item {
            width: 106px;
            height: 54px;
            background: #f9f9fc;
            border-radius: 2px;
            cursor: pointer;
            .add1 {
              margin-top: 7px;
              text-align: center;
              .addPng {
                height: 20px;
              }
            }
            .add-tip {
              font-size: 12px;
              color: #9a9a9a;
              margin-top: 5px;
              text-align: center;
            }
          }
          .check-item {
            width: 106px;
            height: 54px;
            background: #f9f9fc;
            border-radius: 2px;
            margin-right: 44px;
            cursor: pointer;
            &.yes {
              border: 1px solid #6175ae;
            }
            .check-name {
              margin-top: 7px;
              font-size: 12px;
              color: #3d3a50;
              .pay-type {
                margin-left: 6px;
                width: 15px;
                vertical-align: middle;
                margin-right: 8px;
              }
            }
            .select-item {
              margin-top: 7px;
              padding-right: 7px;
              text-align: right;
              .true-logo {
                float: right;
                width: 14px;
              }
            }
          }
        }
      }
      .say-box {
        margin-top: 20px;
        .say-name {
          font-size: 14px;
          color: #9a9a9a;
        }
        .say-text {
          margin-top: 10px;
          width: 100%;
          height: 98px;
          font-size: 12px;
          line-height: 18px;
          resize: none;
          border-color: #e4e7ed;
          padding: 12px;
        }
      }
      .btn {
        margin-top: 30px;
        text-align: right;
        .enterUpdate {
          display: inline-block;
          width: 217px;
          height: 55px;
          background: #6175ae;
          border-radius: 4px;
          font-size: 14px;
          color: #ffffff;
          text-align: center;
          line-height: 55px;
          cursor: pointer;
        }
      }
    }
  }
}
textarea:focus {
  outline: none !important;
}
.el-icon-close {
  font-size: 28px;
  cursor: pointer;
}
</style>
