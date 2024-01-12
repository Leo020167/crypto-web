<template>
  <div class="change-user">
    <el-dialog
      :title="$t('changeUserData.dialog.title')"
      :visible.sync="ifShowDialog"
      @close="closeDialog"
    >
<!--      <p class="mini-title">{{ $t('changeUserData.dialog.headCount') }}</p>-->
<!--      <div class="box">-->
<!--        <single-file-upload-->
<!--          @onAddFile="getAvtarFile"-->
<!--          :oldFile="headUrl"-->
<!--          :canDelete="false"-->
<!--          :fileName="'上传我的头像'"-->
<!--        ></single-file-upload>-->
<!--      </div>-->
      <div class="tab">
        <span class="left">{{ $t('changeUserData.dialog.name') }}</span>
        <el-input
          v-model="name"
          class="right"
          :placeholder="$t('changeUserData.dialog.ph')"
          size="mini"
        ></el-input>
      </div>
      <div class="tab">
        <span class="left">{{ $t('changeUserData.dialog.sex') }}</span>
        <el-radio-group v-model="sex" class="right ts">
          <el-radio :label="0">{{ $t('changeUserData.man') }}</el-radio>
          <el-radio :label="1">{{ $t('changeUserData.woman') }}</el-radio>
        </el-radio-group>
      </div>
      <div class="tab">
        <span class="left">{{ $t('changeUserData.dialog.birth') }}</span>
        <el-date-picker
          v-model="birthday"
          type="date"
          class="right"
          size="mini"
          format="yyyy - MM - dd"
          value-format="yyyy-MM-dd"
          :placeholder="$t('changeUserData.dialog.chooseDate')"
        ></el-date-picker>
      </div>
      <div class="btn">
        <el-button type="primary" class="change-btn" @click="changeData">{{
          $t('changeUserData.dialog.modify')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SingleFileUpload from '@/components/UploadFile/SingleFileUpload.vue';
import { security, uploadImage } from '@/server/axios.js';
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    userData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    headUrl: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {
    ifShowDialog: {
      get() {
        return this.showDialog;
      },
      set() {
        return this.showDialog;
      },
    },
  },
  data() {
    return {
      name: this.userData.userName,
      sex: Number(this.userData.sex),
      birthday: this.userData.birthday ? this.userData.birthday : '',
      avatarFile: {},
      newAvatar: false,
      headerUrl: '',
    };
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    getAvtarFile(file) {
      this.avatarFile = file;
      this.newAvatar = true;
    },
    // 上传之前，图片先上传
    changeData() {
      if (this.newAvatar) {
        let fil = new FormData();
        fil.append('imageFiles', this.avatarFile);
        uploadImage({
          dir: 'userImage',
          type: 'imageRetOriginal',
          imageFiles: fil,
        }).then((res) => {
          if (res.code === '200') {
            this.headerUrl = res.data.imageUrlList[0];
            this.enterChange();
          }
        });
      } else {
        this.enterChange();
      }
    },
    enterChange() {
      let url = this.newAvatar ? this.headerUrl : this.headUrl.fileUrl;
      // userName, sex, birthday, describes, headUrl
      security
        .updateUserInfo(this.name, this.sex, this.birthday, '', url)
        .then((res) => {
          if (res.code === '200') {
            let data = res.data;
            this.$emit('changeData', data);
          }
        });
    },
  },
  components: {
    SingleFileUpload,
  },
};
</script>

<style lang="scss" scoped>
.change-user {
  .box {
    text-align: center;
  }
  .tab {
    margin-top: 20px;
    display: flex;
    line-height: 25px;
    .left {
      width: 100px;
    }
    .right {
      width: 300px;
      &.ts {
        margin-top: 3px;
      }
    }
  }
  .btn {
    text-align: center;
    .change-btn {
      width: 200px;
      margin-top: 25px;
    }
  }
}
</style>
