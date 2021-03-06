import _ from 'lodash'
import base from './base'
let cates = _.extend(_.extend({}, base), {
  name: 'cates',
  async list2 (where, order) {
    if (!where) {
      where = {}
    }
    return new Promise((resolve, reject) => {
      this.Doc.find(where).sort(order).exec((err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  }
})

export default cates
