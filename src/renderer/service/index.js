import path from 'path'
import { remote } from 'electron'
import notes from './notes'
const LinvoDB = require('linvodb3')

let folder = path.join(remote.app.getPath('userData'), '/nuxtkoablog_data')

LinvoDB.defaults.store = {
  db: require('level-js')
}
LinvoDB.dbPath = folder
const models = [notes]
let schema = { } // Non-strict always, can be left empty
let options = {}
console.log(LinvoDB.defaults)

models.forEach((model) => {
  let Doc = new LinvoDB(model.name, schema, options)
  model.init(Doc)
})

function getFileName () {
  return folder
}

export default {
  ...models,
  getFileName
}
