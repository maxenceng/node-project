const express = require('express')
const path = require('path')
const fs = require('fs')

const utils = require('../utils/utils')
const config = JSON.parse(process.env.config)

const pathPresentations = utils.pathBuilder(config.presentationDirectory)

const router = express.Router()

router
  .get('/loadPres', (req, res) => {
    const presentations = fs.readdirSync(pathPresentations)
      .reduce((accu, fileName) => {
        const filePath = path.join(pathPresentations, fileName)
        const pres = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        return {
          ...accu,
          [pres.id]: pres,
        }
      }, {})
    res.send(presentations)
  })
  .post('/savePres', (req, res) => {
    const {id, name, desc} = req.body
    const filePath = path.join(pathPresentations, `${id}.pres.json`)
    const jsonContent = JSON.stringify({id, name, desc}, null, '\t')
    fs.writeFileSync(filePath, jsonContent)
    res.send({id, name, desc})
  })

module.exports = router