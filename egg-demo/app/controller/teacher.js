"use strict";
const Controller = require("egg").Controller;
const rules = require("../data/rules");

class TeacherController extends Controller {
  // 老师接口
  async courseList() {
    const { ctx } = this;
    const payload = ctx.helper.translateToken();
    const result = await ctx.service.teacher.courseList(payload.account);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async report() {
    const { ctx } = this;
    if (!this.app.config.reportApi) {
      ctx.body = {
        code: 1,
        msg: "申报接口功能已关闭",
      };
      return;
    }
    let json = [];
    const requestData = ctx.state.stream.fields;
    // 保存旧文件
    Object.keys(requestData).forEach((item) => {
      if (item.startsWith("file")) {
        json.push(requestData[item]);
      }
    });
    // 保存新文件
    for (const file of ctx.state.stream.files) {
      const filepath =
        "http://120.77.98.123:7001/public" +
        file.split("public")[1].replace(/\\/g, "/");
      json.push(filepath);
    }
    const payload = ctx.helper.translateToken();
    // 此处不需要参数校验,因为数据库插入会校验,不符合会报错
    let obj = {
      tno: payload.account,
      cno: requestData.cno,
      content: requestData.content,
      filepath: JSON.stringify(json),
      time: new Date().getTime(),
    };
    const result = await ctx.service.teacher.report(obj);
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
        msg: "申报成功,请等待审核",
      };
      return;
    } else {
      ctx.body = {
        code: 1,
        msg: "申报失败",
      };
    }
  }
  async peerCount() {
    const { ctx } = this;
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.peerCount(payload.account);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async peerList() {
    const { ctx } = this;
    const requestData = ctx.request.query;
    const errors = this.app.validator.validate(rules.ListRule, requestData);
    if (errors) {
      ctx.body = {
        code: 1,
        msg: errors,
      };
      return;
    }
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.peerList(
      payload.account,
      requestData.page,
      requestData.num
    );
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async getAssess() {
    const { ctx } = this;
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.getAssess(payload.account);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  // 审核人员接口
  async reportCount() {
    const { ctx } = this;
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.reportCount(payload.account);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async reportList() {
    const { ctx } = this;
    const requestData = ctx.request.query;
    const errors = this.app.validator.validate(rules.ListRule, requestData);
    if (errors) {
      ctx.body = {
        code: 1,
        msg: errors,
      };
      return;
    }
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.reportList(
      payload.account,
      requestData.page,
      requestData.num
    );
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async approve() {
    const { ctx } = this;
    if (!this.app.config.approveApi) {
      ctx.body = {
        code: 1,
        msg: "审核接口功能已关闭",
      };
      return;
    }
    const requestData = ctx.state.stream.fields;
    const result = await ctx.service.teacher.approve(requestData);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else if (result === true) {
      ctx.body = {
        code: 0,
        msg: "操作成功",
      };
      return;
    } else {
      ctx.body = {
        code: 1,
        msg: "操作出错",
      };
    }
  }
  // 评审人员接口
  async assessCount() {
    const { ctx } = this;
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.assessCount(payload.account);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async assessList() {
    const { ctx } = this;
    const requestData = ctx.request.query;
    const errors = this.app.validator.validate(rules.ListRule, requestData);
    if (errors) {
      ctx.body = {
        code: 1,
        msg: errors,
      };
      return;
    }
    const payload = await ctx.helper.translateToken();
    const result = await ctx.service.teacher.assessList(
      payload.account,
      requestData.page,
      requestData.num
    );
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
      return;
    } else {
      ctx.body = {
        code: 0,
        data: result,
      };
    }
  }
  async assess() {
    const { ctx } = this;
    if (!this.app.config.assessApi) {
      ctx.body = {
        code: 1,
        msg: "评审接口功能已关闭",
      };
      return;
    }
    const requestData = ctx.state.stream.fields;
    const payload = ctx.helper.translateToken();
    let obj = {
      ...requestData,
      account: payload.account,
    };
    const result = await ctx.service.teacher.assess(obj);
    if (result) {
      ctx.body = {
        code: 0,
        msg: "评审成功",
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "评审失败",
      };
    }
  }
}

module.exports = TeacherController;
1;
