const socketIo = require('socket.io')

const ContentModel = require('../models/content.model')

const dataCommMap = new Map()

const listen = (server) => {
  const io = socketIo(server)
  io.on('connection', (socket) => {
    console.log('user connect')
    socket.emit('connection')
    socket.on('_data_comm_', (msg) => {
      dataCommMap.set(msg.id, msg)
    })
    socket.on('slidEvent', (msg) => {
      console.log(msg)
      ContentModel.read(msg.PRES_ID, (err, content) => {
        if (err) socket.emit(msg.CMD, null)
        socket.emit(msg.CMD, content)
      })
    })
  })
}

module.exports = {listen}