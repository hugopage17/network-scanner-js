var net = require('net')
const crypto = require('crypto')
const randomData = crypto.randomBytes(1024 * 1024)

var server = net.createServer(function(socket) {
  let baseTime = new Date().getTime()
  for (let i = 0; i < 100; i++) {
    let currentTime = new Date().getTime()
    if (currentTime - baseTime > 15000) {
      console.log('15s elapsed')
      break
    }
    socket.write(randomData)
    socket.pipe(socket)
  }
  
})

server.listen(1337, '127.0.0.1')
