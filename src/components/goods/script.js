export default {
  data () {
    return {
      goodsData: [],
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: ''
    }
  },
  created () {
    console.log(this.$route.params.page)

    // const curPage = this.$route.params.page
    this.getGoodsList(this.$route.params.page)
  },
  watch: {
    $route (to, from) {
      // console.log(to.params.page)
      this.getGoodsList(to.params.page)
    }
  },
  methods: {
    async getGoodsList (pagenum = 1) {
      const res = await this.$http.get('/goods', {
        params: {
          query: '',
          pagenum,
          pagesize: this.pagesize
        }
      })
      console.log(res)
      const {pagenum: currPage, goods, total} = res.data.data
      this.goodsData = goods
      this.pagenum = currPage - 0
      this.total = total
    },
    changePage (curPage) {
      // console.log(curPage)
      this.getGoodsList(curPage)
    }
  }
}
