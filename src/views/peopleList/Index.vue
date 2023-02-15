<template>
  <div class="homepage-container" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <img src="../../assets/banner.png" alt="banner" class="banner" />
      <div class="v-ranking-list">
        <h3 class="title">{{ $t('vList.title') }}</h3>
        <p class="mini-title">{{ $t('vList.miniTitle') }}</p>
        <el-table
          ref="vTable"
          class="vTable"
          @row-click="selectV"
          :data="vTableList"
          max-height="578"
        >
          <el-table-column :label="$t('vList.table.label1')">
            <template slot-scope="scope">
              <div class="v-infos">
                <img
                  :src="scope.row.headUrl"
                  :alt="$t('vList.table.vHead')"
                  class="v-logo"
                />
                <div class="v-info">
                  <p class="name">{{ scope.row.userName }}</p>
                  <p class="inDay">
                    {{ $t('vList.table.join') }}{{ scope.row.days
                    }}{{ $t('vList.table.day') }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('vList.table.label2')"
            prop="monthProfit"
          ></el-table-column>
          <el-table-column
            :label="$t('vList.table.label3')"
            prop="totalProfit"
          ></el-table-column>
          <el-table-column :label="$t('vList.table.label4')">
            <template slot-scope="scope">{{ scope.row.correctRate }}%</template>
          </el-table-column>
        </el-table>
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';
import { homePageApi } from '@/server/axios.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      recordsTotal: 6,
      currentPage: 1,
      pageSize: 5,
      vTableList: [],
      carouselArray: [],
      activeUser: '0',
      allAmount: '0',
      allHand: '0',
    };
  },
  computed: {
    ...mapGetters({
      CurrentUserInfos: 'getCurrentUserInfos',
    }),
    // tag 标题
    documentTitle() {
      return this.getTitleValueByLang('跟单', '跟單', 'Follow Influencer');
    },
  },
  created() {
    this.getBaseData();
  },
  methods: {
    // 获取基础数据（banner/大V)
    getBaseData() {
      homePageApi.brandList().then((res) => {
        if (res.code === '200') {
          this.vTableList = res.data.scoreRank;
          this.carouselArray = res.data.banner;
          let formData = res.data.platformData;
          this.activeUser = this.toThousands(formData.activeUser);
          this.allAmount = this.toThousands(formData.allAmount);
          this.allHand = this.toThousands(formData.allHand);
        }
      });
    },
    toThousands(num) {
      var result = '',
        counter = 0;
      num = (num || 0).toString();
      for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result = num.charAt(i) + result;
        if (!(counter % 3) && i != 0) {
          result = ',' + result;
        }
      }
      return result;
    },
    // 点击大V  /personalHome userId
    selectV(row) {
      // if (row.subIsFee !== '1'){
      //   this.$router.push({ name: "userBinding", query: { userId: this.userId } })
      // }else {
      this.$router.push({
        path: '/personalHome',
        query: { userId: row.userId },
      });
      // }
    },
    // 改变每页显示条数
    handleSizeChange(i) {
      this.pageSize = i;
      this.currentPage = 1;
    },
    // 分页
    changePage(i) {
      this.currentPage = i;
    },
    handleApplyDocumentary(row) {
      if (this.CurrentUserInfos.token) {
        homePageApi.applyFollow(row.userId).then((res) => {
          if (res.code === '200') {
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$router.push('/login');
      }
    },
    // banner
    correntUrl(params) {
      let url = JSON.parse(params);
      return url.webURL;
    },
    // 注册页
    goRegister() {
      this.$router.push('/register');
    },
    // 开启交易
    openChange() {
      this.$router.push('/trading');
    },
  },
};
</script>
<style lang="scss" scope>
.homepage-container {
  width: 100%;
  background-color: #fff;
  .el-carousel__container {
    height: 330px;
  }
  .banner {
    width: 100%;
    height: 330px;
  }
  .v-ranking-list {
    background-color: #f7f7f7;
    width: 100%;
    padding: 26px 0 100px;
    .title,
    .vTable,
    .pagination-container,
    .aboutus {
      width: 1000px;
      margin: 0 auto;
    }
    .pagination-container {
      margin-top: 20px;
    }
    .title {
      font-size: 40px;
      color: #6175ae;
      letter-spacing: 1.5px;
    }
    .mini-title {
      font-size: 24px;
      color: #6175ae;
      letter-spacing: 1.5px;
      width: 1000px;
      margin: 0 auto;
      margin-top: 21px;
      margin-bottom: 28px;
    }
    .vTable {
      .v-infos {
        display: flex;
        .v-logo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .v-info {
          .name {
            color: #848290;
            font-size: 14px;
          }
          .inDay {
            font-size: 12px;
            color: #c3c2c9;
          }
        }
      }
      .applyBtn {
        display: inline-block;
        cursor: pointer;
        width: 80px;
        height: 30px;
        line-height: 30px;
        background-color: #6175ae;
        color: #ffffff;
        font-size: 13px;
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss">
.homepage-container {
  .el-table th,
  .el-table tr {
    background-color: #f7f7f7 !important;
    border: none;
    padding: 0;
  }
  .el-table th > .cell {
    color: #008367;
  }
  .el-table tbody tr:hover > td {
    background-color: #f7f7f7 !important;
  }
  .pagination-container {
    .el-input__inner,
    .el-pagination,
    .el-dialog,
    .el-pager li,
    button,
    button:disabled {
      background-color: #f7f7f7 !important;
    }
  }
}
.el-table {
  background-color: transparent;
}
</style>
