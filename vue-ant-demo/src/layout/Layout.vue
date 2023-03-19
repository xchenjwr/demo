<template>
  <div class="layout">
    <a-layout class="section">
      <a-layout-header class="header">
        <h2>教师教学质量奖在线申报与评审系统</h2>
        <span>{{ getPart }}端</span>
        <a-button type="link" ghost icon="export" @click="_logout">
          退出登录
        </a-button>
        <span
          v-if="userInfo.part != 'admin'"
          @click="onSelectItem('personInfo/userProfile|查看个人信息')"
        >
          <a-icon type="user" />
          {{ userInfo.name }}
        </span>
      </a-layout-header>
      <a-layout>
        <a-layout-sider>
          <slider @selectItem="onSelectItem" />
        </a-layout-sider>
        <a-layout-content>
          <tabs v-if="panes.length > 0" />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import Slider from "../components/Slider.vue";
import Tabs from "../components/Tabs.vue";
import { operaPane } from "../assets/js/mixin";
export default {
  name: "Layout",
  components: {
    Slider,
    Tabs,
  },
  mixins: [operaPane],
  methods: {
    onSelectItem(key) {
      const item = key.split("|");
      const pane = {
        path: this.$route.matched[0].path + "/" + item[0],
        title: item[1],
      };
      this.addPane(pane);
    },
    _logout() {
      this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  .section {
    height: 100%;
    .header {
      background-color: #25303f;
      height: 50px;
      padding: 0;

      h2,
      span {
        float: left;
        line-height: 50px;
        color: #acb0b5 !important;
      }
      h2 {
        margin-left: 24px;
      }
      span:nth-of-type(1) {
        margin-left: 10px;
        font-size: 18px;
      }

      button {
        float: right;
        margin-right: 10px;
        line-height: 50px;
        font-size: 18px;
        color: #acb0b5 !important;
      }
      span:nth-of-type(2) {
        cursor: pointer;
        float: right;
        margin-right: 10px;
        font-size: 16px;
      }
    }
  }
}
</style>
