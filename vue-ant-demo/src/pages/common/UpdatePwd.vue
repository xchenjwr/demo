<template>
  <div>
    <a-form-model
      layout="vertical"
      ref="updateform"
      :model="form"
      @submit="handleSubmit"
      @submit.native.prevent
      style="width: 350px"
    >
      <a-form-model-item label="原密码">
        <a-input-password
          type="password"
          v-model="form.password"
          placeholder="请输入原密码"
        />
      </a-form-model-item>
      <a-form-model-item label="新密码">
        <a-input-password
          type="password"
          v-model="form.newPassword"
          placeholder="请输入新密码"
        />
      </a-form-model-item>
      <a-form-model-item label="重复新密码">
        <a-input-password
          type="password"
          v-model="form.reNewPassword"
          placeholder="请重复输入的新密码"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit"> 确定修改密码 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { updatePassword } from "../../network/common";
export default {
  name: "UpdatePwd",
  data() {
    return {
      form: {
        password: "",
        newPassword: "",
        reNewPassword: "",
      },
    };
  },
  methods: {
    /**
     * 功能函数
     */
    formValidate() {
      if (this.form.password.length < 6 || this.form.password.length > 16) {
        return {
          code: 1,
          msg: "请输入长度为6~16位的原密码",
        };
      }
      if (
        this.form.newPassword.length < 6 ||
        this.form.newPassword.length > 16
      ) {
        return {
          code: 1,
          msg: "请输入长度为6~16位的新密码",
        };
      }
      if (this.form.newPassword != this.form.reNewPassword) {
        return {
          code: 1,
          msg: "两次新密码输入不一致",
        };
      }
      return {
        code: 0,
      };
    },
    /**
     * 网络请求
     */
    handleSubmit() {
      const result = this.formValidate();
      if (result.code != 0) {
        this.$message.error(result.msg);
        return;
      }
      const obj = {
        password: this.form.password,
        newPassword: this.form.newPassword,
      };
      const formData = this.toFormData(obj);
      updatePassword(formData).then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
        } else {
          this.$message.success(res.msg);
          this.$refs.updateform.resetFields();
        }
      });
    },
  },
};
</script>
