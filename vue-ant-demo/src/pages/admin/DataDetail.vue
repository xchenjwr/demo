<template>
  <div>
    <label>学院:&nbsp;</label>
    <a-select style="width: 150px" v-model="faculty" size="small">
      <a-select-option v-for="item in facultys" :key="item.faculty">{{
        item.faculty
      }}</a-select-option> </a-select
    ><br /><br />
    <a-row>
      <a-col :span="4" v-for="item in rate" :key="item.name">
        <a-statistic
          :title="item.name"
          :value="Number(item.value * 100).toFixed(2)"
          class="demo-class"
        >
          <template #suffix>
            <span>%</span>
          </template>
        </a-statistic>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <div id="main" style="width: 400px; height: 300px"></div>
      </a-col>
      <a-col :span="12" v-show="rate.report_rate.value != 0">
        <br /><br />
        <a-button type="primary" @click="exportTable('reports')">
          导出申报名单 </a-button
        ><br /><br />
        <a-button type="primary" @click="exportTable('approved')">
          导出审核通过名单
        </a-button>
      </a-col>
    </a-row>
    <br /><br />
  </div>
</template>

<script>
import { getFaculty, dataAnalysis, processDoc } from "../../network/admin";
import * as echarts from "echarts";

export default {
  data() {
    return {
      faculty: "",
      facultys: [],
      rate: {
        report_rate: { name: "申报率", value: 0 },
        approve_rate: { name: "审核通过率", value: 0 },
        student_mark_rate: { name: "学生评教率", value: 0 },
        teacher_mark_rate: { name: "教师评教率", value: 0 },
        supervisor_mark_rate: { name: "督导评教率", value: 0 },
        review_rate: { name: "评审通过率", value: 0 },
      },
    };
  },
  watch: {
    faculty: {
      handler: function () {
        this.getData();
      },
    },
  },
  methods: {
    getFaculty() {
      getFaculty().then((res) => {
        if (res.code == 0) {
          this.facultys = [...res.data];
        }
      });
    },
    show() {
      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        // title: {
        //   text: "过程数据展示",
        // },
        // legend: {
        //   data: ["过程数据"],
        // },
        radar: {
          indicator: [
            { name: "申报率", max: 1 },
            { name: "审核通过率", max: 1 },
            { name: "学生评教率", max: 1 },
            { name: "教师评教率", max: 1 },
            { name: "督导评教率", max: 1 },
            { name: "评审通过率", max: 1 },
          ],
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: [
                  this.rate.report_rate.value,
                  this.rate.approve_rate.value,
                  this.rate.student_mark_rate.value,
                  this.rate.teacher_mark_rate.value,
                  this.rate.supervisor_mark_rate.value,
                  this.rate.review_rate.value,
                ],
                name: "过程数据",
                label: {
                  show: true,
                  formatter: function (params) {
                    return String(Number(params.value * 100).toFixed(2)) + "%";
                  },
                },
              },
            ],
          },
        ],
      };

      option && myChart.setOption(option);
    },
    getData() {
      dataAnalysis(this.faculty).then((res) => {
        if (res.code == 0) {
          for (let i in res.data.rate) {
            this.rate[i].value = res.data.rate[i];
          }
          this.show();
        }
      });
    },
    exportTable(db) {
      processDoc(this.faculty, db).then((res) => {
        if (res.code == 0) {
          window.open(res.data.url);
        }
      });
    },
  },
  mounted() {
    this.getFaculty();
  },
};
</script>

<style></style>
