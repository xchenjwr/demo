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
      <span slot="time" slot-scope="text">
        {{ formatDate(Number(text)) }}
      </span>
      <span slot="action" slot-scope="record, index">
        <a @click="datail(index)">查看详情</a>
        <a-divider type="vertical" />
        <a :class="{ weather: !apiStatus.approveApi }" @click="approve(index)"
          >审核</a
        >
      </span>
    </a-table>
    <a-modal
      :visible="visible"
      :title="'关于' + obj.tname + '申报的审核'"
      ok-text="提交"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="form">
        <a-form-model-item label="审核意见">
          <a-radio-group v-model="form.option">
            <a-radio value="1">审核通过</a-radio>
            <a-radio value="-1">审核不通过</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="审核理由">
          <a-textarea
            v-model="form.content"
            :max-length="100"
            placeholder="请输入审核理由(100字以内)"
            rows="4"
            style="resize: none; margin-top: 5px"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { reportList, reportCount, approver } from "../../network/teacher";
import { setScore } from "../../assets/js/mixin";
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
    title: "申请时间",
    dataIndex: "time",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "Approve",
  mixins: [setScore],
  data() {
    return {
      columns,
      list: [],
      pagination: {},
      loading: true,
      visible: false,
      obj: {},
      form: {
        option: 0,
        content: "",
      },
    };
  },
  created() {
    this.getReportList();
  },
  methods: {
    /**
     * 功能函数
     */
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getReportList();
    },
    handleCancel() {
      this.visible = false;
    },
    approve(index) {
      this.obj = index;
      this.visible = true;
    },
    /**
     * 网络请求
     */
    getReportList() {
      reportCount()
        .then((res) => {
          if (res.code != 0) {
            this.$message.error(res.msg);
            return;
          }
          let pagination = { ...this.pagination };
          pagination.total = res.data;
          pagination.pageSize = 10;
          if (
            pagination.current > 1 &&
            pagination.current === pagination.total / pagination.pageSize + 1
          ) {
            pagination.current -= 1;
          }
          this.pagination = pagination;
        })
        .then(() => {
          reportList(this.pagination.current).then((res) => {
            this.loading = false;
            if (res.code != 0) {
              this.$message.error(res.msg);
              return;
            }
            this.list = res.data;
          });
        });
    },

    handleOk() {
      if (this.form.option == 0 || this.form.content == "") {
        this.$message.info("审核意见和审核理由不能为空");
        return;
      }
      const obj = {
        tno: this.obj.tno,
        approved: this.form.option,
        approveContent: this.form.content,
      };
      const formData = this.toFormData(obj);
      approver(formData).then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
          this.getReportList();
          this.visible = false;
        }
      });
    },
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
