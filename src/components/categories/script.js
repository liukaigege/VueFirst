export default {
  data () {
    return {
      categoriesList: [],
      pagesize: '',
      // 总条数
      total: 0,
      // 当前页
      pagenum: 1,
      loading: false,
      isShowCateBox: false,
      cateBox: {
        cat_name: '',
        cat_pid_arr: []
      },
      cateAddList: []
    }
  },
  created () {
    this.getCategoriesList()
    this.getCateAddList()
  },
  methods: {
    async getCategoriesList (pagenum = 1) {
      // 开启加载
      this.loading = true
      // 发送请求
      const res = await this.$http.get('categories', {
        params: {
          type: 3,
          pagenum,
          pagesize: 5
        }
      })
      console.log(res)
      const {result, pagesize, total, pagenum: curPage} = res.data.data
      this.categoriesList = result
      this.pagesize = pagesize
      this.pagenum = curPage + 1
      this.total = total
      // 关闭加载
      this.loading = false
    },
    changePage (curPage) {
      this.getCategoriesList(curPage)
    },
    showCateBox () {
      this.isShowCateBox = true
    },
    // 获取添加的列表,渲染到对话框中
    async getCateAddList () {
      const res = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(res)
      this.cateAddList = res.data.data
    },
    // 点击确定 添加分类
    async addCate () {
      /* eslint-disable camelcase */
      const {cat_name, cat_pid_arr} = this.cateBox
      const res = await this.$http.post('/categories', {
        cat_name,
        cat_pid: cat_pid_arr[cat_pid_arr.length - 1],
        cat_level: cat_pid_arr.length
      })
      console.log(res)
      // 关闭对话框
      this.isShowCateBox = false
      // 刷新页面
      this.getCategoriesList()
      // 提示消息
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }

  }
}
