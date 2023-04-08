import './style.css';
import { createPinia, PiniaVuePlugin } from 'pinia';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import moment from 'moment';

import func from '@/utils/func';
import ElementUI from 'element-ui';

import i18n from './i18n';

Vue.prototype.moment = moment;

Vue.config.productionTip = false;

// 重置css
import 'normalize.css/normalize.css';
// 全局公共样式
import '@/styles/index.scss';
// element-ui
import './styles/theme/index.css';

import VueQrcode from '@chenfengyuan/vue-qrcode';

Vue.component(VueQrcode.name, VueQrcode);

Vue.use(ElementUI);

/**
 *  fontawesome字体图标
 *  用法:
 *  1.将所需要的图标import进来，要以fa前缀开头，如：
 *    import { faUserSecret } from '@fortawesome/free-solid-svg-icons'，
 *    图标网址网址 https://fontawesome.com/icons?d=gallery&s=solid&m=free
 *  2.library.add()加上引进的图标
 *  3.组件中使用： <font-awesome-icon icon='user-secret' /> (!!!此处要去掉前缀fa,然后改成非驼峰式小写命名)
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import VueQriously from 'vue-qriously';
Vue.use(VueQriously);
import {
  faComments,
  faChalkboardTeacher,
  faUserPlus,
  faUserShield,
  faJournalWhills,
  faUserEdit,
  faPhoneAlt,
  faMapMarkerAlt,
  faTrashAlt,
  faUpload,
  faCheckCircle,
  faEdit,
  faSearch,
  faCircleNotch,
  faStar,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(
  faUser,
  faCircleNotch,
  faStar,
  faSearch,
  faUpload,
  faEdit,
  faCheckCircle,
  faComments,
  faChalkboardTeacher,
  faUserPlus,
  faUserShield,
  faJournalWhills,
  faUserEdit,
  faPhoneAlt,
  faMapMarkerAlt,
  faTrashAlt,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

// 全局组件
// 1.fade过渡效果
import FadeComponent from './components/FadeTransition.vue';
Vue.component('FadeComponent', FadeComponent);

// 2.暂无内容
import NullRecord from './components/NullRecords.vue';
Vue.component('NullRecord', NullRecord);

// 3.分页器组件
import Pagination from './components/Pagination.vue';
Vue.component('Pagination', Pagination);

// 全局指令
import directives from './utils/directives';
Vue.use(directives);
// 注册i18n实例并引入语言文件，文件格式等下解析

// 全局过滤器
import * as filters from '@/utils/filter';
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.use(func);

// 全局获取tag标题
Vue.prototype.getTitleValueByLang = function (cnValue, twValue, enValue) {
  if (typeof this.$i18n == 'undefined') return '';
  if (this.$i18n.locale == 'zh_CN') {
    return cnValue + ' - TradingView';
  } else if (this.$i18n.locale == 'zh_TW') {
    return twValue + ' - TradingView';
  } else {
    return enValue + ' TradingView';
  }
};

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  router,
  store,
  i18n,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
