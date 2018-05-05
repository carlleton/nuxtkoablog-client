<template>
  <div>
    <el-form ref="form" :model="user" label-width="80px">
      <el-form-item label="用户名：">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <el-input v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {

    }
  }
}
</script>
<style scoped>

</style>