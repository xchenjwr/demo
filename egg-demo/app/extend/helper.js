const svgCaptcha = require("svg-captcha");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const sendToWormhole = require("stream-wormhole");

module.exports = {
  captcha() {
    const captcha = svgCaptcha.create({
      size: 4, // 长度(显示几个字符)
      fontSize: 30, // 字体大小
      width: 90, // 宽度
      height: 30, // 高度
      background: "#c9cdcd", // 背景颜色
    });
    return captcha;
  },
  token(json) {
    const { app } = this;
    const token = app.jwt.sign(
      json,
      app.config.jwt.secret,
      { expiresIn: 60 * 60 * 24 * 1 } // 设置1天过期
    );
    return token;
  },
  translateToken() {
    const { ctx, app } = this;
    if (ctx.request.header.authorization === undefined) {
      return null;
    }
    const token = ctx.request.header.authorization.slice(7);
    const payload = app.jwt.verify(token, app.config.jwt.secret);
    return payload;
  },
  xlsxToJson() {
    const { ctx } = this;
    let json = [];
    ctx.state.stream.files.forEach((file) => {
      const workBook = XLSX.readFile(file);
      let sheetNames = workBook.SheetNames;
      for (const sheetName of sheetNames) {
        let worksheet = workBook.Sheets[sheetName];
        json.push(...XLSX.utils.sheet_to_json(worksheet));
      }
    });
    return json;
  },
  async clsUpload() {
    const { ctx } = this;
    try {
      ctx.state.stream.files.forEach((file) => {
        fs.unlink(file, () => {
          fs.rmdir(path.dirname(file), () => {});
        });
      });
    } catch (e) {}
  },
  async delFile(files) {
    files.forEach((file) => {
      const removepath = path.join(
        __dirname,
        "../public/",
        file.split("public")[1]
      );
      fs.unlink(removepath, () => {
        fs.rmdir(path.dirname(removepath), () => {});
      });
    });
  },
  async initStream() {
    const { ctx } = this;
    const parts = ctx.multipart();
    let part;
    let result = {
      fields: {},
      files: [],
    };
    while ((part = await parts()) != null) {
      if (part.length) {
        result.fields[part[0]] = part[1];
      } else {
        if (!part.filename) {
          return;
        }
        if (
          ctx.state.allowType &&
          ctx.state.allowType.indexOf(
            "." + part.filename.split(".")[part.filename.split(".").length - 1]
          ) === -1
        ) {
          return false;
        }
        try {
          let filepath = path.join(
            __dirname,
            "../public",
            new Date().getTime() + Math.random().toFixed(6).substring(2)
          );
          fs.mkdirSync(filepath);
          let writable = fs.createWriteStream(
            path.join(filepath, part.filename)
          );
          await part.pipe(writable);
          await new Promise((resolve, reject) => {
            writable.on("finish", () => {
              resolve("finish");
            });
          });
          result.files.push(path.join(filepath, part.filename));
        } catch (err) {
          await sendToWormhole(part);
          throw err;
        }
        sendToWormhole(part);
      }
    }
    ctx.state.stream = result;
    return true;
  },
  jsonToXlsx(json, filepath, fileName) {
    // 从头开始创建工作簿
    var wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(json);
    // 把工作表添加到工作簿中
    XLSX.utils.book_append_sheet(wb, ws, "sheet");
    // 写入 （node）
    fs.mkdirSync(path.resolve(__dirname, "../public/", filepath));
    XLSX.writeFile(
      wb,
      path.resolve(__dirname, "../public/", filepath, fileName),
      {
        type: "buffer",
        Props: { Author: "author" },
      }
    );
  },
};
