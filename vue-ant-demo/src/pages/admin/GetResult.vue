<template>
  <div>
    <label>学院:&nbsp;</label>
    <a-select style="width: 150px" v-model="faculty" size="small">
      <a-select-option v-for="item in facultys" :key="item.faculty">{{
        item.faculty
      }}</a-select-option> </a-select
    ><br /><br />
    <span v-for="item in perData" :key="item.prize">
      <label>{{ item.prize }}:&nbsp;</label>
      <a-input-number
        v-model="item.data"
        :min="0"
        :max="item.limit"
        style="width: 50px"
      ></a-input-number
      >&nbsp;<b>％</b>&nbsp;&nbsp;</span
    ><br /><br />
    <a-button type="primary" @click="getResult"> 导出分数表 </a-button>
  </div>
</template>

<script>
import { getFaculty, getResult } from "../../network/admin";
export default {
  name: "GetResult",
  data() {
    return {
      faculty: "",
      facultys: [],
      perData: [
        {
          prize: "一等奖",
          limit: 30,
          data: 0,
        },
        {
          prize: "二等奖",
          limit: 30,
          data: 0,
        },
        {
          prize: "三等奖",
          limit: 30,
          data: 0,
        },
      ],
    };
  },
  methods: {
    getFaculty() {
      getFaculty().then((res) => {
        if (res.code == 0) {
          this.facultys = [...res.data];
        }
      });
    },
    getResult() {
      const obj = {
        faculty: this.faculty,
        data: JSON.stringify(
          this.perData.map((item) => {
            return item.data + "%";
          })
        ),
      };
      const formData = this.toFormData(obj);
      getResult(formData).then((res) => {
        if (res.code == 0) {
          window.open(res.data.url);
        }
      });
    },
  },
  created() {
    this.getFaculty();
  },
};
</script>
