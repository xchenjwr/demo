"use strict";
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, jwt } = app;
  router.get("/getcode", controller.common.getCode);
  router.post("/login", controller.common.login);
  router.post("/updatePassword", jwt, controller.common.updatePassword);
  router.get("/getApiStatus", jwt, controller.common.getApiStatus);
  router.get("/getStandard", jwt, controller.common.getStandard);

  router.post("/putScore", jwt, controller.common.putScore);
  router.get("/getReport", jwt, controller.common.getReport);
  router.post("/scoreCount", jwt, controller.common.scoreCount);
  router.post("/getScore", jwt, controller.common.getScore);
  router.post(
    /^\/admin\/import\/((students)|(teachers)|(classes)|(courses)|(selectCourses))/,
    controller.admin.import
  );
  router.post(
    /^\/admin\/grant\/((Approver)|(Supervisor)|(Assessor))/,
    controller.admin.grant
  );
  router.post("/admin/apiManage", controller.admin.apiManage);
  router.post("/admin/standardManage", controller.admin.standardManage);
  router.get("/admin/getFaculty", controller.admin.getFaculty);
  router.post("/admin/getResult", controller.admin.getResult);
  router.post("/admin/resetPassword", controller.admin.resetPassword);
  router.get("/admin/dataAnalysis", controller.admin.dataAnalysis);
  router.get("/admin/processDoc", controller.admin.processDoc);
  router.post("/admin/export", controller.admin.export);
  router.get("/admin/reload", controller.admin.reload);

  router.get("/teacher/courseList", controller.teacher.courseList);
  router.post("/teacher/report", controller.teacher.report);
  router.get("/teacher/peerCount", controller.teacher.peerCount);
  router.get("/teacher/peerList", controller.teacher.peerList);
  router.get("/teacher/getAssess", controller.teacher.getAssess);

  router.get("/teacher/approver/reportCount", controller.teacher.reportCount);
  router.get("/teacher/approver/reportList", controller.teacher.reportList);
  router.post("/teacher/approver/approve", controller.teacher.approve);

  router.get("/teacher/assessor/assessCount", controller.teacher.assessCount);
  router.get("/teacher/assessor/assessList", controller.teacher.assessList);
  router.post("/teacher/assessor/assess", controller.teacher.assess);

  router.get("/student/teacherList", controller.student.teacherList);
};
