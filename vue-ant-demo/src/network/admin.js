import { request } from "./request";

export function Import(table, formdata) {
  return request({
    method: "post",
    url: "/admin/import/" + table,
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function grant(part, formdata) {
  return request({
    method: "post",
    url: "/admin/grant/" + part,
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function apiManage(formdata) {
  return request({
    method: "post",
    url: "/admin/apiManage",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function getFaculty() {
  return request({
    url: "/admin/getFaculty",
  });
}

export function getResult(formdata) {
  return request({
    method: "post",
    url: "/admin/getResult",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function dataAnalysis(faculty) {
  return request({
    url: "/admin/dataAnalysis?faculty=" + faculty,
  });
}

export function processDoc(faculty, db) {
  return request({
    url: "/admin/processDoc?faculty=" + faculty + "&db=" + db,
  });
}

export function resetPassword(formdata) {
  return request({
    method: "post",
    url: "/admin/resetPassword",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function Export(formdata) {
  return request({
    method: "post",
    url: "/admin/export",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function standardManage(formdata) {
  return request({
    method: "post",
    url: "/admin/standardManage",
    data: formdata,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function reload() {
  return request({
    url: "/admin/reload",
  });
}
