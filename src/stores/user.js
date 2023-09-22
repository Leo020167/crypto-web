import { getUserInfo } from '@/server/axios';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const userInfo = useStorage(
    'userInfos',
    sessionStorage.getItem('userInfos'),
    sessionStorage,
    {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }
  );

  console.log(userInfo);

  const getUser = async () => {
    const res = await getUserInfo();

    if (res.code === '200') {
      userInfo.value.user = res.data;
    }
  };
  console.log(userInfo);
  return {
    userInfo,
    getUser,
  };
});
