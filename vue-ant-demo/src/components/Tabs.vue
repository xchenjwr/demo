<template>
  <div class="card-container">
    <a-tabs
      v-model="active"
      hide-add
      type="editable-card"
      @edit="onEdit"
      @change="onChange"
      class="tabs"
    >
      <a-tab-pane v-for="(pane, index) in panes" :key="index" :tab="pane.title">
        <transition mode="out-in">
          <keep-alive>
            <router-view :key="$route.path" />
          </keep-alive>
        </transition>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { vuexObj } from "../assets/js/mixin";
export default {
  name: "Tabs",
  mixins: [vuexObj],
  computed: {
    active: {
      get() {
        return this.activeKey;
      },
      set(val) {
        this.setActiveKey(val);
      },
    },
  },
  watch: {
    activeKey: {
      handler: function () {
        this.$router.push(this.panes[this.activeKey].path);
      },
      immediate: true,
    },
    panes: {
      handler: function () {
        this.$router.push(this.panes[this.activeKey].path);
      },
      immediate: true,
    },
  },
  methods: {
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    onChange(activeKey) {
      this.setActiveKey(activeKey);
    },
    remove(targetKey) {
      let activeKey =
        this.activeKey > targetKey ? this.activeKey - 1 : this.activeKey;
      let panes = [...this.panes];
      panes.splice(targetKey, 1);
      if (
        panes.length &&
        this.activeKey === targetKey &&
        targetKey === this.panes.length - 1
      ) {
        activeKey = panes.length - 1;
      }
      this.setActiveKey(activeKey);
      this.setPanes(panes);
    },
  },
};
</script>

<style lang="less" scoped>
.card-container {
  height: 100%;
  padding: 5px;
  background: #f5f5f5;
  .tabs {
    overflow: auto;
  }
}
.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
.v-enter {
  transform: translateX(100%);
}
.v-enter-active {
  transition: all 0.3s ease;
}
</style>
