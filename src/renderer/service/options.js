import _ from 'lodash'
import base from './base'
let notes = _.extend(_.extend({}, base), {
  name: 'options',
  async get (name) {
    return new Promise((resolve, reject) => {
      this.Doc.find({name}, (err, docs) => {
        if (!err) {
          if (docs.length > 0) {
            resolve(docs[0].content)
          } else {
            resolve('')
          }
        } else {
          reject(err)
        }
      })
    })
  },
  async set (name, val) {
    return new Promise((resolve, reject) => {
      this.Doc.findOne({name}, (err, doc) => {
        if (err || !doc) {
          let id = this.nextId()
          this.Doc.save({
            _id: id,
            id,
            name,
            value: val
          }, (err, docs) => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        } else {
          doc.value = val
          this.Doc.save(doc, (err, docs) => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        }
      })
    })
  }
})

export default notes
