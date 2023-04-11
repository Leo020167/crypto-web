<template>
  <div>
    <el-form
      :model="model"
      :rules="rules"
      label-position="top"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item :label="$t('zhengjianleixing')" prop="certType">
        <el-select
          v-model="model.certType"
          :placeholder="$t('qingxuanzezhengjianleixing')"
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

      <el-form-item :label="$t('xingming')" prop="name">
        <el-input
          v-model="model.name"
          :placeholder="$t('qingshuruxingming')"
          :disabled="isValid"
        ></el-input>
      </el-form-item>

      <el-form-item :label="$t('zhengjianzhengmianzhao')" prop="frontImgUrl">
        <ImageUpload v-model="model.frontImgUrl" :disabled="isValid" />
      </el-form-item>

      <el-form-item :label="$t('zhengjianfanmianzhao')" prop="backImgUrl">
        <ImageUpload v-model="model.backImgUrl" :disabled="isValid" />
      </el-form-item>
      <el-form-item :label="$t('zhengjianshouchizhaopian')" prop="holdImgUrl">
        <ImageUpload v-model="model.holdImgUrl" :disabled="isValid" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="isValid"
          :loading="loading"
          >{{ $t('tijiao') }}</el-button
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
import ImageUpload from './ImageUpload.vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n-composable';

const { t } = useI18n();

const model = ref({
  certType: '',
  name: '',
  certNo: '',
  frontImgUrl: '',
  backImgUrl: '',
  holdImgUrl: '',
});

const rules = reactive({
  certType: [
    {
      required: true,
      message: t('qingxuanzezhengjianleixing'),
      trigger: 'blur',
    },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  certNo: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
  frontImgUrl: [
    { required: true, message: '请上传证件正面照片', trigger: 'blur' },
  ],
  backImgUrl: [
    { required: true, message: '请上传证件反面照片', trigger: 'blur' },
  ],
  holdImgUrl: [
    { required: true, message: '请上传证件手持照片', trigger: 'blur' },
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

const store = useCertificationStore();

const { advancedCertification } = storeToRefs(store);
const { getAdvancedCertification } = store;

watchEffect(() => {
  if (advancedCertification.value) {
    model.value = advancedCertification.value;
  }
});

const isValid = computed(() =>
  ['0', '1'].includes(advancedCertification.value?.state ?? '')
);

const loading = ref(false);
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      identitySubmit({ type: '2', ...model.value }).then(async (res) => {
        if (res.code === '200') {
          await getAdvancedCertification();
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
