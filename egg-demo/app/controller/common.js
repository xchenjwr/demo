"use strict";

const rules = require("../data/rules");

const Controller = require("egg").Controller;
class CommonController extends Controller {
  async getCode() {
    const { ctx } = this;
    const captcha = ctx.helper.captcha();
    ctx.response.body = captcha;
  }
  async login() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    const errors = this.app.validator.validate(rules.loginRule, requestData);
    if (errors) {
      ctx.body = {
        code: 1,
        msg: errors,
      };
      return;
    }
    let result = await ctx.service.common.checkpassword(requestData);
    if (!result) {
      ctx.body = {
        code: 1,
        msg: "账号或密码错误",
      };
      return;
    }
    result = { part: requestData.part, ...result };
    const token = ctx.helper.token(result);
    ctx.body = { code: 0, msg: "登录成功", token, data: result };
  }
  async updatePassword() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    let payload = ctx.helper.translateToken();
    const obj = {
      part: payload.part,
      account: payload.account,
      password: requestData.password,
      newPassword: requestData.newPassword,
    };
    const result = await ctx.service.common.updatePassword(obj);
    switch (result) {
      case -1:
        ctx.body = {
          code: -1,
          msg: "原密码错误",
        };
        return;
      case 0:
        ctx.body = {
          code: 1,
          msg: "更新失败",
        };
        return;
      case 1:
        ctx.body = {
          code: 0,
          msg: "更新成功",
        };
        return;
    }
  }
  async getApiStatus() {
    const { ctx, app } = this;
    ctx.body = {
      reportApi: app.config.reportApi,
      approveApi: app.config.approveApi,
      teacherEvaluationsApi: app.config.teacherEvaluationsApi,
      assessApi: app.config.assessApi,
    };
  }
  async putScore() {
    const { ctx } = this;
    if (!this.app.config.teacherEvaluationsApi) {
      ctx.body = {
        code: 1,
        msg: "评教接口功能已关闭",
      };
      return;
    }
    const requestData = ctx.state.stream.fields;
    const payload = ctx.helper.translateToken();
    let obj = { account: payload.account };
    if (payload.part === "teacher" && payload.IsSupervisor === 1) {
      obj.part = "supervisor";
    } else {
      obj.part = payload.part;
    }
    if (requestData.score > 100) {
      ctx.body = {
        code: 1,
        msg: "分数异常",
      };
      return;
    }
    let imgpath = [];
    Object.keys(requestData).forEach((item) => {
      if (item.startsWith("file")) {
        imgpath.push(requestData[item]);
      }
    });
    for (const file of ctx.state.stream.files) {
      const url =
        "http://120.77.98.123:7001/public" +
        file.split("public")[1].replace(/\\/g, "/");
      imgpath.push(url);
    }
    obj.imgpath = JSON.stringify(imgpath);
    obj = {
      ...obj,
      tnoed: requestData.tnoed,
      details: requestData.details,
      content: requestData.content,
      score: requestData.score,
    };
    const result = await ctx.service.common.putScore(obj);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else if (result === true) {
      ctx.state.isClsUpload = false;
      if (requestData.removefile) {
        const files = JSON.parse(requestData.removefile);
        ctx.helper.delFile(files);
      }
      ctx.body = {
        code: 0,
        msg: "评分成功",
      };
    }
  }
  async getReport() {
    const { ctx } = this;
    const tno = ctx.request.query.tno;
    const result = await ctx.service.common.getReport(tno);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async scoreCount() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    if (requestData.part) {
      requestData.part = JSON.parse(requestData.part);
    }
    const result = await ctx.service.common.scoreCount(requestData);
    if (result) {
      ctx.body = {
        code: 0,
        data: result,
      };
    } else {
      ctx.body = {
        code: 1,
      };
    }
  }
  async getScore() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    const { num, page, ...json } = requestData;
    if (json.part) {
      json.part = JSON.parse(json.part);
    }
    const result = await ctx.service.common.getScore(json, num, page);
    if (result) {
      ctx.body = {
        code: 0,
        data: result,
      };
    } else {
      ctx.body = {
        code: 1,
      };
    }
  }
  async getStandard() {
    const { ctx, app } = this;
    ctx.body = {
      standard: app.config.standard,
    };
  }
}

module.exports = CommonController;
