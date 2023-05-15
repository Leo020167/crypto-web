<template>
  <div>
    <div class="container bg-white mt-10 p-4">
      <div class="text-orange-400 mb-5">
        驗證碼已發送至，{{ route.query.email }}
      </div>

      <el-form
        :model="model"
        :rules="rules"
        label-position="top"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item prop="code">
          <el-input
            v-model="model.code"
            :placeholder="t('qingshuruyouxiangyanzhengma')"
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
import { updateEmail } from '@/server/axios';
import { useUserStore } from '@/stores/user';
import { Message } from 'element-ui';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n-composable';
import { useRoute, useRouter } from 'vue-router/composables';

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const model = ref({
  code: '',
});

const { getUser } = useUserStore();

const rules = reactive({
  code: [
    {
      required: true,
      message: t('qingshuruyouxiangyanzhengma'),
      trigger: 'blur',
    },
  ],
});

const formRef = ref(null);

const loading = ref(false);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      updateEmail({ ...model.value, email: route.query.email }).then((res) => {
        if (res.code === '200') {
          getUser();

          Message.success(res.msg);

          router.replace({
            path: '/trading',
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
