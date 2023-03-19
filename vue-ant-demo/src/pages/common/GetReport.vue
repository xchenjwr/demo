<template>
  <div>
    <div v-if="status.view">
      <div v-if="reportInfo.approved === 1">
        <a-divider orientation="left">评分详情</a-divider>
        <div @click="scoreList('all')" style="width: 85px; cursor: pointer">
          <a-statistic
            title="总平均分"
            :precision="2"
            :value="reportInfo.score"
          >
            <template #suffix>
              <span> / {{ reportInfo.count }}</span>
            </template>
          </a-statistic>
        </div>
        <a-row>
          <a-col :span="8" v-for="item in reportInfo.mark" :key="item.part">
            <div
              @click="scoreList(item.part)"
              style="width: 85px; cursor: pointer"
            >
              <a-statistic
                :title="
                  item.part === 'student'
                    ? '学生评分'
                    : item.part === 'teacher'
                    ? '同行评议'
                    : '督导评分'
                "
                :precision="2"
                :value="item.score"
              >
                <template #suffix>
                  <span> / {{ item.count }}</span>
                </template>
              </a-statistic>
            </div>
          </a-col>
        </a-row>
      </div>
      <a-divider orientation="left">申报详情</a-divider>
      <a-descriptions label="申报详情">
        <a-descriptions-item label="编号">
          {{ reportInfo.tno || this.userInfo.account }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名">
          {{ reportInfo.tname }}
        </a-descriptions-item>
        <a-descriptions-item label="学院">
          {{ reportInfo.faculty }}
        </a-descriptions-item>
        <a-descriptions-item label="教研室">
          {{ reportInfo.major }}
        </a-descriptions-item>
        <a-descriptions-item label="申报课程号">
          {{ reportInfo.cno }}
        </a-descriptions-item>
        <a-descriptions-item label="申报课程">
          {{ reportInfo.cname }}
        </a-descriptions-item>
      </a-descriptions>
      <label style="color: #000">申报理由：</label>
      <div label="申报理由">
        {{ reportInfo.content }}
      </div>
      <br />
      <label style="color: #000">附件：</label>
      <div style="width: 400px">
        <a-upload
          :file-list="fileList"
          :show-upload-list="{
            showRemoveIcon: false,
            showDownloadIcon: true,
          }"
          @preview="handlePreview"
          @download="handleDownload"
        ></a-upload>
      </div>
    </div>
    <Info v-else :title="status.title" />
  </div>
</template>

<script>
import Info from "../extra/Info.vue";
import { getReport } from "../../network/common";
import { fileOperation, operaPane } from "../../assets/js/mixin";
export default {
  name: "GetReport",
  mixins: [fileOperation, operaPane],
  components: { Info },
  data() {
    return {
      reportInfo: {},
      fileList: [],
      status: { view: true, title: "" },
    };
  },
  methods: {
    /**
     * 功能函数
     */
    scoreList(part) {
      // const pane = {
      //   path:
      //     this.$route.matched[0].path +
      //     "/scoreList?tno=" +
      //     this.$route.query.tno +
      //     "&part=" +
      //     part +
      //     "&cno=" +
      //     this.reportInfo.cno,
      //   title: "评分列表",
      // };
      // this.addPane(pane);
    },
    /**
     * 网络请求
     */
    getReport() {
      getReport(this.$route.query.tno || this.userInfo.account).then((res) => {
        if (res.code == 0) {
          if (
            !this.$route.query.tno &&
            (res.data == undefined || res.data.approved != 1)
          ) {
            this.status.view = false;
            this.status.title =
              res.data == undefined ? "您还未申报" : "您的申报暂未审核通过";
            return;
          }
          this.reportInfo = res.data;
          this.reportInfo.tno = this.$route.query.tno;
          const files = JSON.parse(res.data.filepath);
          this.fileList = [];
          files.forEach((file, index) => {
            this.fileList.push({
              uid: index + 1,
              name: file.split("/")[file.split("/").length - 1],
              status: "done",
              url: file,
            });
          });
        }
      });
    },
  },
  activated() {
    this.getReport();
  },
};
</script>
