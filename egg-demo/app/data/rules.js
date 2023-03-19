exports.loginRule = {
  part: {
    type: "enum",
    values: ["student", "teacher", "admin"],
    required: true,
  },
  account: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
};
exports.ListRule = {
  page: {
    type: "number",
    min: 1,
  },
  num: {
    type: "number",
    min: 1,
  },
};
exports.apiManageRule = {
  key: {
    type: "enum",
    values: ["reportApi", "approveApi", "teacherEvaluationsApi", "assessApi"],
    required: true,
  },
  value: {
    type: "boolean",
    required: true,
  },
};
