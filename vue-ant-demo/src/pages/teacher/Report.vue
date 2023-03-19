<template>
  <div>
    <a-form-model
      v-if="this.apiStatus.reportApi"
      layout="vertical"
      @submit="handleSubmit"
      @submit.native.prevent
    >
      <a-form-model-item style="color: green">
        <label style="color: rgba(0, 0, 0, 0.65)">申报状态:&nbsp;</label>
        <span v-if="approveObj.option == 1"
          >已通过审核 <span style="color: rgba(0, 0, 0, 0.65)">审核意见:</span
          >{{ approveObj.content }}</span
        >
        <span v-else-if="approveObj.option == -1" style="color: red"
          >未通过审核 <span style="color: rgba(0, 0, 0, 0.65)">审核意见:</span
          >{{ approveObj.content }}</span
        >
        <span v-else>
          {{ isReport ? "已申报,等待审核" : "未申报" }}
        </span>
      </a-form-model-item>
      <a-form-model-item v-if="approveObj.option != 1 && isReport">
        <label>{{ !isFixed ? "启动修改:" : "取消修改:" }}&nbsp;</label>
        <a-switch
          v-model="isFixed"
          @change="
            (checked) => {
              if (!checked) {
                this.getReport();
              }
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item>
        <label>申报课程:&nbsp;</label>
        <a-select
          style="width: 150px"
          v-model="cno"
          :disabled="!isFixed"
          size="small"
        >
          <a-select-option v-for="item in classes" :key="item.no">{{
            item.name
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <label>申报理由:</label><br />
        <a-textarea
          v-model="content"
          :max-length="500"
          placeholder="请输入申请理由(500字以内)"
          :disabled="!isFixed"
          rows="4"
          style="resize: none; margin-top: 5px"
        />
      </a-form-model-item>
      <a-form-model-item style="width: 400px">
        <a-tooltip>
          <template slot="title"
            >仅支持doc,docx,xls,xlsx,ppt,pptx,wps,zip,rar,pdf,txt,png,jpg
          </template>
          <label>附件:</label></a-tooltip
        >
        <a-upload
          :multiple="true"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :show-upload-list="{
            showRemoveIcon: isFixed,
            showDownloadIcon: true,
          }"
          @preview="handlePreview"
          @download="handleDownload"
        >
          <a-button v-if="!isReport || isFixed" size="small">
            <a-icon type="upload" /> 上传附件
          </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item v-if="!isReport || isFixed">
        <a-button type="primary" html-type="submit" :loading="uploading">
          {{ isReport ? "确定修改申报" : "确定申报" }}
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <Info v-else title="教师申报功能已关闭" />
  </div>
</template>

<script>
import Info from "../extra/Info.vue";
import { fileOperation, vuexObj } from "../../assets/js/mixin";
import { courseList, report } from "../../network/teacher";
import { getReport } from "../../network/common";
export default {
  name: "Report",
  mixins: [fileOperation, vuexObj],
  components: { Info },
  data() {
    return {
      isReport: false,
      approveObj: {},
      isFixed: true,
      classes: [],
      cno: "",
      content: "",
      fileList: [],
      removeFile: [],
      uploading: false,
    };
  },
  methods: {
    /**
     * 功能函数
     */
    handleRemove(file) {
      if (file && file.url) {
        this.removeFile.push(file.url);
      }
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    /**
     * 网络请求
     */
    courseList() {
      courseList().then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.classes = [...res.data];
      });
    },
    getReport() {
      getReport(this.userInfo.account).then((res) => {
        if (res.code == 0 && res.data) {
          this.approveObj = {
            option: res.data.approved,
            content: res.data.approveContent,
          };
          this.isReport = true;
          this.isFixed = false;
          this.cno = res.data.cno;
          this.content = res.data.content;
          const filepath = JSON.parse(res.data.filepath);
          this.fileList = [];
          this.removeFile = [];
          filepath.forEach((file, index) => {
            this.fileList.push({
              uid: index + 1,
              name: file.split("/")[file.split("/").length - 1],
              status: "done",
              url: file,
            });
          });
        } else {
          this.isFixed = true;
        }
      });
    },
    handleSubmit() {
      if (this.cno == "") {
        this.$message.error("申报课程不能为空");
        return;
      }
      if (this.content == "") {
        this.$message.error("申报理由不能为空");
        return;
      }
      let obj = { cno: this.cno, content: this.content };
      this.fileList.forEach((file, index) => {
        if (file.url) {
          obj["file[" + index + "]"] = file.url;
        } else {
          obj["file[" + index + "]"] = file;
        }
      });
      const formData = this.toFormData(obj);
      this.uploading = true;
      report(formData).then((res) => {
        this.uploading = false;
        if (res.code == 0) {
          this.$message.success("申报成功");
          this.getReport();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  created() {
    if (this.apiStatus.reportApi) {
      this.courseList();
      this.getReport();
    }
  },
};
</script>
