import _ from 'lodash'
import base from './base'
let notes = _.extend(_.extend({}, base), {
  name: 'notes',
  async list2 (where, order, pageSize, pageNum) {
    if (!where) {
      where = {}
    }
    let total = new Promise((resolve, reject) => {
      this.Doc.count(where, (err, count) => {
        if (!err) {
          resolve(count)
        } else {
          reject(err)
        }
      })
    })
    let data = new Promise((resolve, reject) => {
      this.Doc.find(where).sort(order).exec((err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
    let result = await Promise.all([total, data])
    // console.log(result)
    return {
      total: result[0],
      data: result[1]
    }
  }
})

export default notes
