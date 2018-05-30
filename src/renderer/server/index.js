import path from 'path'
import { remote } from 'electron'
var LinvoDB = require('linvodb3')

let folder = path.join(remote.app.getPath('userData'), '/nuxtkoablog_data')

var modelName = 'notes'
var schema = { } // Non-strict always, can be left empty
var options = { }
options.filename = folder
options.store = { db: require('level-js') }
var Doc = new LinvoDB(modelName, schema, options)

function getFileName () {
  // var doc = new Doc({ a: 5, now: new Date(), test: '"this is a string' })
  // doc.b = 13
  // doc.save((err) => {
  //   if (!err) {
  //     console.log(doc._id)
  //     Doc.find({}, (err, docs) => {
  //       if (!err) {
  //         console.log(docs)
  //       }
  //     })
  //   }
  // })
  Doc.find({}, (err, docs) => {
    if (!err) {
      console.log(docs)
    }
  })
  return folder
}

export default {
  getFileName
}
