<template>
  <div v-loading="showloading" element-loading-background="rgb(23,27,43)">
    <div
      class="TVChartContainer"
      :id="containerId"
      :style="{ height: height + 'px' }"
    ></div>
  </div>
</template>

<script>
import { marketUrl } from '@/server/axios';
export default {
  name: 'TVChartContainer',
  props: {
    symbol: {
      default: '',
      type: String,
    },
    interval: {
      default: '1',
      type: String,
    },
    containerId: {
      default: 'tv_chart_container',
      type: String,
    },
    libraryPath: {
      default: 'charting_library/',
      type: String,
    },
    height: {
      type: Number,
      default: 300,
    },
    clientId: {
      default: 'tradingview.com',
      type: String,
    },
    userId: {
      default: 'public_user_id',
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
  },
  tvWidget: null,
  data() {
    return {
      buttons: this.$t('newCommon.text52'),
      studies: [],
      ifMounted: false,
      showloading: true,
    };
  },
  mounted() {
    this.ifMounted = true;
    if (this.tvWidget !== null && this.symbol) {
      this.drawChart();
    }
    this.$nextTick(() => {
      setTimeout(() => {
        this.showloading = false;
      }, 2000);
    });
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  },
  methods: {
    drawChart() {
      const widgetOptions = {
        symbol: this.symbol,
        // BEWARE: no trailing slash is expected in feed URL
        datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
          marketUrl + '/quote/tradingview' //行情线路图地址
        ),
        timezone: 'Asia/Shanghai',
        interval: this.interval,
        container_id: this.containerId,
        library_path: this.libraryPath,
        locale: this.getLocalLang() || 'zh',
        disabled_features: [
          'use_localstorage_for_settings',
          // "widget_logo", //允许您在小屏幕设备上隐藏logo的 TradingView  文字
          'panne_content_menu',
          'header_resolutions',
          'volume_force_overlay',
          'header_symbol_search',
          'symbol_search_hot_key',
          'border_around_the_chart',
          'header_undo_redo', //左右箭头
          'control_bar',
          'header_saveload',
          'header_screenshot',
          'go_to_date',
          'header_compare',
          'timeframes_toolbar',
          'create_volume_indicator_by_default',
          'create_volume_indicator_by_default_once',
        ],
        enabled_features: ['study_templates'],
        client_id: this.clientId,
        user_id: this.userId,
        fullscreen: this.fullscreen,
        theme: 'Dark',
        autosize: this.autosize,
        studies_overrides: this.studiesOverrides,
        // custom_css_url: 'bundles/modify.css',
        loading_screen: { backgroundColor: '#171b2b' },
        overrides: {
          'paneProperties.background': '#171b2b',
          volumePaneSize: 'medium',
          'scalesProperties.fontSize': 12,
          'paneProperties.legendProperties.showLegend': false,
          'paneProperties.legendProperties.showStudyArguments': !0,
          'paneProperties.legendProperties.showStudyTitles': !0,
          'paneProperties.legendProperties.showStudyValues': !0,
          'paneProperties.legendProperties.showSeriesTitle': !0,
          'paneProperties.legendProperties.showSeriesOHLC': !0,
          'mainSeriesProperties.areaStyle.color1': 'rgba(122, 152, 247, .1)',
          'mainSeriesProperties.areaStyle.color2': 'rgba(122, 152, 247, .02)',
          'mainSeriesProperties.areaStyle.linecolor': '#737375',
          'paneProperties.horzGridProperties.color': '#1f2943',
          'paneProperties.crossHairProperties.color': '#9194A3',
          'mainSeriesProperties.candleStyle.upColor': '#41b37d',
          'mainSeriesProperties.candleStyle.downColor': 'rgb(204, 53, 53)',
          'mainSeriesProperties.candleStyle.drawWick': true,
          'mainSeriesProperties.candleStyle.wickUpColor': '#41b37d',
          'mainSeriesProperties.candleStyle.wickDownColor': 'rgb(204, 53, 53)',
          'mainSeriesProperties.candleStyle.barColorsOnPrevClose': !1,
          'mainSeriesProperties.candleStyle.drawBorder': true,
          'mainSeriesProperties.candleStyle.borderUpColor': '#41b37d',
          'mainSeriesProperties.candleStyle.borderDownColor':
            'rgb(204, 53, 53)',
          'mainSeriesProperties.candleStyle.borderColor': '#4e5b85',
          'mainSeriesProperties.hollowCandleStyle.drawWick': !0,
          'mainSeriesProperties.hollowCandleStyle.drawBorder': !0,
          'mainSeriesProperties.hollowCandleStyle.borderColor': '#4e5b85',
          'mainSeriesProperties.hollowCandleStyle.upColor': '#41b37d',
          'mainSeriesProperties.hollowCandleStyle.downColor':
            'rgb(204, 53, 53)',
          'mainSeriesProperties.hollowCandleStyle.wickColor': '#737375',
          'mainSeriesProperties.haStyle.upColor': '#41b37d',
          'mainSeriesProperties.haStyle.downColor': 'rgb(204, 53, 53)',
          'mainSeriesProperties.haStyle.drawWick': !0,
          'mainSeriesProperties.haStyle.drawBorder': !0,
          'mainSeriesProperties.haStyle.borderUpColor': '#41b37d',
          'mainSeriesProperties.haStyle.borderDownColor': 'rgb(204, 53, 53)',
          'mainSeriesProperties.haStyle.barColorsOnPrevClose': !1,
          'mainSeriesProperties.barStyle.upColor': '#41b37d',
          'mainSeriesProperties.barStyle.downColor': 'rgb(204, 53, 53)',
          'mainSeriesProperties.barStyle.barColorsOnPrevClose': !1,
          'mainSeriesProperties.barStyle.dontDrawOpen': !1,
          'mainSeriesProperties.lineStyle.color': '#4e5b85',
          'mainSeriesProperties.lineStyle.linewidth': 1,
          'mainSeriesProperties.lineStyle.priceSource': 'close',
        },
        customFormatters: {
          timeFormatter: {
            format: function (date) {
              var _format_str = '%h:%m';
              let h =
                date.getUTCHours() < 10
                  ? '0' + date.getUTCHours()
                  : date.getUTCHours();
              let m =
                date.getUTCMinutes() < 10
                  ? '0' + date.getUTCMinutes()
                  : date.getUTCMinutes();
              return _format_str.replace('%h', h, 2).replace('%m', m, 2);
            },
          },
          dateFormatter: {
            format: function (date) {
              let month = date.getUTCMonth() + 1;
              let m = month < 10 ? '0' + month : month;
              let d =
                date.getUTCDate() < 10
                  ? '0' + date.getUTCDate()
                  : date.getUTCDate();
              return date.getUTCFullYear() + '-' + m + '-' + d;
            },
          },
        },
      };

      const tvWidget = new window.TradingView.widget(widgetOptions);
      this.tvWidget = tvWidget;
      let that = this;
      tvWidget.onChartReady(() => {
        // that.createStudy();
        tvWidget.headerReady().then(() => {
          this.buttons.forEach(function (v) {
            var button = tvWidget.createButton();
            if (v.resolution == '1' && v.chartType == '3') {
              button.classList.add('active');
              tvWidget.chart().setChartType(3);
              that.toggleStudy(3);
            }
            button.textContent = v.title;
            button.setAttribute('title', v.title);
            button.setAttribute('data-chart-type', v.chartType);
            button.setAttribute('data-resolution', v.resolution);
            button.addEventListener('click', function () {
              let chartType = button.getAttribute('data-chart-type') * 1;
              button.classList.add('active');
              var list = that.TVjsApisibling(this.parentNode.parentNode);
              for (var i = 0; i < list.length; i++) {
                if (list[i].childNodes[0]) {
                  var list_btn = list[i].childNodes[0];
                  var list_btn_chil = list_btn.children[0];
                  list_btn_chil.className = list_btn_chil.className.replace(
                    'active',
                    ' '
                  );
                }
              }
              if (tvWidget.chart().chartType() !== chartType) {
                tvWidget.chart().setChartType(chartType);
                that.toggleStudy(chartType);
              }
              if (v.title != 'Time') {
                tvWidget
                  .chart()
                  .setResolution(v.resolution, function onReadyCallback() {});
              } else {
                var type = this.getAttribute('data-resolution');
                tvWidget
                  .chart()
                  .setResolution(type, function onReadyCallback() {});
              }
            });
          });
        });
        setTimeout(() => {
          that.showloading = false;
        }, 1000);
      });
    },
    getLocalLang() {
      const map = {
        'zh-CN': 'zh',
        'zh-TW': 'zh_TW',
      };
      return map[this.$i18n.locale]
        ? map[this.$i18n.locale]
        : this.$i18n.locale;
    },
    TVjsApisibling(elem) {
      var r = [];
      var n = elem.parentNode.firstChild;
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }
      return r;
    },
    createStudy() {
      var id = this.tvWidget
        .chart()
        .createStudy('Moving Average', false, false, [5, 'close', 0], null, {
          'Plot.color': '#34a9ff',
          'Plot.linewidth': 1,
        });
      this.studies.push(id);
      var id1 = this.tvWidget
        .chart()
        .createStudy('Moving Average', false, false, [10, 'close', 0], null, {
          'Plot.color': '#ffb620',
          'Plot.linewidth': 1,
        });
      this.studies.push(id1);
      var id2 = this.tvWidget
        .chart()
        .createStudy('Moving Average', false, false, [15, 'close', 0], null, {
          'Plot.color': '#8750ff',
          'Plot.linewidth': 1,
        });
      this.studies.push(id2);
      var id3 = this.tvWidget
        .chart()
        .createStudy('Moving Average', false, false, [30, 'close', 0], null, {
          'Plot.color': '#ff688f',
          'Plot.linewidth': 1,
        });
      this.studies.push(id3);
    },
    toggleStudy(chartType) {
      var state = chartType == 3 ? 0 : 1;
      for (var i = 0; i < this.studies.length; i++) {
        this.tvWidget.chart().getStudyById(this.studies[i]).setVisible(state);
      }
    },
  },
  watch: {
    symbol: {
      handler(val) {
        try {
          if (this.tvWidget == null && this.ifMounted && val) {
            this.drawChart();
          }
          if (this.tvWidget && val) {
            this.tvWidget.setSymbol(val, this.interval);
          }
        } catch (error) {
          console.log(error);
        }
      },
    },
  },
};
</script>
