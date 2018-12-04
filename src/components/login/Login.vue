<template>
  <el-row class="login" type="flex" justify="center" align="middle" >
    <el-col  :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form :label-position="labelPosition" :model="loginForm" :rules="rules" ref="loginForm" label-width="100%" class="demo-loginForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loginIn">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
// 引入axos
import axios from 'axios'
export default {
  data () {
    return {
      labelPosition: 'top',
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginIn () {
      // console.log(this.$refs)
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          return false
        }
        // 发送ajax请求
        axios.post('http://localhost:8888/api/private/v1/login', this.loginForm).then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            // 本地存储身份令牌token值
            localStorage.setItem('token', res.data.data.token)
            // 1.登录成功跳转到主页
            this.$router.push('/home')
            // 2.提示登陆成功信息
            this.$message({
              message: res.data.meta.msg,
              type: 'success',
              duration: 1000
            })
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: 'error',
              duration: 1000
            })
          }
        })
      })
    },
    resetForm (loginForm) {
      // console.log('重置成功')
      this.$refs[loginForm].resetFields()
    }
  }
}
</script>

<style>
  .el-form--label-top .el-form-item__label{
    padding: 0;
  }
  .demo-loginForm {
    min-width: 400px;
    padding: 20px;
    border-radius: 15px;
    margin: 200px auto;
    background-color: #fff;
  }
  .login{
    height: 100%;
    background-color: #2D434C;
  }
</style>
