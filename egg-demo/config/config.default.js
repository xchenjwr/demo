/* eslint valid-jsdoc: "off" */

"use strict";
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1645619328214_6715";

  // add your middleware config here
  config.middleware = [
    "adminAuth",
    "approverAuth",
    "assessorAuth",
    "studentAuth",
    "teacherAuth",
    "global",
  ];
  config.global = {
    match: "*",
  };
  config.adminAuth = {
    match: "/admin",
  };
  config.studentAuth = {
    match: "/student",
  };
  config.teacherAuth = {
    match: "/teacher",
  };
  config.approverAuth = {
    match: "/teacher/approver",
  };
  config.assessorAuth = {
    match: "/teacher/assessor",
  };
  config.multipart = {
    mode: "stream",
    whitelist() {
      return true;
    },
  };
  config.mysql = {
    client: {
      host: "120.77.98.123",
      port: "3306",
      user: "work",
      password: "123456",
      database: "work",
    },
    app: true,
    agent: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.jwt = {
    secret: "xchenjwr",
  };
  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };
  config.validate = {
    convert: true, // 对参数可以使用convertType规则进行类型转换
    widelyUndefined: true, // 将NaN、null转成undefined
    // validateRoot: false,   // 限制被验证值必须是一个对象。
  };
  // add your user config here
  const userConfig = {
    reportApi: false,
    approveApi: false,
    teacherEvaluationsApi: false,
    assessApi: false,
    standard: {
      student: {
        theory: [
          {
            key: "1",
            attr: "标准1",
            standard: `1.为人师表,教书育人,无违反党和国家方针政策的言论和行为,无意识形态方面的问题.
          2.教学认真负责,备课充分;精神饱满,教态仪表端庄,大方.
          3.严格要求学生,有效管理课堂.`,
            weight: "10%",
          },
          {
            key: "2",
            attr: "标准2",
            standard: `1.有达成课堂目标的途径和方法,过程安排合理,方法运用恰当.
          2.语言精炼,表达清晰、生动,语速节奏恰当.
          3.PPT设计合理,板书清晰,板书及多媒体技术综合使用得当.
          4.与学生互动,启迪学生思维.`,
            weight: "40%",
          },
          {
            key: "3",
            attr: "标准3",
            standard: `1.教学内容充实,信息量适中,能结合学科新思想、新发展.
          2.讲述内容熟练、准确,条理清晰,重点突出、难点处理得当.
          3.结合专业特点,理论联系实际,举例恰当.`,
            weight: "35%",
          },
          {
            key: "4",
            attr: "标准4",
            standard: `1.学生听课关注度高,积极参与,课堂气氛活跃.
          2.掌握教学内容,教学效果明显.`,
            weight: "15%",
          },
        ],
        test: [
          {
            key: "1",
            attr: "标准1",
            standard: `1.设备仪器完好率高,实验室整洁卫生,台面物品摆放有序.
        2.实验材料、用品准备充分,新开实验有试做报告.
        3.学生提前预习,并提交预习报告.`,
            weight: "30%",
          },
          {
            key: "2",
            attr: "标准2",
            standard: `1.为人师表,教书育人,无违反党和国家方针政策的言论和行为,无意识形态方面的问题.
        2.教师讲解示范简明、准确,板书规范、工整,注重理论联系实际.
        3.实验内容安排合理,有达成实验目标的途径和方法,符合实验内容特点,体现教学新理念.
        4.全程在场及时指导,不做与实验教学无关的事情,答疑耐心、辅导热情,重视学生动手能力的培养,注重实验安全管理.
        5.对学生严格要求,注重培养学生严谨科学态度,规范的操作方法,实验数据真实,记录完整.`,
            weight: "50%",
          },
          {
            key: "3",
            attr: "标准3",
            standard: `1.学生实验参与度高,兴趣浓厚,实验秩序好.
        2.掌握实验内容,实验效果明显.`,
            weight: "20%",
          },
        ],
      },
      teacher: {
        theory: [
          {
            key: "1",
            attr: "教学态度",
            standard: `1.为人师表,教书育人,无违反党和国家方针政策的言论和行为,无意识形态方面的问题.
        2.教学认真负责,备课充分;精神饱满,教态仪表端庄,大方.
        3.严格要求学生,有效管理课堂.`,
            weight: "10%",
          },
          {
            key: "2",
            attr: "教学组织",
            standard: `1.有达成课堂目标的途径和方法,过程安排合理,方法运用恰当.
        2.语言精炼,表达清晰、生动,语速节奏恰当.
        3.PPT设计合理,板书清晰,板书及多媒体技术综合使用得当.
        4.与学生互动,启迪学生思维.`,
            weight: "40%",
          },
          {
            key: "3",
            attr: "教学内容",
            standard: `1.教学内容充实,信息量适中,能结合学科新思想、新发展.
        2.讲述内容熟练、准确,条理清晰,重点突出、难点处理得当.
        3.结合专业特点,理论联系实际,举例恰当.`,
            weight: "35%",
          },
          {
            key: "4",
            attr: "学生听课效果",
            standard: `1.学生听课关注度高,积极参与,课堂气氛活跃.
        2.掌握教学内容,教学效果明显.`,
            weight: "15%",
          },
        ],
        test: [
          {
            key: "1",
            attr: "实验准备",
            standard: `1.设备仪器完好率高,实验室整洁卫生,台面物品摆放有序.
        2.实验材料、用品准备充分,新开实验有试做报告.
        3.学生提前预习,并提交预习报告.`,
            weight: "30%",
          },
          {
            key: "2",
            attr: "实验教学",
            standard: `1.为人师表,教书育人,无违反党和国家方针政策的言论和行为,无意识形态方面的问题.
        2.教师讲解示范简明、准确,板书规范、工整,注重理论联系实际.
        3.实验内容安排合理,有达成实验目标的途径和方法,符合实验内容特点,体现教学新理念.
        4.全程在场及时指导,不做与实验教学无关的事情,答疑耐心、辅导热情,重视学生动手能力的培养,注重实验安全管理.
        5.对学生严格要求,注重培养学生严谨科学态度,规范的操作方法,实验数据真实,记录完整.`,
            weight: "50%",
          },
          {
            key: "3",
            attr: "学生实验效果",
            standard: `1.学生实验参与度高,兴趣浓厚,实验秩序好.
        2.掌握实验内容,实验效果明显.`,
            weight: "20%",
          },
        ],
      },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
