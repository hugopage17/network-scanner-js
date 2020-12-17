import socketServer from 'socket.io'
import socketClient from 'socket.io-client'
import http from 'http'
const server = http.createServer()

class WebSocket{

}

WebSocket.Server = class{
  constructor(port){
    const io = socketServer(server)
    server.listen(port)
    return io
  }
}

WebSocket.Client = class{
  constructor(host){
    const client = socketClient(host)
    return client
  }
}

export default WebSocket
