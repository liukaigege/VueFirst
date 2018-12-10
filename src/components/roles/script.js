
export default {
  data () {
    return {
      rolesList: [],
      isShowRights: false,
      assignRightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },

  created () {
    this.getRolesList()
    this.getAssignRights()
  },
  methods: {
    async getRolesList () {
      const res = await this.$http.get(`/roles`)
      console.log(res)
      this.rolesList = res.data.data
    },
    // 显示权限列表对话框
    assignRights (rights) {
      console.log(rights)
      this.isShowRights = true
      // 暂存roleId
      this.roleId = rights.id
      // 树形结构显示后，设置选中的树形分支
      this.$nextTick(() => {
        // 只有最后一个节点选中时，上层的才会逐级选中
        /*
        // 直接获取tree会报错：Cannot read property 'setCheckedKeys' of undefined
        获取不到 tree 原因说明：
        1 tree是在对话框中的，而对话框默认是隐藏的，隐藏是说组件没有被选中
        2 isShowRoleDialog 是控制对话框展示和隐藏的，让 isShowRoleDialog = true，表示展示对话框，但是 Vue 中是 异步DOM更新 所以，数据变化后，DOM没有立即更新

        可以通过 $nextTick() 获取到更新后的DOM内容

        v-if 隐藏元素时，元素不会被编译解析； v-show 隐藏元素时，元素已经编译解析了
      */
        console.log(this.$refs.tree)
        // 获取最底层的children的id，由于可以选中多个 所以理应是个数组
        const checkedKeys = []
        // 遍历第一层
        rights.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkedKeys.push(level3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(checkedKeys)
      })

      // .setCheckedKeys([3])
    },
    // 获取对话框的数据
    async getAssignRights () {
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      this.assignRightsList = res.data.data
    },
    // 点击确定按钮，更新更改状态
    async assignRightsForm () {
      // 拿到全选中的key和半选中的key
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const getHalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 把选中的key组合到一起，且全部更新
      const allKeys = [...checkedKeys, ...getHalfCheckedKeys]
      // 发送请求 并授权
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: allKeys.join(',')
      })
      console.log(res)
      // 更新完成，关闭对话框
      this.isShowRights = false
      // 刷新页面
      this.getRolesList()

      // 弹出提示消息
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }
  }
}
