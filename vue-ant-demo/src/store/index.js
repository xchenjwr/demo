import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = {
  state: {
    userInfo: {},
    panes: [],
    activeKey: 0,
    apiStatus: {},
  },
  getters: {
    getPart: (state) => {
      switch (state.userInfo.part) {
        case "student":
          return "学生";
        case "teacher":
          return "教师";
        case "admin":
          return "管理";
      }
    },
  },
  mutations: {
    login(state, payload) {
      state.userInfo = { ...payload };
    },
    setApiStatus(state, payload) {
      state.apiStatus = { ...payload };
    },
    logout(state) {
      state.userInfo = {};
      state.panes = [];
      sessionStorage.removeItem("token");
    },
    setPane(state, payload) {
      state.panes[payload.index] = payload.data;
    },
    pushPane(state, payload) {
      state.panes.push(payload);
    },
    setPanes(state, payload) {
      state.panes = [...payload];
    },
    setActiveKey(state, payload) {
      state.activeKey = payload;
    },
  },
};

export default new Vuex.Store(store);
