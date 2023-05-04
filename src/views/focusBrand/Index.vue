<template>
  <div class="focus-brand-box" v-document-title :data-title="documentTitle">
    <FadeComponent>
      <div class="focus-container">
        <!-- 标题 -->
        <p class="focus-title">{{ $t('subscribe.title') }}</p>
        <p class="mini-focus-title">{{ $t('subscribe.miniTitle') }}</p>
        <el-table
          class="table-boxs"
          @row-click="selectV"
          :data="focusData"
          style="width: 100%"
        >
          <el-table-column :label="$t('subscribe.table.label1')">
            <template slot-scope="scope">
              <div class="avarts">
                <div class="img">
                  <img :src="scope.row.headUrl" class="avart-pic" />
                </div>
                <div class="people-data">
                  <p class="name">{{ scope.row.userName }}</p>
                  <p class="day">
                    {{ $t('subscribe.table.join') }}{{ scope.row.days
                    }}{{ $t('subscribe.table.day') }}
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 上月收益 -->
          <el-table-column
            prop="monthProfit"
            :label="$t('subscribe.table.label2')"
          ></el-table-column>
          <!-- 总收益 -->
          <el-table-column
            prop="totalProfit"
            :label="$t('subscribe.table.label3')"
          ></el-table-column>
          <!-- 准确率 -->
          <el-table-column :label="$t('subscribe.table.label4')">
            <template slot-scope="scope">
              <p>{{ scope.row.correctRate }}%</p>
            </template>
          </el-table-column>
          <!-- 到期时间 -->
          <!--          <el-table-column :label="$t('subscribe.table.label6')">-->
          <!--            <template slot-scope="scope">-->
          <!--              <p :class="scope.row.isExpireTime != '0' ? 'color-green' : 'color-red'">{{scope.row.isExpireTime != '0' ? transTime(scope.row.expireTime) : '订阅已过期'}}</p>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!-- 操作 -->
          <el-table-column
            prop="accuracy"
            :label="$t('subscribe.table.label5')"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small">{{
                scope.row.subIsFee != '1'
                  ? $t('subscribe.table.chakan')
                  : $t('subscribe.table.chakan')
              }}</el-button>
              <!--              <el-button type="primary" size="small">{{scope.row.subIsFee != '1' ? $t('subscribe.table.shenqingbangding') : $t('subscribe.table.chakan')}}</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </FadeComponent>
  </div>
</template>

<script>
import { homePageApi } from '@/server/axios.js';
import { transforTime } from '@/utils/time.js';
export default {
  data() {
    return {
      focusData: [],
    };
  },
  created() {
    this.getBaseData();
  },
  computed: {
    documentTitle() {
      return this.getTitleValueByLang('订阅', '訂閱', 'Subscribe');
    },
  },
  methods: {
    // 获取基本信息
    getBaseData() {
      homePageApi.myFocusList().then((res) => {
        if (res.code === '200') {
          this.focusData = res.data.scoreRank;
        }
      });
    },
    // 转换时间
    transTime(time) {
      return transforTime.returnYMD(time);
    },
    //    进入大V的个人中心
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
  },
};
</script>

<style lang="scss" scope>
.focus-brand-box {
  background-color: white;
  .focus-container {
    width: 84%;
    margin: 0 auto;
    padding: 25px 0;
    min-height: 600px;
    .focus-title {
      font-size: 40px;
      color: #6175ae;
      letter-spacing: 1.5px;
    }
    .mini-focus-title {
      font-size: 24px;
      color: #6175ae;
      letter-spacing: 1.5px;
      margin: 0 auto;
      margin-top: 21px;
      margin-bottom: 28px;
    }
    .table-boxs {
      margin-top: 15px;
      .avarts {
        display: flex;
        .img {
          height: 43px;
          width: 43px;
          .avart-pic {
            height: 43px;
            width: 43px;
            border-radius: 50%;
          }
        }
        .people-data {
          margin-left: 5px;
          .name {
            font-size: 15px;
            font-weight: bold;
          }
          .day {
            margin-top: 1px;
          }
        }
      }
    }
  }
}
</style>
