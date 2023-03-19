<template>
  <div style="width: 500px">
    上传文件格式如下:
    <a-table
      :columns="columns[index]"
      :data-source="list[index]"
      :pagination="false"
    >
    </a-table>
    <br />
    <a-upload
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="beforeUpload"
      accept=".xls,.xlsx"
    >
      <a-button size="small"> <a-icon type="upload" />上传文件</a-button
      >文件类型仅限:.xls,.xlsx
    </a-upload>
    <a-button
      type="primary"
      :disabled="fileList.length === 0"
      :loading="uploading"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ uploading ? "上传中..." : "开始上传" }}
    </a-button>
  </div>
</template>

<script>
import { Import, grant } from "../../network/admin";
const columns = [
  [
    { title: "account", dataIndex: "account" },
    { title: "name", dataIndex: "name" },
    { title: "faculty", dataIndex: "faculty" },
    { title: "major", dataIndex: "major" },
  ],
  [
    { title: "no", dataIndex: "no" },
    { title: "name", dataIndex: "name" },
  ],
  [
    { title: "no", dataIndex: "no" },
    { title: "cno", dataIndex: "cno" },
    { title: "tno", dataIndex: "tno" },
    { title: "time", dataIndex: "time" },
  ],
  [
    { title: "classno", dataIndex: "classno" },
    { title: "sno", dataIndex: "sno" },
  ],
  [{ title: "account", dataIndex: "account" }],
];
const list = [
  [
    {
      key: 1,
      account: "123456789",
      name: "小明",
      faculty: "信息与通信学院",
      major: "电子信息类",
    },
  ],
  [
    {
      key: 1,
      no: "BJ000000000",
      name: "高等数学",
    },
  ],
  [
    {
      key: 1,
      no: "2122333",
      cno: "高等数学",
      tno: "t13001001",
      time: "周5第5、6节1-8周:11B301",
    },
  ],
  [
    {
      key: 1,
      classno: "2122333",
      sno: "2300100101",
    },
  ],
  [
    {
      key: 1,
      account: "t13001001",
    },
  ],
];
export default {
  name: "Import",
  data() {
    return {
      list,
      columns,
      fileList: [],
      uploading: false,
    };
  },
  computed: {
    table: function () {
      return this.$route.path.split("/")[3];
    },
    index: function () {
      switch (this.$route.path.split("/")[3]) {
        case "students":
          return 0;
        case "teachers":
          return 0;
        case "courses":
          return 1;
        case "classes":
          return 2;
        case "selectCourses":
          return 3;
        case "Approver":
          return 4;
        case "Supervisor":
          return 4;
        case "Assessor":
          return 4;
      }
      return -1;
    },
  },
  methods: {
    /**
     * 功能函数
     */
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleResponse(res) {
      this.uploading = false;
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.fileList = [];
      } else {
        this.$message.error(res.msg);
      }
    },
    /**
     * 网络请求函数
     */
    handleUpload() {
      this.uploading = true;
      let obj = {};
      this.fileList.forEach((file, index) => {
        obj["file[" + index + "]"] = file;
      });
      const formData = this.toFormData(obj);
      if (this.index < 4) {
        Import(this.table, formData).then((res) => {
          this.handleResponse(res);
        });
      } else {
        grant(this.table, formData).then((res) => {
          this.handleResponse(res);
        });
      }
    },
  },
};
</script>
