<template>
  <div class="main">
    <div class="loginbox">
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item>
          <h2>登陆</h2>
        </el-form-item>
        <el-form-item label="服务器：">
          <el-input v-model="user.serverurl"></el-input>
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input type="password" v-model="user.userpass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登陆</el-button>
        </el-form-item>
      </el-form>
      <div>
        server:　{{filename}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        serverurl: 'http://localhost:3001',
        username: 'admin',
        userpass: '123456'
      }
    }
  },
  computed: {
    filename () {
      return this.$service.getFileName()
    }
  },
  mounted () {
    //
  },
  methods: {
    async login () {
      let url = this.user.serverurl + '/api/users/login'
      let params = {
        username: this.user.username,
        userpass: this.user.userpass
      }
      let res = await this.$http.post(url, params)
      if (res.data && res.data.code === 200) {
        this.$message('登陆成功！')
        // 检查数据库，如果没有则将token、用户名、serverurl写入数据库
      } else {
        this.$message.error('登陆失败哦~~')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginbox{
    width: 400px;
    border: 1px solid rgba(0,0,0,0.1);
    padding: 10px;
  }
}
</style>