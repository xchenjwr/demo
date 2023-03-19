<template>
  <div>
    <a-button
      type="primary"
      v-if="!justLook"
      :disabled="!isFixed"
      @click="handleSubmit"
      >提交</a-button
    >
    <span v-if="!justLook && hasScore">
      <label>&nbsp;{{ !isFixed ? "启动修改:" : "取消修改:" }}&nbsp;</label>
      <a-switch
        v-model="isFixed"
        @change="
          (checked) => {
            if (!checked) {
              this.getScore();
            }
          }
        "
      />
    </span>
    <a-divider orientation="left">评价标准</a-divider>
    <a-table
      :columns="columns"
      :data-source="standard[part][type]"
      :pagination="false"
      size="small"
      bordered
    >
      <span slot="score" slot-scope="text, record, index">
        <a-select
          v-model="scores[index]"
          :style="width"
          :disabled="!isFixed"
          size="small"
        >
          <a-select-option v-for="item in grade[part]" :key="item.text"
            >{{ item.text }}
          </a-select-option>
        </a-select>
      </span>
    </a-table>
    <a-divider orientation="left">评价或建议</a-divider>
    <a-textarea
      v-model="content"
      :max-length="100"
      placeholder="请输入评论(100字以内)"
      rows="2"
      style="resize: none; margin-top: 5px"
      :disabled="!isFixed"
    />
    <div v-if="part === 'teacher'">
      <a-divider orientation="left">听课剪影</a-divider>
      <a-upload
        :multiple="true"
        accept=".jpg,.png,.jpeg"
        list-type="picture-card"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        :show-upload-list="{
          showRemoveIcon: isFixed,
        }"
        @preview="handlePreview"
      >
        <div v-if="fileList.length < 9 && isFixed">
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </div>
</template>

<script>
import { vuexObj } from "../../assets/js/mixin";
import { putScore, getScore, getStandard } from "../../network/common";
const columns = [
  {
    title: "评价属性",
    dataIndex: "attr",
  },
  {
    title: "评价标准",
    dataIndex: "standard",
  },
  {
    title: "权重占比",
    dataIndex: "weight",
  },
  {
    title: "评分",
    dataIndex: "score",
    scopedSlots: { customRender: "score" },
  },
];
const standard = {
  student: {
    theory: [],
    test: [],
  },
  teacher: {
    theory: [],
    test: [],
  },
};
const grade = {
  teacher: [
    { text: "A", score: 100 },
    { text: "B", score: 90 },
    { text: "C", score: 80 },
    { text: "D", score: 70 },
    { text: "E", score: 60 },
  ],
  student: [
    { text: "完全同意", score: 100 },
    { text: "比较同意", score: 90 },
    { text: "基本同意", score: 80 },
    { text: "比较不同意", score: 70 },
    { text: "完全不同意", score: 60 },
  ],
};
export default {
  name: "PutScore",
  data() {
    return {
      query: {},
      hasScore: false,
      isFixed: true,
      columns,
      grade,
      type: "theory",
      part: "student",
      scores: [],
      content: "",
      fileList: [],
      removeFile: [],
      previewVisible: false,
      previewImage: "",
      width: "",
      justLook: false,
      standard,
    };
  },
  mixins: [vuexObj],
  methods: {
    /**
     * 功能函数
     */
    init() {
      getStandard().then((res) => {
        for (let i = 0; i < 4; i++) {
          this.standard = { ...res.standard };
        }
      });
      this.part = this.query.part || this.userInfo.part;
      this.type = this.query.cno.startsWith("BS") ? "test" : "theory";
      let width = this.part === "student" ? "110px" : "40px";
      this.width = "width:" + width;
      if (this.query.account) {
        this.justLook = true;
      } else {
        this.justLook = false;
      }
      this.getScore();
    },
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleRemove(file) {
      if (file && file.url) {
        this.removeFile.push(file.url);
      }
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    async handleAdd(file) {
      file.thumbUrl = await this.getBase64(file);
      this.fileList = [...this.fileList, file];
    },
    beforeUpload(file) {
      this.handleAdd(file);
      return false;
    },
    /**
     * 网络请求函数
     */
    getScore() {
      const obj = {
        account: this.justLook ? this.query.account : this.userInfo.account,
        tnoed: this.query.tno,
      };
      const formData = this.toFormData(obj);
      getScore(formData).then((res) => {
        if (res.code == 0 && res.data.length > 0) {
          res.data = res.data[0];
          this.isFixed = false;
          this.hasScore = true;
          this.scores = JSON.parse(res.data.details);
          this.content = res.data.content;
          const imgpath = JSON.parse(res.data.imgpath);
          this.fileList = [];
          this.removeFile = [];
          imgpath.forEach((file, index) => {
            this.fileList.push({
              uid: index + 1,
              name: file.split("/")[file.split("/").length - 1],
              status: "done",
              url: file,
            });
          });
        } else {
          this.hasScore = false;
          this.isFixed = true;
        }
      });
    },
    handleSubmit() {
      let total = 0;
      let scores = [];
      if (
        this.scores.length == 0 ||
        this.scores.length != this.standard[this.part][this.type].length
      ) {
        this.$message.error("评价标准还未完成,请仔细检查");
        return;
      }
      if (this.content == "") {
        this.$message.error("评价或意见不能为空,请仔细检查");
        return;
      }
      if (this.part == "teacher" && this.fileList.length == 0) {
        this.$message.error("听课照片不能为空,请仔细检查");
        return;
      }
      for (let i = 0; i < this.scores.length; i++) {
        this.grade[this.part].some((item) => {
          if (item.text === this.scores[i]) {
            scores[i] = item.score;
            return true;
          }
        });
      }
      this.standard[this.part][this.type].forEach((item, index) => {
        total += Number(item.weight.replace("%", "") / 100) * scores[index];
      });
      let obj = {
        tnoed: this.query.tno,
        details: JSON.stringify(this.scores),
        content: this.content,
        score: total,
      };
      this.fileList.forEach((file, index) => {
        if (file.url) {
          obj["file[" + index + "]"] = file.url;
        } else {
          // 为了网络传输效率,图片展示会闪烁
          delete file.thumbUrl;
          obj["file[" + index + "]"] = file;
        }
      });
      if (this.removeFile.length != 0) {
        obj.removeFile = JSON.stringify(this.removeFile);
      }
      const formData = this.toFormData(obj);
      this.uploading = true;
      putScore(formData).then((res) => {
        this.uploading = false;
        if (res.code == 0) {
          this.getScore();
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  activated() {
    this.query = this.$route.query;
    this.init();
  },
};
</script>

<style lang="less" scoped>
.upload-list-inline .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}
</style>
