import { request } from "./request";
// 教师接口
export function courseList() {
  return request({
    url: "/teacher/courseList",
  });
}
export function report(formdata) {
  return request({
    method: "post",
    url: "/teacher/report",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function peerCount() {
  return request({
    url: "/teacher/peerCount",
  });
}
export function peerList(page = 1, num = 10) {
  return request({
    url: "/teacher/peerList?page=" + page + "&num=" + num,
  });
}
export function getAssess() {
  return request({
    url: "/teacher/getAssess",
  });
}
// 审核接口
export function reportCount() {
  return request({
    url: "/teacher/approver/reportCount",
  });
}
export function reportList(page = 1, num = 10) {
  return request({
    url: "/teacher/approver/reportList?page=" + page + "&num=" + num,
  });
}
export function approver(formdata) {
  return request({
    method: "post",
    url: "/teacher/approver/approve",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
// 评审接口
export function assessCount() {
  return request({
    url: "/teacher/assessor/assessCount",
  });
}
export function assessList(page = 1, num = 10) {
  return request({
    url: "/teacher/assessor/assessList?page=" + page + "&num=" + num,
  });
}
export function assess(formdata) {
  return request({
    method: "post",
    url: "/teacher/assessor/assess",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
