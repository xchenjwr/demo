<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="list"
      :row-key="(record) => record.account"
      :pagination="pagination"
      size="small"
      bordered
      @change="handleTableChange"
    >
      <span slot="part" slot-scope="record, index">
        {{
          index.part === "student"
            ? "学生"
            : index.part === "teacher"
            ? "教师"
            : "督导"
        }}
      </span>
      <span slot="action" slot-scope="record, index">
        <a @click="putScore(index)">查看详情</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getScore, scoreCount } from "../../network/common";
import { setScore } from "../../assets/js/mixin";
const columns = [
  {
    title: "身份",
    dataIndex: "part",
    filters: [
      { text: "学生", value: "student" },
      { text: "教师", value: "teacher" },
      { text: "督导", value: "supervisor" },
    ],
    defaultFilteredValue: [],
    scopedSlots: { customRender: "part" },
  },
  {
    title: "评价者编号",
    dataIndex: "account",
  },
  {
    title: "评价者姓名",
    dataIndex: "name",
  },
  {
    title: "分数",
    dataIndex: "score",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "ScoreList",
  mixins: [setScore],
  data() {
    return {
      query: {},
      columns,
      list: [],
      pagination: {},
      loading: true,
      part: [],
    };
  },
  methods: {
    /**
     * 功能函数
     */
    init() {
      this.part = [];
      this.columns[0].defaultFilteredValue = [];
      if (this.query.part != "all") {
        this.part.push(this.query.part);
        this.columns[0].defaultFilteredValue = [this.query.part];
      }
      this.getScoreCount();
      this.getScore();
    },
    handleTableChange(pagination, filters) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.part = filters.part;
      this.getScoreCount();
      this.getScore();
    },
    /**
     * 网络请求函数
     */
    getScoreCount() {
      let obj = {
        tnoed: this.query.tno,
      };
      if (this.part.length != 0) {
        obj.part = JSON.stringify(this.part);
      }
      const formData = this.toFormData(obj);
      scoreCount(formData).then((res) => {
        if (res.code == 0) {
          let pagination = { ...this.pagination };
          pagination.total = res.data;
          pagination.pageSize = 5;
          this.pagination = pagination;
        }
      });
    },
    getScore() {
      let obj = {
        tnoed: this.query.tno,
        page: this.pagination.current ? this.pagination.current : 1,
      };
      if (this.part.length != 0) {
        obj.part = JSON.stringify(this.part);
      }
      const formData = this.toFormData(obj);
      getScore(formData).then((res) => {
        if (res.code == 0) {
          this.list = res.data;
          this.loading = false;
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
