module.exports = (options) => {
  return async function studentAuth(ctx, next) {
    const payload = ctx.helper.translateToken();
    if (payload && payload.part === "student") {
      await next();
    } else {
      ctx.body = {
        code: 1,
        msg: "需要学生权限",
      };
      return;
    }
  };
};
