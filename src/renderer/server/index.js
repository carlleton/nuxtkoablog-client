import path from 'path'
import { remote } from 'electron'

let filename = path.join(remote.app.getPath('userData'), '/data')

function getFileName () {
  return filename
}

export default {
  getFileName
}
