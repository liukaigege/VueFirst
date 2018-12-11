// 导入 富文本编辑器 的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  data () {
    return {
      stepActive: 0,
      tabActive: 'basic',
      goodsAddForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        is_promote: false,
        pics: []
      },
      goodsAddList: [],
      uploadHeaders: {
        Authorization: localStorage.getItem('token')
      },
      htmlStr: '<h1 class="title">这是通过 v-html 动态创建出来的元素</h1>'

    }
  },
  created () {
    this.getGoodsAddList()
  },
  methods: {
    /**
     * 切换标签页，step跟着联动
     * @param {object} tab tab标签页的每一项组件
     */
    changeTab (tab) {
      console.log(tab)
      this.stepActive = tab.index - 0
    },
    /**
     * 点击下一步，step步骤条和tab标签页实施联动
     * @param {number} step 步骤条的index值
     * @param {string} tapName tab标签页的name属性值
     */
    nextStep (step, tapName) {
      this.stepActive = step
      this.tabActive = tapName
    },
    async getGoodsAddList () {
      const res = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      this.goodsAddList = res.data.data
    },
    uploadSuccess (response, file, fileList) {
      console.log(response)
      this.goodsAddForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    async addGoods () {
      /* eslint-disable camelcase */

      const {goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        is_promote,
        goods_introduce,
        pics} = this.goodsAddForm

      const res = await this.$http.post('/goods', {
        goods_name,
        goods_cat: goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        is_promote,
        goods_introduce,
        pics
      })
      console.log(res)
      // 添加成功，跳转到goods界面
      this.$router.push('/goods')
      // 提示添加成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg
      })
    }

  }
}
