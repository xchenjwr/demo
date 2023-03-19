"use strict";
const Controller = require("egg").Controller;

class StudentController extends Controller {
  async teacherList() {
    const { ctx } = this;
    const payload = ctx.helper.translateToken();
    const result = await ctx.service.student.teacherList(payload.account);
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
}
module.exports = StudentController;
