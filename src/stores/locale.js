import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import i18n from '../i18n';

export const locales = [
  {
    value: 'zh-CN',
    label: '简体中文',
  },
  {
    value: 'zh-TW',
    label: '繁體中文',
  },
  {
    value: 'en',
    label: 'ENGLISH',
  },
  {
    value: 'ja',
    label: '日本語',
  },
  {
    value: 'ko',
    label: '한국인',
  },
  {
    value: 'ru',
    label: 'Русский язык',
  },
  {
    value: 'fr',
    label: 'Français',
  },
  {
    value: 'es',
    label: 'Español',
  },
];

export const useLocaleStore = defineStore({
  id: 'locale',
  state: () => ({
    locales: Object.freeze(locales),
    locale: useStorage('locale', 'en'),
  }),
  getters: {},
  actions: {
    setLocale(locale) {
      this.locale = locale;
      i18n.locale = locale;
    },
  },
});
