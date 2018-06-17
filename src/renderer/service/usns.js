import _ from 'lodash'
import base from './base'
let {tableids} = require('../config/state')
let usns = _.extend(_.extend({}, base), {
  name: 'usns',
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
