<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :http-request="handleHttpRequest"
    list-type="picture-card"
    :on-success="handleAvatarSuccess"
    :on-remove="handleAvatarRemove"
    :on-progress="handleProgress"
    :disabled="props.disabled"
    accept="image/jpeg, image/png"
  >
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script setup>
import { uploadImage } from '@/server/axios';
import { computed } from 'vue';

const props = defineProps({ value: String, disabled: Boolean });
const emit = defineEmits(['input']);

console.log(props);

const value = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('input', value);
  },
});

const handleHttpRequest = async (e) => {
  let formData = new FormData();
  formData.append('imageFiles', e.file);
  return await uploadImage({
    dir: 'identityImage',
    type: 'imageRetOriginal',
    imageFiles: formData,
    data: {
      onUploadProgress: (progressEvent) => {
        let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0; //百分比
        e.onProgress({ percent: num }); //进度条
      },
    },
  });
};

const handleAvatarSuccess = (e) => {
  value.value = e.data.imageUrlList?.[0];
};

const handleAvatarRemove = () => {
  value.value = '';
};

const handleProgress = (e) => {
  console.log(e);
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}
</style>
