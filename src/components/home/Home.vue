<template>
  <el-container class="container">
    <el-header class="header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="6"><img src="@/assets/images/logo.png" alt=""></el-col>
          <el-col :span="6"><h2>电商后台管理系统</h2></el-col>
          <el-col :span="6" class="header-right">
            <span>欢迎上海前端28期星曜会员</span>
            <a href="javascript:;" style="color:#B07A17" @click.prevent="logOut">退出</a>
          </el-col>
        </el-row>
      </el-header>

    <el-container>
      <el-aside class="aside" width="200px">
        <el-row class="tac">
          <el-col>
            <el-menu
              :router='true'
              :default-active="this.$route.path.slice(1)"
              :unique-opened="true"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="level1.id + ''" v-for="level1 in menuList" :key="level1.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{level1.authName}}</span>
                </template>
                <el-menu-item :index="level2.path" v-for="level2 in level1.children" :key="level2.id">
                <i class="el-icon-menu"></i>
                  <span>{{level2.authName}}</span>
                </el-menu-item>
              </el-submenu>

              <!-- <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限管理</span>
                </template>
                  <el-menu-item index="/roles">
                    <i class="el-icon-menu"></i>
                    <span>角色列表</span>
                  </el-menu-item>
                  <el-menu-item index="/rights">
                    <i class="el-icon-menu"></i>
                    <span>权限列表</span>
                  </el-menu-item>
              </el-submenu> -->
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>

      <el-main class="main">
        <!-- 用户页出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logOut () {
      this.$confirm('您确定退出吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // 退出成功跳转到登录页
        this.$router.push('/login')
        // 删除token值
        localStorage.removeItem('token')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    async getMenuList () {
      const res = await this.$http.get(`/menus`)
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.menuList = data
      }
    }

  }
}
</script>
<style>
 .container{
   background-color: #EAEEF1;
   height: 100%;
  }
  .header{
    background-color: #B3C1CD;
    height: 60px;
    line-height: 60px;
  }
  .header img{
    width: 180px;
    vertical-align: middle;
  }
  .header h2{
    font-size: 30px;
    text-align: center;
    color: #fff;
  }
  .header span,a {
    font-weight: bold;
  }
  .header-right{
    text-align: right;
  }
  .aside{
    background-color: #545C64;
  }
  .mian{
    background-color: #EAEEF1;
  }
</style>
