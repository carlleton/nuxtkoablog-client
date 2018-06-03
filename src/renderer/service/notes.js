import _ from 'lodash'
import base from './base'
let notes = _.extend({
  name: 'notes',
  async list (where) {
    return new Promise((resolve, reject) => {
      this.Doc.find(where, (err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  }
}, base)

export default notes
