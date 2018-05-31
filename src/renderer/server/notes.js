let Doc
module.exports = {
  init (_Doc) {
    Doc = _Doc
  },
  add (doc) {
    return new Promise((resolve, reject) => {
      Doc.insert(doc, (err, newDoc) => {
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
      Doc.update(_id, doc, {}, (err, numReplaced) => {
        if (!err) {
          resolve(numReplaced)
        } else {
          reject(err)
        }
      })
    })
  },
  del (_id) {
    return new Promise((resolve, reject) => {
      Doc.remove(_id, {}, (err, numRemoved) => {
        if (!err) {
          resolve(numRemoved)
        } else {
          reject(err)
        }
      })
    })
  },
  async search (where) {
    try {
      var docs = await Doc.find(where).limit(10).execAsync()
      return docs
    } catch (err) {
      return err
    }
  }
}
