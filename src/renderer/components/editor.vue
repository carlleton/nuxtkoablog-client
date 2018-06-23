<template>
  <div class="form">
    <template v-if="act=='show'">
      <h1>{{note.title}}</h1>
      <p class="btns">
        <i class="fa fa-edit" title="编辑" @click="actchange('edit')">编辑</i>
        <i class="fa fa-eye replay" @click="addReplay()">复盘<span>{{note.replay||0}}</span>次</i>
      </p>
      <p v-if="note.tags">{{note.tags}}</p>
      <div class="contentshow md" v-html="markdownhtml"></div>
    </template>
    <template v-else>
      <el-input placeholder="请输入标题" v-model="note.title"></el-input>
      <div class="formtit">
        <el-input size="small" placeholder="标签" class="inputtags" v-model="note.tags"></el-input>
      </div>
      <div class="btns">
        <i class="fa fa-undo" title="查看" @click="actchange('show')">返回</i>
        <i class="fa fa-save" @click="save" title="保存">保存</i>
      </div>
      <mavon-editor class="editor" v-if="act!='show'" v-model="note.content"></mavon-editor>
    </template>
    <div class="nonoteshow" v-if="act=='show' && noteid==0">
      <button @click="$emit('addNote')">添加笔记</button>
    </div>
  </div>
</template>
<script>
import hljs from 'highlight.js'
import 'highlight.js/styles/dark.css'
import '../assets/css/yeh-md-theme.css'

let marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})
export default {
  props: ['cateid', 'noteid', 'act'],
  data () {
    return {
      note: {
        tags: '',
        title: '',
        content: '',
        addtime: new Date(),
        replay: 0,
        id: 0
      }
    }
  },
  computed: {
    markdownhtml () {
      return marked(this.note.content)
    }
  },
  watch: {
    cateid (newval, oldval) {
      this.note.cid = newval
    },
    noteid (newval, oldval) {
      if (newval === 0) {
        this.doadd()
      } else {
        this.$emit('update:act', 'show')
        this.getnote(newval)
      }
    }
  },
  created () {

  },
  methods: {
    async getnote (id) {
      this.note = await this.$service.notes.one(id)
    },
    async save () {
      var params = {
        title: this.note.title,
        content: this.note.content,
        cid: this.note.cid,
        tags: this.note.tags || '',
        addtime: new Date(this.note.addtime).getTime(),
        updatetime: Date.now(),
        id: this.note.id || '',
        replay: this.note.replay || 0
      }
      if (!this.note.id) {
        let notedata = await this.$service.notes.add(params)
        if (notedata._id) {
          this.note.id = notedata._id
          this.$message({
            message: '添加成功',
            duration: 2000,
            onClose: () => {
              this.$emit('update:act', 'show')
              this.$emit('update:noteid', this.note.id)
              this.$emit('updatenotes')
            }
          })
        }
      } else {
        let num = await this.$service.notes.update({_id: this.note.id}, params)
        if (num > 0) {
          this.$message({
            message: '更新成功',
            duration: 2000,
            onClose: () => {
              this.$emit('update:act', 'show')
              this.$emit('updatenotes')
            }
          })
        }
      }
    },
    doadd () {
      this.$emit('update:act', 'add')
      this.note.id = 0
      this.note.tags = ''
      this.note.title = ''
      this.note.content = ''
      this.note.addtime = new Date()
      this.note.replay = 0
    },
    async addReplay () {
      let _id = this.note.id
      let replay = this.note.replay || 0
      replay += 1
      let num = await this.$service.notes.updateReplay(_id, replay)
      if (num > 0) {
        this.$message({
          message: '更新成功，更新' + num + '条',
          duration: 2000,
          onClose: () => {
            this.note.replay = replay
            this.$emit('update:act', 'show')
            this.$emit('updatenotes')
          }
        })
      }
    },
    actchange (tag) {
      this.$emit('update:act', tag)
    }
  }
}
</script>
<style lang="scss" scoped>
.form{
  height: 100%;
  width: 99%;
  h1{
    padding: 0 10px;
  }
}
.inputtags{
  width: 500px;
}
.ispost{
  margin-left: 10px;
}
.formtit{
  overflow: auto;
}
.btns{
  line-height: 35px;
  margin-right: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  i{
    cursor: pointer;
    margin-right: 10px;
    line-height: 35px;
    padding: 0 10px;
  }
  .replay span{
    color: #f00;
  }
}
.editor{
  height: calc(100% - 80px);
}
.contentshow{
  padding: 10px;
}
.nonoteshow{
  width: 300px;
  text-align: center;
}
</style>
