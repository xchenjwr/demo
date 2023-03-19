"use strict";

const Service = require("egg").Service;

class TeacherController extends Service {
  // 教师接口
  async courseList(tno) {
    const sql =
      "select DISTINCT courses.no,courses.name from courses inner join (select cno from classes where classes.tno='" +
      tno +
      "') as myCourse on myCourse.cno=courses.no";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async report(obj) {
    let result;
    let sql =
      "REPLACE INTO reports(tno,cno,content,filepath,time) VALUES ('" +
      obj.tno +
      "','" +
      obj.cno +
      "','" +
      obj.content +
      "','" +
      obj.filepath +
      "','" +
      obj.time +
      "');";
    // 此处异常捕捉是因为前面没有进行参数校验
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return true;
  }
  async peerCount(tno) {
    const sql =
      "select count(*) as count from reports inner join (select account from teachers where teachers.faculty=(select faculty from teachers where account='" +
      tno +
      "')) as sameFaculty on sameFaculty.account=reports.tno and reports.approved=1;";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result[0].count;
  }
  async peerList(tno, page, num) {
    const sql =
      "select tab1.*,group_concat(classes.time) as time from (select teacherList.tno,teacherList.tname,teacherList.faculty,teacherList.major,teacherList.cno,courses.name as cname from (select colleague.tno,colleague.tname,colleague.faculty,colleague.major,approvedList.cno from (select account as tno,name as tname,faculty,major from teachers where faculty=(select faculty from teachers where account='" +
      tno +
      "')) as colleague inner join (select tno,cno from reports where approved=1) as approvedList on colleague.tno=approvedList.tno limit " +
      (page - 1) * num +
      "," +
      num +
      ") as teacherList inner join courses on courses.no=teacherList.cno) as tab1 inner join classes on classes.tno=tab1.tno and classes.cno=tab1.cno group by tab1.tno;";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    for (let i = 0; i < result.length; i++) {
      let mark = await this.app.mysql.get("scores", {
        account: tno,
        tnoed: result[i].tno,
      });
      result[i].mark = mark ? true : false;
    }
    return result;
  }
  async getAssess(tno) {
    const sql =
      "select `option`,count(*)as count from reviews where tnoed='" +
      tno +
      "' group by `option`;";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    let json = { tt: 0, ff: 0, ttData: [], ffData: [] };
    if (result.length != 0) {
      result.forEach((item) => {
        if (item.option == 1) {
          json.tt = item.count;
        } else {
          json.ff = item.count;
        }
      });
      if (json.tt > 0) {
        let _sql =
          "select content from reviews where tnoed='" +
          tno +
          "' and `option`=1;";
        let _result;
        try {
          _result = await this.app.mysql.query(_sql);
        } catch (err) {
          return err;
        }
        json.ttData = _result;
      }
      if (json.ff > 0) {
        let _sql =
          "select content from reviews where tnoed='" +
          tno +
          "' and `option`=0;";
        let _result;
        try {
          _result = await this.app.mysql.query(_sql);
        } catch (err) {
          return err;
        }
        json.ffData = _result;
      }
    }
    return json;
  }
  // 审核人员接口
  async reportCount(tno) {
    const sql =
      "select count(*)as count from (select tno,cno,time from reports where reports.approved=0) as noapproved inner join (select * from teachers where faculty=(select faculty from teachers where teachers.account='" +
      tno +
      "')) as colleague on noapproved.tno=colleague.account";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result[0].count;
  }
  async reportList(tno, page, num) {
    const sql =
      "select mynoapproved.*,courses.name as cname from(select colleague.account as tno,colleague.name as tname,colleague.faculty,colleague.major,noapproved.time,noapproved.cno from (select tno,cno,time from reports where reports.approved=0) as noapproved inner join (select * from teachers where faculty=(select faculty from teachers where teachers.account='" +
      tno +
      "')) as colleague on noapproved.tno=colleague.account) as mynoapproved inner join courses on courses.no=mynoapproved.cno limit " +
      (page - 1) * num +
      "," +
      num;
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async approve(obj) {
    const result = await this.app.mysql.update(
      "reports",
      { approved: obj.approved, approveContent: obj.approveContent },
      { where: { tno: obj.tno } }
    );
    return result.affectedRows === 1;
  }
  // 管理人员接口
  async import(db, json) {
    const { app } = this;
    let sql = "";
    let str = "";
    switch (db) {
      case "students":
      case "teachers":
        sql = "insert into " + db + " (account,name,faculty,major) values ";
        for (let i = 0; i < json.length; i++) {
          str +=
            "('" +
            json[i].account +
            "','" +
            json[i].name +
            "','" +
            json[i].faculty +
            "','" +
            json[i].major +
            "'),";
        }
        break;
      case "classes":
        sql = "insert into " + db + " (no,cno,tno,time) values ";
        for (let i = 0; i < json.length; i++) {
          str +=
            "('" +
            json[i].no +
            "','" +
            json[i].cno +
            "','" +
            json[i].tno +
            "','" +
            json[i].time +
            "'),";
        }
        break;
      case "courses":
        sql = "insert into " + db + " (no,name) values ";
        for (let i = 0; i < json.length; i++) {
          str += "('" + json[i].no + "','" + json[i].name + "'),";
        }
        break;
      case "selectCourses":
        sql = "insert into " + db + " (classno,sno) values ";
        for (let i = 0; i < json.length; i++) {
          str += "('" + json[i].classno + "','" + json[i].sno + "'),";
        }
        break;
    }
    str = str.slice(0, str.length - 1);
    sql += str;
    let result;
    try {
      result = await app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return true;
  }
  async grant(attr, json) {
    let sql = "update teachers set " + attr + " = case account ";
    let str1 = "";
    let str2 = "";
    for (let i = 0; i < json.length; i++) {
      str1 += "when '" + json[i].account + "' then 1 ";
      str2 += "'" + json[i].account + "',";
    }
    str2 = str2.slice(0, str2.length - 1);
    sql += str1 + "end where account in (" + str2 + ")";
    try {
      await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return true;
  }
  async getFaculty() {
    const sql = "select faculty from teachers group by faculty;";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async getResult(faculty) {
    const sql =
      "select * from (select Tab1.*,scoresTab.score from (select peerTab.* from (select account as tno,name as tname,faculty,major from teachers where teachers.faculty='" +
      faculty +
      "')as peerTab inner join (select tno from (select tnoed as tno,avg(`option`)as `option` from reviews group by tnoed)as assessTab where `option`>0.5)as assessedTab on assessedTab.tno=peerTab.tno)as Tab1 inner join (select tnoed as tno,avg(score)as score from scores group by tnoed)as scoresTab on Tab1.tno=scoresTab.tno)as Tab2 order by score desc;";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async processDoc(faculty, db) {
    let sql =
      "select teachers.account,teachers.name,teachers.faculty,teachers.major from reports inner join teachers on teachers.account=reports.tno and teachers.faculty='" +
      faculty +
      "'";
    if (db === "approved") {
      sql += " and reports.approved=1";
    }
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async export(data) {
    let sql;
    let result = {};
    for (let i in data) {
      if (data[i]) {
        sql = "select * from " + i;
        try {
          result[i] = await this.app.mysql.query(sql);
        } catch (err) {
          return err;
        }
      }
    }
    return result;
  }
  // 评审人员接口
  async assessCount(tno) {
    const sql =
      "select count(*)as count from (select reports.tno from reports inner join (select account from teachers where teachers.faculty=(select faculty from teachers where account='" +
      tno +
      "')) as sameFaculty on sameFaculty.account=reports.tno and reports.approved=1)as assessTab where tno not in (select tnoed from reviews where account='" +
      tno +
      "');";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result[0].count;
  }
  async assessList(tno, page, num) {
    const sql =
      "select * from (select reportsInfo.*,avg.score from (select reports.tno,peerList.tname from reports inner join (select account as tno,name as tname from teachers where faculty=(select faculty from teachers where account='" +
      tno +
      "')) as peerList on peerList.tno=reports.tno and reports.approved=1) as reportsInfo inner join (select tnoed,avg(score) as score from scores group by tnoed)as avg on reportsInfo.tno=avg.tnoed)as assessList where tno not in (select tnoed from reviews where account='" +
      tno +
      "') order by score desc limit " +
      (page - 1) * num +
      "," +
      num;
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    return result;
  }
  async assess(obj) {
    const result = await this.app.mysql.insert("reviews", obj);
    return result.affectedRows === 1;
  }
}
module.exports = TeacherController;
