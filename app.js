const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./config.json')
process.env.config = JSON.stringify(config)

const defaultRoute = require('./app/routes/default.route')
const presentationRoute = require('./app/routes/presentation.route')
const contentRoute = require('./app/routes/content.route')

const IOController = require('./app/controllers/io.controllers')


const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(defaultRoute)
app.use(presentationRoute)
app.use(contentRoute)
app.use('/admin', express.static(path.join(__dirname, 'public/admin')))
app.use('/watch', express.static(path.join(__dirname, 'public/watch')))

const server = http.createServer(app)
IOController.listen(server)
server.listen(config.port)
