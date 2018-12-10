
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async  getRightsList () {
      const res = await this.$http.get(`/rights/list`)
      console.log(res)
      this.rightsList = res.data.data
    }
  }
}
