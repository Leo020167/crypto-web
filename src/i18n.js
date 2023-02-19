import en from './assets/languages/en.json';
import es from './assets/languages/es.json';
import fr from './assets/languages/fr.json';
import ja from './assets/languages/ja.json';
import ko from './assets/languages/ko.json';
import ru from './assets/languages/ru.json';
import zh_CN from './assets/languages/zh-CN.json';
import zh_TW from './assets/languages/zh-TW.json';

import enLocale from 'element-ui/lib/locale/lang/en';
import esLocale from 'element-ui/lib/locale/lang/es';
import frLocale from 'element-ui/lib/locale/lang/fr';
import jaLocale from 'element-ui/lib/locale/lang/ja';
import koLocale from 'element-ui/lib/locale/lang/ko';
import ruRULocale from 'element-ui/lib/locale/lang/ru-RU';
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN';
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW';

import ElementLocale from 'element-ui/lib/locale';
import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: localStorage.getItem('locale')
    ? localStorage.getItem('locale')
    : 'zh-CN',
  messages: {
    en: Object.assign(en, enLocale),
    es: Object.assign(es, esLocale),
    fr: Object.assign(fr, frLocale),
    ja: Object.assign(ja, jaLocale),
    ko: Object.assign(ko, koLocale),
    ru: Object.assign(ru, ruRULocale),
    'zh-CN': Object.assign(zh_CN, zhCNLocale),
    'zh-TW': Object.assign(zh_TW, zhTWLocale),
  },
});

ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
