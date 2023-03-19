<template>
  <div>
    <a-button type="primary" @click="backup">备份当前数据</a-button><br />
    <p>👆👆👆👆👆👆👆👆</p>
    <p>请确保已备份系统的当前数据后再重置系统！重置系统操作不可逆！</p>
    <a-button type="danger" @click="reload"> 重置系统 </a-button>
    <a-modal
      :visible="visible"
      title="请选择需要备份的数据表"
      ok-text="提交"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model>
        <a-form-model-item>
          <a-checkbox-group v-model="db">
            <a-checkbox value="classes"> 课表 </a-checkbox>
            <a-checkbox value="selectCourses"> 学生选课表 </a-checkbox>
            <a-checkbox value="reports"> 申报表 </a-checkbox>
            <a-checkbox value="scores"> 评教表 </a-checkbox>
            <a-checkbox value="reviews"> 评审表 </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :visible="visible2"
      title="请输入重置系统四个字来确定操作"
      ok-text="重置"
      cancel-text="取消"
      @ok="_handleOk"
      @cancel="_handleCancel"
    >
      <a-form-model>
        <a-form-model-item>
          <a-input v-model="action" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { Export, reload } from "../../network/admin";
export default {
  name: "Reload",
  data() {
    return {
      visible: false,
      db: ["classes", "selectCourses", "reports", "scores", "reviews"],
      visible2: false,
      action: "",
    };
  },
  methods: {
    backup() {
      this.visible = true;
    },
    reload() {
      this.visible2 = true;
    },
    handleOk() {
      if (this.db.length == 0) {
        this.$message.info("请至少选择一项文档");
        return;
      }
      let obj = {
        classes: false,
        selectCourses: false,
        reports: false,
        scores: false,
        reviews: false,
      };
      this.db.forEach((item) => {
        obj[item] = true;
      });
      const formData = this.toFormData(obj);
      Export(formData).then((res) => {
        if (res.code == 0) {
          res.data.url.forEach((item) => {
            window.open(item);
          });
        }
        this.visible = false;
      });
    },
    handleCancel() {
      this.visible = false;
    },
    _handleOk() {
      if (this.action != "重置系统") {
        this.$message.info("请输入正确的指令文字");
        return;
      }
      reload().then((res) => {
        if (res.code == 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
      this.visible2 = false;
    },
    _handleCancel() {
      this.visible2 = false;
    },
  },
};
</script>

<style></style>
