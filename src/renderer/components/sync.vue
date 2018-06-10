<template>
  <div class="sync">
    <span v-show="isSync">
      <el-progress class="progress" :show-text="false" :stroke-width="5" :percentage="showPercent"></el-progress>
      <i class="el-icon-loading"></i>
    </span>
    <i class="syncbtn fa fa-repeat" v-show="!isSync" @click="do_sync()"></i>
  </div>
</template>
<script>
let state = require('../config/state')
export default {
  data () {
    return {
      isSync: false,
      percent: 0
    }
  },
  computed: {
    showPercent () {
      return parseInt(this.percent)
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let usns = await this.$service.usns.list()
      console.log('usns.length,', usns.length)
      let cates = await this.$service.cates.list()
      console.log('cates.length,', cates.length)
      let notecates = await this.$service.notecates.list()
      console.log('notecates.length,', notecates.length)
      let posts = await this.$service.posts.list()
      console.log('posts.length,', posts.length)
      let notes = await this.$service.notes.list()
      console.log('notes.length', notes.length)
    },
    async do_sync () {
      this.isSync = true
      console.log('开始同步')
      // 获取服务器内容
      this.percent = 0
      let url = this.$api.sync_state + '?usn=0'
      let res = await this.$http.get(url)
      if (res.error) {
        this.percent = 100
        setTimeout(() => {
          this.isSync = false
        }, 2 * 1000)
        return
      }
      let usns = res.data.usns
      let cates = res.data.cates
      let notecates = res.data.notecates
      this.percent += 1
      await this.$service.usns.save(usns)
      this.percent += 4
      await this.$service.cates.save(cates)
      this.percent += 2
      await this.$service.notecates.save(notecates)
      this.percent += 3
      let postids = usns.filter(item => item.tag === state.tableids['posts']).map(item => item.tagid)
      let noteids = usns.filter(item => item.tag === state.tableids['notes']).map(item => item.tagid)
      let alllentgh = postids.length + noteids.length
      for (let i = postids.length - 1; i >= 0; i--) {
        let ids = []
        for (;i >= 0 && ids.length < 5; i--) {
          ids.push(postids[i])
        }
        let url = this.$api.sync_post + '?ids=' + ids.join(',')
        let res = await this.$http.get(url)
        if (!res.error) {
          await this.$service.posts.save(res.data)
          this.percent += ids.length * 90 / alllentgh
        }
      }
      for (let i = noteids.length - 1; i >= 0; i--) {
        let ids = []
        for (;i >= 0 && ids.length < 5; i--) {
          ids.push(noteids[i])
        }
        let url = this.$api.sync_note + '?ids=' + ids.join(',')
        let res = await this.$http.get(url)
        if (!res.error) {
          await this.$service.notes.save(res.data)
          this.percent += ids.length * 90 / alllentgh
        }
      }
      // 结束时
      this.percent = 100
      console.log('同步结束')
      setTimeout(() => {
        this.isSync = false
      }, 2 * 1000)
    }
  }
}
</script>
<style scoped>
.progress{
  width: calc(100% - 20px);
  display: inline-block;
}
.sync{
  line-height: 30px;
}
.syncbtn{
  float: right;
  cursor: pointer;
}
</style>
