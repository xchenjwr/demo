module.exports = (options) => {
  return async function adminAuth(ctx, next) {
    const payload = ctx.helper.translateToken();
    if (payload && payload.part === "admin") {
      await next();
    } else {
      ctx.body = {
        code: 1,
        msg: "需要管理员权限",
      };
      return;
    }
  };
};
