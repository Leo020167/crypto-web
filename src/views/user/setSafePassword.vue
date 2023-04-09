<template>
  <div class="container py-3 lg:py-8">
    <div class="lg:bg-card lg:rounded-lg lg:px-6 lg:py-12">
      <div class="lg:mx-auto lg:w-[30rem]">
        <el-form
          class="mt-4"
          :model="model"
          :rules="rules"
          ref="formRef"
          label-width="100px"
        >
          <el-form-item prop="oldPayPass" v-if="userInfo.user.payPass">
            <el-input
              v-model="model.oldPayPass"
              type="password"
              placeholder="请输入原密码"
            />
          </el-form-item>
          <el-form-item prop="payPass">
            <el-input
              v-model="model.payPass"
              type="password"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item prop="configPayPass">
            <el-input
              v-model="model.configPayPass"
              type="password"
              placeholder="确认新密码"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="w-full"
              @click="submit"
              :loading="loading"
            >
              提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue';
import { setPayPass } from '@/server/axios';
import { Message } from 'element-ui';
import { useRouter } from 'vue-router/composables';

const model = reactive({
  payPass: '',
});

const formRef = ref(null);

const loading = ref(false);

const store = inject('vuex-store'); // TODO

const userInfo = computed(() => store.getters.getCurrentUserInfos);

const rules = reactive({
  oldPayPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  payPass: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback('请输入新密码');
        }

        if (value.length !== 6) {
          return callback('请输入6位数密码');
        }

        return callback();
      },
      trigger: 'blur',
    },
  ],
  configPayPass: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback('请输入确认密码');
        }

        if (value !== model.payPass) {
          return callback('两次密码输入不一致!');
        }

        return callback();
      },
      trigger: 'blur',
    },
  ],
});

const router = useRouter();

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const res = await setPayPass({
          ...model,
        });
        if (res.code === '200') {
          Message.success(res.msg);
          router.replace('/trading');
        } else {
          Message.error(res.msg);
        }
        console.log(res);
      } catch (error) {
        //
        console.log(error);
      } finally {
        loading.value = false;
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
};
</script>

<style lang="scss" scoped></style>
