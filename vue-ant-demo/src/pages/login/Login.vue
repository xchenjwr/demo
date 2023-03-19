<template>
  <div class="login_class">
    <a-card class="login_card" :bordered="false">
      <h3>教师教学质量奖在线申报与评审系统</h3>
      <a-form-model
        layout="vertical"
        :model="form"
        @submit="handleSubmit"
        @submit.native.prevent
      >
        <a-form-model-item>
          <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="4">类型:</a-col>
            <a-col :span="20">
              <a-radio-group
                v-model="form.part"
                default-value="student"
                button-style="solid"
              >
                <a-radio-button value="student">学生</a-radio-button>
                <a-radio-button value="teacher">教师</a-radio-button>
                <a-radio-button value="admin">管理员</a-radio-button>
              </a-radio-group>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item>
          <a-input v-model="form.account" placeholder="请输入账号">
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-input-password
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item>
          <a-row>
            <a-col :span="16">
              <a-input v-model="form.code" placeholder="请输入验证码">
                <a-icon
                  slot="prefix"
                  type="code"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </a-input>
            </a-col>
            <a-col
              :span="8"
              class="code"
              @click="getCode"
              title="点击切换验证码"
              ><span v-html="codeData.data"></span
            ></a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" html-type="submit" block :loading="loading">
            Login
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import { getCode, login, getApiStatus } from "../../network/common";
import { vuexObj } from "../../assets/js/mixin";
export default {
  name: "Login",
  mixins: [vuexObj],
  data() {
    return {
      form: {
        account: "",
        password: "",
        part: "student",
        code: "",
      },
      codeData: {},
      loading: false,
    };
  },
  methods: {
    /**
     * 功能函数
     */
    formValidate() {
      if (this.form.account == "") {
        return {
          code: 1,
          msg: "账号不能为空",
        };
      }
      if (this.form.password.length < 6 || this.form.password.length > 16) {
        return {
          code: 1,
          msg: "请输入长度为6~16位的密码",
        };
      }
      if (this.form.code.length != 4) {
        return {
          code: 1,
          msg: "请输入长度为4验证码",
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
      if (this.codeData.text.toLowerCase() != this.form.code.toLowerCase()) {
        this.$message.error("验证码不正确");
        return;
      }
      const obj = {
        part: this.form.part,
        account: this.form.account,
        password: this.form.password,
      };
      let formData = this.toFormData(obj);
      this.loading = true;
      login(formData).then((res) => {
        this.loading = false;
        if (res.code == 0) {
          this.$message.success(res.msg);
          let storage = window.sessionStorage;
          storage.token = res.token;
          this.login(res.data);
          getApiStatus().then((_res) => {
            this.setApiStatus(_res);
            this.$router.push(res.data.part);
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getCode() {
      getCode().then((res) => {
        this.codeData = res;
      });
    },
  },
  created() {
    this.getCode();
  },
};
</script>

<style lang="less" scoped>
.login_class {
  height: 100%;
  background: url("../../assets/img/home.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 50% 0;
  padding: 30px;
  h3 {
    margin-bottom: 10px;
  }
  .login_card {
    position: absolute;
    top: 15%;
    right: 5%;
    width: 320px;
    height: 350px;
  }
  .code {
    cursor: pointer;
  }
}
</style>
