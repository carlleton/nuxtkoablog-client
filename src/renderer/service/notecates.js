import _ from 'lodash'
import base from './base'
import { getTen } from './tools'

let notecates = _.extend(_.extend({}, base), {
  name: 'notecates',
  async list2 (where, order) {
    if (!where) {
      where = {}
    }
    return new Promise((resolve, reject) => {
      this.Doc.find(where).sort(order).exec((err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  },
  async add (doc) {
    if (!doc.orderid) {
      doc.orderid = 1
    }
    if (doc.pid !== 0) {
      var pCates = await this.exec(this.Doc.find({id: doc.pid}).limit(1))
      if (pCates.result.length > 0) {
        doc.path = pCates.result[0].path
        doc.pidpath = pCates.result[0].idpath + getTen(pCates.result[0].id) + ','
      }
    }
    if (!doc.orderid) {
      let maxCate = await this.exec(this.Doc.find({pid: doc.pid}).sort({ orderid: 1 }).limit(1))
      if (maxCate.result.length > 0) {
        doc.orderid = maxCate.result[0].orderid + 1
      }
    }
    doc.path += getTen(doc.orderid) + ','
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
  async updatedoc (doc) {
    var params = {
      _id: doc.id
    }
    doc.catename && (params.catename = doc.catename)
    doc.pid && (params.pid = doc.pid)
    doc.orderid && (params.orderid = doc.orderid)

    if (doc.orderid) {
      params.path = ''
      if (doc.pid !== 0) {
        var pCates = await this.exec(this.Doc.find({id: doc.pid}).limit(1))[0]
        if (pCates.result.length > 0) {
          params.path = pCates.result[0].path
        }
      }
      params.path += getTen(params.orderid) + ','
    }
    return new Promise((resolve, reject) => {
      this.Doc.save(params, (err, docs) => {
        if (!err) {
          resolve(docs)
        } else {
          reject(err)
        }
      })
    })
  },
  async up (doc) {
    var id = doc.id
    var upone = await this.one(id, 'up')
    if (!upone) {
      return {
        rows: 0
      }
    } else {
      var nowone = await this.one(id)

      var nowpath = nowone.path
      nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
      nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
      if (nowpath) {
        nowpath += ','
      }
      nowpath += getTen(upone.orderid) + ','
      var objnow = {
        id: nowone.id,
        path: nowpath,
        orderid: upone.orderid
      }
      await this.update({_id: id}, objnow)
      let regex = new RegExp((nowone.pidpath || '') + getTen(nowone.id) + ',')
      let res1 = await this.list({pidpath: { $regex: regex }})
      for (let item of res1) {
        item.path = item.path.replace(nowone.path, nowpath)
        await this.save(item)
      }

      var uppath = upone.path
      uppath = uppath.substr(0, uppath.lastIndexOf(','))
      uppath = uppath.substr(0, uppath.lastIndexOf(','))
      if (uppath) {
        uppath += ','
      }
      uppath += getTen(nowone.orderid) + ','
      var objup = {
        path: uppath,
        orderid: nowone.orderid
      }
      await this.update({_id: upone.id}, objup)
      regex = new RegExp((upone.pidpath || '') + getTen(upone.id) + ',')
      let res2 = await this.list({pidpath: { $regex: regex }})
      for (let item of res2) {
        item.path = item.path.replace(upone.path, uppath)
        await this.save(item)
      }
      return {
        rows: 2 + res1.length + res2.length
      }
    }
  },
  async down (doc) {
    var id = doc.id
    var upone = await this.one(id, 'down')
    if (!upone) {
      return {
        rows: 0
      }
    } else {
      var nowone = await this.one(id)

      var nowpath = nowone.path
      nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
      nowpath = nowpath.substr(0, nowpath.lastIndexOf(','))
      if (nowpath) {
        nowpath += ','
      }
      nowpath += getTen(upone.orderid) + ','
      var objnow = {
        id: nowone.id,
        path: nowpath,
        orderid: upone.orderid
      }
      await this.update({_id: id}, objnow)
      let regex = new RegExp((nowone.pidpath || '') + getTen(nowone.id) + ',')
      let res1 = await this.list({pidpath: { $regex: regex }})
      for (let item of res1) {
        item.path = item.path.replace(nowone.path, nowpath)
        await this.save(item)
      }

      var uppath = upone.path
      uppath = uppath.substr(0, uppath.lastIndexOf(','))
      uppath = uppath.substr(0, uppath.lastIndexOf(','))
      if (uppath) {
        uppath += ','
      }
      uppath += getTen(nowone.orderid) + ','
      var objup = {
        id: upone.id,
        path: uppath,
        orderid: nowone.orderid
      }
      await this.update({_id: upone.id}, objup)
      regex = new RegExp((upone.pidpath || '') + getTen(upone.id) + ',')
      let res2 = await this.list({pidpath: { $regex: regex }})
      for (let item of res2) {
        item.path = item.path.replace(upone.path, uppath)
        await this.save(item)
      }

      return {
        rows: 2 + res1.length + res2.length
      }
    }
  }
})

export default notecates
