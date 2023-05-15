<template>
  <div>
    <div class="container bg-white mt-10 p-4">
      <div class="mb-5 text-orange-400" v-if="email">
        您目前的郵箱是{{ email }}，想要把它更新為？
      </div>
      <el-form
        :model="model"
        :rules="rules"
        label-position="top"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item :label="t('youxiang')" prop="email">
          <el-input
            type="email"
            v-model="model.email"
            :placeholder="t('qingshuruyouxiang')"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">{{
            t('tijiao')
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getEmail } from '@/server/axios';
import { Message } from 'element-ui';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useRoute, useRouter } from 'vue-router/composables';

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const model = ref({
  email: '',
});

const rules = reactive({
  email: [{ required: true, message: t('qingshuruyouxiang'), trigger: 'blur' }],
});

const formRef = ref(null);

const email = route.query.email;

const loading = ref(false);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      getEmail(model.value).then((res) => {
        if (res.code === '200') {
          Message.success(res.msg);

          router.push({
            path: '/bind-email-code',
            query: {
              type: route.query.type === 1 ? 1 : undefined,
              email: model.value.email,
            },
          });
        } else {
          Message.error(res.msg);
        }
      });
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style lang="scss" scoped></style>
