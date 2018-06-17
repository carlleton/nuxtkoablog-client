let snowflake = require('node-snowflake').Snowflake
export default {
  Doc: null,
  usns: null,
  init (_Doc, usns) {
    this.Doc = _Doc
    this.usns = usns
  },
  nextId () {
    let id = snowflake.nextId()
    return id
  },
  add (doc, notUsn) {
    doc.id = this.nextId()
    doc._id = doc.id
    return new Promise((resolve, reject) => {
      this.Doc.insert(doc, async (err, newDoc) => {
        if (err) {
          reject(err)
        } else {
          if (!notUsn && this.name !== 'usns' && this.name !== 'options') {
            await this.usns.syncadd(this.name, doc.id)
          }
          resolve(newDoc)
        }
      })
    })
  },
  async update (where, update, multi, notUsn) {
    let options = {}
    if (multi) {
      options.multi = true
    }
    let docs = await this.list(where)
    return new Promise((resolve, reject) => {
      this.Doc.update(where, {$set: update}, options, async (err, numReplaced) => {
        if (!err) {
          if (!notUsn && this.name !== 'usns' && this.name !== 'options') {
            for (let doc of docs) {
              await this.usns.syncupdate(this.name, doc.id)
            }
          }
          resolve(numReplaced)
        } else {
          reject(err)
        }
      })
    })
  },
  save (docs, notUsn) {
    let updateids = []
    let addids = []
    if (docs instanceof Array) {
      docs.forEach((item) => {
        if (!item._id) {
          if (!item.id) {
            item.id = this.nextId()
          }
          item._id = item.id
          addids.push(item.id)
        } else {
          updateids.push(item.id)
        }
      })
    } else {
      if (!docs._id) {
        if (!docs.id) {
          docs.id = this.nextId()
        }
        docs._id = docs.id
        addids.push(docs.id)
      } else {
        updateids.push(docs.id)
      }
    }
    return new Promise((resolve, reject) => {
      this.Doc.save(docs, async (err, docs) => {
        if (!err) {
          if (!notUsn && this.name !== 'usns' && this.name !== 'options') {
            for (let id of addids) {
              await this.usns.syncadd(this.name, id)
            }
            for (let id of updateids) {
              await this.usns.syncupdate(this.name, id)
            }
          }
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
  del (_id, notUsn) {
    return new Promise((resolve, reject) => {
      this.Doc.remove(_id, {}, async (err, numRemoved) => {
        if (!err) {
          if (!notUsn && this.name !== 'usns' && this.name !== 'options') {
            await this.usns.syncdel(this.name, _id)
          }
          resolve(numRemoved)
        } else {
          reject(err)
        }
      })
    })
  },
  empty () {
    return new Promise((resolve, reject) => {
      this.Doc.remove({}, {multi: true}, (err, nums) => {
        if (!err) {
          resolve(nums)
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
  async copy (_id) {
    let doc = await this.one(_id)
    if (doc.title) {
      doc.title += ' copy'
    }
    if (doc.catename) {
      doc.catename += ' copy'
    }
    await this.add(doc)
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
