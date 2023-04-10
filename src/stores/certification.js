import { identityGet } from '@/server/axios';
import { defineStore } from 'pinia';

export const useCertificationStore = defineStore('certification', {
  state: () => {
    return { primaryCertification: null, advancedCertification: null };
  },
  actions: {
    async getPrimaryCertification() {
      const res = await identityGet({ type: '1' });
      if (res.code === '200') {
        this.primaryCertification = res.data.identityAuth;
      }
    },
    async getAdvancedCertification() {
      const res = await identityGet({ type: '2' });
      if (res.code === '200') {
        this.advancedCertification = res.data.identityAuth;
      }
    },
  },
});
