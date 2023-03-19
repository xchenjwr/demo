<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="list"
      :rowKey="(record) => record.tno"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="action" slot-scope="record, index">
        <a @click="datail(index)">查看详情</a>
        <a-divider type="vertical" />
        <a
          :class="{ weather: !apiStatus.teacherEvaluationsApi }"
          @click="putScore(index)"
          >{{ index.mark ? "修改评分" : "评分" }}</a
        >
      </span>
    </a-table>
  </div>
</template>

<script>
import { setScore } from "../../assets/js/mixin";
import { teacherList } from "../../network/student";
const columns = [
  {
    title: "教师编号",
    dataIndex: "tno",
  },
  {
    title: "教师姓名",
    dataIndex: "tname",
  },
  {
    title: "授课课程",
    dataIndex: "cname",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TeacherList",
  mixins: [setScore],
  data() {
    return {
      columns,
      list: [],
      loading: true,
    };
  },
  methods: {
    /**
     * 功能函数
     */
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getTeacherList();
    },
    /**
     * 网络请求
     */
    getTeacherList() {
      teacherList().then((res) => {
        this.loading = false;
        if (res.code != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.list = res.data;
      });
    },
  },
  activated() {
    this.getTeacherList();
  },
};
</script>
