import axios from 'axios'
export default {
  data () {
    return {
      usersList: [],
      // 总条数
      total: 0,
      // 每页大小
      pagesize: 3,
      // 当前页码
      pagenum: 1,
      // 查询内容
      searchText: '',
      dialogFormVisible: false,
      editUserBoxVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          // pattern 表示使用正则表达式来校验
          /* eslint-disable no-useless-escape */
          { pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1[3|4|5|8]\d{9}$/, message: '手机格式不正确', trigger: 'blur' }
        ]
      },
      // 修改用户信息
      editUserBox: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 校验用户信息
      editUserBoxRules: {
        email: [
          // pattern 表示使用正则表达式来校验
          /* eslint-disable no-useless-escape */
          { pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1[3|4|5|8]\d{9}$/, message: '手机格式不正确', trigger: 'blur' }
        ]
      },
      isShowRoles: false,
      userRoleForm: {
        username: '凯凯',
        // 用户id
        id: '',
        // 角色id
        rid: ''
      },
      userRoleList: []
    }
  },

  created () {
    this.getUserlist()
    this.getRoleList()
  },

  methods: {
    // 获取用户列表
    async getUserlist (pagenum = 1, query = '') {
      const url = ('http://localhost:8888/api/private/v1/users')
      const config = {
        params: {
          query,
          pagenum,
          pagesize: 3
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }
      const res = await axios(url, config)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.usersList = res.data.data.users
        this.total = res.data.data.total
        this.pagenum = res.data.data.pagenum
      } else {
        // 获取失败说明登录状态过期 重新登录
        this.$router.push('/login')
        // 删除登录信息token
        localStorage.removeItem('token')
      }
    },
    changePage (curPage) {
      this.getUserlist(curPage, this.searchText)
    },
    // 查询数据
    search () {
      console.log('查询条件为：', this.searchText)
      // 查询数据的时候，页码应该从第一页开始展示查询的结果数据
      this.getUserlist(1, this.searchText)
    },
    // 展示添加用户对话框
    showDialogForm () {
      this.dialogFormVisible = true
    },
    // 添加用户
    async addUserForm () {
      try {
        await this.$refs.userAddFormRef.validate()
        console.log('添加用户')
        const res = await this.$http.post('/users', this.addForm)
        console.log(res)
        if (res.data.meta.status === 201) {
          this.dialogFormVisible = false
          this.getUserlist()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 重置表单
    resetUserForm () {
      this.$refs.userAddFormRef.resetFields()
    },
    // 更改用户状态
    async changeUserStatus (changeUser) {
      try {
        const res = await axios.put(`users/${changeUser.id}/state/${changeUser.mg_state}`)
        console.log(res)
        this.getUserlist(this.pagenum, this.searchText)
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 删除用户
    async delUser (id) {
      try {
        await this.$confirm('您确定删除该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.$http.delete(`/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        console.log(res)
        // 刷新列表数据
        this.getUserlist()
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 展示更改对话框
    async showEditUserBox (editUsers) {
      this.editUserBoxVisible = true
      console.log(editUsers)
      this.editUserBox = editUsers
    },
    // 关闭对话框，重置表单
    resetEditUserBox () {
      this.$refs.editUserBoxRef.resetFields()
    },
    // 修改用户信息
    async editUser () {
      try {
        await this.$refs.editUserBoxRef.validate()
        const res = await this.$http.put(`/users/${this.editUserBox.id}`, this.editUserBox)
        console.log(res)
        // 更新成功，刷新页面，关闭对话框
        this.getUserlist()
        this.editUserBoxVisible = false
        // 重置表单
        this.$refs.editUserBoxRef.resetFields()
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } catch (e) {
        console.log(e)
      }
    },
    // 展示分配角色对话框
    async showAssginRole (curRole) {
      this.isShowRoles = true
      console.log(curRole)

      const res = await this.$http.get(`/users/${curRole.id}`)

      // console.log(res)
      this.userRoleForm.rid = res.data.data.rid
      this.userRoleForm.username = curRole.username
      this.userRoleForm.id = curRole.id
    },
    async getRoleList () {
      const res = await this.$http.get('/roles')
      console.log(res)
      this.userRoleList = res.data.data
    },
    async assignRole () {
      const { id, rid } = this.userRoleForm
      const res = await this.$http.put(`users/${id}/role`, {
        rid
      })
      // 关闭对话
      this.isShowRoles = false
      // 刷新列表数据
      this.getUserlist(1, this.searchText)
      // 提示
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }
  }
}
