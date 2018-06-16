let snowflake = require('node-snowflake').Snowflake
export default {
  Doc: null,
  init (_Doc) {
    this.Doc = _Doc
  },
  nextId () {
    let id = snowflake.nextId()
    return id
  },
  add (doc) {
    doc.id = this.nextId()
    doc._id = doc.id
    return new Promise((resolve, reject) => {
      this.Doc.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err)
        } else {
          resolve(newDoc)
        }
      })
    })
  },
  update (where, update, multi) {
    let options = {}
    if (multi) {
      options.multi = true
    }
    return new Promise((resolve, reject) => {
      this.Doc.update(where, {$set: update}, options, (err, numReplaced) => {
        if (!err) {
          resolve(numReplaced)
        } else {
          reject(err)
        }
      })
    })
  },
  save (docs) {
    if (docs instanceof Array) {
      docs.forEach((item) => {
        if (!item._id) {
          if (!item.id) {
            item.id = this.nextId()
          }
          item._id = item.id
        }
      })
    } else {
      if (!docs._id) {
        if (!docs.id) {
          docs.id = this.nextId()
        }
        docs._id = docs.id
      }
    }
    return new Promise((resolve, reject) => {
      this.Doc.save(docs, (err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  },
  async one (_id, tag) {
    let params = {}
    let order = {}
    if (!tag) {
      params._id = _id
    } else {
      let doc = await this.exec(this.Doc.findOne({_id}))
      let pid = doc.pid
      params.pid = pid
      if (tag === 'up') {
        params.orderid = {
          $lt: doc.orderid
        }
        order = {
          orderid: -1
        }
      } else if (tag === 'down') {
        params.orderid = {
          $gt: doc.orderid
        }
        order = {
          orderid: 1
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.Doc.findOne(params).sort(order).exec((err, doc) => {
        if (!err) {
          resolve(doc)
        } else {
          reject(err)
        }
      })
    })
  },
  del (_id) {
    return new Promise((resolve, reject) => {
      this.Doc.remove(_id, {}, (err, numRemoved) => {
        if (!err) {
          resolve(numRemoved)
        } else {
          reject(err)
        }
      })
    })
  },
  async list (where) {
    if (!where) {
      where = {}
    }
    return new Promise((resolve, reject) => {
      this.Doc.find(where, (err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  },
  exec (fun) {
    return new Promise((resolve, reject) => {
      fun.exec((err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(err)
        }
      })
    })
  }
}
