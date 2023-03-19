module.exports = (options) => {
  return async function teacherAuth(ctx, next) {
    const payload = ctx.helper.translateToken();
    if (payload && payload.part === "teacher") {
      await next();
    } else {
      ctx.body = {
        code: 1,
        msg: "需要教师权限",
      };
      return;
    }
  };
};
