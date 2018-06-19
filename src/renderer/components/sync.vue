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
/* eslint-disable */
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

      let options = await this.$service.options.list()
      console.log('options.length', options.length)
    },
    async do_sync () {
      let models = {
        1: this.$service.cates,
        2: this.$service.notecates,
        3: this.$service.notes,
        4: this.$service.posts
      }

      this.isSync = true
      console.log('开始同步')
      let lastusn = await this.$service.options.get('lastusn')
      if (lastusn === '' || !lastusn) {
        lastusn = 0
        await this.$service.options.set('lastusn', 0)
      }
      // 获取服务器内容
      this.percent = 0
      let url = this.$api.sync_state + '?usn=' + lastusn
      let res = await this.$http.get(url)
      if (res.error) {
        this.percent = 100
        setTimeout(() => {
          this.isSync = false
        }, 2 * 1000)
        return
      }
      lastusn = res.data.maxusn
      // 获取最新的usns，更新usns,cates,notecates
      let usns = res.data.usns
      let usnids = usns.map(item => item._id)
      let hackusns = await this.$service.usns.list({
        deal: 0,
        _id: {
          $in: usnids
        }
      })
      for (let usn of hackusns) {
        let model = models[usn.tag]
        await model.copy(usn.tagid)
      }
      let cates = res.data.cates
      let notecates = res.data.notecates
      this.percent += 2
      await this.$service.usns.save(usns, true)
      this.percent += 3
      await this.$service.cates.save(cates, true)
      this.percent += 2
      await this.$service.notecates.save(notecates, true)
      this.percent += 3
      // 删除操作
      let delusns = usns.filter(item => item.state === 0)
      for (let usn of delusns) {
        let model = models[usn.tag]
        await model.del(usn.tagid, true)
      }
      this.percent += 3
      // 更新posts,notes
      let postids = usns.filter(item => item.tag === state.tableids['posts'] && item.state !== 0).map(item => item.tagid)
      let noteids = usns.filter(item => item.tag === state.tableids['notes'] && item.state !== 0).map(item => item.tagid)
      let alllentgh = postids.length + noteids.length
      
      for (let i = postids.length - 1; i >= 0; i--) {
        let ids = []
        for (;i >= 0 && ids.length < 5; i--) {
          ids.push(postids[i])
        }
        let url = this.$api.sync_post + '?ids=' + ids.join(',')
        let res = await this.$http.get(url)
        if (!res.error) {
          await this.$service.posts.save(res.data, true)
          this.percent += ids.length * 57 / alllentgh
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
          await this.$service.notes.save(res.data, true)
          this.percent += ids.length * 57 / alllentgh
        }
      }
      
      // 上传更新和新建、删除数据
      let upusns = await this.$service.usns.list({
        deal: 0
      })
      if (upusns.length > 0) {
        let uplen = upusns.length;
        for (let usn of upusns) {
          let model = models[usn.tag]
          usn.obj = await model.one(usn.tagid)
        }
        url = this.$api.sync_up
        for (let i = 0; i < uplen; i++) {
          let tempusns = [];
          for (;tempusns.length < 5 && i < uplen; i++) {
            tempusns.push(upusns[i]);
          }
          res = await this.$http.post(url, {
            usns: tempusns
          })
          this.percent += tempusns.length * 20 / uplen;
          if (res.data.maxusn) {
            lastusn = res.data.maxusn
            for (let usn of tempusns) {
              await this.$service.usns.update({
                _id: usn._id
              }, {
                usn: lastusn,
                deal: 1,
                state: 1
              }, true, true)
            }
          }

        }
      }
      await this.$service.options.set('lastusn', lastusn)

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
