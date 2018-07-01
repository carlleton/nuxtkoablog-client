<template>
  <div>
    <div class="catestit">
      <i class="fa fa-book fa-left"></i>
      笔记本
      <i class="fa fa-plus right cateadd" @click="addCate()"></i>
    </div>
    <div class="cates" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <ul>
        <li v-for="cate in cates" :key="cate.id">
          <p :class="{cur:cateid===cate.id}" @click="selectcate(cate)" @contextmenu="showContextMenu(cate)" @dblclick.prevent.stop="changeEdit(cate)">
            <span>
              <template v-if="cate.childs">
                <i class="fa fa-plus-square-o" v-show="!cate.childshow" @click.stop="cate.childshow=true"></i>
                <i class="fa fa-minus-square-o" v-show="cate.childshow" @click.stop="cate.childshow=false"></i>
              </template>
              <i class="catename" v-else></i>
              <template v-if="!cate.edit">
                {{cate.catename}}
              </template>
              <template v-else>
                <input class="editbox" type="text" v-model="cate.catename" :ref="'input_'+cate.id" @blur="savename(cate)" @keyup.enter="savename(cate)" />
              </template>
            </span>
            <i class="fa fa-cog set" @click="showContextMenu(cate)" v-if="cate.id!=0"></i>
          </p>
            <ul v-if="cate.childs && cate.childs.length > 0" v-show="cate.childshow">
              <li v-for="child in cate.childs" :key="child.id" @contextmenu="showContextMenu(child)">
                <p :class="{cur:cateid==child.id}" @click="selectcate(child)">
                <span @dblclick.prevent="changeEdit(child)">
                  <template v-if="!child.edit">
                    {{child.catename}}
                  </template>
                  <template v-else>
                    <input class="editbox" type="text" v-model="child.catename" :ref="'input_'+child.id" @blur="savename(child)" @keyup.enter="savename(child)" />
                  </template>
                </span>
                <i class="fa fa-cog set" @click="showContextMenu(child)"></i>
                </p>
              </li>
            </ul>
        </li>
      </ul>
      <contextmenu ref="contextmenu" :point="contextmenuData.point" :menus="contextmenuData.menus" :isShow.sync="contextmenuData.isShow"></contextmenu>
    </div>
  </div>
</template>
<script>
import contextmenu from './contextmenu'

