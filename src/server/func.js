import axios from 'axios';
import * as params from './params';
import store from '@/store';
import router from '@/router';
import { Message } from 'element-ui';

export const localeHash = {
  'zh-CN': 'cn',
  'zh-TW': 'ts',
  en: 'en',
  es: 'es',
  fr: 'fr',
  ja: 'ja',
  ko: 'ko',
  'ru-RU': 'ru',
};

const instance = axios.create({
  baseURL: '',
});

instance.interceptors.request.use((config) => {
  if (config?.headers) {
    config.headers['lang'] =
      localeHash[window.localStorage.getItem('locale') ?? 'zh-TW'];
  }

  return config;
});

export default {
  axiosPost(apiUrl, postData) {
    let url = apiUrl;
    let formData = new FormData();
    let json = params.signParameters(postData);
    for (let i in json) {
      formData.append(i, json[i]);
    }

    return new Promise((resolve, reject) => {
      instance
        .post(url, formData)
        .then((resData) => {
          resData = resData.data;
          if (resData.code == 40009) {
            store.dispatch('removeCurrentUserInfo');
          }
          resolve(resData);
        })
        .catch(function (error) {
          console.log(error);
          // Message({
          //   message: '网络错误,请检查',
          //   type: 'warning',
          //   duration: 3 * 1000
          // });
          reject();
        });
    });
  },
};
