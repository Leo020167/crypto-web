<template>
  <FadeComponent>
    <div class="user-home" v-document-title :data-title="documentTitle">
      <div class="img">
        <img src="../../assets/logo.png" class="avartar" />
      </div>
      <p class="name">{{ currentUserInfos.user.userName }}</p>
      <p class="id">
        {{ $t('changeUserData.id') }}: {{ currentUserInfos.user.userId }}
      </p>
      <div class="sex">
        <p class="left">{{ $t('changeUserData.sex') }}</p>
        <p class="right">
          {{
            currentUserInfos.user.sex == 0
              ? $t('changeUserData.man')
              : $t('changeUserData.woman')
          }}
        </p>
      </div>
      <div class="date">
        <p class="left">{{ $t('changeUserData.birth') }}</p>
        <p class="right">
          {{
            currentUserInfos.user.birthday
              ? currentUserInfos.user.birthday
              : $t('changeUserData.birth_tip')
          }}
        </p>
      </div>
      <div class="btn">
        <el-button type="primary" class="change-btn" @click="changeMyData">{{
          $t('changeUserData.modify')
        }}</el-button>
      </div>
    </div>
    <change-user-dialog
      @changeData="changeData"
      :show-dialog="showChangeDialog"
      :headUrl="headUrlFile"
      :userData="currentUserInfos.user"
      @closeDialog="closeChangeDialog"
    ></change-user-dialog>
  </FadeComponent>
</template>

<script>
import { mapGetters } from 'vuex';
import ChangeUserDialog from './compotents/changeUserDialog.vue';
export default {
  data() {
    return {
      showChangeDialog: false,
      headUrlFile: {},
    };
  },
  computed: {
    ...mapGetters({
      currentUserInfos: 'getCurrentUserInfos',
    }),
    documentTitle() {
      return this.getTitleValueByLang(
        '编辑个人资料',
        '編輯個人資料',
        'Edit profile'
      );
    },
  },
  methods: {
    changeMyData() {
      this.headUrlFile = { fileUrl: this.currentUserInfos.user.headUrl };
      this.showChangeDialog = true;
    },
    closeChangeDialog() {
      this.showChangeDialog = false;
    },
    changeData(data) {
      let org = this.currentUserInfos;
      org.user.birthday = data.birthday;
      org.user.sex = data.sex;
      org.user.headUrl = data.headUrl;
      org.user.userName = data.userName;
      this.headUrlFile = { fileUrl: data.headUrl };
      this.$store.dispatch('changeCurrentUerInfos', org); // vuex备存
      this.showChangeDialog = false;
      this.$message.success(this.$t('changeUserData.tip'));
    },
  },
  components: {
    ChangeUserDialog,
  },
};
</script>

<style lang="scss" scoped>
.user-home {
  width: 94%;
  margin: 20px auto;
  background-color: white;
  min-height: 450px;
  padding: 30px;
  color: $globalTextColor;
  .img {
    text-align: center;
    height: 140px;
    .avartar {
      height: 140px;
      width: 140px;
      border-radius: 70px;
      background-color: $color_info;
    }
    .el-icon-edit {
      margin-left: -20px;
      cursor: pointer;
    }
  }
  .name {
    margin-top: 30px;
    font-size: 22px;
    text-align: center;
    cursor: pointer;
  }
  .id {
    margin-top: 20px;
    font-size: 15px;
    text-align: center;
  }
  .sex,
  .date,
  .des {
    margin-top: 50px;
    display: flex;
    .left {
      flex: 1;
      text-align: right;
      padding-right: 120px;
    }
    .right {
      flex: 1;
      text-align: left;
      padding-left: 70px;
    }
  }
  .btn {
    text-align: center;
    margin-top: 40px;
    .change-btn {
      width: 35%;
    }
  }
}
</style>
