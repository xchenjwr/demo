const streamApi = ["/admin", "/teacher/report", "/putScore"];

const streamConfig = [
  [".xlsx", "xls"],
  [
    ".doc",
    ".docx",
    ".xlsx",
    ".xls",
    ".ppt",
    ".pptx",
    ".pdf",
    ".wps",
    ".rar",
    ".zip",
    ".jpeg",
    ".jpg",
    ".png",
    ".txt",
  ],
  [".jpeg", ".jpg", ".png"],
];

function matchRoute(url) {
  for (let i = 0; i < streamApi.length; i++) {
    if (url.startsWith(streamApi[i])) {
      return streamConfig[i];
    }
  }
  return false;
}
module.exports = { matchRoute, streamApi };
