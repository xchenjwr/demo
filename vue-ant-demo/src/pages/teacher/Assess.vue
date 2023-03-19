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
      <span slot="score" slot-scope="record, index">
        {{ index.score.toFixed(2) }}
      </span>
      <span slot="action" slot-scope="record, index">
        <a @click="datail(index)">查看详情</a>
        <a-divider type="vertical" />
        <a :class="{ weather: !apiStatus.assessApi }" @click="assess(index)"
          >评审</a
        >
      </span>
    </a-table>
    <a-modal
      :visible="visible"
      :title="'关于' + obj.tname + '申报的评审'"
      ok-text="提交"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model :model="form">
        <a-form-model-item label="评审意见">
          <a-radio-group v-model="form.option">
            <a-radio value="1">赞成</a-radio>
            <a-radio value="0">反对</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="评审理由">
          <a-textarea
            v-model="form.content"
            :max-length="100"
            placeholder="请输入评审理由(100字以内)"
            rows="4"
            style="resize: none; margin-top: 5px"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setScore } from "../../assets/js/mixin";
import { assessCount, assessList, assess } from "../../network/teacher";
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
    title: "平均分",
    dataIndex: "score",
    scopedSlots: { customRender: "score" },
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "Assess",
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
        option: -1,
        content: "",
      },
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
      this.getAssessList();
    },
    assess(index) {
      this.obj = index;
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    /**
     * 网络函数
     */
    getAssessList() {
      assessCount()
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
          assessList(this.pagination.current).then((res) => {
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
      if (this.form.option == -1 || this.form.content == "") {
        this.$message.info("评审表决和评审意见不能为空");
        return;
      }
      let obj = {
        tnoed: this.obj.tno,
        ...this.form,
      };
      const formData = this.toFormData(obj);
      assess(formData).then((res) => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          this.getAssessList();
          this.visible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
  created() {
    this.getAssessList();
  },
};
</script>
