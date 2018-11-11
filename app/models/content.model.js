const path = require('path')
const fs = require('fs')

const utils = require('../utils/utils')
const config = JSON.parse(process.env.config)

const pathContent = utils.pathBuilder(config.contentDirectory)

class ContentModel {
  constructor({type, id, title, src, fileName}) {
    this.type = type
    this.id = id
    this.title = title
    this.src = src
    this.fileName = fileName
    let _data = null
    this.setData = (data) => {
      _data = data
    }
    this.getData = () => {
      return _data
    }
  }

  static create(content, callback) {
    const {id, fileName} = content
    const data = content.getData()
    const filePath = path.join(pathContent, fileName)
    fs.writeFile(filePath, data, (err) => {
      if (err) return callback(err)
      const metaPath = path.join(pathContent, `${id}.meta.json`)
      const metaData = JSON.stringify(content, null, '\t')
      fs.writeFile(metaPath, metaData, callback)
    })
  }

  static read(id, callback) {
    const metaPath = path.join(pathContent, `${id}.meta.json`)
    fs.readFile(metaPath, 'utf-8', (err, data) => {
      if (err) return callback(err)
      const content = new ContentModel(JSON.parse(data))
      return callback(err, content)
    })
  }

  static update(content, callback) {
    const {id, type, fileName} = content
    const metaPath = path.join(pathContent, `${id}.meta.json`)
    const metaData = JSON.stringify(content, null, '\t')
    fs.writeFile(metaPath, metaData, (err) => {
      if (err) return callback(err)
      const contentData = content.getData()
      if (type === 'img' && contentData && contentData.length > 0) {
        const filePath = path.join(pathContent, fileName)
        fs.writeFile(filePath, contentData, callback)
      }
    })
  }

  static delete(id, callback) {
    const metaPath = path.join(pathContent, `${id}.meta.json`)
    fs.readFile(metaPath, 'utf-8', (err, data) => {
      if (err) return callback(err)
      fs.unlink(metaPath, (err) => {
        if (err) return callback(err)
        const {fileName} = JSON.parse(data)
        const filePath = path.join(pathContent, fileName)
        fs.unlink(filePath, callback)
      })
    })
  }
}

module.exports = ContentModel