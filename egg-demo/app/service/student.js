"use strict";

const Service = require("egg").Service;

class StudentController extends Service {
  async teacherList(sno) {
    const sql =
      "select myTeacher_1.tno,myTeacher_1.tname,myTeacher_1.cno,courses.name as cname from courses inner join (select myTeacher.tno,teachers.name as tname,myTeacher.cno from teachers inner join (select myCourse.tno,myCourse.cno from reports inner join (select classes.tno,classes.cno from (select classno from selectCourses where sno='" +
      sno +
      "') as myClass inner join classes on classes.no=myClass.classno)as myCourse on reports.tno=myCourse.tno and reports.approved=1) as myTeacher on myTeacher.tno=teachers.account) as myTeacher_1 on myTeacher_1.cno=courses.no";
    let result;
    try {
      result = await this.app.mysql.query(sql);
    } catch (err) {
      return err;
    }
    for (let i = 0; i < result.length; i++) {
      let mark = await this.app.mysql.get("scores", {
        account: sno,
        tnoed: result[i].tno,
      });
      result[i].mark = mark ? true : false;
    }
    return result;
  }
}
module.exports = StudentController;
