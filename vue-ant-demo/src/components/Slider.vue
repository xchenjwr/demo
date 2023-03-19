<template>
  <div class="slider">
    <a-menu
      mode="inline"
      class="menu"
      :open-keys="openKeys"
      @click="selectItem"
      @openChange="onOpenChange"
    >
      <template v-for="item in routes.children">
        <a-sub-menu v-if="item.children" :key="item.path">
          <span slot="title"
            ><a-icon :type="item.meta.icno" /><span>{{
              item.meta.title
            }}</span></span
          >
          <a-menu-item
            v-for="iitem in item.children"
            :key="item.path + '/' + iitem.path + '|' + iitem.meta.title"
          >
            {{ iitem.meta.title }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item
          v-else-if="
            item.meta.display !== 'none' &&
            (item.meta.auth ? part.indexOf(item.meta.auth) != -1 : true)
          "
          :key="item.path + '|' + item.meta.title"
        >
          <a-icon :type="item.meta.icno" />
          <span>{{ item.meta.title }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { vuexObj } from "../assets/js/mixin";
export default {
  name: "Slider",
  data() {
    return {
      routes: {},
      rootSubmenuKeys: [],
      openKeys: [],
      part: [],
    };
  },
  mixins: [vuexObj],
  methods: {
    selectItem({ key }) {
      this.$emit("selectItem", key);
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(
        (key) => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    init() {
      this.routes = this.$router.options.routes.find((item) => {
        return item.path === this.$route.path;
      });
      this.rootSubmenuKeys = this.routes.children.map((item) => {
        if (item.children) {
          return item.path;
        }
      });
      if (this.userInfo.part == "teacher") {
        if (this.userInfo.IsApprover == 1) {
          this.part.push("approver");
        }
        if (this.userInfo.IsSupervisor == 1) {
          this.part.push("supervisor");
        } else {
          this.part.push("teacher");
        }
        if (this.userInfo.IsAssessor == 1) {
          this.part.push("assessor");
        }
      }
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="less" scoped>
.slider {
  height: 100%;
  .menu {
    height: 100%;
    font-weight: 500;
    background-color: #f5f5f5;
    color: #555555;
    // ::v-deep .ant-menu-submenu-title,
    // .anticon {
    //   font-size: 16px !important;
    // }
    // ::v-deep .ant-menu-item {
    //   font-size: 16px !important;
    // }
  }
}
</style>
