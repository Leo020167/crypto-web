import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { getUserInfo } from '@/server/axios';

export const useUserStore = defineStore('user', () => {
  const userInfo = useStorage('userInfos', null, sessionStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  const getUser = async () => {
    const res = await getUserInfo();

    if (res.code === '200') {
      userInfo.value.user = res.data;
    }
  };

  return {
    userInfo,
    getUser,
  };
});