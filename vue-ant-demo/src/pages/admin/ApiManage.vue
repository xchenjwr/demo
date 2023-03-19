<template>
  <div>
    <a-divider orientation="left">管理功能开放</a-divider>
    <a-row type="flex" justify="space-around">
      <a-col :span="4" v-for="item in apiType" :key="item.value">
        {{ item.title }}<br />
        <a-switch
          v-model="item.checked"
          @change="onChange($event, item.value)"
        />
      </a-col>
    </a-row>
    <a-divider orientation="left">管理评教标准</a-divider>
    <label>角色:&nbsp;</label>
    <a-select style="width: 65px" v-model="part" size="small">
      <a-select-option key="student">学生</a-select-option>
      <a-select-option key="teacher">教师</a-select-option> </a-select
    >&nbsp;
    <label>课程类型:&nbsp;</label>
    <a-select style="width: 85px" v-model="type" size="small">
      <a-select-option key="theory">理论课</a-select-option>
      <a-select-option key="test">实验课</a-select-option> </a-select
    ><br /><br />
    <a-button type="primary" @click="submit">提交</a-button
    >&nbsp;&nbsp;<a-button @click="handleAdd"> 添加标准 </a-button>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      size="small"
      bordered
    >
      <template
        v-for="col in ['attr', 'standard', 'weight']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-divider type="vertical" />
            <a @click="() => cancel(record.key)">取消</a>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
              >编辑</a
            >
            <a-divider type="vertical" />
            <a :disabled="editingKey !== ''" @click="() => onDelete(record.key)"
              >删除</a
            >
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { vuexObj } from "../../assets/js/mixin";
import { apiManage, standardManage } from "../../network/admin";
import { getApiStatus, getStandard } from "../../network/common";

const apiType = [
  { title: "申报功能", value: "reportApi", checked: false },
  { title: "审核功能", value: "approveApi", checked: false },
  { title: "评教功能", value: "teacherEvaluationsApi", checked: false },
  { title: "评审功能", value: "assessApi", checked: false },
];
const columns = [
  {
    title: "评价属性",
    dataIndex: "attr",
    scopedSlots: { customRender: "attr" },
    width: "8%",
  },
  {
    title: "评价标准",
    dataIndex: "standard",
    scopedSlots: { customRender: "standard" },
  },
  {
    title: "权重占比",
    dataIndex: "weight",
    scopedSlots: { customRender: "weight" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: "11%",
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
export default {
  name: "ApiManage",
  mixins: [vuexObj],
  data() {
    return {
      apiType,
      data: [],
      cacheData: [],
      columns,
      editingKey: "",
      part: "student",
      type: "theory",
      standard,
    };
  },
  watch: {
    part: {
      handler: function () {
        this.data = [...this.standard[this.part][this.type]];
      },
    },
    type: {
      handler: function () {
        this.data = [...this.standard[this.part][this.type]];
      },
    },
  },
  methods: {
    /**
     * 网络请求
     */
    onChange(checked, api) {
      const obj = {
        key: api,
        value: checked,
      };
      const formData = this.toFormData(obj);
      apiManage(formData).then((res) => {
        getApiStatus().then((res) => {
          this.setApiStatus(res);
          this.init();
        });
      });
    },
    getStandard() {
      getStandard().then((res) => {
        this.standard = { ...res.standard };
        this.data = [...this.standard[this.part][this.type]];
        this.cacheData = this.data.map((item) => ({ ...item }));
      });
    },
    init() {
      this.apiType.forEach((item) => {
        item.checked = this.apiStatus[item.value];
      });
      this.getStandard();
    },
    submit() {
      if (this.editingKey !== "") {
        this.$message.error("请先修改完毕");
        return;
      }
      let sum = 0;
      this.data.forEach((item) => {
        sum += Number(item.weight.slice(0, item.weight.length - 1));
      });
      if (sum != 100) {
        this.$message.error("占比和应为100%");
        return;
      }
      const obj = {
        part: this.part,
        type: this.type,
        standard: JSON.stringify(this.data),
      };
      const formData = this.toFormData(obj);
      standardManage(formData).then((res) => {
        this.$message.success(res.msg);
        this.getStandard();
      });
    },
    /**
     * 功能函数
     */
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      this.data.forEach((item) => {
        let num = Number(item.weight.slice(0, item.weight.length - 1));
        if (num < 0 || num > 100) {
          this.$message.error("占比在0~100%之间");
          item.weight = "0%";
        }
        if (item.weight[item.weight.length - 1] != "%") {
          item.weight = item.weight + "%";
        }
      });
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item) => key === item.key);
      const targetCache = newCacheData.find((item) => key === item.key);
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.data = newData;
      }
    },
    handleAdd() {
      let count;
      if (this.data.length > 0) {
        count = Number(this.data[this.data.length - 1].key) + 1;
      } else {
        count = 0;
      }
      const newData = {
        key: count.toString(),
        attr: "评价属性",
        standard: `评教标准详细内容`,
        weight: "0%",
      };
      this.data.push(newData);
      this.cacheData = this.data.map((item) => ({ ...item }));
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter((item) => item.key !== key);
    },
  },
  created() {
    this.init();
  },
};
</script>
