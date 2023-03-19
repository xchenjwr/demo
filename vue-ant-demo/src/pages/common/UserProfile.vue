<template>
  <div>
    <a-descriptions title="用户信息">
      <a-descriptions-item label="编号">
        {{ userInfo.account }}
      </a-descriptions-item>
      <a-descriptions-item label="姓名">
        {{ userInfo.name }}
      </a-descriptions-item>
      <a-descriptions-item label="学院">
        {{ userInfo.faculty }}
      </a-descriptions-item>
      <a-descriptions-item
        :label="userInfo.part === 'student' ? '专业' : '教研室'"
        >{{ userInfo.major }}
      </a-descriptions-item>
      <a-descriptions-item label="身份"
        >{{ getPart }}
        {{ userInfo.IsApprover ? " 审核员" : "" }}
        {{ userInfo.IsSupervisor ? " 督导员" : "" }}
        {{ userInfo.IsAssessor ? " 评审员" : "" }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { vuexObj } from "../../assets/js/mixin";
export default {
  name: "UserProfile",
  mixins: [vuexObj],
};
</script>
