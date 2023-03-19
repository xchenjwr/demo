import { request } from "./request";

export function getCode() {
  return request({
    url: "/getcode",
  });
}
export function login(formdata) {
  return request({
    method: "post",
    url: "/login",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function updatePassword(formdata) {
  return request({
    method: "post",
    url: "/updatePassword",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function getApiStatus() {
  return request({
    url: "/getApiStatus",
  });
}
export function putScore(formdata) {
  return request({
    method: "post",
    url: "/putScore",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function getReport(tno) {
  return request({
    method: "get",
    url: "/getReport?tno=" + tno,
  });
}
export function scoreCount(formdata) {
  return request({
    method: "post",
    url: "/scoreCount",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function getScore(formdata) {
  return request({
    method: "post",
    url: "/getScore",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function getStandard() {
  return request({
    url: "/getStandard",
  });
}
