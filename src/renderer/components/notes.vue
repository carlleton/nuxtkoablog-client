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
        <i class="badge" v-if="note.replay">{{note.replay}}</i>
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
  props: ['cateid', 'catetag', 'noteid', 'catename', 'act', 'searchkey'],
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
  },
  mounted () {
    this.$on('updatenotes', () => {
      this.pageNum = 1
      this.notes = []
      this.getData()
    })
  },
  methods: {
    async getData (cid) {
      let where = {}
      if (this.searchkey) {
        where.title = {
          $regex: new RegExp(this.searchkey)
        }
      } else {
        if (cid) {
          where.cid = cid
        } else if (this.cateid !== 0 && this.cateid !== '') {
          where.cid = this.cateid
        }
        if (this.catetag === 'copy') {
          where.title = {
            $regex: new RegExp('copy')
          }
        }
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
      console.log(num)
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
<style lang="scss" scoped>
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
  position: relative;
  .badge{
    background: rgba(0, 0, 0, 0.3);
    padding: 2px;
    font-size: 12px;
    min-width: 12px;
    height: 12px;
    border-radius: 12px;
    text-align: center;
    color: #fff;
    float: right;
    margin-right: 2px;
    margin-top: 8px;
    font-style: normal;
  }
  .set{
    display: none;
    float: right;
    margin-right: 5px;
    line-height: 30px;
    opacity: 0.8;
    z-index: 1;
    padding: 0 2px;
    cursor: pointer;
  }
  &.cur{
    background-color: #ccc;
  }
  &:hover{
    background-color: #cdc;
    .set{
      display: inline-flex;
    }
  }
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
