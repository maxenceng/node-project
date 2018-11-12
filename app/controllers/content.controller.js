const fs = require('fs')
const path = require('path')

const ContentModel = require('../models/content.model')
const utils = require('../utils/utils')

const config = JSON.parse(process.env.config)

const pathContent = utils.pathBuilder(config.contentDirectory)

const list = (req, res) => {
  const metaFiles = fs.readdirSync(pathContent)
    .reduce((accu, fileName) => {
      if (!fileName.includes('.meta.json')) return accu
      const filePath = path.join(pathContent, fileName)
      const meta = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      return {
        ...accu,
        [meta.id]: meta,
      }
    }, {})
  res.send(metaFiles)
}

const create = (req, res) => {
  const { type, title, src, fileName, file } = req.body
  const id = utils.generateUUID()
  const content = new ContentModel({type, id, title, src, fileName})
  if (type === 'img') content.setData(file)
  ContentModel.create(content, (err) => {
    if (err) return res.send({action: 'create', message: 'an error has occurred'})
    return res.send({action: 'create', message: `new content created with ID: ${id}`})
  })
}

const read = (req, res) => {
  const {id} = req.params
  const {json} = req.query
  ContentModel.read(id, (err, content) => {
    if (err) return res.send({action: 'read', message: 'an error has occurred'})
    if (content.type === 'img') {
      utils.readFileIfExists(utils.getDataFilePath(content.fileName), function (err, data) {
        return res.sendFile(data)
      })
    } else if (content.src) {
      return res.redirect(content.src)
    } else if (json === 'true') {
      return res.send(content)
    } else {
      return res.send({})
    }
  })
}

module.exports = {list, create, read}