<template>
  <el-container>
    <el-header style="height:40px;">
      <div class="admin_tit">
        <router-link to="/">nuxtkoablog客户端</router-link>
        <router-link to="/login">登陆</router-link>
        <el-button plain size="mini" style="margin-left:10px;" @click="addNote">添加笔记</el-button>
        <router-link to="/systeminfo">systeminfo</router-link>
      </div>
      <div class="syncbox">
        <sync></sync>
      </div>
      <div class="author">
        <a class="logout" @click="logout()">退出</a>
      </div>
    </el-header>
    <el-container class="main">
      <el-aside width="200px" class="cates">
        <div class="catestit">
          <i class="fa fa-book fa-left"></i>
          笔记本
        </div>
        <!-- 分类 -->
        <Cates ref="cates" :cateid.sync="cateid" :catename.sync="catename" :catetag.sync="catetag"></Cates>
      </el-aside>
      <el-aside width="250px" class="notes">
        <!-- 笔记列表 -->
        <Notes ref="notes" :cateid="cateid" :catename="catename" :catetag="catetag" :act.sync="act" :noteid.sync="noteid"></Notes>
      </el-aside>
      <el-main class="editor">
        <!-- 编辑器 -->
        <Editor :cateid="cateid" :noteid.sync="noteid" :act.sync="act" @updatenotes="updatenotes" @addNote="addNote"></Editor>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Cates from './cates'
import Notes from './notes'
import Editor from './editor'
import sync from './sync'

export default {
  layout: 'admin2',
  head () {
    return {
      title: '笔记'
    }
  },
  data () {
    return {
      cateid: 0,
      catename: '最新',
      catetag: '',
      noteid: 0,
      act: 'show'
    }
  },
  created () {
  },
  methods: {
    addNote () {
      if (this.cateid === 0) {
        // 选择第一个分类
        this.$refs.cates.$emit('selectFirstCate')
      }
      this.noteid = 0
      this.act = 'add'
    },
    updatenotes () {
      this.$refs.notes.$emit('updatenotes')
    }
  },
  components: {
    Cates,
    Notes,
    Editor,
    sync
  }
}
</script>
<style scoped>
.el-header{
  background-color: #666;
}
.admin_tit{
  font-size: 20px;
  color: #fff;
  float: left;
  line-height: 40px;
}
.admin_tit a{
  color: #fff;
}
.admin_tit .page{
  font-size: 14px;
  margin-left: 20px;
}
.syncbox{
  float: left;
}
.author{
  float: right;
  color: #fff;
  line-height: 40px;
}
.author a{
  color: #fff;
}
.logout{
  cursor: pointer;
}
.main{
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
}
.editor{
  padding: 0;
}
.cates{
  background: #41586e;
  color: #ccc;
  border-right: 1px solid #ccc;
  overflow: auto;
}
.catestit{
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}
.notes{
  background-color: #fff;
  border: 1px solid #cfcfcf;
}
</style>
