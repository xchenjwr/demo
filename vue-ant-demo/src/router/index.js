import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

// 1.安装插件
Vue.use(VueRouter);

// 避免重复路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  if (
    to.path != "/" &&
    to.path != "/login" &&
    to.path.split("/")[1] != router.app.$store.state.userInfo.part
  ) {
    router.app.$message.error("进入该路由需要登录");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  } else {
    next();
  }
});

export default router;
