import ping from 'ping'
import fetch from 'node-fetch'
import sslCertificate from 'get-ssl-certificate'
import extractDomain from 'extract-domain'
import WebSocket from './web-socket.js'
import Traceroute from 'nodejs-traceroute'
import {getRange, subnetData} from './functions'

class NetworkScanner{
  async poll(host, config){
    if(!config){
      config = {
        repeat:1,
        size:32,
        timeout:1
      }
    }
    if(!config.repeat){
      config.repeat = 1
    }
    if(!config.size){
      config.size = 32
    }
    if(!config.timeout){
      config.timeout = 1
    }
    if(!host){
      return new Error('Host cannot be null')
    }
    try{
      let p = await ping.promise.probe(host, {min_reply:config.repeat, packetSize:config.size, timeout:config.timeout}).then((res)=>{
        const status = res.alive == true ? ('online'):('offline')
        return {
          host:host,
          ip_address:res.numeric_host,
          status:status,
          res_avg:`${res.avg}ms`,
          times:res.times,
          packet_loss:res.packetLoss
        }
      })
      return p
    }catch(err){
      return new Error(err)
    }
  }

  getSubnet(subnet){
    if(!subnet.split('/')[1]){
      return new Error(`${subnet} is an invalid subnet`)
    }
    return fetch(`https://networkcalc.com/api/ip/${subnet}?binary=1`)
      .then((res) => {
        return res.json()
      })
      .then((data)=>{
        const obj = subnetData(data)
        return obj
      })
  }

  async ipScan(range, cb){
    const arr = getRange(range)
    await Promise.all(arr.map(async (a) => {
      try{
        const each_node = await this.poll(a)
        each_node.status === 'online' ? (cb(each_node)):(null)
      }catch(err){
        throw new Error(err)
      }
    }))
  }

  async macLookup(mac){
    let res = await fetch(`https://api.macvendors.com/${mac}`)
    let data = await res.text()
    return data
  }

  async getSsl(url){
    const domain = extractDomain(url)
    let ssl = await sslCertificate.get('nodejs.org')
    return ssl
  }

  async clusterPing(array, cb){
    var new_arr = []
    await Promise.all(array.map(async (a) => {
      try{
        const each_node = await this.poll(a)
        new_arr.push(each_node)
      }catch(err){
        throw new Error(err)
      }
    }))
    cb(new_arr)
  }

  netServer(port){
    const server = new WebSocket.Server(port)
    return server
  }

  netClient(host){
    const client = new WebSocket.Client(host)
    return client
  }

  traceroute(dest, cb){
   try {
     const tracer = new Traceroute();
     tracer.on('hop', (hop) => {
       cb(hop)
     }).on('close', (code) => {
        return
      })
    tracer.trace(dest);
   } catch (ex) {
     return ex
   }
  }
}


module.exports = NetworkScanner