export default {
  props: ['cateid', 'catename', 'catetag'],
  data () {
    return {
      loading: false,
      cates: [],
      contextmenuData: {
        point: {},
        menus: [],
        isShow: false
      }
    }
  },
  mounted () {
    this.getCatesData()
    this.$on('selectFirstCate', () => {
      var cate = this.cates[1]
      this.selectcate(cate)
    })
  },
  methods: {
    // 获取分类列表
    async getCatesData () {
      this.loading = true
      let catesresult = await this.$service.notecates.list2({}, {path: 1})
      // console.log(catesresult)
      var data = catesresult
      var cates = []
      var temps = []
      for (var i = 0, n = data.length; i < n; i++) {
        data[i].edit = false
        data[i].oldcatename = data[i].catename
        if (data[i].pid === '0') {
          cates.push(data[i])
        } else {
          var maxi = cates.length - 1
          if (data[i].pid === cates[maxi].id) {
            if (cates[maxi].childs === undefined) {
              cates[maxi].childshow = false
              cates[maxi].childs = []
            }
            cates[maxi].childs.push(data[i])
          } else {
            temps.push(data[i])
          }
        }
      }
      this.cates = [{
        id: 0,
        catename: '最新'
      }, {
        id: '',
        tag: 'copy',
        catename: '待处理'
      }].concat(cates.concat(temps))
      this.loading = false
    },
    // 选择某一项
    selectcate (cate) {
      this.$emit('update:cateid', cate.id)
      this.$emit('update:catename', cate.catename)
      this.$emit('update:catetag', cate.tag)
      this.$nextTick(() => {
        this.$emit('updatenotes')
      })
    },
    // 右键菜单
    showContextMenu (cate) {
      event.preventDefault()
      event.stopPropagation()
      if (cate.isAdd) {
        return
      }
      if (cate.id === 0 || !cate.id) {
        return
      }
      var x = event.clientX
      var y = event.clientY
      this.contextmenuData.point = {
        x: x,
        y: y
      }
      this.contextmenuData.menus = [
        {
          name: '添加子分类',
          ico: 'fa fa-sitemap',
          fnHandler: () => {
            this.addCate(cate)
            this.contextmenuData.isShow = false
          }
        },
        {
          name: '上移',
          ico: 'fa fa-arrow-up',
          fnHandler: () => {
            this.do_up(cate)
            this.contextmenuData.isShow = false
          }
        },
        {
          name: '下移',
          ico: 'fa fa-arrow-down',
          fnHandler: () => {
            this.do_down(cate)
            this.contextmenuData.isShow = false
          }
        },
        {
          name: '删除',
          ico: 'fa fa-remove',
          fnHandler: () => {
            this.$confirm('您确认要删除吗？如有下级菜单将级联删除', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.contextmenuData.isShow = false
              this.do_del(cate)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消删除'
              })
            })
          }
        }
      ]
      this.contextmenuData.isShow = true
    },
    // 上移
    async do_up (cate) {
      if (cate.orderid === 1) {
        this.$message({
          type: 'info',
          message: '已经是第一个，不需要上移了'
        })
        return
      }
      this.loading = true
      var params = {
        id: cate.id
      }
      let res = await this.$service.notecates.up(params)
      if (res.rows > 0) {
        this.$message({
          type: 'success',
          message: '更新' + res.rows + '条'
        })
        this.getCatesData()
      } else {
        this.$message({
          type: 'error',
          message: '无法上移'
        })
      }
      this.loading = false
    },
    // 下移
    async do_down (cate) {
      this.loading = true
      var params = {
        id: cate.id
      }
      let res = await this.$service.notecates.down(params)
      if (res.rows > 0) {
        this.$message({
          type: 'success',
          message: '更新' + res.rows + '条'
        })
        this.getCatesData()
      } else {
        this.$message({
          type: 'error',
          message: '无法下移'
        })
      }
      this.loading = false
    },
    // 删除操作
    async do_del (cate) {
      this.loading = true
      let rows = await this.$service.notecates.del(cate.id)
      if (rows > 0) {
        this.$message({
          type: 'success',
          message: '删除' + rows + '条'
        })
        this.getCatesData()
      } else {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
      this.loading = false
    },
    // 名称更改后自动保存
    async savename (cate) {
      if (cate.oldcatename === cate.catename) {
        cate.edit = false
        if (cate.isAdd) { // 新添加的无添加内容时删除
          if (cate.pid === '0') {
            this.cates.splice(2, 1)
          } else {
            for (let i = 0, n = this.cates.length; i < n; i++) {
              if (this.cates[i].id === cate.pid) {
                this.cates[i].childs.splice(0, 1)
                break
              }
            }
          }
        }
        return
      }
      let docs = await this.$service.notecates.updatedoc(cate)
      if (docs.length > 0) {
        this.$message({
          message: '更新成功',
          duration: 2000
        })
        cate.oldcatename = cate.catename
        cate.edit = false
      }
    },
    // 编辑
    changeEdit (cate) {
      if (cate.id !== 0 && cate.id) {
        cate.edit = true
      }
    },
    addCate (pCate) { // 添加根目录分类
      let id = this.$service.notecates.nextId()
      let newCate = {
        _id: id,
        id: id,
        edit: true,
        catename: '',
        oldcatename: '',
        pid: '0',
        orderid: 0,
        path: '',
        pidpath: '',
        isAdd: true
      }
      if (pCate) {
        newCate.pid = pCate.id
        newCate.path = pCate.path || ''
        newCate.pidpath = (pCate.pidpath || '') + pCate.id + ','
        if (pCate.childs === undefined) {
          pCate.childs = []
        }
        pCate.childshow = true
        if (pCate.childs.length === 0) {
          pCate.childs.push(newCate)
        } else {
          pCate.childs.unshift(newCate)
        }
        this.$set(pCate, 'childs', pCate.childs)
      } else {
        this.cates.splice(2, 0, newCate)
      }
      this.$nextTick(() => {
        console.log(this.$refs)
        for (let i in this.$refs) {
          console.log(this.$refs[i])
        }
        console.log(this.cates)
        console.log(this.$refs['input_' + id])
        this.$refs['input_' + id][0].focus()
      })
    }
  },
  components: {
    contextmenu
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        el.focus()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.catestit{
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  .cateadd{
    font-size: 16px;
    font-weight: 700;
    line-height: 35px;
    cursor: pointer;
  }
}
.cates{
  background-color: #37485e;
  li{
    line-height: 35px;
    border-bottom: 1px solid transparent;
    border-color: rgba(255, 255, 255, 0.05);
    ul{
      li{
        p{
          padding-left: 30px;
        }
      }
    }
    p{
      color: #ADBECE;
      padding-left: 10px;
      line-height: 35px;
      display: block;
      cursor: pointer;
      background-color: transparent;
      display: flex;
      .set{
        display: none;
        margin-right: 5px;
        line-height: 35px;
        opacity: 0.8;
      }
      &.cur{
        background-color: #191D2B;
        border: 0;
      }
      &:hover{
        background-color: rgba(0, 0, 0, 0.3);
        .set{
          display: inline-flex;
        }
      }
    }
    p:hover, a.cur{
      border-radius: 3px;
      color: #fff;
    }
    i{
      line-height: 35px;
    }
    span{
      flex: 1;
    }
  }
  .catename{
    width: 10px;
    display: inline-block;
  }
}
.editbox{
  line-height: 35px;
  border: 0;
  outline: none;
  width: 80%;
  background: #191D2B;
  color: #fff;
  padding: 0 5px;
}

</style>
