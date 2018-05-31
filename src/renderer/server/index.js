import path from 'path'
import { remote } from 'electron'
const LinvoDB = require('linvodb3')

let folder = path.join(remote.app.getPath('userData'), '/nuxtkoablog_data')

const models = ['notes']
let schema = { } // Non-strict always, can be left empty
let options = {
  filename: folder,
  store:  {
    db: require('level-js')
  }
}

let services = {}
models.forEach((modelName) => {
  let Doc = new LinvoDB(modelName, schema, options)
  let service = require('./' + modelName)
  service.init(Doc)
  services[modelName] = service
})

services.getFileName = () => {
  return folder
}

export default services
