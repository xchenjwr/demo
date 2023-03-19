"use strict";

const Service = require("egg").Service;

class CommonService extends Service {
  async checkpassword(data) {
    let db = data.part + "s";
    let { part, ...obj } = data;
    const result = await this.app.mysql.get(db, obj);
    let dataString = JSON.stringify(result);
    let _data = JSON.parse(dataString);
    if (result) {
      let { id, password, ...res } = _data;
      return res;
    }
    return false;
  }
  async updatePassword(data) {
    const { app } = this;
    let result;
    const { newPassword, ..._data } = data;
    result = await this.checkpassword(_data);
    if (!result) {
      return -1;
    }
    let db = data.part + "s";
    result = await app.mysql.update(
      db,
      { password: data.newPassword },
      { where: { account: data.account } }
    );
    return result.affectedRows === 1 ? 1 : 0;
  }
  async putScore(data) {
    let result;
    let sql =
      "REPLACE INTO scores(part,account,tnoed,details,content,imgpath,score) VALUES ('" +
      data.part +
      "','" +
      data.account +
      "','" +
      data.tnoed +
      "','" +
      data.details +
      "','" +
      data.content +
      "','" +
      data.imgpath +
      "'," +
      data.score +
      ")";
    // 此处异常捕捉是因为前面没有进行参数校验
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return true;
  }
  async getReport(tno) {
    let sql =
      "select * from (select report.*,courses.name as cname from courses inner join (select cno,content,filepath,approved,approveContent from reports where tno='" +
      tno +
      "') as report on courses.no=report.cno) as reportInfo,(select name as tname,faculty,major from teachers where account='" +
      tno +
      "') as teacherInfo,(select avg(score) as score,count(*)as count from scores where tnoed='" +
      tno +
      "') as avg;";
    let result;
    let data;
    try {
      data = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    if (data.length == 0) {
      return;
    }
    result = data[0];
    if (data[0].approved == 0) {
      return result;
    }
    data = null;
    sql =
      "select part,avg(score) as score,count(*)as count FROM scores where tnoed='" +
      tno +
      "' group by part;";
    try {
      data = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    result.mark = data;
    return result;
  }
  async scoreCount(data) {
    const result = await this.app.mysql.select("scores", {
      where: data,
    });
    return result.length;
  }
  async getScore(data, num = 5, page = 1) {
    let result = await this.app.mysql.select("scores", {
      where: data,
      limit: num,
      offset: (page - 1) * num,
    });
    for (let i = 0; i < result.length; i++) {
      let _result = await this.app.mysql.get(
        result[i].part === "student" ? "students" : "teachers",
        {
          account: result[i].account,
        }
      );
      result[i].name = _result.name;
    }
    return result;
  }
  // 管理员功能
  async resetPassword(json) {
    let sql = " set password = case account ";
    let str1 = "";
    let str2 = "";
    for (let i = 0; i < json.length; i++) {
      str1 += "when '" + json[i].account + "' then '123456'";
      str2 += "'" + json[i].account + "',";
    }
    str2 = str2.slice(0, str2.length - 1);
    sql += str1 + "end where account in (" + str2 + ")";
    let _sql = "update students" + sql;
    try {
      await this.app.mysql.query(_sql);
    } catch (err) {
      return err;
    }
    _sql = "update teachers" + sql;
    try {
      await this.app.mysql.query(_sql);
    } catch (err) {
      return err;
    }
    return true;
  }
  async dataAnalysis(faculty) {
    // 授课教师
    let sql =
      "select count(DISTINCT tno)as count from teachers inner join classes on teachers.account=classes.tno where teachers.faculty='" +
      faculty +
      "';";
    let teacher_hasclass;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_hasclass = result[0].count;
    } catch (err) {
      return err;
    }
    // 申报教师
    sql =
      "select count(*)as count from reports inner join teachers on teachers.account=reports.tno and teachers.faculty='" +
      faculty +
      "'";
    let teacher_reported;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_reported = result[0].count;
    } catch (err) {
      return err;
    }
    const report_rate = teacher_reported / teacher_hasclass;
    // 审核通过教师
    sql =
      "select count(*)as count from reports inner join teachers on teachers.account=reports.tno and teachers.faculty='" +
      faculty +
      "' and reports.approved=1;";
    let teacher_approved;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_approved = result[0].count;
    } catch (err) {
      return err;
    }
    const approve_rate = teacher_approved / teacher_reported;
    // 评审通过教师
    sql =
      "select count(*)as count from (select tnoed,avg(`option`)as avgoption from reviews group by tnoed)as reviews2 inner join teachers on teachers.account=reviews2.tnoed and teachers.faculty='" +
      faculty +
      "' and reviews2.avgoption>0.6;";
    let teacher_reviewed;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_reviewed = result[0].count;
    } catch (err) {
      return err;
    }
    const review_rate = teacher_reviewed / teacher_approved;
    // 学生人数
    sql =
      "select count(*)as count from students where faculty='" + faculty + "';";
    let student_number;
    try {
      const result = await this.app.mysql.query(sql);
      student_number = result[0].count;
    } catch (err) {
      return err;
    }
    // 学生评教人数
    sql =
      "select count(DISTINCT scores.account)as count from scores inner join students on students.account=scores.account and students.faculty='" +
      faculty +
      "' and scores.part='student';";
    let student_marked;
    try {
      const result = await this.app.mysql.query(sql);
      student_marked = result[0].count;
    } catch (err) {
      return err;
    }
    const student_mark_rate = student_marked / student_number;
    // 教师总人数
    sql =
      "select count(*)as count from teachers where faculty='" +
      faculty +
      "' and IsSupervisor=0;";
    let teacher_number;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_number = result[0].count;
    } catch (err) {
      return err;
    }
    // 教师评教人数
    sql =
      "select count(DISTINCT scores.account)as count from scores inner join teachers on teachers.account=scores.account and teachers.faculty='" +
      faculty +
      "' and scores.part='teacher'; ";
    let teacher_marked;
    try {
      const result = await this.app.mysql.query(sql);
      teacher_marked = result[0].count;
    } catch (err) {
      return err;
    }
    const teacher_mark_rate = teacher_marked / teacher_number;
    // 督导人数
    sql =
      "select count(*)as count from teachers where faculty='" +
      faculty +
      "' and IsSupervisor=1;";
    let supervisor_number;
    try {
      const result = await this.app.mysql.query(sql);
      supervisor_number = result[0].count;
    } catch (err) {
      return err;
    }
    // 督导评教人数
    sql =
      "select count(DISTINCT scores.account)as count from scores inner join teachers on teachers.account=scores.account and teachers.faculty='" +
      faculty +
      "' and scores.part='supervisor';";
    let supervisor_marked;
    try {
      const result = await this.app.mysql.query(sql);
      supervisor_marked = result[0].count;
    } catch (err) {
      return err;
    }
    const supervisor_mark_rate = supervisor_marked / supervisor_number;
    return {
      detail: {
        teacher_hasclass,
        teacher_reported,
        teacher_approved,
        teacher_reviewed,
        student_number,
        student_marked,
        teacher_number,
        teacher_marked,
        supervisor_number,
        supervisor_marked,
      },
      rate: {
        report_rate,
        approve_rate,
        review_rate,
        student_mark_rate,
        teacher_mark_rate,
        supervisor_mark_rate,
      },
    };
  }
  async reload() {
    let sql = "delete from classes";
    try {
      const result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    sql = "update teachers set IsApprover=0,IsAssessor=0,IsSupervisor=0;";
    try {
      const result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return true;
  }
}
module.exports = CommonService;
