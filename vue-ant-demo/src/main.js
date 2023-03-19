import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
Vue.use(Antd);

import Utils from "./assets/js/utils";
Vue.use(Utils);

Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
