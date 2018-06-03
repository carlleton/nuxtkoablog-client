export default {
  Doc: null,
  init (_Doc) {
    this.Doc = _Doc
  },
  add (doc) {
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
  update (_id, doc) {
    return new Promise((resolve, reject) => {
      this.Doc.update(_id, doc, {}, (err, numReplaced) => {
        if (!err) {
          resolve(numReplaced)
        } else {
          reject(err)
        }
      })
    })
  },
  save (docs) {
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
  }
}
