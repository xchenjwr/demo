module.exports = (options) => {
  return async function approverAuth(ctx, next) {
    const payload = ctx.helper.translateToken();
    if (payload && payload.IsApprover == 1) {
      await next();
    } else {
      ctx.body = {
        code: 1,
        msg: "需要审核员权限",
      };
      return;
    }
  };
};
