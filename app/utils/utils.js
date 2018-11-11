const path = require('path')
const fs = require('fs')

const config = JSON.parse(process.env.config)

const pathBuilder = folder => path.join(__dirname, `../../${folder}`)

const generateUUID = () => {
  let date = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const random = (date + Math.random() * 16) % 16 | 0
    date = Math.floor(date / 16)
    return (c === 'x' ? random : ((random & 0x3) | 0x8)).toString(16)
  })
}

const fileExists = (path, callback) => {
  fs.stat(path, function (err, stat) {
    if (err) {
      callback(err)
    } else {
      if (stat.isFile()) {
        callback(null)
      }
    }
  })
}

const readFileIfExists = (path, callback) => {
  fileExists(path, function (err) {
    if (err) {
      callback(err)
    } else {
      fs.readFile(path, callback)
    }
  });
};

const getMetaFilePath = id => path.join(config.contentDirectory, id + '.meta.json')

const getDataFilePath = fileName => path.join(config.contentDirectory, fileName)

const getNewFileName = (id, originalFileName) => `${id}.${originalFileName.split('.').pop()}`

module.exports = {
  pathBuilder,
  generateUUID,
  fileExists,
  readFileIfExists,
  getMetaFilePath,
  getDataFilePath,
  getNewFileName,
}