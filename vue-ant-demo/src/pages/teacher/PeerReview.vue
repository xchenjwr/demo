<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="list"
      :rowKey="(record) => record.tno"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      size="small"
      bordered
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
import { peerCount, peerList } from "../../network/teacher";
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
    title: "申请课程",
    dataIndex: "cname",
  },
  {
    title: "上课时间",
    dataIndex: "time",
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "PeerReview",
  mixins: [setScore],
  data() {
    return {
      columns,
      list: [],
      pagination: {},
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
      this.getPeerList();
    },
    /**
     * 网络请求
     */
    getPeerCount() {
      peerCount().then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
          return;
        }
        let pagination = { ...this.pagination };
        pagination.total = res.data;
        pagination.pageSize = 10;
        this.pagination = pagination;
      });
    },
    getPeerList() {
      peerList(this.pagination.current).then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.list = res.data;
        this.loading = false;
      });
    },
  },
  created() {
    this.getPeerCount();
  },
  activated() {
    this.getPeerList();
  },
};
</script>
<style lang="less" scoped>
.weather {
  color: gray;
  cursor: pointer;
  pointer-events: none;
}
</style>
