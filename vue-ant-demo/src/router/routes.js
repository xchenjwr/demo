const Login = () => import("../pages/login/Login");
const Layout = () => import("../layout/Layout");
// 2.创建router
export default [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "*",
    name: "404",
    component: () => import("../pages/extra/404"),
  },
  {
    path: "/student",
    meta: {
      title: "学生页面",
    },
    component: Layout,
    children: [
      {
        path: "personInfo",
        meta: {
          title: "个人信息",
          icno: "user",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "userProfile",
            meta: {
              title: "查看个人信息",
            },
            component: () => import("../pages/common/UserProfile"),
          },
          {
            path: "updatePwd",
            meta: {
              title: "修改密码",
            },
            component: () => import("../pages/common/UpdatePwd"),
          },
        ],
      },
      {
        path: "teacherList",
        meta: {
          title: "学生评教",
          icno: "contacts",
        },
        component: () => import("../pages/student/TeacherList"),
      },
      {
        path: "getReport",
        meta: {
          display: "none",
        },
        component: () => import("../pages/common/GetReport"),
      },
      {
        path: "putScore",
        meta: {
          title: "评教",
          display: "none",
        },
        component: () => import("../pages/common/PutScore"),
      },
      {
        path: "scoreList",
        meta: {
          display: "none",
        },
        component: () => import("../pages/common/ScoreList"),
      },
    ],
  },
  {
    path: "/teacher",
    meta: {
      title: "教师页面",
    },
    component: Layout,
    children: [
      {
        path: "personInfo",
        meta: {
          title: "个人信息",
          icno: "user",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "userProfile",
            meta: {
              title: "查看个人信息",
            },
            component: () => import("../pages/common/UserProfile"),
          },
          {
            path: "updatePwd",
            meta: {
              title: "修改密码",
            },
            component: () => import("../pages/common/UpdatePwd"),
          },
        ],
      },
      {
        path: "report",
        meta: {
          title: "教师申报",
          icno: "form",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "reportAwards",
            meta: {
              title: "申报奖项",
            },
            component: () => import("../pages/teacher/Report"),
          },
          {
            path: "scoreDetail",
            meta: {
              title: "查看评教详情",
            },
            component: () => import("../pages/common/GetReport"),
          },
          {
            path: "assessDetail",
            meta: {
              title: "查看评审详情",
            },
            component: () => import("../pages/teacher/GetAssess"),
          },
        ],
      },
      {
        path: "peer",
        meta: {
          title: "同行评议",
          icno: "team",
          auth: "teacher",
        },
        component: () => import("../pages/teacher/PeerReview"),
      },
      {
        path: "supervisor",
        meta: {
          title: "督导打分",
          icno: "team",
          auth: "supervisor",
        },
        component: () => import("../pages/teacher/PeerReview"),
      },
      {
        path: "approve",
        meta: {
          title: "审核申报",
          icno: "file-search",
          auth: "approver",
        },
        component: () => import("../pages/teacher/Approve"),
      },
      {
        path: "assess",
        meta: {
          title: "评审申报",
          icno: "diff",
          auth: "assessor",
        },
        component: () => import("../pages/teacher/Assess"),
      },
      {
        path: "getReport",
        meta: {
          display: "none",
        },
        component: () => import("../pages/common/GetReport"),
      },
      {
        path: "putScore",
        meta: {
          display: "none",
        },
        component: () => import("../pages/common/PutScore"),
      },
      {
        path: "scoreList",
        meta: {
          display: "none",
        },
        component: () => import("../pages/common/ScoreList"),
      },
    ],
  },
  {
    path: "/admin",
    meta: {
      title: "管理员页面",
    },
    component: Layout,
    children: [
      {
        path: "import",
        meta: {
          title: "导入数据",
          icno: "upload",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "students",
            meta: {
              title: "导入学生表",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "teachers",
            meta: {
              title: "导入教师表",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "courses",
            meta: {
              title: "导入课程表",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "classes",
            meta: {
              title: "导入课表",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "selectCourses",
            meta: {
              title: "导入学生选课表",
            },
            component: () => import("../pages/admin/Import"),
          },
        ],
      },
      {
        path: "grant",
        meta: {
          title: "赋予权限",
          icno: "user-add",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "Approver",
            meta: {
              title: "导入审核员",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "Supervisor",
            meta: {
              title: "导入督导员",
            },
            component: () => import("../pages/admin/Import"),
          },
          {
            path: "Assessor",
            meta: {
              title: "导入评审员",
            },
            component: () => import("../pages/admin/Import"),
          },
        ],
      },
      {
        path: "apiManage",
        meta: {
          title: "管理功能",
          icno: "setting",
        },
        component: () => import("../pages/admin/ApiManage"),
      },
      {
        path: "data",
        meta: {
          title: "数据分析",
          icno: "line-chart",
        },
        component: () => import("../pages/admin/DataDetail"),
      },
      {
        path: "reload",
        meta: {
          title: "重置功能",
          icno: "reload",
        },
        component: { render: (e) => e("router-view") },
        children: [
          {
            path: "password",
            meta: {
              title: "重置用户密码",
            },
            component: () => import("../pages/admin/ResetPassword"),
          },
          {
            path: "reloadProject",
            meta: {
              title: "重置系统",
            },
            component: () => import("../pages/admin/Reload"),
          },
        ],
      },
      {
        path: "getResult",
        meta: {
          title: "导出获奖名单",
          icno: "export",
        },
        component: () => import("../pages/admin/GetResult"),
      },
    ],
  },
];
