<template>
  <div>
    <el-form
      :model="model"
      :rules="rules"
      label-position="top"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item :label="t('zhengjianleixing')" prop="certType">
        <el-select
          v-model="model.certType"
          :placeholder="t('qingxuanzezhengjianleixing')"
          :disabled="isValid"
        >
          <el-option
            v-for="item in options"
            :label="item.name"
            :value="item.code"
            :key="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('xingming')" prop="name">
        <el-input
          v-model="model.name"
          :placeholder="t('qingshuruxingming')"
          :disabled="isValid"
        ></el-input>
      </el-form-item>

      <el-form-item :label="t('zhengjianhaoma')" prop="certNo">
        <el-input
          v-model="model.certNo"
          :placeholder="t('qingshuruzhengjianhaoma')"
          :disabled="isValid"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="isValid"
          :loading="loading"
          >{{ t('tijiao') }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { identityConfig, identitySubmit } from '@/server/axios';
import { useCertificationStore } from '@/stores/certification';
import { Message } from 'element-ui';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n-composable';

const { t } = useI18n();

const model = ref({
  certType: '',
  name: '',
  certNo: '',
});

const rules = reactive({
  certType: [
    {
      required: true,
      message: t('qingxuanzezhengjianleixing'),
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: t('qingshuruxingming'), trigger: 'blur' }],
  certNo: [
    { required: true, message: t('qingshuruzhengjianhaoma'), trigger: 'blur' },
  ],
});

const formRef = ref(null);

const options = ref([]);
onMounted(async () => {
  const res = await identityConfig();
  if (res.code === '200') {
    options.value = res.data;
  }
});

const { primaryCertification, getPrimaryCertification } =
  useCertificationStore();

watchEffect(() => {
  if (primaryCertification) {
    model.value = primaryCertification;
  }
});

const isValid = computed(() =>
  ['0', '1'].includes(primaryCertification?.state ?? '')
);

const loading = ref(false);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      identitySubmit(model.value).then(async (res) => {
        console.log(res);
        if (res.code === '200') {
          await getPrimaryCertification();
          loading.value = false;
          Message.success(res.msg);
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
