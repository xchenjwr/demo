import { request } from "./request";

export function teacherList() {
  return request({
    url: "/student/teacherList",
  });
}
