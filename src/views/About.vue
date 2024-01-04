<template>
  <div class="about pb-12">
    <div class="bict-banner">
      <div class="bict-banner-bg">
        <img src="../assets/icon/icon_banner_about.png" alt="" class="image" />
      </div>
      <div class="bict-banner-box">
        <div class="bict-title">
          <h3 class="bict-h3">{{ $t('Global encrypted digital services') }}</h3>
<!--          <h3 class="bict-sub">-->
<!--            {{-->
<!--              $t(-->
<!--                "Through a global network of more than 1,000 investment experts, we can ensure the success of user investments and provide users with the safest, most efficient and most convenient transactions."-->
<!--              )-->
<!--            }}-->
<!--          </h3>-->
        </div>
      </div>
    </div>
    <div class="bict-about">
      <div class="bict-about-image">
        <img src="../assets/logo.png" alt="" class="image" />
      </div>
      <div class="bict-about-box">
        <div class="bict-about-title">
          <h3 class="bict-h3">{{ $t('About the Group') }}</h3>
        </div>
        <div class="bict-about-detail">
          <p class="text">
            {{
              $t(
                "Liegt encrypted digital exchange is one of the world's top encrypted digital service platforms and the fastest growing encrypted digital exchange in the Asia-Pacific region."
              )
            }}
          </p>
          <p class="text">
            {{
              $t(
                "Through a global network of more than 900 investment experts, it can ensure that users' investments are efficient, convenient and safe. In Hong Kong, Liegt crypto digital exchange uses its global scale and excellent operations to create tailor-made solutions for users. , deeply favored by users and widely supported by users."
              )
            }}
          </p>
          <p class="text">
            {{
              $t(
                "Liegt Encrypted Digital Exchange's global headquarters is located in London, UK, and its Asia-Pacific regional headquarters is located in Hong Kong. It is the world's leading digital asset service platform. It has obtained digital currency trading licenses from the United States, Turkey, Europe, Singapore, etc., and provides comprehensive services to 3 million+ users 24 hours a day. Directional services, core members of the exchange have been deeply involved in the fields of finance and technology for many years, providing technical security guarantees for many users. The Liegt encrypted digital exchange system applies the world's top bank and securities risk control management system mechanism, and adopts the dual security of underlying security technology + supervision and early warning system To ensure that it provides users with a more secure encrypted digital trading environment, the Liegt encrypted digital exchange system has opened a global system and an Asia-Pacific regional system, and has also successively established regional business units around the world to comprehensively and efficiently promote the implementation of the global strategic layout."
              )
            }}
          </p>
        </div>
<!--        <div class="bict-about-content">-->
<!--          <p class="text">-->
<!--            {{-->
<!--              $t(-->
<!--                'Stdelit is a leading global digital asset service platform based in London, UK and headquartered in Hong Kong, Asia Pacific. It is licensed to trade digital currency in the US and provides 24-hour service to 3 million+ users. The core members of the company have been working in the financial and technology sectors for many years, providing technical and business consulting services to many financial institutions, with rich resources of global financial institutions and rich experience in risk management.'-->
<!--              )-->
<!--            }}-->
<!--            {{-->
<!--              $t(-->
<!--                "The Stdelit Smart Trading System provides users with a safer encrypted digital trading environment by applying the world's leading risk control system for banking securities, adopting underlying security technology, establishing an internal monitoring and alert system, and setting up a risk reserve fund mechanism."-->
<!--              )-->
<!--            }}-->
<!--            {{-->
<!--              $t(-->
<!--                'The Stdelit Smart Trade System has opened a global station and a Hong Kong sub-station, while regional business units are being set up in different regions to advance the global strategic layout.'-->
<!--              )-->
<!--            }}-->
<!--          </p>-->
<!--        </div>-->
<!--        <div class="bict-about-content2">-->
<!--          <p class="text">-->
<!--            {{-->
<!--              $t(-->
<!--                'The Stdelit Smart Trading System is an independent platform for cryptocurrency trading for users in Hong Kong. It uses the matching engine and technical wallet support licensed by Stdelit Global Station to facilitate cryptocurrency smart trading using USDT, BTC and ETH for local users.'-->
<!--              )-->
<!--            }}-->
<!--            {{-->
<!--              $t(-->
<!--                'Stdelit Hong Kong employs the same risk control system and the same underlying security technology as Stdelit Global, establishing an internal monitoring and alert system and setting up a risk reserve mechanism to provide a safer environment for users to trade cryptographic digital currency intelligently.'-->
<!--              )-->
<!--            }}-->
<!--          </p>-->
<!--        </div>-->
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
              <h3 class="bict-h3">{{ $t('Our Mission') }}</h3>
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
                {{ $t('Make Liegt spread to every country in the world') }}
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

<script setup>
</script>

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
