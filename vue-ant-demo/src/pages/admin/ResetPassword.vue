<template>
  <div style="width: 500px">
    上传文件格式如下:
    <a-table :columns="columns" :data-source="list" :pagination="false">
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
import { resetPassword } from "../../network/admin";
const columns = [{ title: "account", dataIndex: "account" }];
const list = [
  {
    key: 1,
    account: "t13001001",
  },
];
export default {
  name: "ResetPassword",
  data() {
    return {
      list,
      columns,
      fileList: [],
      uploading: false,
    };
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
      resetPassword(formData).then((res) => {
        this.handleResponse(res);
      });
    },
  },
};
</script>
