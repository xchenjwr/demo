module.exports = (options) => {
  return async function assessorAuth(ctx, next) {
    const payload = ctx.helper.translateToken();
    if (payload && payload.IsAssessor == 1) {
      await next();
    } else {
      ctx.body = {
        code: 1,
        msg: "需要评审员权限",
      };
      return;
    }
  };
};
