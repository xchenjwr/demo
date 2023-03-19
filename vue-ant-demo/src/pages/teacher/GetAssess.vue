<template>
  <div>
    <div v-if="assessData.tt != 0 || assessData.ff != 0">
      <a-statistic
        title="评审投票(赞同/反对)"
        :precision="0"
        :value="assessData.tt"
      >
        <template #suffix>
          <span> / {{ assessData.ff }}</span>
        </template> </a-statistic
      ><br />
      <a-row
        v-if="assessData.tt != 0 || assessData.ff != 0"
        type="flex"
        justify="space-around"
      >
        <a-col :span="10">
          <h2>赞同者意见</h2>
          <div v-for="(item, index) in assessData.ttData" :key="index">
            <b>评审员:</b>
            <p style="color: green">{{ item.content }}</p>
          </div>
        </a-col>
        <a-col :span="10">
          <h2>反对者意见</h2>
          <div v-for="(item, index) in assessData.ffData" :key="index">
            <b>评审员:</b>
            <p style="color: red">{{ item.content }}</p>
          </div>
        </a-col>
      </a-row>
    </div>
    <Info v-else :title="'暂无评审结果'" />
  </div>
</template>

<script>
import { getAssess } from "../../network/teacher";
import Info from "../extra/Info";
export default {
  name: "Result",
  components: { Info },
  data() {
    return {
      assessData: {},
    };
  },
  methods: {
    getAssessResult() {
      getAssess().then((res) => {
        if (res.code == 0) {
          this.assessData = { ...res.data };
        }
      });
    },
  },
  created() {
    this.getAssessResult();
  },
};
</script>

<style></style>
