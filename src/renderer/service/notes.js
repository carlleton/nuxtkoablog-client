import _ from 'lodash'
import base from './base'
let notes = _.extend({
  name: 'notes',
  async search (where) {
    try {
      var docs = await this.Doc.find(where).limit(10).execAsync()
      return docs
    } catch (err) {
      return err
    }
  }
}, base)

export default notes
