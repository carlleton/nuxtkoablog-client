<template>
  <div class="noteslist">
    <div class="notestit">
      {{catename}}({{total}})
    </div>
    <ul>
      <li v-show="act=='add' && noteid===0">
        <p></p>
      </li>
      <li v-for="(note,index) in notes" :key="index" :class="{cur:noteid==note.id}" @click="selectNote(note)" @contextmenu="showContextMenu(note)">
        <p class="itemtitle" :title="note.title">
          {{note.title}}
        </p>
        <i class="fa fa-cog set" @click="showContextMenu(note)"></i>
      </li>
    </ul>
    <p class="loading" v-show="total>notes.length" v-loading="isloading" @click="loadingnext()">
      加载更多...
    </p>
    <contextmenu ref="contextmenu" :point="contextmenuData.point" :menus="contextmenuData.menus" :isShow.sync="contextmenuData.isShow"></contextmenu>
  </div>
</template>
<script>
import contextmenu from './contextmenu'

export default {
  props: ['cateid', 'noteid', 'catename', 'act'],
  data () {
    return {
      isloading: false,
      notes: [],
      pageSize: 20,
      pageNum: 1,
      total: 0,
      contextmenuData: {
        point: {},
        menus: [],
        isShow: false
      }
    }
  },
  created () {
    this.getData()
    this.$on('updatenotes', () => {
      this.pageNum = 1
      this.notes = []
      this.getData()
    })
  },
  watch: {
    cateid (newval, oldval) {
      this.pageNum = 1
      this.notes = []
      this.getData(newval)
    }
  },
  methods: {
    async getData (cid) {
      let where = {}
      if (cid) {
        where.cid = cid
      } else if (this.cateid !== 0) {
        where.cid = this.cateid
      }
      let order = { updatetime: -1 }
      let notesresult = await this.$service.notes.list2(where, order, this.pageSize, this.pageNum)
      // console.log(notesresult)
      this.total = notesresult.total
      this.notes.push(...notesresult.data)
    },
    loadingnext () {
      this.pageNum = this.pageNum + 1
      this.getData()
    },
    selectNote (note) {
      this.$emit('update:noteid', note.id)
    },
    // 右键菜单
    showContextMenu (note) {
      event.preventDefault()
      event.stopPropagation()
      var x = event.clientX
      var y = event.clientY
      this.contextmenuData.point = {
        x: x,
        y: y
      }
      this.contextmenuData.menus = [
        {
          name: '删除',
          ico: 'fa fa-remove',
          fnHandler: () => {
            this.$confirm('您确认要删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.contextmenuData.isShow = false
              this.do_del(note)
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
    // 删除操作
    async do_del (note) {
      this.isloading = true
      let num = await this.$service.notes.del(note.id)
      if (num > 0) {
        this.$message({
          type: 'success',
          message: '删除' + num + '条'
        })
        this.pageNum = 1
        this.notes = []
        this.getData()
      } else {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
      this.isloading = false
    }
  },
  components: {
    contextmenu
  }
}
</script>
<style scoped>
.notestit{
  background-color: #eee;
  border-bottom: 1px solid #ebeff2;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
}
.noteslist ul, .noteslist li{
  list-style: none;
}
.noteslist ul{
  padding: 0;
  margin: 5px 0;
}
.noteslist li{
  height: 30px !important;
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #ebeff2;
  padding: 0 0 0 5px;
  display: flex;
}
.noteslist li.cur{
  background-color: #eee;
}
.noteslist li:hover{
  background-color: #eee;
}
.noteslist li .set{
  display: none;
  float: right;
  margin-right: 5px;
  line-height: 30px;
  opacity: 0.8;
  z-index: 1;
  padding: 0 2px;
  cursor: pointer;
}
.noteslist li:hover .set{
  display: inline-flex;
}
.itemtitle{
  font-size: 16px;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  flex: 1;
  padding: 0;
  margin: 0;
}
.loading{
  text-align: center;
  font-size: 14px;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
