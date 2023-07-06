<template>
  <div class="container">
    <div class="text-right mb-5">
      <router-link to="/pledge-history">{{ $t('pledge.text1') }}</router-link>
    </div>

    <el-row :gutter="24">
      <el-col :span="8" v-for="v in pledges" :key="v.id" class="mb-6">
        <el-card class="box-card">
          <div slot="header" class="flex items-center justify-between">
            <span>{{ v.pledgeName }}</span>
            <el-button type="primary" size="small" @click="handleClick(v)">{{
              $t('pledge.text2')
            }}</el-button>
          </div>

          <el-row style="color: #666">
            <el-col :span="6">
              <div>
                <div>{{ $t('pledge.text3') }}</div>
                <div style="margin-top: 4px">{{ v.minCount }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <div>{{ $t('pledge.text4') }}</div>
                <div style="margin-top: 4px">
                  {{ v.duration }}{{ $t('pledge.text5') }}
                </div>
              </div>
            </el-col>
            <!-- <el-col :span="6">
              <div>
                <div>{{ $t('pledge.text6') }}</div>
                <div style="margin-top: 4px">
                  {{ Number(v.minCount) * Number(v.profitRate) * 0.01 }}
                </div>
              </div>
            </el-col> -->
            <el-col :span="6">
              <div>
                <div>{{ $t('pledge.text7') }}</div>
                <div style="margin-top: 4px">{{ v.profitRate }}%</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="$t('pledge.text2')" :visible.sync="visible" width="50%">
      <div style="padding: 0 12px" v-if="pledge">
        <el-row>
          <el-col class="box">
            <div class="title">
              {{ pledge.duration }}{{ $t('pledge.text5') }}
            </div>
            <div class="description">{{ $t('pledge.text4') }}</div>
          </el-col>
          <el-col class="box" style="width: auto">
            <div class="title">
              <span>{{
                (Number(count) * Number(pledge.profitRate) * 0.01).toFixed(2)
              }}</span>

              <span class="symbol">{{ pledge.symbol }}</span>
            </div>
            <div class="description">{{ $t('pledge.text7') }}</div>
          </el-col>
        </el-row>

        <div style="margin-top: 20px">
          <div style="color: #666666; font-size: 12px; margin-bottom: 20px">
            {{ $t('pledge.text8') }}
          </div>
          <el-input-number
            v-model="count"
            :min="Number(pledge.minCount ?? 0)"
            :controls="false"
            style="width: 100%"
          ></el-input-number>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('pledge.text9') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t('pledge.text10')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listPledges, pledgeCommit } from '@/server/axios.js';

export default {
  data: () => ({
    pledge: null,
    pledges: [],
    visible: false,
    count: 0,
  }),
  created() {
    listPledges().then((res) => {
      this.pledges = res.data;
    });
  },
  methods: {
    handleSubmit() {
      pledgeCommit({ count: this.count, pledgeId: this.pledge?.id }).then(
        (data) => {
          if (data.code === '200') {
            this.$message.success(data.msg);
            this.visible = false;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    handleClick(pledge) {
      this.pledge = pledge;
      this.count = Number(pledge.minCount);
      this.visible = true;
    },
  },
};
</script>
<style lang="scss">
.container {
  padding: 30px 50px;

  .el-input-number .el-input__inner {
    text-align: left;
  }

  .el-card__header {
    border: 0;
    color: #2e8ded;
  }

  .text-right {
    text-align: right;
  }

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .box {
    min-width: 154px;
    width: 154px;
    height: 70px;
    background: linear-gradient(
      180deg,
      rgba(237, 242, 249, 0.69) 0%,
      rgba(210, 220, 249, 0.52) 100%
    );
    border-radius: 5px 5px 5px 5px;
    opacity: 1;
    border: 1px solid #6175ae;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 30px;
    padding: 20px;

    .title {
      color: #6175ae;
      font-size: 24px;

      .symbol {
        font-size: 14px;
      }
    }

    .description {
      color: #333333;
      font-size: 12px;
      margin-top: 8px;
    }
  }
}
</style>
