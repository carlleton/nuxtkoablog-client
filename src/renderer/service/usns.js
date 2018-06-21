import _ from 'lodash'
import base from './base'
let {tableids} = require('../config/state')
let usns = _.extend(_.extend({}, base), {
  name: 'usns',
  onebytagid (tag, id) {
    let params = {}
    params.tag = tag
    params.tagid = id
    return new Promise((resolve, reject) => {
      this.Doc.findOne(params).exec((err, doc) => {
        if (!err) {
          resolve(doc)
        } else {
          reject(err)
        }
      })
    })
  },
  async syncadd (name, id) {
    let tag = tableids[name]
    return this.add({
      tag,
      tagid: id,
      usn: 0,
      updatetime: Date.now(),
      state: 1,
      deal: 0
    })
  },
  async syncdel (name, id) {
    let tag = tableids[name]
    return this.update({
      tag,
      tagid: id
    }, {
      state: 0,
      deal: 0
    })
  },
  async syncupdate (name, id) {
    let tag = tableids[name]
    let usn = await this.onebytagid(tag, id)
    if (usn && usn.deal === 0) {
      return
    }
    return this.update({
      tag,
      tagid: id
    }, {
      state: 2,
      deal: 0
    })
  }
})

export default usns
