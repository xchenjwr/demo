const { matchRoute } = require("../data/streamConfig");
module.exports = (options) => {
  return async function global(ctx, next) {
    if (ctx.request.method == "POST") {
      ctx.state.allowType = matchRoute(ctx.url);
      const result = await ctx.helper.initStream();
      if (!result) {
        ctx.body = {
          code: 1,
          msg: "错误的文件类型",
        };
        return;
      }
      ctx.state.isClsUpload = true;
    }
    ctx.app.on("error", (err, ctx) => {
      ctx.helper.clsUpload();
    });
    await next();
    if (ctx.state.isClsUpload) {
      ctx.helper.clsUpload();
    }
  };
};
