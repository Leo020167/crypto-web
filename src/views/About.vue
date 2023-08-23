<template>
  <div class="about pb-12">
    <div class="bict-banner">
      <div class="bict-banner-bg">
        <img src="../assets/icon/icon_banner_about.png" alt="" class="image" />
      </div>
      <div class="bict-banner-box">
        <div class="bict-title">
          <h3 class="bict-h3">{{ $t('Top Global Asset Management') }}</h3>
          <h3 class="bict-sub">
            {{
              $t(
                "Through a global network of over 900 investment professionals, we can ensure the success of our customers' investments."
              )
            }}
          </h3>
        </div>
      </div>
    </div>
    <div class="bict-about">
      <div class="bict-about-image">
        <img src="../assets/icon/icon_logo.png" alt="" class="image" />
      </div>
      <div class="bict-about-box">
        <div class="bict-about-title">
          <h3 class="bict-h3">{{ $t('About the Group') }}</h3>
        </div>
        <div class="bict-about-detail">
          <p class="text">
            {{ $t('Group Introduction') }}
          </p>
        </div>
      </div>
    </div>
    <div class="bict-culture">
      <div class="bict-title">
        <h3 class="bict-h3">{{ $t('Company Culture') }}</h3>
      </div>
      <div class="bict-culture-nav">
        <el-row class="bict-ul">
          <el-col class="bict-li" :md="8">
            <div class="bict-culture-image">
              <img
                src="../assets/icon/icon_culture_1.png"
                alt=""
                class="icon"
              />
            </div>
            <div class="bict-culture-title">
              <h3 class="bict-h3">{{ $t('Our Real Name') }}</h3>
            </div>
            <div class="bict-culture-note">
              <p class="text">
                {{ $t('Make it easy for everyone to trade digital assets') }}
              </p>
            </div>
          </el-col>
          <el-col class="bict-li" :md="8">
            <div class="bict-culture-image">
              <img
                src="../assets/icon/icon_culture_2.png"
                alt=""
                class="icon"
              />
            </div>
            <div class="bict-culture-title">
              <h3 class="bict-h3">{{ $t('Our Vision') }}</h3>
            </div>
            <div class="bict-culture-note">
              <p class="text">
                {{ $t('Make AIDTC spread to every country in the world') }}
              </p>
            </div>
          </el-col>
          <el-col class="bict-li" :md="8">
            <div class="bict-culture-image">
              <img
                src="../assets/icon/icon_culture_3.png"
                alt=""
                class="icon"
              />
            </div>
            <div class="bict-culture-title">
              <h3 class="bict-h3">{{ $t('Our Advantages') }}</h3>
            </div>
            <div class="bict-culture-note">
              <p class="text">
                {{ $t('Micro-second high performance trading technology') }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bict-good">
      <div class="bict-title">
        <h3 class="bict-h3">{{ $t('Product Features') }}</h3>
      </div>
      <div class="bict-good-nav">
        <el-row class="bict-ul">
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_1.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">
                {{ $t('Operating system with core level security') }}
              </p>
            </div>
          </el-col>
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_2.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">
                {{ $t('A wide range of financial derivative Products') }}
              </p>
            </div>
          </el-col>
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_3.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">{{ $t('Multi-currency support') }}</p>
            </div>
          </el-col>
        </el-row>
        <el-row class="bict-ul">
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_4.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">{{ $t('Mobility support') }}</p>
            </div>
          </el-col>
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_5.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">{{ $t('Multi-language support') }}</p>
            </div>
          </el-col>
          <el-col :md="8" class="bict-li">
            <div class="bict-good-image">
              <img src="../assets/icon/icon_good_6.png" alt="" class="icon" />
            </div>
            <div class="bict-good-note">
              <p class="text">{{ $t('Platform-wide client support') }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@media screen and (min-width: 1200px) {
  .about {
    .bict-about {
      width: 1080px;
    }

    .bict-culture {
      width: 1080px;
    }

    .bict-good {
      width: 1000px;
    }
  }
}

@media screen and (max-width: 768px) {
  .about {
    .bict-about {
      margin: 20px !important;
      padding: 20px !important;
    }
    .bict-about-image {
      display: none;
    }

    .bict-banner {
      overflow: hidden;

      .bict-banner-bg {
        img {
          width: auto;
          height: 300px;
        }
      }
    }

    .bict-culture {
      margin-top: 20px !important;

      .bict-culture-nav {
        margin-top: 20px !important;

        .bict-ul {
          .bict-li {
            margin-bottom: 20px;
          }
        }
      }
    }

    .bict-good-nav {
      .bict-ul {
        .bict-li {
          margin-bottom: 20px;
        }
      }
    }
  }
}

.about {
  background: #ffffff;

  .bict-banner {
    width: 100%;
    position: relative;

    .image {
      width: 100%;
    }

    .bict-banner-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 28%;

      .bict-title {
        text-align: center;

        .bict-h3 {
          font-size: 39px;
          font-family: FZHei-B01T;
          font-weight: bold;
          color: #ffffff;
        }

        .bict-sub {
          margin-top: 20px;
          font-size: 18px;
          font-family: FZHei-B01T;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
  }

  .bict-about {
    margin: 98px auto auto;
    box-sizing: border-box;
    background: #f7fafd;
    padding: 80px 100px;

    .bict-about-image {
      margin-top: -150px;
      float: left;
      margin-right: 15px;

      .image {
        width: 276px;
        height: 276px;
      }
    }

    .bict-about-box {
      .bict-about-title {
        .bict-h3 {
          font-size: 22px;
          font-family: FZHei-B01T;
          font-weight: bold;
          color: #333333;
        }
      }

      .bict-about-detail {
        margin-top: 30px;

        .text {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 300;
          color: #151515;
          line-height: 24px;
          text-indent: 2em;
        }
      }

      .bict-about-content {
        margin-top: 28px;

        .text {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 300;
          color: #151515;
          line-height: 24px;
          text-indent: 2em;
        }
      }

      .bict-about-content2 {
        margin-top: 28px;

        .text {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 300;
          color: #151515;
          line-height: 24px;
          text-indent: 2em;
        }
      }
    }
  }

  .bict-culture {
    margin: 80px auto auto;
    overflow: hidden;
    padding: 0 18px;

    .bict-title {
      text-align: center;

      .bict-h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #1e2428;
      }
    }

    .bict-culture-nav {
      margin-top: 60px;

      .bict-ul {
        .bict-li {
          list-style: none;
          text-align: center;

          .bict-culture-image {
            .icon {
              width: 108px;
              height: 86px;
            }
          }

          .bict-culture-title {
            .bict-h3 {
              font-size: 24px;
              font-family: FZHei-B01T;
              font-weight: 400;
              color: #1e2428;
            }
          }

          .bict-culture-note {
            margin-top: 10px;

            .text {
              font-size: 18px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #1e2428;
            }
          }
        }
      }
    }
  }

  .bict-good {
    margin: 80px auto auto;
    overflow: hidden;
    padding: 0 18px;

    .bict-title {
      text-align: center;

      .bict-h3 {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #1e2428;
      }
    }

    .bict-good-nav {
      margin-top: 60px;

      .bict-ul {
        margin-bottom: 50px;

        .bict-li {
          list-style: none;
          text-align: center;

          .bict-good-image {
            .icon {
              width: 160px;
              height: 160px;
            }
          }

          .bict-good-note {
            margin-top: 30px;

            .text {
              font-size: 20px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #1e2428;
            }
          }
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
