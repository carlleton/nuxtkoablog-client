<template>
  <el-container>
    <el-header style="height:40px;">
      <div class="admin_tit">
        <router-link to="/">nuxtkoablog客户端</router-link>
      </div>
      <div class="left">
        <div class="searchinput">
          <el-input placeholder="搜索" size="small" v-model="searchkey" :clearable="true" @keydown.enter="do_search()" @clear="updatenotes()">
            <el-button slot="append" icon="el-icon-search" @click="do_search(true)"></el-button>
          </el-input>
        </div>
        <el-button plain size="mini" style="margin-left:10px;" @click="addNote">添加笔记</el-button>
      </div>
      <div class="right">
        <div class="syncbox">
          <sync></sync>
        </div>
        <div class="author">
          <router-link v-if="!isLogin" to="/login">登陆</router-link>
          <a class="logout" v-else @click="logout()">退出</a>
        </div>
      </div>
    </el-header>
    <el-container class="main">
      <el-aside width="200px" class="cates">
        <div class="catestit">
          <i class="fa fa-book fa-left"></i>
          笔记本
        </div>
        <!-- 分类 -->
        <Cates 
          ref="cates" 
          :cateid.sync="cateid" 
          :catename.sync="catename" 
          :catetag.sync="catetag" 
          @updatenotes="updatenotes"
          ></Cates>
      </el-aside>
      <el-aside width="250px" class="notes">
        <!-- 笔记列表 -->
        <Notes 
          ref="notes" 
          :cateid="cateid" 
          :catename="catename" 
          :catetag="catetag" 
          :act.sync="act" 
          :noteid.sync="noteid"
          :searchkey="searchkey"
          ></Notes>
      </el-aside>
      <el-main class="editor">
        <!-- 编辑器 -->
        <Editor 
          :cateid="cateid" 
          :noteid.sync="noteid" 
          :act.sync="act" 
          @updatenotes="updatenotes" 
          @addNote="addNote"
          ></Editor>
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
      isLogin: true,
      cateid: 0,
      catename: '最新',
      catetag: '',
      noteid: 0,
      searchkey: '',
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
    do_search (isCheckKey) {
      if (isCheckKey && this.searchkey === '') {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning'
        })
        return
      }
      this.$refs.notes.$emit('updatenotes')
    },
    updatenotes () {
      this.searchkey = ''
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
<style lang="scss" scoped>
.el-header{
  background-color: #666;
}
.admin_tit{
  font-size: 20px;
  width: 180px;
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
.searchinput{
  display: inline-block;
  width: 300px;
  height: 40px;
  line-height: 40px;
  input[type='text']{
    outline: none;
  }
}

.syncbox{
  display: inline-block;
}
.author{
  display: inline-block;
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
