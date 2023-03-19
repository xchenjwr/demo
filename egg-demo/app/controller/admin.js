"use strict";
const Controller = require("egg").Controller;
const rules = require("../data/rules");

class AdminController extends Controller {
  async import() {
    const { ctx } = this;
    const db = ctx.url.split("/")[3];
    const json = ctx.helper.xlsxToJson();
    const result = await ctx.service.teacher.import(db, json);
    if (!(result instanceof Error)) {
      ctx.body = {
        code: 0,
        msg: "导入" + db + "成功",
      };
    } else {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    }
  }
  async grant() {
    const { ctx } = this;
    const attr = "Is" + ctx.url.split("/")[3];
    const json = ctx.helper.xlsxToJson();
    const result = await ctx.service.teacher.grant(attr, json);
    if (!(result instanceof Error)) {
      ctx.body = {
        code: 0,
        msg: "导入" + attr.slice(2) + "成功",
      };
    } else {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    }
  }
  async apiManage() {
    const { ctx } = this;
    let requestData = ctx.state.stream.fields;
    requestData.value = JSON.parse(requestData.value);
    const errors = this.app.validator.validate(
      rules.apiManageRule,
      requestData
    );
    if (errors) {
      ctx.body = {
        code: 1,
        msg: errors,
      };
      return;
    }
    this.app.config[requestData.key] = requestData.value;
    let msg = "";
    switch (requestData.key) {
      case "reportApi":
        msg = "申报接口功能";
        break;
      case "approveApi":
        msg = "审核接口功能";
        break;
      case "teacherEvaluationsApi":
        msg = "评教接口功能";
        break;
      default:
        msg = "评审接口功能";
        break;
    }
    msg += requestData.value ? "打开" : "关闭";
    ctx.body = {
      code: 0,
      msg,
    };
  }
  async getFaculty() {
    const { ctx } = this;
    const result = await ctx.service.teacher.getFaculty();
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
  async getResult() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    const result = await ctx.service.teacher.getResult(requestData.faculty);
    requestData.data = JSON.parse(requestData.data);
    let j = 0;
    for (let i = 0; i < requestData.data.length; i++) {
      let prize = i == 0 ? "一等奖" : i == 1 ? "二等奖" : "三等奖";
      let count = parseInt(
        j + result.length * Number(requestData.data[i].replace("%", "") / 100)
      );
      for (; j < count; j++) {
        result[j].prize = prize;
      }
    }
    const json = result.map((item) => ({
      工号: item.tno,
      姓名: item.tname,
      学院: item.faculty,
      专业: item.major,
      分数: item.score.toFixed(2),
      奖项: item.prize,
    }));
    const filepath =
      new Date().getTime() + Math.random().toFixed(6).substring(2);
    const fileName = "教师教学质量奖获奖名单(" + requestData.faculty + ").xlsx";
    ctx.helper.jsonToXlsx(json, filepath, fileName);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        data: {
          url: "http://120.77.98.123:7001/public/" + filepath + "/" + fileName,
        },
      };
    }
  }
  async resetPassword() {
    const { ctx } = this;
    const json = ctx.helper.xlsxToJson();
    const result = await ctx.service.common.resetPassword(json);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        msg: "批量更新密码成功",
      };
    }
  }
  async dataAnalysis() {
    const { ctx } = this;
    const faculty = ctx.query.faculty;
    const result = await ctx.service.common.dataAnalysis(faculty);
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
  async processDoc() {
    const { ctx } = this;
    const requestData = ctx.query;
    const result = await ctx.service.teacher.processDoc(
      requestData.faculty,
      requestData.db
    );
    const json = result.map((item) => ({
      工号: item.account,
      姓名: item.name,
      学院: item.faculty,
      专业: item.major,
    }));
    let time = new Date();
    const fileName =
      requestData.db === "approved"
        ? "已审核通过"
        : "已申报" +
          "教师教学质量奖的教师名单(" +
          requestData.faculty +
          ")" +
          "-" +
          time.getFullYear() +
          "-" +
          (time.getMonth() + 1) +
          "-" +
          time.getDate() +
          ".xlsx";
    ctx.helper.jsonToXlsx(json, fileName);
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        data: {
          url: "http://120.77.98.123:7001/public/" + fileName,
        },
      };
    }
  }
  async export() {
    const { ctx } = this;
    const requestData = ctx.state.stream.fields;
    const result = await ctx.service.teacher.export(requestData);
    let url = [];
    for (let i in result) {
      const fileName = i + ".xlsx";
      url.push(fileName);
      const json = result[i];
      ctx.helper.jsonToXlsx(json, fileName);
    }
    url = url.map((item) => {
      return "http://120.77.98.123:7001/public/" + item;
    });
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        data: {
          url: [...url],
        },
      };
    }
  }
  async standardManage() {
    const { ctx } = this;
    let requestData = ctx.state.stream.fields;
    let part = requestData.part;
    let type = requestData.type;
    let standard = JSON.parse(requestData.standard);
    this.app.config.standard[part][type] = standard;
    ctx.body = {
      code: 0,
      msg: "修改成功",
    };
  }
  async reload() {
    const { ctx } = this;
    const result = await ctx.service.common.reload();
    if (result instanceof Error) {
      ctx.body = {
        code: 1,
        msg: result.sqlMessage,
      };
    } else {
      ctx.body = {
        code: 0,
        msg: "重置成功",
      };
    }
  }
}

module.exports = AdminController;
