const express = require('express')
const multer = require('multer')
const router = express.Router()

const contentController = require('../controllers/content.controller')

const multerMiddleware = multer({dest: '/tmp/'})

router
  .route('/contents')
  .get(contentController.list)
  .post(multerMiddleware.single('file'), contentController.create)

router
  .route('/contents/:id')
  .get(contentController.read)

module.exports = router
