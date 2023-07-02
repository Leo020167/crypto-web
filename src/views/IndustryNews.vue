<template>
  <div class="content bg-white text-[#2c3e50]">
    <div class="page-notice-details page-wrap-1200 page-min-width">
      <div class="page-notice-details-left">
        <div
          class="page-notice-menu-item"
          v-for="(item, index) in articleList"
          :key="index"
          @click="handleItem(item.articleId)"
        >
          <div class="page-notice-menu-item-time">
            <div>{{ item.createTime.substring(5, 10) }}</div>
            <div>{{ item.createTime.substring(0, 4) }}</div>
          </div>
          <div
            class="page-notice-menu-item-title"
            :title="item.summary ? item.summary : item.title"
          >
            {{ item.summary ? item.summary : item.title }}
          </div>
        </div>
      </div>
      <div class="page-notice-details-right" v-loading="articleLoading">
        <div class="page-notice-details-main">
          <h3>{{ articleInfo.title }}</h3>
          <div class="page-notice-details-main-date">
            {{ parseTime(articleInfo.createTime) }}
          </div>
          <div
            class="page-notice-details-main-text"
            v-html="articleInfo.content"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, getArticle } from '@/server/axios';
import { transforTime } from '@/utils/time.js';

export default {
  components: {},
  data() {
    return {
      articleList: [],
      articleInfo: {},
      articleLoading: true,
    };
  },
  mounted() {
    this.procoinArticle();
    let articleId = this.$route.params.id;
    // eslint-disable-next-line no-empty
    if (articleId == null || articleId === 0) {
      articleId = this.articleList?.[0]?.articleId;
    }
    this.articleDetail(articleId);
  },
  methods: {
    parseTime: transforTime.parseTime,
    addNum(data) {
      console.log(data);
      if (data == 'zh') {
        this.procoinArticle('ts');
      } else {
        this.procoinArticle('en');
      }
    },
    procoinArticle() {
      const params = {
        pageNo: 1,
        pageSize: 100000,
      };

      getArticles(params).then((res) => {
        if (res.code === '200') {
          const data = res.data.data;
          data.forEach((item) => {
            item.createTime = this.parseTime(item.createTime, '{y}-{m}-{d}');
          });
          this.articleList = data;
          this.articleDetail(data[0].articleId);
        }
      });
    },
    handleItem(articleId) {
      this.articleLoading = true;
      this.articleDetail(articleId);
    },
    articleDetail(articleId) {
      const params = {
        articleId: articleId,
      };
      getArticle(params).then((res) => {
        if (res.code === '200') {
          this.articleLoading = false;
          this.articleInfo = Object.assign({}, res.data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
}

.page-notice-details {
  display: flex;
  margin: 0 auto auto;
  width: 1200px;

  .page-notice-details-left {
    width: 320px;
    min-height: calc(100vh - 200px);
    background: rgba(247, 251, 255, 1);
    padding: 30px 0;

    .page-notice-menu-item {
      display: flex;
      margin-bottom: 15px;
      padding: 10px 0;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background: #2c72ef;
        color: #ffffff;

        .page-notice-menu-item-time {
          color: #bad3ff;
        }
      }

      .page-notice-menu-item-time {
        color: #8192a5;
        font-size: 12px;
        border-right: solid 1px #d3d3d3;
        padding: 0 20px;
      }

      .page-notice-menu-item-title {
        flex: 1;
        overflow: hidden;
        padding: 0 20px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }

  .page-notice-details-right {
    flex: 1;
    padding: 30px 20px 30px 50px;

    .page-notice-details-main {
      h3 {
        color: #15223b;
        font-size: 21px;
        margin-bottom: 15px;
      }

      .page-notice-details-main-date {
        color: #8192a5;
        font-size: 12px;
        margin-bottom: 25px;
      }

      .page-notice-details-main-text {
        font-size: 15px;
        color: #15223b;
        line-height: 32px;
        padding-bottom: 40px;
        border-bottom: solid 1px #d3d3d3;
      }
    }

    .page-notice-details-other {
      padding-top: 36px;

      h3 {
        font-size: 16px;
        margin-bottom: 30px;
        text-transform: uppercase;
      }

      .page-notice-details-other-item {
        color: #2c72ef;
        margin-bottom: 20px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;

        div:first-child {
          flex: 1;

          &:hover {
            text-decoration: underline;
          }
        }

        div:last-child {
          color: #8192a5;
        }
      }
    }
  }
}
</style>
